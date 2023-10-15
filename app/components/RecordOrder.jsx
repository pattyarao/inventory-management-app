"use client";

import { useState } from "react";

const RecordOrder = (props) => {


    const [shortageList, setShortageList] = useState([
        { name: "Material A", quantity: 5, unit: "g" },
        { name: "Material B", quantity: 10, unit: "g" },
        { name: "Material C", quantity: 2, unit: "ml" },
        { name: "Material D", quantity: 3, unit: "ml" }
      ]);
      

  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(false);
  

  return (
    <>
      <button
        className="text-sm px-6 py-3 ms-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
        style={{ backgroundColor: "#097969", color: "white" }}
        type="button"
        onClick={() => setShowModal(true)}
      >
        Record Order
      </button>

      {showModal && success ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div
              className="relative w-auto my-6 mx-auto max-w-5xl"
              style={{ minWidth: "40%" }}
            >
              {/*content*/}
              <div
                className="border-0 rounded-lg relative flex flex-col w-full outline-none focus:outline-none"
                style={{ backgroundColor: "#097969" }}
              >
                {/*body*/}
                <div
                  className="relative p-6 flex-auto rounded-lg"
                  style={{ backgroundColor: "#097969" }}
                >
                  <svg
                    class="mx-auto mb-4 text-green-500 w-12 h-12 dark:text-green-200"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>

                  <div
                    className="flex justify-center text-white font-bold uppercase text-sm px-6 py-3 mb-5"
                    style={{ fontSize: "30px", color: "white" }}
                  >
                    Order Recorded Successfully
                  </div>

                  <div className="flex justify-center">
                    <button
                      className="text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      style={{ backgroundColor: "#27374D" }}
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="opacity-75 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : showModal && !success ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div
              className="relative w-auto my-6 mx-auto max-w-5xl"
              style={{ minWidth: "40%" }}
            >
              {/*content*/}
              <div
                className="border-0 rounded-lg relative flex flex-col w-full outline-none focus:outline-none"
                style={{ backgroundColor: "#A12323" }}
              >
                {/*body*/}
                <div
                  className="relative p-6 flex-auto rounded-lg"
                  style={{ backgroundColor: "#A12323" }}
                >
                  <svg
                    class="mx-auto mb-4 text-red-500 w-12 h-12 dark:text-red-200"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>

                  <div
                    className="flex justify-center text-white font-bold uppercase text-sm px-6 py-3 mb-5"
                    style={{ fontSize: "30px", color: "white" }}
                  >
                    Insufficient Materials
                  </div>
              
                  {shortageList.map((product, index) => (
                      <div key={index}>
                        <div
                          className="w-full p-1 mb-1 text-xs rounded-lg"
                          style={{
                            backgroundColor: "#9DB2BF",
                            color: "#27374D",
                          }}
                        >
                          <div className="text-center col-span-3 md:col-span-4  font-black text-lg">
                          {product.quantity}{product.unit} of {product.name}
                          </div>

                          
                        </div>
                      </div>
                    ))}
                  

                  <div className="flex justify-center">
                    <button
                      className="text-white mt-4 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      style={{ backgroundColor: "#27374D" }}
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="opacity-75 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default RecordOrder;
