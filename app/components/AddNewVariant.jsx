"use client";

import { useState } from "react";
import { POST } from "../api/purchasevariant/route";



const AddNewVariant = (props) => {

    //stores all products in the database
    const [error, setError] = useState(null);
    const [newVariant, setNewVariant] = useState({
        material_id: props.material_id,
        name: "",
        initialAmt: 0,
        amt: 0,
        unit: "0"
    });
    console.log(newVariant)

    const convertAmount = (amount, value) => {
      
      if (value==="0"){
      return amount;
      } else if (value==="1"){
        return amount*1000;
      } else if (value==="2"){
        return amount/1000;
      } 

    };
    

    const handleChange = (e) => {
      const { name, value } = e.target;
  
      // Convert the amount to its default unit if the unit is changed
      
      if (name === "initialAmt" && newVariant.unit==="0") {
        setNewVariant({
          ...newVariant,
          [name]: value,
          amt: value,
        });
      } else if (name === "initialAmt" && newVariant.unit==="1") {
        setNewVariant({
          ...newVariant,
          [name]: value,
          amt: value*1000,
        });
      } else if (name === "initialAmt" && newVariant.unit==="2") {
        setNewVariant({
          ...newVariant,
          [name]: value,
          amt: value/1000,
        });
      } else if (name === "unit" && value === "0") {
        setNewVariant({
          ...newVariant,
          [name]: value,
          amt: newVariant.initialAmt,
        });
      } else if (name === "unit" && value === "1") {
        setNewVariant({
          ...newVariant,
          [name]: value,
          amt: newVariant.initialAmt*1000,
        });
      } else if (name === "unit" && value === "2") {
        setNewVariant({
          ...newVariant,
          [name]: value,
          amt: newVariant.initialAmt/1000,
        });
      } else {
        // Update other properties normally
        setNewVariant({
          ...newVariant,
          [name]: value,
        });
      }
    };
    

     //closes the modal and removes all previous personalizations
     const handleClose= () => {
        props.onClose()
      };

      const handleSubmit = async () => {
          const convertedAmt = convertAmount(newVariant.amt, newVariant.unit); // Implement convertToDefaultUnit function
          console.log(newVariant)
          setNewVariant({
            ...newVariant,
            amt: convertedAmt,
          });
      
        try {
          // Assuming you have the 'variants' data available
          const postResult = await POST(newVariant);
      
          if (postResult.error) {
            setError(postResult.error);
            console.log("Error: " + postResult.error);
          } else {
            // Assuming you want to set the new variant in state
            setVariantsList([...variantsList, postResult.newVariant]);
            setLoading(false); // Data has been loaded
            console.log(postResult.newVariant);
          }
        } catch (error) {
          setError(error.message);
        }
        props.onClose();
      };
      

  
    return (
          <>
            <div
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
              <div className="relative w-auto my-6 mx-auto max-w-5xl" style={{ minWidth: '40%' }} >
                {/*content*/}
                <div className="border-0 rounded-lg relative flex flex-col w-full outline-none focus:outline-none" style={{ backgroundColor: '#526D82'}}>
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t" style={{ backgroundColor: '#27374D'}}>
                    <h3 className="text-3xl font-semibold">
                      Create a Variant
                    </h3>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto rounded-b-lg" style={{ backgroundColor: '#526D82'}}>
                    
                 
           
                  <div className="grid grid-cols-2">
                <div className="text-sm flex items-center">
                    Variant Name
                </div>
                <div className="text-sm flex items-center">
                    <div>
                    Amount
                    </div>

                </div>
                
                </div>



                    <div className="flex grid-cols-2">
                    
                    <div className="col-span-1 flex flex-row h-10 w-full rounded-lg relative bg-transparent">
                    <input
                        type="text"
                        name="name"
                        className="mt-1 p-2 outline-none focus:outline-none text-center h-full w-full me-4 bg-gray-300 font-semibold text-md hover:text-black focus:text-black md:text-base cursor-default flex items-center text-gray-700 outline-none rounded-lg"
                        value={newVariant.name}
                        onChange={(event) => handleChange(event)} // Pass the event to the function
                      />


                    </div>

                    <div className="col-span-1 flex flex-row h-10 w-full rounded-lg relative bg-transparent">
                        <input
                        type="number"

                        name="initialAmt"
                        className="mt-1 p-2 outline-none focus:outline-none text-center h-full w-full me-4 bg-gray-300 font-semibold text-md hover:text-black focus:text-black md:text-base cursor-default flex items-center text-gray-700 outline-none rounded-lg"
                        value={newVariant.initialAmt}
                        onChange={(event) => handleChange(event)} // Pass the event to the function

                        /> 
                        <div className="relative">
                        <select
                            id="large"
                            name="unit"
                            value={newVariant.unit}
                            onChange={(event) => handleChange(event)}
                            class="block w-15 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        >
                            {props.unit === "g" ? (
                                        <>
                                          <option value="0">g</option>
                                          <option value="1">kg</option>
                                          <option value="2">mg</option>
                                        </>
                                      ): <>
                                        <option value="0">mL</option>
                                        <option value="1">L</option>
                                          </>}
                        </select>
                        </div>
                    </div>


                    </div>

                             

         
                    <div className="mt-5">
                  <div className="flex justify-end"> 
                    <button
                      className="text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      style={{ backgroundColor: "#A12323"}}
                      type="button"
                      onClick={handleClose}
                    >
                      Close
                    </button>
                    <button
                      className="text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      style={{ backgroundColor: "#097969"}}
                      type="button"

                      onClick={handleSubmit}
                      >
                      Add Variant
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

export default AddNewVariant;