"use client";

import { useState, useEffect } from "react";
import { POST } from "../api/discard/newreason/route";

const AddNewReason = (props) => {

    const [reason, setReason] = useState([])

    // stores all products in the database
    
    // store input
    const handleReasonChange = (event) => {
        setReason(event.target.value)
    }

    useEffect(() => {
        console.log(reason)
    },[ reason ])

    // closes the modal, post new reason in the DB, and sets the dropdown and input to the new record 
    const handleClose = async () => {
        props.onClose()
    };

    const handleSubmit = async () => {
        const postResponse = await POST(reason);
        const { newReason, error } = await postResponse.json()

        if (error) {
            console.log(error)
            return;
        }

        console.log(newReason)
        props.onClose()
    }
  
    return (
          <>
            <div
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
              <div className="relative w-auto my-6 mx-auto max-w-5xl" style={{ minWidth: '40%' }} >
                {/*content*/}
                <div className="border-0 rounded-lg relative flex flex-col w-full outline-none focus:outline-none" style={{ backgroundColor: '#526D82'}}>
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t" style={{ backgroundColor: '#8D93AB'}}>
                    <h3 className="text-3xl font-semibold">
                      State a new reason
                    </h3>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto rounded-b-lg" style={{ backgroundColor: '#D6E0F0'}}>
                    
                 
           
                  <div className="grid grid-cols-2">
                <div className="text-sm flex items-center">
                    Reason
                </div>
                
                </div>



                    <div className="flex grid-cols-2">
                    
                    <div className="col-span-1 flex flex-row h-10 w-full rounded-lg relative bg-gray">
                        <input
                        type="text"
                        className="mt-1 p-2 outline-none focus:outline-none text-center h-full w-full me-4 bg-white-300 font-semibold text-md hover:text-black focus:text-black md:text-base cursor-default flex items-center text-gray-700 outline-none rounded-lg"
                        onChange={(event) =>
                            handleReasonChange(event)
                          }
                        />
                    </div>

                    </div>

                             

         
                    <div className="mt-5">
                  <div className="flex justify-end"> 
                    <button
                      className="text-black font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      style={{ backgroundColor: "#A12323"}}
                      type="button"
                      onClick={handleClose}
                    >
                      Close
                    </button>
                    <button
                      className="text-black font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      style={{ backgroundColor: "#097969"}}
                      type="button"
                      onClick={handleSubmit}
                    >
                      Add Reason
                    </button>
                  </div>
                </div>
                  </div>
                  
                </div>
              </div>
            </div>
            <div className="opacity-75 fixed inset-0 z-40 bg-black"></div>
          </>
  );
};

export default AddNewReason;