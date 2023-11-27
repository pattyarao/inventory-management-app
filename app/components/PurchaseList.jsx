"use client";

import { useState, useEffect } from "react";
import AddNewUnit from "./AddNewUnit";
import AddNewVariant from "./AddNewVariant";
import AddMaterialPurchase from "./AddMaterialPurchase";
import RecordPurchase from "./RecordPurchase";
import ClearPurchaseList from "./ClearPurchaseList";
import { GET as GETVAR } from "../api/purchasevariant/route";
import { GET as GETUNIT } from "../api/submetric/route";

const PurchaseList = (props) => {
  //stores all ordered products
  const [purchaseList, setPurchaseList] = useState([]);
  const [usedItemList, setUsedItemList] = useState([]); 
  const [variantsList, setVariantsList] = useState([]);
  const [unitsList, setUnitsList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [addVariantCondition, setAddVariantCondition] = useState(false);
  const [addUnitCondition, setAddUnitCondition] = useState(false);
  const [materialID, setMaterialID] = useState(null);
  const [unit, setUnit] = useState(null);
  const [removedMaterials, setRemovedMaterials] = useState([]);


  useEffect(() => {
    async function getVariants() {
      try {
        const response = await GETVAR();
        const { variants, error } = await response.json();

        if (error) {
          setError(error);
        } else {
          setVariantsList(variants);
          setLoading(false); // Data has been loaded
        }
      } catch (error) {
        setError(error.message);
        
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
    getVariants();
  }, [addVariantCondition, addUnitCondition]);

  console.log(unitsList)
  console.log(purchaseList)

// Function to update the selected products
const handleAddMaterials = (discardItem) => {

    

  // store each id into usedItemList
  let idList = []
  let updatedDiscardedList = [...purchaseList] // remove the asyncronous nature of setDiscardedList
  
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
            name: item.id, 
            amount: 0,
            finalAmount: 0,
            unit: item.REF_METRIC.id, 
            quantity: 1,  
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
              name: item.id, 
              amount: item.amt,
              finalAmount: item.amt,
              unit: item.MD_RAW_MATERIALS.metric_id, 
              quantity: 1, 
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
            name: item.id, 
            amount: item.amt, 
            finalAmount: item.amt,
            unit: item.MD_RAW_MATERIALS.metric_id, 
            quantity: 1,  
          }
        ]
      }

      updatedDiscardedList.push(updatedDiscardItem)
      console.log("case 3 insert successful: ", updatedDiscardItem, updatedDiscardedList);
    }
  })

  setPurchaseList(updatedDiscardedList)

};


  const [edit, setEdit] = useState(false);



  const addVariant = (productIndex) => {
    

    const newPurchaseList = [...purchaseList];
    const newVariant = { name: newPurchaseList[productIndex].id, amount: 0, finalAmount: 0, unit: newPurchaseList[productIndex].mainMetric, quantity: 1};
    newPurchaseList[productIndex].variants.push(newVariant);
    setPurchaseList(newPurchaseList);
  };
  
  const handleVariantNameChange = (unit, materialID, productIndex, variantIndex, event) => {
    const newPurchaseList = [...purchaseList];
    if (event.target.value === "Add New Variant") {
      setAddVariantCondition(true);
      setMaterialID(materialID)
      setUnit(unit)
      return;
    }
 
    if (event.target.value===""){
      newPurchaseList[productIndex].variants[variantIndex].name = event.target.value;
      newPurchaseList[productIndex].variants[variantIndex].unit = newPurchaseList[productIndex].mainMetric;
      newPurchaseList[productIndex].variants[variantIndex].amount = 0;
    } else {
      newPurchaseList[productIndex].variants[variantIndex].name = event.target.value;
      const selectedVariant = variantsList.find((variant) => variant.id === event.target.value);
      newPurchaseList[productIndex].variants[variantIndex].amount = selectedVariant.amt;
    }

    setPurchaseList(newPurchaseList);
  };

  const handleUnitChange = (productIndex, variantIndex, event) => {
    const newPurchaseList = [...purchaseList];

    if (event.target.value === "Add New Unit") {
      setAddUnitCondition(true);
      setMaterialID(materialID)
      setUnit(unit)
      return;
    }

    newPurchaseList[productIndex].variants[variantIndex].unit = event.target.value;
    const selectedUnit = unitsList.find((unit) => unit.id === newPurchaseList[productIndex].variants[variantIndex].unit);
    let ratio = selectedUnit.ratio
    newPurchaseList[productIndex].variants[variantIndex].finalAmount = ratio * newPurchaseList[productIndex].variants[variantIndex].amount;
    setPurchaseList(newPurchaseList);
  };

  const handleAmtChange = (productIndex, variantIndex, event) => {
    const newPurchaseList = [...purchaseList];

    if(newPurchaseList[productIndex].variants[variantIndex].unit === newPurchaseList[productIndex].mainMetric){
      newPurchaseList[productIndex].variants[variantIndex].amount = event.target.valueAsNumber;
      newPurchaseList[productIndex].variants[variantIndex].finalAmount = event.target.valueAsNumber;
      setPurchaseList(newPurchaseList);
    } else {
      const selectedUnit = unitsList.find((unit) => unit.id === newPurchaseList[productIndex].variants[variantIndex].unit);

      console.log(selectedUnit)
      let amt = event.target.valueAsNumber
      let ratio = selectedUnit.ratio
      newPurchaseList[productIndex].variants[variantIndex].amount = amt;
      newPurchaseList[productIndex].variants[variantIndex].finalAmount = ratio * amt;
      setPurchaseList(newPurchaseList);
    }
   
  };




  const handleQtyChange = (productIndex, variantIndex, event) => {
    const newPurchaseList = [...purchaseList];
    newPurchaseList[productIndex].variants[variantIndex].quantity =
      event.target.valueAsNumber;
    setPurchaseList(newPurchaseList);
  };



  const handleIncrement = (productIndex, variantIndex) => {
    const newPurchaseList = [...purchaseList];
    newPurchaseList[productIndex].variants[variantIndex].quantity++;
    setPurchaseList(newPurchaseList);
  };

  const handleDecrement = (productIndex, variantIndex) => {
    const newPurchaseList = [...purchaseList];
    if (newPurchaseList[productIndex].variants[variantIndex].quantity > 1) {
      newPurchaseList[productIndex].variants[variantIndex].quantity--;
      setPurchaseList(newPurchaseList);
    }
  };

  const handleRemove = (productIndex, variantIndex) => {
    const newPurchaseList = [...purchaseList];
    const removedMaterial = newPurchaseList[productIndex];
    newPurchaseList[productIndex].variants.splice(variantIndex, 1);

    // Check if there are no more variants in the product
    if (newPurchaseList[productIndex].variants.length === 0) {
      newPurchaseList.splice(productIndex, 1);

      setRemovedMaterials(removedMaterials.concat(removedMaterial));

    }
    setPurchaseList(newPurchaseList);
  };

  return (
    <div
      className="w-[100%] p-10 bg-blue-300 gap-6 rounded-lg"
      style={{ backgroundColor: "#526D82", color: "white" }}
    >
      <div className="px-3 w-full grid grid-cols-5 rounded-lg">
        <div className="col-span-3 md:col-span-4 text-xl font-bold">
          Purchase List
        </div>
        <div className="col-span-2 md:col-span-1 text-md flex items-center justify-center">
          {edit && purchaseList.length !== 0 ? (
            <button onClick={() => setEdit(false)}>
              {" "}
              <u> Done </u>{" "}
            </button>
          ) : !edit && purchaseList.length !== 0 ? (
            <button onClick={() => setEdit(true)}>
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
                  {purchaseList.length !== 0 ? (
                    <>
                      <div
                        className="px-3 w-full grid grid-cols-5 text-xs rounded-lg"
                        style={{ backgroundColor: "#526D82", color: "white" }}
                      >
                        <div className="col-span-1 text-sm flex items-center justify-center">
                          Material Name
                        </div>
                        <div className="col-span-1 me-5 text-sm flex items-center justify-center">
                          Variant
                        </div>
                        <div className="col-span-1 me-5 text-sm flex items-center justify-center">
                          Amount
                        </div>
                        <div className="col-span-1 text-sm ms-5">Unit</div>
                        <div className="col-span-1 text-sm flex items-center justify-center">
                          Qty. Purchased
                        </div>
                      </div>

                      {purchaseList.map((material, index) => (

                        <div key={index}>
                          <div
                            className="w-full p-3 mb-4 grid grid-cols-5 text-xs rounded-lg"
                            style={{
                              backgroundColor: "#9DB2BF",
                              color: "#27374D",
                            }}
                          >
                            <div className="col-span-1 flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
                              <button
                                onClick={() => addVariant(index)}
                                className="h-7 w-6 rounded-lg cursor-pointer flex items-center justify-center mt-2"
                                style={{ backgroundColor: "#097969" }}
                              >
                                <span className="text-xl font-bold text-white">
                                  +
                                </span>
                              </button>

                              <div className="font-black text-xl ms-3 mt-2">

                                {material.name}
                              </div>
                            </div>
                           {material.variants.map((variant, variantIndex) => (

                              <>
                                {variantIndex !== 0 ? (
                                  <div className="col-span-1 me-5 mt-3 " />
                                ) : null}
                                <div className="col-span-1 me-5">
                                  <div className="relative">
                                    <select
                                      value={variant.name}
                                      onChange={(event) =>
                                        handleVariantNameChange(
                                          material.mainMetric,
                                          material.id,
                                          index,
                                          variantIndex,
                                          event,
                                        )
                                      }
                                      id="large"
                                      class="mt-3 block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    >     
                                          <option value="">None</option>
                                          {variantsList.map((variantItem, variantItemIndex) => (
                                            <>
                                          {variantItem.material_id === material.id ? (
                                          <option value={variantItem.id}>{variantItem.name}</option>
                                          ): null}
                                          </>
                                            ))} 
                                      <option disabled>─────────────</option>
                                      <option>Add New Variant</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="col-span-1 flex flex-row h-10 w-full rounded-lg relative bg-transparent ">
                                  <input
                                    type="number"
                                    className="mt-3 outline-none focus:outline-none text-center h-full w-full me-4 bg-gray-300 font-semibold text-md hover:text-black focus:text-black md:text-base cursor-default flex items-center text-gray-700 outline-none rounded-lg "
                                    value={variant.amount}
                                    onChange={(event) =>
                                      handleAmtChange(
                                        index,
                                        variantIndex,
                                        event,
                                      )
                                    }
                                    disabled={(variant.name != material.id ? true : false) && variant.name !== ""}
                                  />
                                </div>

                                <div className="mt-3 col-span-1 flex flex-row h-10 w-full rounded-lg relative bg-transparent">
                                  <div className="relative">
                                    <select
                                        id="large"
                                        disabled={(variant.name != material.id ? true : false) && variant.name !== ""}
                                        value={variant.unit}
                                        onChange={(event) =>
                                            handleUnitChange(
                                                index,
                                                variantIndex,
                                                event
                                            )
                                        }
                                        className="block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    >
                                        {unitsList
                                            .filter((unit) => material.mainMetric === unit.metric_id)
                                            .map((unit) => (
                                                <option key={unit.id} value={unit.id}>
                                                    {unit.abbreviation}
                                                </option>
                                            ))}
                                        <option disabled>─────────────</option>
                                        <option>Add New Unit</option>
                                    </select>

                                  </div>
                                </div>

                                <div className="mt-3 col-span-1 flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
                                {material.id != variant.name ? 
                                  (
                                  <button
                                    onClick={() =>
                                      handleDecrement(index, variantIndex)
                                    }
                                    className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none"
                                    style={{ backgroundColor: "#A12323" }}
                                  >
                                    <span className="m-auto text-2xl font-bold text-white">
                                      −
                                    </span>
                                  </button>): (
                                    ""
                                  )
                                  }
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
                                    disabled={variant.name != material.id ? false : true}
                                  />
                                  {material.id != variant.name ? 
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
                                  </button>): (
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
                                      onClick={() =>
                                        handleRemove(index, variantIndex)
                                      }
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
                    <div
                      className="w-full p-20 mb-4 text-xs rounded-lg"
                      style={{ backgroundColor: "#9DB2BF", color: "#27374D" }}
                    >
                      <div className="font-black text-xl flex items-center justify-center">
                        Your Purchase List is Empty
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-end">
                  <AddMaterialPurchase purchaseList={purchaseList}  onAddMaterials={handleAddMaterials}/>

                  {purchaseList.length !== 0 ? (
                    <>
                      <ClearPurchaseList
                        onConfirmClear={() => setPurchaseList([])}
                      />
                      <RecordPurchase  userID={props.userID} purchaseList={purchaseList}  onConfirmClear={() => setPurchaseList([])} />
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {addVariantCondition ? (
        <AddNewVariant material_id={materialID} unit={unit} onClose={() => setAddVariantCondition(false)} />
      ) : null}

      {addUnitCondition ? (
        <AddNewUnit material_id={materialID} unit={unit} onClose={() => setAddUnitCondition(false)} />
      ) : null}
    </div>
  );
};

export default PurchaseList;