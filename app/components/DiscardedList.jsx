"use client";

import { useState, useEffect } from "react";
import AddNewUnit from "./AddNewUnit";
import { GETMETRIC, GETREASON } from "../api/helper/route";
import { GET as GETUNIT } from "../api/submetric/route";
import RecordDiscard from "./RecordDiscard";
import AddMaterialDiscard from "./AddMaterialDiscard"
import { FaInbox } from "react-icons/fa";
import ClearDiscardList from "./ClearDiscardList"
import AddNewReason from "./AddNewReason";

const DiscardedList = (props) => {
  //stores all ordered products
  const [discardedList, setDiscardedList] = useState([]); // list for rendering
  const [usedItemList, setUsedItemList] = useState([]); // reference list for adding new items, stores the material/variant id
  const [reasonList, setReasonList] = useState([]);
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addUnitCondition, setAddUnitCondition] = useState(false);
  const [metricList, setMetricList] = useState([])
  const [unitsList, setUnitsList] = useState([]);
  const [addReasonCondition, setAddReasonCondition] = useState(false)

  useEffect(() => {
    async function fetchData() {
        const response = await GETMETRIC()
        const {metric, error} = await response.json()
        if (error) {
          setError(error)
        } 
        else {
          setLoading(false);
          setMetricList(metric)
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
  }, [addUnitCondition]);

  useEffect(() => {
    const getUnits = async () => {
      const response = await GETREASON()
      const {reason, error} = await response.json()

      if (error) {
        setError(error)
        console.log(error)
        return;
      }

      setReasonList(reason)
    }
    getUnits()
  }, [addReasonCondition])

  console.log(metricList)


  useEffect(() => {
    console.log('Reasons List: ', reasonList)
  }, [reasonList])

  useEffect(() => {
    console.log('Discard List: ', discardedList)
  }, [discardedList])

  useEffect(() => {
    console.log('Metric: ', metricList)
  }, [metricList])

  useEffect(() => {
    console.log('Used Item: ', usedItemList)
  }, [usedItemList])

  const handleAddMaterials = (discardItem) => {

    

    // store each id into usedItemList
    let idList = []
    let updatedDiscardedList = [...discardedList] // remove the asyncronous nature of setDiscardedList
    
    discardItem.map((item) => {

      // store each id into usedItemList
      idList.push({id: item.id})
      console.log(idList)
      setUsedItemList(usedItemList.concat(idList))

      // determine which case the item belongs to
      const isMaterial = !Boolean(item.material_id)
      const isInList = isMaterial ? updatedDiscardedList.some(discarded => discarded.id === item.id) : updatedDiscardedList.some(discarded => discarded.id === item.material_id)

      console.log('Test Case: ', isMaterial, isInList)

      // new condition checker
      if (isMaterial && isInList) {
        console.log("CASE 4: item is a material and a variant of the item has already been added to the discard list")

        updatedDiscardedList.map((discarded) => {
          if (discarded.id === item.id) {
            discarded.variants.push({ 
              name: item.name, 
              amount: null, 
              unit: item.REF_METRIC.id, 
              quantity: 1, 
              id: item.id, 
              reason_id: null,
              partialamount: 0,
              finalPartialAmount: 0,
            })

            console.log("case 4 insert successful", updatedDiscardedList);
          }
        })
      }
      else if (isMaterial && !isInList) {
        console.log("CASE 1: item is a new material in the list")
        const updatedDiscardItem = {
          name: item.name,
          id: item.id,
          qty_available: item.qty_available,
          mainMetric: item.REF_METRIC.id,
          variants: [
            { 
              name: item.name, 
              amount: 0,
              finalAmount: 0,
              unit: item.REF_METRIC.id, 
              quantity: 1, 
              id: item.id, 
              reason_id: null,
              partialamount: 0,
              finalPartialAmount: 0,
            }
          ]
        }

        updatedDiscardedList.push(updatedDiscardItem)
        console.log('case 1 insert succesfull: ', updatedDiscardItem, updatedDiscardedList)
      }
      else if (!isMaterial && isInList) {
        console.log("CASE 2: item is a variant with its material already in the list")

        updatedDiscardedList.map((discarded) => {
            if (discarded.id === item.material_id) {
              discarded.variants.push({ 
                name: item.name, 
                amount: item.amt,
                finalAmount: item.amt,
                unit: item.MD_RAW_MATERIALS.metric_id, 
                quantity: 0, 
                id: item.id, 
                reason_id: null,
                partialamount: 0,
                finalPartialAmount: 0,
                partialunit: item.MD_RAW_MATERIALS.metric_id, 
              })
            }
        })
        console.log("case 2 insert successful", updatedDiscardedList);
      }
      else if (!isMaterial && !isInList) {
        console.log("CASE 3: item is a variant with its material NOT in the list")

        const updatedDiscardItem = {
          name: item.MD_RAW_MATERIALS.name,
          id: item.MD_RAW_MATERIALS.id,
          qty_available: item.MD_RAW_MATERIALS.qty_available,
          mainMetric: item.MD_RAW_MATERIALS.metric_id,
          variants: [
            {
              name: item.name, 
              amount: item.amt, 
              finalAmount: item.amt,
              unit: item.MD_RAW_MATERIALS.metric_id, 
              quantity: 0, 
              id: item.id, 
              reason_id: null,
              partialamount: 0,
              finalPartialAmount: 0,
              partialunit: item.MD_RAW_MATERIALS.metric_id, 
            }
          ]
        }

        updatedDiscardedList.push(updatedDiscardItem)
        console.log("case 3 insert successful: ", updatedDiscardItem, updatedDiscardedList);
      }
    })

    setDiscardedList(updatedDiscardedList)

  };

  console.log(discardedList)

  const handleUnitChange = (productIndex, variantIndex, event) => {
    const newDiscardedList = [...discardedList];
    if (event.target.value === "Add New Unit") {
      setAddUnitCondition(true);
      return;
    } else { 
      
      newDiscardedList[productIndex].variants[variantIndex].unit = event.target.value;

      const selectedUnit = unitsList.find((unit) => unit.id === newDiscardedList[productIndex].variants[variantIndex].unit);
  
        let ratio = selectedUnit.ratio
        newDiscardedList[productIndex].variants[variantIndex].finalAmount = ratio * newDiscardedList[productIndex].variants[variantIndex].amount;
        setDiscardedList(newDiscardedList);
    }

    
   
    
  };

  const handlePartialUnitChange = (productIndex, variantIndex, event) => {
    if (event.target.value === "Add New Unit") {
      setAddUnitCondition(true);
      return;
    }
    const newDiscardedList = [...discardedList];
    newDiscardedList[productIndex].variants[variantIndex].partialunit = event.target.value;

    const selectedUnit = unitsList.find((unit) => unit.id === newDiscardedList[productIndex].variants[variantIndex].partialunit);

      let ratio = selectedUnit.ratio
      newDiscardedList[productIndex].variants[variantIndex].finalPartialAmount = ratio * newDiscardedList[productIndex].variants[variantIndex].partialamount;
      setDiscardedList(newDiscardedList);
  };
  
  const handleQtyChange = (productIndex, variantIndex, event) => {

    const newDiscardedList = [...discardedList];
    // newDiscardedList[productIndex].variants[variantIndex].quantity =
    //   event.target.valueAsNumber;

    // test
    newDiscardedList[productIndex].quantity = event.target.valueAsNumber;

    console.log('reached')
    //console.log("item", newDiscardedList[productIndex].quantity)
    setDiscardedList(newDiscardedList);
  };
  
  const handleAmtChange = (productIndex, variantIndex, event) => {
    const newDiscardedList = [...discardedList];
    console.log(newDiscardedList[productIndex].variants[variantIndex].unit)

    if(newDiscardedList[productIndex].variants[variantIndex].unit === newDiscardedList[productIndex].mainMetric){
      newDiscardedList[productIndex].variants[variantIndex].amount = event.target.valueAsNumber;
      newDiscardedList[productIndex].variants[variantIndex].finalAmount = event.target.valueAsNumber;
      setDiscardedList(newDiscardedList);
    } else {
      const selectedUnit = unitsList.find((unit) => unit.id === newDiscardedList[productIndex].variants[variantIndex].unit);

      console.log(selectedUnit)
      let amt = event.target.valueAsNumber
      let ratio = selectedUnit.ratio
      newDiscardedList[productIndex].variants[variantIndex].amount = amt;
      newDiscardedList[productIndex].variants[variantIndex].finalAmount = ratio * amt;
      setDiscardedList(newDiscardedList);
    }
   
  };

  const handlePartialAmountChange = (productIndex, variantIndex, event) => {
    const newDiscardedList = [...discardedList];

    if(newDiscardedList[productIndex].variants[variantIndex].partialunit === newDiscardedList[productIndex].mainMetric){
      newDiscardedList[productIndex].variants[variantIndex].partialamount = event.target.valueAsNumber;
      newDiscardedList[productIndex].variants[variantIndex].finalPartialAmount = event.target.valueAsNumber;
      setDiscardedList(newDiscardedList);
    } else {
      const selectedUnit = unitsList.find((unit) => unit.id === newDiscardedList[productIndex].variants[variantIndex].partialunit);

      console.log(selectedUnit)
      let amt = event.target.valueAsNumber
      let ratio = selectedUnit.ratio
      newDiscardedList[productIndex].variants[variantIndex].partialamount = amt;
      newDiscardedList[productIndex].variants[variantIndex].finalPartialAmount = ratio * amt;
      setDiscardedList(newDiscardedList);
    }
  };
  
  const handleIncrement = (productIndex, variantIndex) => {
    const newDiscardedList = [...discardedList];
    
    newDiscardedList[productIndex].variants[variantIndex].quantity++;
    setDiscardedList(newDiscardedList);
  };
  
  const handleDecrement = (productIndex, variantIndex) => {
    const newDiscardedList = [...discardedList];
    
    if (newDiscardedList[productIndex].variants[variantIndex].quantity > 0 && newDiscardedList[productIndex].variants[variantIndex].quantity) {
      newDiscardedList[productIndex].variants[variantIndex].quantity--;
      setDiscardedList(newDiscardedList);
    }
  };

  const handleRemove = (productIndex, variantIndex) => {
    const newDiscardedList = [...discardedList];
    const newUsedItemList = [...usedItemList];

    let idToRemove;
    // determine if variant or id
    if (newDiscardedList[productIndex].id === newDiscardedList[productIndex].variants[variantIndex].id) {
      idToRemove = newDiscardedList[productIndex].id
    }
    else {
      idToRemove = newDiscardedList[productIndex].variants[variantIndex].id
    }

    newDiscardedList[productIndex].variants.splice(variantIndex, 1);
  
    // Check if there are no more variants in the product
    if (newDiscardedList[productIndex].variants.length === 0) {
      newDiscardedList.splice(productIndex, 1);
    }
    setDiscardedList(newDiscardedList);

    // remove id from the usedItemList
    newUsedItemList.map((item, index) => {
      if (item.id === idToRemove) {
        newUsedItemList.splice(index, 1)
      }
    })

    setUsedItemList(newUsedItemList)

  };
  
  const handleReasonChange = (productIndex, variantIndex, event) => {
    
    const newDiscardedList = [...discardedList];
    if (event.target.value === "Add New Reason") {
      setAddReasonCondition(true)
    }
    else {
      newDiscardedList[productIndex].variants[variantIndex].reason_id = event.target.value;
      setDiscardedList(newDiscardedList);
    }

    
    
  }

  return (
    <div
      className="w-[100%] p-10 bg-blue-300 gap-6 rounded-lg"
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

                        className="px-3 w-full grid grid-cols-9 text-xs rounded-lg"

                        style={{ backgroundColor: "#526D82", color: "white" }}
                      >
                        <div className="col-span-1 text-sm flex items-center justify-center">
                          Material Name
                        </div>
                        <div className="col-span-2 me-5 text-sm flex items-center justify-center">
                          Variant Name
                        </div>
                        <div className="col-span-1 me-5 text-sm flex items-center justify-center">
                          Amount
                        </div>
                        <div className="col-span-1 text-sm ms-5">
                          Unit
                        </div>
                        <div className="col-span-1 text-sm flex items-center justify-center">
                          Qty. Discarded
                        </div>
                        <div className="col-span-1 text-sm ms-5">
                          Partial Amount
                        </div>
                        <div className="col-span-1 text-sm ms-5">
                          Unit
                        </div>
                        <div className="col-span-1 text-sm ms-5">
                          Reason for Discard
                        </div>

                      </div>

                      {discardedList.map((product, index) => (
                        <div key={index}>
                          <div

                            className="w-full p-3 mb-4 grid grid-cols-9 text-xs rounded-lg"

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

                            
                            {product.variants.map((variant, variantIndex) => (
                              <>
                                {variantIndex !== 0 ? (
                                    <div className="col-span-1 me-5 mt-3 " />
                                  ) : null
                                }

                                <div className="col-span-2 me-5 mt-3">
                                  <div className="relative">
                                    
                                    {/** render input and name if it is a variant */}
                                    {!(variant.name === product.name) ? (
                                      
                                      <input
                                        key={variantIndex}
                                        value={variant.name}
                                        id="large"
                                        className="block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                        disabled
                                      />
                                      
                                      ) : <input
                                      key={variantIndex}
                                      value={"None"}
                                      id="large"
                                      className="block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                      disabled
                                    />
                                    }
                                  </div>
                                </div>

                                {/** change to disable amount if the item is a variant since it is already predetermined */}
                                <div className="col-span-1 flex flex-row h-10 w-full rounded-lg relative bg-transparent ">
                                  <input
                                    type="number"
                                    className="mt-3 outline-none focus:outline-none text-center h-full w-full me-4 bg-gray-300 font-semibold text-md hover:text-black focus:text-black md:text-base cursor-default flex items-center text-gray-700 outline-none rounded-lg "
                                    value={variant.amount}
                                    onChange={(event) =>
                                      handleAmtChange(index, variantIndex, event)
                                    }
                                    disabled={variant.id != product.id ? true : false}
                                  />
                                </div>

                                <div className="mt-3 me-5 col-span-1 flex flex-row h-10 w-full rounded-lg relative bg-transparent">
                                  <div className="relative">
                                    <select
                                      id="large"
                                      value={variant.unit}
                                      onChange={(event) =>
                                        handleUnitChange(index, variantIndex, event)
                                      }
                                      disabled={variant.id != product.id ? true : false}
                                      class="block w-[80%] px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    >
                                       {unitsList
                                              .filter((unit) => product.mainMetric === unit.metric_id)
                                              .map((unit) => (
                                                  <option key={unit.id} value={unit.id}>
                                                      {unit.abbreviation}
                                                  </option>
                                              ))}
                                        <option disabled>────────</option>
                                        <option>Add New Unit</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="mt-3 col-span-1 flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
                                  
                                  {product.id != variant.id ? 
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
                                    disabled={product.id != variant.id ? false : true}
                                  />
                                  
                                {product.id != variant.id ? 
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

                                  
                                </div>
                                {/** PARTIAL AMOUNT */}
                                {product.id != variant.id ? (
                                  <div className="mt-4 col-span-2 grid grid-cols-2 gap-4">
                                  <div className="flex flex-row h-10 w-full rounded-lg relative bg-transparent">
                                    <input
                                      type="number"
                                      className="ms-5 outline-none focus:outline-none text-center h-full w-full me-4 bg-gray-300 font-semibold text-md hover:text-black focus:text-black md:text-base cursor-default flex items-center text-gray-700 outline-none rounded-lg "
                                      onChange={(event) =>
                                        handlePartialAmountChange(index, variantIndex, event)
                                      }
                                    />
                                  </div>
                                  <div className="flex flex-row h-8 w-full rounded-lg relative bg-transparent">
                                    <div className="relative">
                                      <select
                                        id="large"
                                        value={variant.partialunit}
                                        onChange={(event) =>
                                          handlePartialUnitChange(index, variantIndex, event)
                                        }
                                        class="block w-[80%] px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                      >
                                          {unitsList
                                              .filter((unit) => product.mainMetric === unit.metric_id)
                                              .map((unit) => (
                                                  <option key={unit.id} value={unit.id}>
                                                      {unit.abbreviation}
                                                  </option>
                                              ))}
                                            <option disabled>────────</option>
                                            <option>Add New Unit</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                                ) : (
                                  <div className="mt-3 col-span-2 flex flex-row h-10 w-full rounded-lg relative bg-transparent">
                                    <div className="mt-3 col-span-1 flex flex-row h-10 w-full rounded-lg relative bg-transparent"/>
                                    <div className="mt-3 col-span-1 flex flex-row h-10 w-full rounded-lg relative bg-transparent"/>
                                  </div>
                                )}

                                <div className="col-span-1 flex flex-row h-10 w-full rounded-lg relative bg-transparent ">
                                    <select
                                      id="large"
                                      onChange={(event) =>
                                        handleReasonChange(index, variantIndex, event)
                                      }
                                      class="mt-3 outline-none focus:outline-none text-center h-full w-full me-4 bg-gray-300 font-semibold text-md hover:text-black focus:text-black md:text-base cursor-default flex items-center text-gray-700 outline-none rounded-lg"
                                    >
                                      <option>Select</option>
                                      {reasonList.map((reason, index) => (
                                        <option key={index} value={reason.id}>{reason.reason}</option>
                                      ))}
                                      <option disabled>─────────────</option>
                                      <option>Add New Reason</option> {/** TODO: add new reason modal */}
                                    </select>
                                    {edit ? (
                                    <button
                                      className="mt-3 h-10 p-2 rounded-lg cursor-pointer"
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
                                
                                {/** disabled rendering of +/- for discardItem as the only value needed is the amt provided by the textbox */}

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
                        <FaInbox style={{ fontSize: '20em'}} />
                        <div className="flex flex-col">
                            <div className="text-3xl justify-center text-grey ">
                                Your Discard List is Empty
                            </div>
                            <div className="text-black text-xl mt-6">
                                <AddMaterialDiscard purchaseList={usedItemList}  onAddMaterials={handleAddMaterials}/>
                            </div>
                        </div>
                        </div>
                    </>
                  )}
                </div>
                <div className="flex justify-end px-10 py-4">
                  {discardedList.length !== 0 ? (
                    <>
                      <AddMaterialDiscard purchaseList={usedItemList}  onAddMaterials={handleAddMaterials}/>
                      <ClearDiscardList onConfirmClear={() => {setDiscardedList([]); setUsedItemList([])}} />
                      <RecordDiscard userID={props.userID} discardedList={discardedList} metricList={metricList} onConfirmClear={() =>{ setDiscardedList([]); setUsedItemList([]) }} />
                    
                    </>
                      ) 
                      : null}
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        {/** where modals for adding new things will be placed */}
        { addReasonCondition ? (
          <AddNewReason onClose={() => {setAddReasonCondition(false)}} />
        ) : null }

      {addUnitCondition ? (
        <AddNewUnit onClose={() => setAddUnitCondition(false)} />
      ) : null}
    </div>

    
  );
};

export default DiscardedList;



