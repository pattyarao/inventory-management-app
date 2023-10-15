"use client";

import { useState, useEffect } from "react";
//import AddProductSales from "./AddProductSales";
//import ClearOrderList from "./ClearOrderList";
//import RecordOrder from "./RecordOrder";

const ProductOfferList = () => {
  //stores all ordered products
  const [orderList, setOrderList] = useState([
    { name: "Apple", status: "active" },
    { name: "Baboy", status: "active" },
    { name: "Cat Food", status: "active" },
    { name: "Dog Food", status: "active" },
]);

const handleToggleStatus = (index) => {
    const updatedOrderList = [...orderList];
    updatedOrderList[index].status =
      updatedOrderList[index].status === "active" ? "inactive" : "active";
    setOrderList(updatedOrderList);
  };

  const handleClear = () => {
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
                        Name
                      </div>
                      <div className="col-span-2 md:col-span-1 text-sm flex items-center justify-center">
                        Status
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
                            {product.name}
                          </div>

                          <div className="col-span-2 md:col-span-1 flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
                            
                          <button
                              className={`${
                                product.status === "active"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              } text-white font-bold w-1/2 mx-auto`}
                              onClick={() => handleToggleStatus(index)}
                            >
                            {product.status}
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
                {/*<AddProductSales />*/}
                {orderList.length !== 0 ? (
                    <>
                    {/*<ClearOrderList onConfirmClear={() => handleClear()}/>*/}
                    {/*<RecordOrder/>*/}
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

export default ProductOfferList;
