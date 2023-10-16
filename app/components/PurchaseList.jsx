"use client";

import { useState, useEffect } from "react";
import AddNewVariant from "./AddNewVariant";
import AddMaterialPurchase from "./AddMaterialPurchase";
import RecordPurchase from "./RecordPurchase";
import ClearPurchaseList from "./ClearPurchaseList";

const PurchaseList = () => {
  //stores all ordered products
  const [purchaseList, setPurchaseList] = useState([
    {
      name: "Material A",
      metric: "0",
      variants: [{ variantName: "0", amount: 0, unit: "0", quantity: 1 }],
    },
    {
      name: "Material B",
      metric: "1",
      variants: [{ variantName: "0", amount: 0, unit: "0", quantity: 1 }],
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

  console.log(purchaseList);

  const [edit, setEdit] = useState(false);
  const [addVariantCondition, setAddVariantCondition] = useState(false);

  const addVariant = (productIndex) => {
    const newVariant = { variantName: 0, amount: 0, unit: 0, quantity: 1 };
    const newPurchaseList = [...purchaseList];
    newPurchaseList[productIndex].variants.push(newVariant);
    setPurchaseList(newPurchaseList);
  };

  //handles changes with the input if number is manually typed in
  const handleVariantNameChange = (productIndex, variantIndex, event) => {
    const newPurchaseList = [...purchaseList];
    if (event.target.value === "Add New Variant") {
      console.log("OPEN");
      setAddVariantCondition(true);
      return;
    }
    newPurchaseList[productIndex].variants[variantIndex].variantName =
      event.target.value;
    setPurchaseList(newPurchaseList);
  };

  const handleUnitChange = (productIndex, variantIndex, event) => {
    const newPurchaseList = [...purchaseList];
    newPurchaseList[productIndex].variants[variantIndex].unit =
      event.target.value;
    setPurchaseList(newPurchaseList);
  };

  const handleQtyChange = (productIndex, variantIndex, event) => {
    const newPurchaseList = [...purchaseList];
    newPurchaseList[productIndex].variants[variantIndex].quantity =
      event.target.valueAsNumber;
    setPurchaseList(newPurchaseList);
  };

  const handleAmtChange = (productIndex, variantIndex, event) => {
    const newPurchaseList = [...purchaseList];
    newPurchaseList[productIndex].variants[variantIndex].amount =
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
    newPurchaseList[productIndex].variants.splice(variantIndex, 1);

    // Check if there are no more variants in the product
    if (newPurchaseList[productIndex].variants.length === 0) {
      newPurchaseList.splice(productIndex, 1);
    }
    setPurchaseList(newPurchaseList);
  };

  return (
    <div
      className="w-[80%] p-10 bg-blue-300 gap-6 rounded-lg"
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

                      {purchaseList.map((product, index) => (
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
                                {product.name}
                              </div>
                            </div>
                            {product.variants.map((variant, variantIndex) => (
                              <>
                                {variantIndex !== 0 ? (
                                  <div className="col-span-1 me-5 mt-3 " />
                                ) : null}
                                <div className="col-span-1 me-5">
                                  <div className="relative">
                                    <select
                                      value={variant.variantName}
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
                                      <option value="0">None</option>
                                      <option value="1">Variant A</option>
                                      <option value="2">Variant B</option>
                                      <option value="3">Variant C</option>
                                      <option value="4">Variant D</option>
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
                                      class="block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    >
                                      <option value="0">g</option>
                                      <option value="1">mg</option>
                                      <option value="2">kg</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="mt-3 col-span-1 flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
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
                                    <span className="m-auto text-2xl font-bold text-white">
                                      +
                                    </span>
                                  </button>
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
                  <AddMaterialPurchase />
                  {purchaseList.length !== 0 ? (
                    <>
                      <ClearPurchaseList
                        onConfirmClear={() => setPurchaseList([])}
                      />
                      <RecordPurchase />
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {addVariantCondition ? (
        <AddNewVariant onClose={() => setAddVariantCondition(false)} />
      ) : null}
    </div>
  );
};

export default PurchaseList;
