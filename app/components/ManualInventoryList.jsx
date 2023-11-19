"use client";
import { useState, useEffect } from "react";
import RecordManualCount from "./RecordManualCount";
import ClearManualCount
 from "./ClearManualCount";
 import Navbar from "./Navbar";
import { GET as getAllVariants} from "../api/purchasevariant/route";
import { GET as getAllMaterials} from "../api/purchase/route";


const ManualCount
 = () => {
  const [materialList, setMaterialList] = useState([]);
  const [variantsList, setVariantsList] = useState([]);

  useEffect(() => {
    async function getVariants() {
      try {
        const response = await getAllVariants();
        const { variants, error } = await response.json();

        if (error) {
          setError(error);
        } else {
          
          setVariantsList(variants);
          console.log('Variants Data:', variants);
        }
      } catch (error) {
        console.error(error)
        
      }
    }

    getVariants();
  }, []);


  useEffect(() => {

    async function getMaterials() {
      try {
        const response = await getAllMaterials();
        const { materials, error } = await response.json();

        if (error) {
          setError(error);
        } else {
          setMaterialList(materials);
          console.log('Material Data:', materials);
        }
      } catch (error) {
        console.error(error)
      }
    }
    getMaterials();
  }, []);




  //stores all ordered products
  const [ManualCount
    , setManualCount
  ] = useState([
    {
      name: "Material A",
      metric: "0",
      variants: [{ variantName: "MA-V1", amount: 0, unit: "0", quantity: 1 }, { variantName: "MA-V2", amount: 0, unit: "0", quantity: 1 }],
    },
    {
      name: "Material B",
      metric: "1",
      variants: [{ variantName: "MB-V2", amount: 0, unit: "0", quantity: 1 }],
    },
    {
      name: "Material C",
      metric: "0",
      variants: [{ variantName: "0", amount: 0, unit: "0", quantity: 1 }],
    },
    {
      name: "Material D",
      metric: "1",
      variants: [{ variantName: "0", amount: 0, unit: "0", quantity: 1 }],
    },
    {
      name: "Material E",
      metric: "1",
      variants: [{ variantName: "0", amount: 0, unit: "0", quantity: 1 }],
    },
  ]);

  const [sortOption, setSortOption] = useState('nameAscending'); // Default sort option

    // Sorting function
    const sortManualCount = (option) => {
      const sortedManualCount = [...ManualCount];
  
      switch (option) {
        case 'nameAscending':
          sortedManualCount.sort((a, b) => a.name.localeCompare(b.name));
          sortedManualCount.forEach((item) => {
            item.variants.sort((va, vb) => va.variantName.localeCompare(vb.variantName));
          });
          break;
        case 'nameDescending':
          sortedManualCount.sort((a, b) => b.name.localeCompare(a.name));
          sortedManualCount.forEach((item) => {
            item.variants.sort((va, vb) => vb.variantName.localeCompare(va.variantName));
          });
          break;
        // Add more cases for additional sorting options if needed
        default:
          break;
      }
  
      setManualCount(sortedManualCount);
      setSortOption(option);
    };

    
  

  console.log(materialList)
  console.log(variantsList)




  const handleQtyChange = (productIndex, variantIndex, event) => {
    const newManualCount
     = [...ManualCount
    ];
    newManualCount
    [productIndex].variants[variantIndex].quantity =
      event.target.valueAsNumber;
    setManualCount
    (newManualCount
      );
  };


  const handleAmtChange = (productIndex, variantIndex, event) => {
    const newManualCount
     = [...ManualCount
    ];
    newManualCount
    [productIndex].variants[variantIndex].amount =
      event.target.valueAsNumber;
    setManualCount
    (newManualCount
      );
  };


  const handleIncrement = (productIndex, variantIndex) => {
    const newManualCount
     = [...ManualCount
    ];
    newManualCount
    [productIndex].variants[variantIndex].quantity++;
    setManualCount
    (newManualCount
      );
  };


  const handleDecrement = (productIndex, variantIndex) => {
    const newManualCount
     = [...ManualCount
    ];
    if (newManualCount
      [productIndex].variants[variantIndex].quantity > 1) {
      newManualCount
      [productIndex].variants[variantIndex].quantity--;
      setManualCount
      (newManualCount
        );
    }
  };

  console.log(materialList)
  console.log(variantsList)
  return (
    
    <div  
      className="w-[100%] p-10 bg-blue-300 gap-6 rounded-lg"
      style={{ backgroundColor: "#D6E0F0", color: "black" }} //style for sorting
    >
        <select
        className="p-2 rounded-md bg-white"
        value={sortOption}
        onChange={(e) => sortManualCount(e.target.value)}
      >
          <option value="nameAscending">Sort by Name (A-Z)</option>
          <option value="nameDescending">Sort by Name (Z-A)</option>      
        </select>
        
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
                  {ManualCount
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
                        <div className="col-span-1 me-5 text-sm flex items-center justify-center">
                          Unit
                        </div>
                      </div>

                      <div>
                      {materialList
                      .map((material, index) => (
                        <div key={index}>
                          <div
                            className="w-full p-3 mb-4 grid grid-cols-5 text-xs rounded-lg"
                            style={{
                              backgroundColor: "#D6E0F0",
                              color: "#27374D",
                            }}
                          >
                            <div className="col-span-5 flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">

                              <div className="ml-0 font-black text-xl ms-20 mt-1"> 
                                {material.name}
                              </div>
                            </div>


                            {variantsList.map((variant, variantIndex) => (
                              
                              <>
                                {variant.material_id === material.id ? (<>
                                
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
                                      {variant.name}
                                    </li>
                                    
                                  </div>
                                </div>


                                <div className="mt-3 col-span-1 flex flex-row h-11 w-full rounded-lg relative bg-transparent mt-1">
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
                                  />
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


                                </div>
                                <div className="ml-5 col-span-1 flex flex-row h-11 w-full rounded-lg relative bg-transparent ">
                                  <input
                                    type="number"
                                    className="mt-3 outline-none focus:outline-none text-center h-full w-full me-4 bg-white-300 font-semibold text-md hover:text-black focus:text-black md:text-base cursor-default flex items-center text-gray-700 outline-none rounded-lg "
                                    value={variant.amount}
                                    onChange={(event) =>
                                      handleAmtChange(
                                        index,
                                        variantIndex,
                                        event,
                                      )
                                    }
                                  />
                                </div>
                                <div className="mt-3 col-span-1 flex flex-row h-10 w-full rounded-lg relative bg-transparent">
                                  <div className="relative">
                                    <select
                                      id="large"
                                      value={variant.unit}
                                      onChange={(event) =>
                                        handleUnitChange(
                                          index,
                                          variantIndex,
                                          event,
                                        )
                                      }
                                      class="block w-full ml-10 px-5 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    >
                                      <option value="0">g</option>
                                      <option value="1">mg</option>
                                      <option value="2">kg</option>
                                      <option value="3">ml</option>
                                      <option value="4">l</option>
                                      <option value="5"></option>
                                    </select>
                                  </div>
                                </div>

                                </>) : null}
                                
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
                  {ManualCount
                  .length !== 0 ? (
                    <>            
 
                      <RecordManualCount />
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
