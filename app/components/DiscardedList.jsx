"use client";

import { useState, useEffect } from "react";
import { POST, GetReasons } from "../api/discard/route";
import AddMaterialPurchase from "./AddMaterialPurchase";
import { GET } from "../api/purchasevariant/route";

const DiscardedList = () => {
  //stores all ordered products
  const [discardedList, setDiscardedList] = useState([]);
  const [variantsList, setVariantsList] = useState([]);
  const [reasonList, setReasonList] = useState([]);
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await GET();
        const { variants, error } = await response.json();
        const response2 = await GetReasons()
        const {reason, error2} = await response.json()

        if (error || error2) {
          error & error2 ? setError(error + error2) : (error ? setError(error) : setError(error2))
        } else {
          setVariantsList(variants);
          setLoading(false);
        }
      } catch (error) {
        setError(error.message);
        
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    console.log('Variants List: ', variantsList)
  }, [variantsList])

  const handleAddMaterials = (materials) => {
    const discardWithVariants = materials.map((material) => ({
      ...material,
      variants: [{ variantName: "", amount: 0, unit: "", quantity: 1 }],
    }));
  
    setDiscardedList(discardedList.concat(discardWithVariants));
  };

  const addVariant = (productIndex) => {
    const newVariant = { variantName: 0, amount: 0, unit: 0, quantity: 1 };
    const newDiscardedList = [...discardedList];
    newDiscardedList[productIndex].variants.push(newVariant);
    setDiscardedList(newDiscardedList);
  };
  
  //handles changes with the input if number is manually typed in
  const handleVariantNameChange = (productIndex, variantIndex, event) => {
    const newDiscardedList = [...discardedList];
    if (event.target.value === "Add New Variant") {
      
      return;
    }
    newDiscardedList[productIndex].variants[variantIndex].variantName =
      event.target.value;
    setDiscardedList(newDiscardedList);
  };

  const handleUnitChange = (productIndex, variantIndex, event) => {
    const newDiscardedList = [...discardedList];
    newDiscardedList[productIndex].variants[variantIndex].unit =
      event.target.value;
    setDiscardedList(newDiscardedList);
  };
  
  const handleQtyChange = (productIndex, variantIndex, event) => {
    const newDiscardedList = [...discardedList];
    newDiscardedList[productIndex].variants[variantIndex].quantity =
      event.target.valueAsNumber;
    setDiscardedList(newDiscardedList);
  };
  
  const handleAmtChange = (productIndex, variantIndex, event) => {
    const newDiscardedList = [...discardedList];
    newDiscardedList[productIndex].variants[variantIndex].amount =
      event.target.valueAsNumber;
    setDiscardedList(newDiscardedList);
  };
  
  const handleIncrement = (productIndex, variantIndex) => {
    const newDiscardedList = [...discardedList];
    newDiscardedList[productIndex].variants[variantIndex].quantity++;
    setDiscardedList(newDiscardedList);
  };
  
  const handleDecrement = (productIndex, variantIndex) => {
    const newDiscardedList = [...discardedList];
    if (newDiscardedList[productIndex].variants[variantIndex].quantity > 1) {
      newDiscardedList[productIndex].variants[variantIndex].quantity--;
      setDiscardedList(newDiscardedList);
    }
  };

  const handleRemove = (productIndex, variantIndex) => {
    const newDiscardedList = [...discardedList];
    newDiscardedList[productIndex].variants.splice(variantIndex, 1);
  
    // Check if there are no more variants in the product
    if (newDiscardedList[productIndex].variants.length === 0) {
      newDiscardedList.splice(productIndex, 1);
    }
    setDiscardedList(newDiscardedList);
  };
  


  return (
    <div
      className="w-[80%] p-10 bg-blue-300 gap-6 rounded-lg"
      style={{ backgroundColor: "#526D82", color: "white" }}
    >
      <div className="px-3 w-full grid grid-cols-5 rounded-lg">
        <div className="col-span-3 md:col-span-4 text-xl font-bold">
          Discarded List
        </div>
        <div className="col-span-2 md:col-span-1 text-md flex items-center justify-center text-l text-white font-bold">
          {edit && discardedList.length !== 0 ? (
            <button onClick={() => setEdit(false)}>
              {" "}
              <u> Done </u>{" "}
            </button>
          ) : !edit && discardedList.length !== 0 ? (
            <button onClick={() => setEdit(true)} className="text-l text-white font-bold">
              {" "}
              <u> Remove Items </u>{" "}
            </button>
          ) : null}
        </div>
      </div>
      <hr
        className="w-full border-2 mb-4"
        style={{ backgroundColor: "#DDE6ED", color: "white" }}
      ></hr>
      <div className="w-full flex flex-col items-center gap-4">
        <div className="w-full flex flex-col text-xs">
          <div className="flex flex-col">
            <div className="w-full flex flex-col items-center gap-4">
              <div className="w-full flex flex-col text-xs">
                <div className="flex flex-col">
                  {discardedList.length !== 0 ? (
                    <>
                      <div

                        className="px-3 w-full grid grid-cols-6 text-xs rounded-lg"

                        style={{ backgroundColor: "#526D82", color: "white" }}
                      >
                        <div className="col-span-1 text-sm flex items-center justify-center">
                          Material Name
                        </div>
                        <div className="col-span-1 me-5 text-sm flex items-center justify-center">
                          
                        </div>
                        <div className="col-span-1 me-5 text-sm flex items-center justify-center">
                          Amount
                        </div>
                        <div className="col-span-1 text-sm ms-5">
                          Unit
                        </div>
                        <div className="col-span-1 text-sm ms-5">
                          Reason for Discard
                        </div>

                        <div className="col-span-1 text-sm flex items-center justify-center">
                          Qty. Discarded
                        </div>
                      </div>

                      {discardedList.map((product, index) => (
                        <div key={index}>
                          <div

                            className="w-full p-3 mb-4 grid grid-cols-6 text-xs rounded-lg"

                            style={{
                              backgroundColor: "#9DB2BF",
                              color: "#27374D",
                            }}
                          >
                            <div className="col-span-1 flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
                            {/** removed add variant button */}
                              <div className="font-black text-xl ms-3 mt-2">
                                {product.name}
                              </div>
                            </div>

                            {/** TODO: remove variant mapping as the list is now a mix of material and variant */}
                            {product.variants.map((variant, variantIndex) => (
                              <>
                                {variantIndex !== 0 ? (
                                  <div className="col-span-1 me-5 mt-3 " />
                                ) : null}
                                <div className="col-span-1 me-5">
                                  <div className="relative">
                                    {/* <select

                                      value={variant.name}
                                      onChange={(event) =>
                                        handleVariantNameChange(index, variantIndex, event)
                                      }
                                      id="large"
                                      class="mt-3 block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    > 
                                      TODO: remove variants column 
                                      <option value={variantIndex}>{variant.name}</option>
                                    </select> */}
                                  </div>
                                </div>

                                {/** change to disable amount if the item is a variant since it is already predetermined */}
                                <div className="col-span-1 flex flex-row h-10 w-full rounded-lg relative bg-transparent ">
                                  <input
                                    type="number"
                                    className="mt-3 outline-none focus:outline-none text-center h-full w-full me-4 bg-gray-300 font-semibold text-md hover:text-black focus:text-black md:text-base cursor-default flex items-center text-gray-700 outline-none rounded-lg "
                                    value={product.amt}
                                    onChange={(event) =>
                                      handleAmtChange(index, variantIndex, event)
                                    }
                                    disabled={product.material_id ? true : false}
                                  />
                                </div>

                                <div className="mt-3 col-span-1 flex flex-row h-10 w-full rounded-lg relative bg-transparent">
                                  <div className="relative">
                                    <select
                                      id="large"
                                      value={variant.unit}
                                      onChange={(event) =>
                                        handleUnitChange(index, variantIndex, event)
                                      }
                                      class="block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    >
                                      <option value="0">g</option>
                                      <option value="1">mg</option>
                                      <option value="2">kg</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="col-span-1 flex flex-row h-10 w-full rounded-lg relative bg-transparent ">
                                    <select
                                      id="large"
                                      onChange={(event) =>
                                        handleUnitChange(index, variantIndex, event)
                                      }
                                      class="mt-3 outline-none focus:outline-none text-center h-full w-full me-4 bg-gray-300 font-semibold text-md hover:text-black focus:text-black md:text-base cursor-default flex items-center text-gray-700 outline-none rounded-lg"
                                    >
                                      <option>Not Determined</option>
                                      <option value="0">Expired</option>
                                      <option>Add New Reason</option>
                                      <option disabled>─────────────</option>
                                    </select>
                                </div>
                                
                                {/** disabled rendering of +/- for materials as the only value needed is the amt provided by the textbox */}
                                <div className="mt-3 col-span-1 flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
                                  
                                  {product.material_id ? 
                                    (<button
                                      onClick={() =>
                                        handleDecrement(index, variantIndex)
                                      }
                                      className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none"
                                      style={{ backgroundColor: "#A12323" }}
                                    >
                                      <span className="m-auto text-2xl font-bold text-white">
                                        −
                                      </span>
                                    </button>) : (
                                      ""
                                    )
                                  }
                                  <input
                                    type="number"
                                    className="outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black md:text-base cursor-default flex items-center text-gray-700 outline-none"
                                    value={variant.quantity}
                                    onChange={(event) =>
                                      handleQtyChange(index, variantIndex,event)
                                    }
                                    disabled={product.material_id ? true : false}
                                  />
                                  
                                {product.material_id ? 
                                  (<button
                                    onClick={() =>
                                      handleIncrement(index, variantIndex)
                                    }
                                    className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer"
                                    style={{ backgroundColor: "#097969" }}
                                  >
                                    <span className="m-auto text-2xl font-bold text-white">
                                      +
                                    </span>
                                  </button>) : (
                                    ""
                                  )
                                }

                                  {edit ? (
                                    <button
                                      className="ms-3 col-span-1 p-2 flex items-center justify-center rounded-lg cursor-pointer"
                                      style={{
                                        backgroundColor: "#FF0000",
                                        color: "#FFFFFF",
                                      }}
                                      onClick={() => handleRemove(index, variantIndex)}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>
                                    </button>
                                  ) : null}
                                </div>
                              </>
                            ))}

                            <div className="col-span-2" />
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                        <div className="h-[300px] px-10 py-4 rounded-lg flex flex-row items-center justify-center gap-6 bg-[#9DB2BF]">
                        <div className="text-xl">**insert icon here**</div>
                        <div className="flex flex-col">
                            <div className="text-3xl justify-center text-grey ">
                                Your <b>Expired Material List</b> is <b>Empty</b>
                            </div>
                            <div className="text-black text-xl mt-6">
                                <AddMaterialPurchase purchaseList={discardedList}  onAddMaterials={handleAddMaterials}/>
                            </div>
                        </div>
                        </div>
                    </>
                  )}
                </div>
                <div className="flex justify-end">
                  {discardedList.length !== 0 ? <AddMaterialPurchase purchaseList={discardedList}  onAddMaterials={handleAddMaterials}/> : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscardedList;



