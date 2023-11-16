"use client";

import { useEffect, useState } from "react";
import { GET } from "../api/rawmaterials/route";
import { POST } from "../api/productlist/route";

const AddProductOffer = ({ addProductToList }) => {
  const [productName, setProductName] = useState("");

  const handleProductNameChange = (e) => {
    setProductName(e.target.value);
  };

  //stores all products in the database
  const [materialList, setMaterialList] = useState([]);
  const [newMaterial, setNewMaterial] = useState({
    name: "",
    amount: "",
    unit: "",
  });
  const [existingMaterial, setExistingMaterial] = useState({
    selected: "",
    amount: "",
    unit: "",
  });

  const [materialNames, setMaterialNames] = useState([])
  const [unitMap, setUnitMap] = useState({}); // Initialize unit map

  useEffect(() => {
    async function getMaterials() {
      try {
        const response = await GET();
        const { materials, error } = await response.json();
  
        if (!error) {
          const materialNames = materials.map((material) => material.name);
          setMaterialNames(materialNames);
          const unitMapping = {};
          materials.forEach((material) => {
            unitMapping[material.name] = material.REF_METRIC.metric_unit;
          });
          setUnitMap(unitMapping);
        } else {
          console.error('Error fetching materials:', error);
        }
      } catch (error) {
        console.error('Error in getMaterials:', error);
      }
    }
    getMaterials();
  }, []);



  const handleMaterialNameChange = (e) => {
    setNewMaterial({ ...newMaterial, name: e.target.value });
  };

  const handleMaterialAmountChange = (e) => {
    setNewMaterial({ ...newMaterial, amount: e.target.value });
  };

  const handleMaterialUnitChange = (e) => {
    setNewMaterial({ ...newMaterial, unit: e.target.value });
  };

  const handleExistMaterialAmountChange = (e) => {
    setExistingMaterial({ ...existingMaterial, amount: e.target.value });
  };

  const handleExistMaterialUnitChange = (e) => {
    setExistingMaterial({ ...existingMaterial, unit: e.target.value });
  };

  const [newMaterialNameError, setNewMaterialNameError] = useState('');

  const validate = () => {
    let newMaterialNameError = '';

    const lowerCaseNewMaterialName = newMaterial.name.toLowerCase();
    const lowerCaseMaterialNames = materialNames.map(name => name.toLowerCase());

    if (lowerCaseMaterialNames.includes(lowerCaseNewMaterialName)){
      newMaterialNameError = 'The material you inputted already exists';
    }
    setNewMaterialNameError(newMaterialNameError);

    if (newMaterialNameError) {
      return false;
    }
    return true;
  }

  const handleAddMaterial = () => {
    const isValid = validate();
    if (isValid) {
      const materialObject = { ...newMaterial };
      setMaterialList([...materialList, materialObject]);
      setNewMaterial({ name: "", amount: "", unit: "" });
      setNewMaterialNameError('');
    }
    
  };

  const [selectedExistingMaterial, setSelectedExistingMaterial] = useState("");

  const handleExistingMaterialChange = (e) => {
    const selectedMaterialName = e.target.value;
    const selectedUnit = unitMap[selectedMaterialName]; // Get the corresponding unit

    setSelectedExistingMaterial(selectedMaterialName);

    // Update the existingMaterial state with the selected material name and unit
    setExistingMaterial({
      selected: selectedMaterialName,
      amount: existingMaterial.amount,
      unit: selectedUnit,
    });
  };

  const handleAddExistingMaterial = () => {
    if (selectedExistingMaterial && existingMaterial.amount) {
      // Use the selected existing material's name to fetch the unit from unitMap
      const unit = unitMap[selectedExistingMaterial];
  
      if (unit) {
        const materialObject = {
          name: selectedExistingMaterial,
          amount: existingMaterial.amount,
          unit: unit,
        };
        setMaterialList([...materialList, materialObject]);
        setExistingMaterial({ name: "", amount: "", unit: "" });
      }
    }
  };

  const handleAddProduct = async () => {
    try {
      // Create an array of objects for materials with name, amount, and unit properties
      const materials = materialList.map((material) => ({
        name: material.name,
        amount: material.amount,
        unit: material.unit,
        material_id: material.material_id, // Include material_id in the object
      }));
  
      // Create the newProduct object with the product name, status, and materials
      const newProduct = {
        name: productName,
        status: "Active",
        materials: materials,
      };
  
      const response = await POST(newProduct);
  
      if (response.status === 200) {
        // If the request is successful, add the new product to the list
        addProductToList(newProduct);
  
        // Reset the input fields and close the modal
        setProductName("");
        setMaterialList([]);
        setShowModal(false);
        window.location.reload();
      } else {
        console.error("Error adding product. Server response:", response.status, response.statusText);
        // You can also log the response body for more detailed error information.
        const errorBody = await response.json();
        console.error("Server error response body:", errorBody);
        // Handle the error gracefully in your UI, e.g., show an error message.
      }
    } catch (error) {
      console.error("Error adding product:", error);
      // Handle unexpected errors here, e.g., network issues.
    }
  };

  const [selectedOption, setSelectedOption] = useState("new");
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  //determines if the modal for adding a product is shown or not
  const [showModal, setShowModal] = useState(false);

  //closes the modal and removes all previous personalizations
  const handleClose = () => {
    setProductName("");
    setMaterialList([]);
    setShowModal(false);
  };

  //Sort and Search Mechanisms

  return (
    <>
      <button
        className="text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
        style={{ backgroundColor: "#27374D", color: "white" }}
        type="button"
        onClick={() => setShowModal(true)}
      >
        Add Product
      </button>

      {showModal ? (
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
                  <h3 className="text-3xl font-semibold">Add a Product</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div
                  className="relative p-6 flex-auto rounded-b-lg"
                  style={{ backgroundColor: "#526D82" }}
                >
                  <div className="flex space-x-4 mb-4">
                    <label className="flex items-center text-lg">
                      Name of Product
                    </label>
                    <input
                      type="text"
                      className="flex-grow p-2 rounded"
                      style={{ backgroundColor: "#DDE6ED", color: "#27374D" }}
                      value={productName}
                      onChange={handleProductNameChange}
                    />
                  </div>
                  <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    {materialList.length !== 0 ? (
                      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                            <th scope="col" className="px-6 py-3">
                              Material name
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Amount
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Unit
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {materialList.map((material, index) => (
                            <tr
                              className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
                              key={index}
                            >
                              <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                {material.name}
                              </td>
                              <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                {material.amount}
                              </td>
                              <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                {material.unit}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div
                        className="w-full p-20 text-xs rounded-lg"
                        style={{ backgroundColor: "#9DB2BF", color: "#27374D" }}
                      >
                        <div className="font-black text-xl flex items-center justify-center">
                          No Materials Added
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap justify-center">
                    <div className="flex items-center mr-4 mt-5">
                      <input
                        id="new-material-radio"
                        type="radio"
                        name="material-radio"
                        value="new"
                        checked={selectedOption === "new"}
                        onChange={handleOptionChange}
                        className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="new-material-radio"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Add New Material
                      </label>
                    </div>
                    <div className="flex items-center mr-4 mt-5">
                      <input
                        id="existing-material-radio"
                        type="radio"
                        value="existing"
                        name="material-radio"
                        checked={selectedOption === "existing"}
                        onChange={handleOptionChange}
                        className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="existing-material-radio"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Add Existing Material
                      </label>
                    </div>
                  </div>
                  {selectedOption === "new" ? (
                    <>
                      <div>
                        <div className="flex justify-center space-x-4 mb-4 mt-4">
                          <label className="w-32 text-right mt-2">
                            Name of Material
                          </label>
                          <input
                            className={`w-72 rounded-md appearance-none border border-gray-300 py-2 px-2 bg-white text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent ${
                              newMaterialNameError && 'border-red-500'
                            }`}
                            style={{
                              backgroundColor: "#DDE6ED",
                              color: "#27374D",
                            }}
                            value={newMaterial.name}
                            onChange={handleMaterialNameChange}
                          />
                        </div>
                        {newMaterialNameError && (
                          <p className = "text-red-500 text-sm pl-60 mt-2">
                            {newMaterialNameError}
                          </p>
                        )}

                        <div className="flex justify-center space-x-4 mb-4 pl-4">
                          <label className="text-right mt-2 ">Amount</label>
                          <input
                            className="focus:outline-none focus:ring-2 focus:ring-sky-600 w-56 text-gray-700 py-2 px-3 border border-gray-300 bg-white rounded-md w-42 p-2 rounded"
                            style={{
                              backgroundColor: "#DDE6ED",
                              color: "#27374D",
                            }}
                            value={newMaterial.amount}
                            onChange={handleMaterialAmountChange}
                          />
                        </div>
                        <div className="flex justify-center space-x-4 mb-4 pl-3 pr-52">
                          <label className="w-32 text-right mt-2">Unit</label>
                          <select
                            className="w-24 p-2 rounded"
                            style={{
                              backgroundColor: "#DDE6ED",
                              color: "#27374D",
                            }}
                            value={newMaterial.unit}
                            onChange={handleMaterialUnitChange}
                          >
                            <option value="">Select</option>
                            <option value="mg">mg</option>
                            <option value="g">g</option>
                            <option value="mL">mL</option>
                            <option value="L">L</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-center">
                          <button
                            className="text-white font-semibold uppercase text-sm px-6 py-3 rounded-3xl shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            style={{ backgroundColor: "#097969" }}
                            type="button"
                            onClick={handleAddMaterial}
                          >
                            Add New Material
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <div className="flex justify-center space-x-4 mb-4 mt-4">
                          <label className="w-32 text-right mt-2">
                            Name of Material
                          </label>
                          <select
                            className="w-72 rounded-md appearance-none border border-gray-300 py-2 px-2 bg-white text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent"
                            value={selectedExistingMaterial}
                            onChange={handleExistingMaterialChange}
                          >
                            <option value="">Select a Material</option>
                            {materialNames.map((materialName, index) => (
                              <option key={index} value={materialName}>
                                {materialName}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex justify-center space-x-4 mb-4 pl-4">
                          <label className="text-right mt-2 ">Amount</label>
                          <input
                            className="focus:outline-none focus:ring-2 focus:ring-sky-600 w-56 text-gray-700 py-2 px-3 border border-gray-300 bg-white rounded-md w-42 p-2 rounded"
                            style={{
                              backgroundColor: "#DDE6ED",
                              color: "#27374D",
                            }}
                            value={existingMaterial.amount}
                            onChange={handleExistMaterialAmountChange}
                          />
                        </div>
                        <div className="flex justify-center space-x-4 mb-4 pl-3 pr-52">
                          <label className="w-32 text-right mt-2">Unit</label>
                          <select
                            className="w-24 p-2 rounded"
                            style={{
                              backgroundColor: "#DDE6ED",
                              color: "#27374D",
                            }}
                            value={existingMaterial.unit}
                            onChange={handleExistMaterialUnitChange}
                            disabled
                          >
                            <option value="mg">mg</option>
                            <option value="g">g</option>
                            <option value="mL">mL</option>
                            <option value="L">L</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-center">
                          <button
                            className="text-white font-semibold uppercase text-sm px-6 py-3 rounded-3xl shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            style={{ backgroundColor: "#097969" }}
                            type="button"
                            onClick={handleAddExistingMaterial}
                          >
                            Add Existing Material
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="mt-5">
                    <div className="flex justify-center">
                      <button
                        className="text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        style={{ backgroundColor: "#A12323" }}
                        type="button"
                        onClick={handleClose}
                      >
                        Cancel
                      </button>
                      <button
                        className="text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        style={{ backgroundColor: "#097969" }}
                        type="button"
                        onClick={handleAddProduct}
                      >
                        &nbsp;&nbsp;&nbsp;&nbsp;Save&nbsp;&nbsp;&nbsp;&nbsp;
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-75 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default AddProductOffer;
