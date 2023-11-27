"use client";

import { useState, useEffect } from "react";
import { GET, POST } from "../api/submetric/route";

const AddNewUnit = (props) => {
  //stores all products in the database
  const [error, setError] = useState(null);
  const [newUnit, setNewUnit] = useState({
    metric_id: "",
    name: "",
    abbreviation: "",
    ratio: 0,
  });

  const [unitsList, setUnitsList] = useState([]);
  const [existingUnit, setExistingUnit] = useState(null);
  const [existingUnitAmt, setExistingUnitAmt] = useState(0);
  const [newUnitAmt, setNewUnitAmt] = useState(0);

  useEffect(() => {
    async function getUnits() {
      try {
        const response = await GET();
        const { metrics, error } = await response.json();

        if (error) {
          setError(error);
        } else {
          console.log(metrics);
          setUnitsList(metrics);
          setExistingUnit(metrics[0]);
          setNewUnit({
            ...newUnit,
            metric_id: metrics[0].metric_id,
          });
          setLoading(false); // Data has been loaded
        }
      } catch (error) {
        setError(error.message);
      }
    }
    getUnits();
  }, []);

  useEffect(() => {
    async function getRatio() {
      if (existingUnit !== null) {
        console.log("E: " + existingUnitAmt);
        console.log("N: " + newUnitAmt);
        console.log("R: " + existingUnit.ratio);

        var newRatio = existingUnitAmt / newUnitAmt;
        console.log("E/N: " + newRatio);
        newRatio = newRatio * existingUnit.ratio;
        console.log("(E/N)*R: " + newRatio);

        setNewUnit({
          ...newUnit,
          ratio: newRatio,
        });
      }
    }
    getRatio();
  }, [existingUnit, existingUnitAmt, newUnitAmt]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setNewUnit((prevNewUnit) => ({
      ...prevNewUnit,
      [name]: value,
    }));
  };

  //closes the modal and removes all previous personalizations
  const handleClose = () => {
    props.onClose();
  };

  const handleExistingUnitChange = (event) => {
    const selectedUnitId = event.target.value; // Assuming the value is the metric_id or a unique identifier
    const selectedUnit = unitsList.find((unit) => unit.id === selectedUnitId);
    console.log(selectedUnit);

    setExistingUnit(selectedUnit);
    setNewUnit({
      ...newUnit,
      metric_id: selectedUnit.metric_id,
    });
  };

  const handleExistingUnitAmtChange = (event) => {
    setExistingUnitAmt(event.target.value);
  };

  const handleNewUnitAmtChange = (event) => {
    setNewUnitAmt(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      // Assuming you have the 'variants' data available
      const postResult = await POST(newUnit);

      if (postResult.error) {
        setError(postResult.error);
        console.log("Error: " + postResult.error);
      }
    } catch (error) {
      setError(error.message);
    }
    props.onClose();
  };

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div
          className="relative w-auto my-6 mx-auto max-w-5xl"
          style={{ minWidth: "40%" }}
        >
          {/*content*/}
          <div
            className="border-0 rounded-lg relative flex flex-col w-full outline-none focus:outline-none"
            style={{ backgroundColor: "#526D82" }}
          >
            {/*header*/}
            <div
              className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t"
              style={{ backgroundColor: "#27374D" }}
            >
              <h3 className="text-3xl font-semibold">Add a New Unit</h3>
            </div>
            {/*body*/}
            <div
              className="relative p-6 flex-auto rounded-b-lg"
              style={{ backgroundColor: "#526D82" }}
            >
              <div className="grid grid-cols-2">
                <div className="text-sm flex items-center">Unit Name</div>
              </div>
              <div className="flex grid-cols-2 mb-3">
                <div className="flex flex-row h-10 w-full rounded-lg relative bg-transparent">
                  <input
                    type="text"
                    name="name"
                    className="mt-1 p-2 outline-none focus:outline-none text-center h-full w-full me-4 bg-gray-300 font-semibold text-md hover:text-black focus:text-black md:text-base cursor-default flex items-center text-gray-700 outline-none rounded-lg"
                    value={newUnit.name}
                    onChange={(event) => handleChange(event)} // Pass the event to the function
                  />
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="col-span-1 text-sm flex items-center">
                  Unit abbreviation
                </div>

                <div className="ms-4 col-span-1 text-sm flex items-center">
                  <div>Existing Unit</div>
                </div>
              </div>

              <div className="flex grid-cols-2">
                <div className="col-span-1 flex flex-row h-10 w-full rounded-t-lg relative bg-transparent">
                  <input
                    type="text"
                    placeholder="e.g. mL, g"
                    name="abbreviation"
                    className="mt-1 p-2 outline-none focus:outline-none text-center h-full w-full me-4 bg-gray-300 font-semibold text-md hover:text-black focus:text-black md:text-base cursor-default flex items-center text-gray-700 outline-none rounded-t-lg"
                    value={newUnit.abbreviation}
                    onChange={(event) => handleChange(event)} // Pass the event to the function
                  />
                </div>

                <div
                  className="text-lg flex items-center me-4"
                  style={{ color: "rgba(0, 0, 0, 0)" }}
                >
                  {"="}
                </div>

                <div className="col-span-1 flex flex-row h-10 w-full rounded-t-lg relative bg-transparent">
                  <select
                    name="existingUnit"
                    className="mt-1 p-2 outline-none focus:outline-none text-center h-full w-full me-4 bg-gray-300 font-semibold text-md hover:text-black focus:text-black md:text-base cursor-default flex items-center text-gray-700 outline-none rounded-t-lg"
                    onChange={(event) => handleExistingUnitChange(event)}
                  >
                    {unitsList.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name} ({unit.abbreviation})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div></div>

              <div className="flex grid-cols-2">
                <div className="col-span-1 flex flex-row h-10 w-full rounded-b-lg relative bg-transparent">
                  <input
                    type="number"
                    name="newUnitAmt"
                    className="mt-1 p-2 outline-none focus:outline-none text-center h-full w-full me-4 bg-gray-600 font-semibold text-md md:text-base cursor-default flex items-center text-gray-200 outline-none rounded-b-lg"
                    value={newUnitAmt}
                    onChange={(event) => handleNewUnitAmtChange(event)}
                    style={{ backgroundColor: "#2c3e50" }} // Set your desired darker color
                  />
                </div>

                <div className="text-lg flex items-center me-4">=</div>

                <div className="col-span-1 flex flex-row h-10 w-full rounded-b-lg relative bg-transparent">
                  <input
                    type="number"
                    name="existingUnitAmt"
                    className="mt-1 p-2 outline-none focus:outline-none text-center h-full w-full me-4 bg-gray-600 font-semibold text-md md:text-base cursor-default flex items-center text-gray-200 outline-none rounded-b-lg"
                    value={existingUnitAmt}
                    onChange={(event) => handleExistingUnitAmtChange(event)}
                    style={{ backgroundColor: "#2c3e50" }} // Set your desired darker color
                  />
                </div>
              </div>

              <div className="mt-5">
                <div className="flex justify-end">
                  <button
                    className="text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    style={{ backgroundColor: "#A12323" }}
                    type="button"
                    onClick={handleClose}
                  >
                    Close
                  </button>
                  <button
                    className="text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    style={{ backgroundColor: "#097969" }}
                    type="button"
                    onClick={handleSubmit}
                  >
                    Add Unit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-75 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default AddNewUnit;
