"use client";

import { useState, useEffect } from "react";
import AddProductSales from "./AddProductSales";
import ClearOrderList from "./ClearOrderList";
import RecordOrder from "./RecordOrder";

const SalesOrderList = () => {
  //stores all ordered products
  const [orderList, setOrderList] = useState([
    "Apple",
    "Baboy",
    "Cat Food",
    "Dog Food"
]);

  //assigns 1 as the default number of orders for each instance of a product in the orderLis
  const [qtyValues, setQtyValues] = useState([]);
  useEffect(() => {
    setQtyValues((prevQtyValues) => {
      const newQtyValues = [...prevQtyValues];
      // Check if elements are added to orderList
      while (newQtyValues.length < orderList.length) {
        newQtyValues.push(1); // Initialize new elements with 1
      }
      return newQtyValues;
    });
  }, [orderList]);

  //handles changes with the input if number is manually typed in
  const handleQtyChange = (index, event) => {
    const newQtyValues = [...qtyValues];
    newQtyValues[index] = parseInt(event.target.value, 10);
    setQtyValues(newQtyValues);
  };

  //increments the value in the number input field
  const handleIncrement = (index) => {
    const newQtyValues = [...qtyValues];
    newQtyValues[index]++;
    setQtyValues(newQtyValues);
  };

  //decrements the value in the number input field
  const handleDecrement = (index) => {
    const newQtyValues = [...qtyValues];
    if (newQtyValues[index] > 0) {
      newQtyValues[index]--;
      setQtyValues(newQtyValues);
    }
  };

  const handleClear = () => {
    setQtyValues([]); // Clear qtyValues
    setOrderList([]); // Clear orderList
  };
  

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="w-full flex flex-col text-xs">
        <div className="flex flex-col">
          <div className="w-full flex flex-col items-center gap-4">
            <div className="w-full flex flex-col text-xs">
              <div className="flex flex-col">
                {orderList.length !== 0 ? (
                  <>
                    <div
                      className="px-3 w-full grid grid-cols-5 text-xs rounded-lg"
                      style={{ backgroundColor: "#526D82", color: "white" }}
                    >
                      <div className="col-span-3 md:col-span-4  text-sm ms-5">
                        Product Name
                      </div>
                      <div className="col-span-2 md:col-span-1 text-sm flex items-center justify-center">
                        Qty. Ordered
                      </div>
                    </div>

                    {orderList.map((product, index) => (
                      <div key={index}>
                        <div
                          className="w-full p-3 mb-4 grid grid-cols-5 text-xs rounded-lg"
                          style={{
                            backgroundColor: "#9DB2BF",
                            color: "#27374D",
                          }}
                        >
                          <div className="col-span-3 md:col-span-4  font-black text-xl ms-5 mt-2">
                            {product}
                          </div>

                          <div className="col-span-2 md:col-span-1 flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
                            <button
                              onClick={() => handleDecrement(index)}
                              className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none"
                              style={{ backgroundColor: "#A12323"}}
                            >
                              <span className="m-auto text-2xl font-bold text-white">−</span>

                            </button>
                            <input
                              type="number"
                              className="outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black md:text-base cursor-default flex items-center text-gray-700 outline-none"
                              value={qtyValues[index]}
                              onChange={(event) =>
                                handleQtyChange(index, event)
                              }
                            />
                            <button
                              onClick={() => handleIncrement(index)}
                              className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer"
                              style={{ backgroundColor: "#097969"}}
                            >
                              <span className="m-auto text-2xl font-bold text-white">+</span>

                            </button>
                          </div>
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
                      Your Order List is Empty
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                <AddProductSales />
                {orderList.length !== 0 ? (
                    <>
                    <ClearOrderList onConfirmClear={() => handleClear()}/>
                    <RecordOrder/>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesOrderList;
