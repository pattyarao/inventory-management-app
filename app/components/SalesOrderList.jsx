"use client";

import { useState, useEffect } from "react";
import AddProductSales from "./AddProductSales";
import ClearOrderList from "./ClearOrderList";
import RecordOrder from "./RecordOrder";

const SalesOrderList = (props) => {
  //stores all ordered products
  const [orderList, setOrderList] = useState([]);

  const [edit, setEdit] = useState(false);

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

  const handleQtyChange = (index, event) => {
    const newOrderList = [...orderList];
    newOrderList[index].quantity =
      event.target.valueAsNumber;
    setOrderList(newOrderList);
  };

  const handleIncrement = (index) => {
    const newOrderList = [...orderList];
    newOrderList[index].quantity ++;
    setOrderList(newOrderList);
  };

  const handleDecrement = (index) => {
    const newOrderList = [...orderList];
    if (newOrderList[index].quantity > 1) {
      newOrderList[index].quantity--;
      setOrderList(newOrderList);
    }
  };
  
  const handleClear = () => {
    setQtyValues([]); // Clear qtyValues
    setOrderList([]); // Clear orderList
  };

  const handleRemove = (index) => {
    // Remove the element at the specified index from qtyValues
    const newQtyValues = qtyValues.slice(0, index).concat(qtyValues.slice(index + 1));
    setQtyValues(newQtyValues);
  
    // Remove the element at the specified index from orderList
    const newOrderList = orderList.slice(0, index).concat(orderList.slice(index + 1));
    setOrderList(newOrderList);
  };

  const handleAddProducts = (products) => {
    const productsWithQty = products.map((product) => ({
      ...product,
      quantity: 1
    }));
  
    setOrderList(orderList.concat(productsWithQty));
  };

  
  
  console.log(orderList)

  return (
    <div className="w-[100%] p-10 bg-blue-300 gap-6 rounded-lg" style={{ backgroundColor: '#526D82', color: 'white' }}>
        <div className="px-3 w-full grid grid-cols-5 rounded-lg"> 
        <div className="col-span-3 md:col-span-4 text-xl font-bold">Order List</div>
        <div className="col-span-2 md:col-span-1 text-md flex items-center justify-center"> 
        
        {edit && orderList.length !== 0 ? (
        <button onClick={() => setEdit(false)}> <u>  Done </u>  </button> ):
        !edit && orderList.length !== 0  ? (
        <button onClick={() => setEdit(true)}> <u>  Remove Items </u>  </button> ): null}
          
        
        
        </div>
        </div>
        <hr className="w-full border-2 mb-4" style={{ backgroundColor: '#DDE6ED', color: 'white' }}></hr>
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
                            {product.name}
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
                              value={orderList[index].quantity}
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
                            {edit ? (
                                <button
                                className="ms-3 col-span-1 p-2 flex items-center justify-center rounded-lg cursor-pointer"
                                style={{ backgroundColor: "#FF0000", color: "#FFFFFF" }}
                                onClick={() => handleRemove(index)}
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
                          
                          <div className="col-span-2"/> 
                          
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
                <AddProductSales orderList={orderList} onAddProducts={handleAddProducts} />
                {orderList.length !== 0 ? (
                    <>
                    <ClearOrderList onConfirmClear={() => handleClear()}/>
                    <RecordOrder userID={props.userID} orderList={orderList} onConfirmClear={() => setOrderList([])} />
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

export default SalesOrderList;
