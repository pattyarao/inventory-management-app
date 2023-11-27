"use client";

import { useState } from "react";

const ClearDiscardList = (props) => {

  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        className="text-sm px-6 py-3 ms-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
        style={{ backgroundColor: "#A12323", color: "white" }}
        type="button"
        onClick={() => setShowModal(true)}
      >
        Clear Discard List
      </button>

      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div
              className="relative w-auto my-6 mx-auto max-w-5xl"
              style={{ minWidth: "40%" }}
            >
              {/*content*/}
              <div
                className="border-0 rounded-lg relative flex flex-col w-full outline-none focus:outline-none"
                style={{ backgroundColor: "#526D82" }}
              >
                {/*body*/}
                <div
                  className="relative p-6 flex-auto rounded-lg"
                  style={{ backgroundColor: "#526D82" }}
                >
                  <svg
                    class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  <div className="flex justify-center p-5 mb-5 text-2xl">
                    Are you sure you want to clear the Discard List?
                  </div>

                  <div className="flex justify-center">
                    <button
                      className="text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      style={{ backgroundColor: "#27374D" }}
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      No, Cancel
                    </button>
                    <button
                      className="text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      style={{ backgroundColor: "#A12323" }}
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        props.onConfirmClear();
                      }}
                    >
                      {"Yes, I'm Sure"}
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


export default ClearDiscardList;

