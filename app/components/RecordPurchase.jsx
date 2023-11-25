"use client";

import { useState, useEffect } from "react";
import { PATCH, POST } from "../api/purchase/route";

const RecordPurchase = (props) => {

  //replace userID with current user logic
  const [userID, setUserID] = useState("b3a1e7a7-2932-435b-b07b-9a0d64cf4637");

  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [purchases, setPurchases] = useState([
    {material_id: "",
    variation_id: "",
    qty_purchased: 0}
  ]);

  const [directPurchases, setDirectPurchases] = useState([
    {material_id: "",
    qty_purchased: 0,
    amt: 0}
  ]);

  const [newQuantities, setNewQuantities] = useState([
    {material_id: "",
    newAmount: 0}
  ]);

  useEffect(() => {
    async function summarizePurchase() {
      const updatedPurchases = [];
      const updatedDirectPurchases = [];
      
  
      props.purchaseList.forEach((material) => {
        material.variants.forEach((variant) => {
          if (variant.name === material.id) {
            // Add to directPurchases
            
            const newDirectPurchase = {
              material_id: material.id,
              qty_purchased: variant.quantity,
              amt: variant.finalAmount,
            };
            updatedDirectPurchases.push(newDirectPurchase);
          } else {
            // Add to purchases
            const newPurchase = {
              material_id: material.id,
              variation_id: variant.name,
              qty_purchased: variant.quantity,
            };
            updatedPurchases.push(newPurchase);
          }
        });
      });
  
      // Update state with the summarized purchases
      setPurchases(updatedPurchases);
      setDirectPurchases(updatedDirectPurchases);
    }

    async function newQuantity() {
      const newQuantity = [];
    
      props.purchaseList.forEach((material) => {
        // Create a copy of the material
        const updatedMaterial = { ...material };
    
        material.variants.forEach((variant) => {
          if (variant.name === material.id) {
            updatedMaterial.qty_available += variant.finalAmount * variant.quantity;
          } else {
            updatedMaterial.qty_available += variant.amount * variant.quantity;
          }


        });
    
        // Add the updated material to the newQuantity array
        newQuantity.push(updatedMaterial);
      });
    
      // Update state with the summarized quantities
      setNewQuantities(newQuantity);
    }
    
    summarizePurchase();
    newQuantity();
  }, [props]);

  console.log(newQuantities)
  


  const handleSubmit = async () => {
   

    try {
      // Assuming you have the 'variants' data available
      const postResult = await POST(purchases, directPurchases, userID);
      setShowModal(true)
      if (postResult.error) {
        setError(postResult.error);
        console.log(postResult.error);
      } else {
   
      }
    } catch (error) {
      setError(error.message);
    }

    try {
      // Assuming you have the 'variants' data available
      const patchResult = await PATCH(newQuantities);
      if (patchResult.error) {
        setError(patchResult.error);
        console.log(patchResult.error);
      } else {
   
      }
    } catch (error) {
      setError(error.message);
    }


   
  };


  

  return (
    <>
      <button
        className="text-sm px-6 py-3 ms-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
        style={{ backgroundColor: "#097969", color: "white" }}
        type="button"
        onClick={() => handleSubmit()}

      >
        Record Purchase
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
                    Purchase Recorded Successfully
                  </div>

                  <div className="flex justify-center">
                    <button
                      className="text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      style={{ backgroundColor: "#27374D" }}
                      type="button"
                      onClick={() => {setShowModal(false);
                        props.onConfirmClear();}}

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
      )  : null}
    </>
  );
};

export default RecordPurchase;