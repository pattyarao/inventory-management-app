"use client";

import { useState } from "react";


const ViewProduct = ({ product, onClose }) => {
    console.log("Product in ViewProduct: ", product);
    //determines if the modal for adding a product is shown or not
    const [showModal, setShowModal] = useState(true);
    const [showOverlay, setShowOverlay] = useState(true);

    //closes the modal and removes all previous personalizations
    const handleClose= () => {
        setShowModal(false);
        onClose()
      };

    return (
        <>
      {showModal && (
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="relative w-auto my-6 mx-auto max-w-5xl" style={{ minWidth: '40%' }}>
            {/* Content */}
            <div className="border-0 rounded-lg relative flex flex-col w-full outline-none focus:outline-none" style={{ backgroundColor: '#526D82', zIndex: 51 }}> {/* Add zIndex here */}
              {/* Header */}
              <div className="flex items-center justify-center p-5 border-b border-solid border-blueGray-200 rounded-t" style={{ backgroundColor: '#27374D' }}>
                
                <div>
                    <div>
                    <h3 className="text-3xl font-semibold flex items-center justify-center">
                  {product.name}
                </h3>
                </div>
                
                <div className="flex space-x-4 mb-4 mt-3 items-center justify-center">
                    <h4 className="text-2xl mb-2">Needed Raw Materials</h4>
                </div>
                <div className="flex items-center justify-center mt-5">
                    <ul>
                    {product.materials.map((material, index) => (
                        <li key={index}>
                        {material.name} - {material.amount} {material.unit}
                        </li>
                    ))}
                    </ul>
                </div>
                
                <div className="flex items-center justify-center mt-5">
                   <button
                    className="text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    style={{ backgroundColor: "#A12323" }}
                    type="button"
                    onClick={handleClose}
                  >
                    Close
                  </button> 
                </div>
                </div>
                
                
              </div>
              {/* Body */}
            
              {/* Footer */}


                  


            </div>
          </div>
        </div>
      )}

        <div className="opacity-75 fixed inset-0 z-40 bg-black" onClick={handleClose}></div>

    </>
  );
};

export default ViewProduct;
