"use client";
import { useState, useEffect } from "react";
import RecordManualCount from "./RecordManualCount";
import ClearManualCount from "./ClearManualCount";
import Navbar from "./Navbar";
import { GET as GETUNIT } from "../api/submetric/route";
import { GET as getCompleteList, POST} from "../api/manualcount/route";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";

const ManualCount = (props) => {
  const [postSuccess, setPostSuccess] = useState(false);
  const [completeList, setCompleteList] = useState([]);
  const [unitsList, setUnitsList] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getCompleteList();
        const { materials, error } = await response.json();
    
        if (error) {
          setError(error);
        } else {
          // Iterate through materials variants and set the unit to "1"
          const modifiedMaterials = materials.map((material) => ({
            ...material,
            variants: material.variants.map((variant) => ({
              ...variant,
              unit: "1",
              finalPartialAmount: 0
            })),
          }));
          setCompleteList(modifiedMaterials);
          console.log('New Complete List Data:', modifiedMaterials);
        }
      } catch (error) {
        console.error(error);
      }
    }
    
      async function getUnits() {
        try {
          const response = await GETUNIT();
          const { metrics, error } = await response.json();
  
          if (error) {
            setError(error);
          } else {
            setUnitsList(metrics);
          }
        } catch (error) {
          setError(error.message);
          
        }
      }
      getUnits();
      fetchData();
  }, [postSuccess])

  useEffect(() => {
    console.log('updated complete list:', completeList);
  }, [completeList])

  const [sortOrder, setSortOrder] = useState("ascending");
  
  const sortMaterialsAndVariantsByName = () => {
    const sortedMaterials = [...materialList].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    const sortedVariants = [...variantsList].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    if (sortOrder === "ascending") {
      setMaterialList(sortedMaterials);
      setVariantsList(sortedVariants);
      setSortOrder("descending");
    } else {
      setMaterialList(sortedMaterials.reverse());
      setVariantsList(sortedVariants.reverse());
      setSortOrder("ascending");
    }
  };
  
  const handleUnitChange = (productIndex, variantIndex, event) => {
    const newManualCount = [...completeList];
    newManualCount[productIndex].variants[variantIndex].unit = event.target.value;

   

      let ratio = parseFloat(event.target.value)
      newManualCount[productIndex].variants[variantIndex].finalPartialAmount = ratio * newManualCount[productIndex].variants[variantIndex].amount;
      setCompleteList(newManualCount);
    
  };



  const handleQtyChange = (productIndex, variantIndex, event) => {
    const newManualCount = [...completeList];
    newManualCount[productIndex].variants[variantIndex].quantity = event.target.valueAsNumber;
    setCompleteList(newManualCount);
  };


  const handleAmtChange = (productIndex, variantIndex, event) => {

    const newManualCount = [...completeList];
    newManualCount[productIndex].variants[variantIndex].amount = event.target.value;

      let ratio = parseFloat(newManualCount[productIndex].variants[variantIndex].unit)

      newManualCount[productIndex].variants[variantIndex].finalPartialAmount = ratio * event.target.value;
      setCompleteList(newManualCount);
  };

  const handleIncrement = (productIndex, variantIndex) => {
      const newCompleteList = [...completeList];

      newCompleteList[productIndex].variants[variantIndex].quantity += 1
  
      setCompleteList(newCompleteList);
    
  };
  
  const handleDecrement = (productIndex, variantIndex) => {
    const newManualCount = [...completeList];
    if (newManualCount[productIndex].variants[variantIndex].quantity > 0) {
      newManualCount[productIndex].variants[variantIndex].quantity--;
      setCompleteList(newManualCount);
    }
  };

  return (
    
    <div className="w-[80%] p-10 bg-blue-300 gap-6 rounded-lg" style={{ backgroundColor: "#D6E0F0", color: "black" }}>
<div className="w-[6%] rounded-md" style={{ backgroundColor: "#27374D", color: "black" }}>
  <button
    onClick={sortMaterialsAndVariantsByName}
    style={{
      padding: "5px 10px", // Example padding
      borderRadius: "5px", // Example border radius
      display: "flex", // Make button inline with icon
      alignItems: "center", // Align items vertically
    }}
  >
    Sort{" "}
    <FontAwesomeIcon icon={faSort} style={{ marginLeft: "5px" }} />
  </button>
</div>


      <div className="px-3 w-full grid grid-cols-5 rounded-lg">
        <div className="col-span-5 md:col-span-5 text-xl font-bold">
          Materials List
        </div>
      </div>
      <hr
        className="w-full border-2 mb-4"
        style={{ backgroundColor: "#D6E0F0", color: "white" }}
      ></hr>
      <div className="w-full flex flex-col items-center gap-4">
        <div className="w-full flex flex-col text-xs">
          <div className="flex flex-col">
            <div className="w-full flex flex-col items-left gap-4">
              <div className="w-full flex flex-col text-xs">
                <div className="flex flex-col">
                  {completeList
                  .length !== 0 ? (
                    <>
                      <div
                        className="px-3 w-full grid grid-cols-5 text-xs rounded-lg"
                        style={{ backgroundColor: "#D6E0F0", color: "black" }} //style for headers
                      >
                        <div className="col-span-1 text-sm flex items-center justify-center">
                          Name
                        </div>
                        {/* <div className="col-span-1 me-5 text-sm flex items-center justify-center">
                          Variant
                        </div> */}
                        <div className="col-span-1 text-sm flex items-center justify-center">
                          Qty. Count
                        </div>
                        <div className="col-span-1 me-5 text-sm flex items-center justify-center">
                          Partial Amount
                        </div>
                        <div className="col-span-1 ml-0 me-24 text-sm flex items-center justify-center">
                          Unit
                        </div>
                      </div>

                      <div>
                      {completeList.map((material, index) => (
                        <div key={index}>
                          <div
                            className="w-full p-3 mb-4 grid grid-cols-5 text-xs rounded-lg"
                            style={{
                              backgroundColor: "#D6E0F0",
                              color: "#27374D",
                            }}
                          >

                            {material.variants.length > 0 ? (
                              <div className="col-span-5 flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
                                <div className="ml-0 font-black text-xl ms-20 mt-1"> 
                                  {material.name}
                                </div>
                              </div>
                            ) : null}
                            
                            
                            {material.variants.map((variant, variantIndex) => (
                              
                              <>
                                {variantIndex !== 0 ? (
                                  <div className="col-span-5 me-5 mt-3" />
                                ) : null}

                                

                                <div className="col-span-1 me-5">
                                  <div className="relative">
                                    <li
                                      value={variant.name}
                                      onChange={(event) =>
                                        handleVariantNameChange(
                                          index,
                                          variantIndex,
                                          event,
                                        )
                                      }
                                      id="large"
                                      class="mt-3 block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    >
                                      {variant.name === material.name ? "No Variation" : variant.name}
                                    </li>
                                  </div>
                                </div>


                                <div className="mt-3 col-span-1 flex flex-row h-11 w-full rounded-lg relative bg-transparent mt-1">
                                  {!(variant.name === material.name) ? (
                                    <button
                                      onClick={() =>
                                        handleDecrement(index, variantIndex)
                                      }
                                      className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none"
                                      style={{ backgroundColor: "#A12323" }}
                                    >
                                      <span className="m-auto text-2xl font-bold text-black">
                                        −
                                      </span>
                                    </button>
                                  ) : null}
                                  
                                  <input
                                    type="number"
                                    className="outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black md:text-base cursor-default flex items-center text-gray-700 outline-none"
                                    value={variant.quantity}
                                    onChange={(event) =>
                                      handleQtyChange(
                                        index,
                                        variantIndex,
                                        event,
                                      )
                                    }
                                    disabled={variant.name === material.name}
                                  />

                                  {!(variant.name === material.name) ? (
                                    <button
                                      onClick={() =>
                                        handleIncrement(index, variantIndex)
                                      }
                                      className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer"
                                      style={{ backgroundColor: "#097969" }}
                                    >
                                      <span className="m-auto text-2xl font-bold text-black">
                                        +
                                      </span>
                                    </button>
                                  ) : null}
                                </div>
                                <div className="ml-5 col-span-1 flex flex-row h-11 w-full rounded-lg relative bg-transparent ">
                                  <input
                                    type="number"
                                    className="mt-3 outline-none focus:outline-none text-center h-full w-full me-4 bg-white-300 font-semibold text-md hover:text-black focus:text-black md:text-base cursor-default flex items-center text-gray-700 outline-none rounded-lg "
                                    value={variant.amount === 0 ? "" : variant.amount}
                                    onChange={(event) =>
                                      handleAmtChange(
                                        index,
                                        variantIndex,
                                        event,
                                      )
                                    }

                                  />
                                </div>
                                {/** to be updated with unit feature */}
                                <div className="mt-3 col-span-1 flex flex-row h-10 w-full rounded-lg relative bg-transparent">
                                  <div className="relative">
                                  <select
                                      id="large"
                                      value={variant.unit}
                                      onChange={(event) =>
                                        handleUnitChange(index, variantIndex, event)
                                      }
                                      class="block ml-2 w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    >
                                       {unitsList
                                              .filter((unit) => material.metric_id === unit.metric_id)
                                              .map((unit) => (
                                                  <option key={unit.id} value={unit.ratio}>
                                                      {unit.abbreviation}
                                                  </option>
                                              ))}
                                    </select>
                                  </div>
                                </div>
                              </>
                              
                             
                            ))}


                            <div className="col-span-1" />
                          </div>
                        </div>
                      ))}
                      </div>
                    </>
                  
                  ) : (
                    <div
                    >
                    </div>
                  )}
                </div>
                <div className="flex justify-end">
                  {completeList
                  .length !== 0 ? (
                    <>            
                      <RecordManualCount userID={props.userID} completeList={completeList} postMaterial={POST} onConfirmClear={() =>{ setPostSuccess((prev) => (!prev)) }}/>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};


export default ManualCount
;