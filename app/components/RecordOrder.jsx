"use client";

import { useState, useEffect } from "react";
import { PATCH, POST } from "../api/order/route";
import { GET as GETPROF } from "../api/productprofile/route";
import { GET as GETMAT } from "../api/purchase/route";

const RecordOrder = (props) => {

  const [userID, setUserID] = useState("b3a1e7a7-2932-435b-b07b-9a0d64cf4637");
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(true);
  const [ingredientsList, setIngredientsList] = useState([]);
  const [materialsList, setMaterialsList] = useState([]);
  const [shortageList, setShortageList] = useState([]);
  
  const [orders, setOrders] = useState([
    {order_id: "",
    product_id: "",
    qty_ordered: 0}
  ]);

  const [newQuantities, setNewQuantities] = useState([
    {material_id: "",
    newAmount: 0}
  ]);


  useEffect(() => {
    async function getIngredients() {
      try {
        const response = await GETPROF();
        const { ingredients, error } = await response.json();
          
        if (error) {
          setError(error);
          console.log(error)
        } else {
          setIngredientsList(ingredients);
          setLoading(false); // Data has been loaded
        }
      } catch (error) {
        setError(error.message);
        
      }
    }
    async function getMaterials() {
      try {
        const response = await GETMAT();
        const { materials, error } = await response.json();
  
        if (error) {
          setError(error);
          console.log("err0 " + error);
        } else {
          
          // Filter out materials that are already in props.purchaseList
          setMaterialsList(materials);
        }
      } catch (error) {
        setError(error.message);
      }
    }
    getIngredients();
    getMaterials();
  }, [showModal]);

  

  useEffect(() => {
    async function summarizeOrders() {
      const updatedOrders = [];
      
      props.orderList.forEach((product) => {
     
            
            const newOrder = {
              product_id: product.id,
              qty_ordered: product.quantity,
            };
            updatedOrders.push(newOrder);
 
      });
  
      // Update state with the summarized purchases
      setOrders(updatedOrders);
    }

    
    

    
    summarizeOrders();
  }, [props]);

  useEffect(() => {
    async function updateNewQuantities() {
      const materialAmountMap = {};
  
      for (const product of props.orderList) {
        // Find all matching ingredients for the current product
        const matchingIngredients = ingredientsList.filter(
          (ingredient) => ingredient.product_id === product.id
        );
  
        // Calculate the total qty_available for each matching ingredient
        matchingIngredients.forEach((matchingIngredient) => {
          const newAmount = product.quantity * matchingIngredient.qty_needed;
  
          const materialId = matchingIngredient.material_id;
  
          // Update existing entry or add a new one
          if (materialAmountMap[materialId]) {
            materialAmountMap[materialId].qty_available += newAmount;
          } else {
            const metricInfo = matchingIngredient.MD_RAW_MATERIALS?.REF_METRIC;
            const metric = metricInfo ? metricInfo.metric_unit : "";
  
            materialAmountMap[materialId] = {
              id: materialId,
              qty_available: newAmount,
              metric: metric,
            };
          }
        });
      }
  
      // Adjust qty_available based on qty_available in materialsList
      const updatedQuantities = Object.values(materialAmountMap).map(
        (entry) => {
          const material = materialsList.find(
            (mat) => mat.id === entry.id
          );
  
          if (material) {
            entry.qty_available = material.qty_available - entry.qty_available;
            entry.name = material.name; // Add the name of the material
          }
  
          return entry;
        }
      );
  
      setSuccess(!(updatedQuantities.some((entry) => entry.qty_available < 0)));
      setNewQuantities(updatedQuantities);
    }
  
    updateNewQuantities();
  }, [props.orderList, ingredientsList, materialsList]);
  console.log(newQuantities);
  



 

  const handleSubmit = async () => {
    // Check if there are negative qty_available values in newQuantities
    
  
    if (!success) {
      // If there are negative qty_available values, setSuccess to false
      setShowModal(true);
    } else {
      try {
        // Assuming you have the 'orders' data available
        const postResult = await POST(orders, userID);
        setShowModal(true);
  
        if (postResult.error) {
          setError(postResult.error);
          console.log(postResult.error);
        } else {
          // Proceed with the PATCH query only if POST was successful
          try {
            // Assuming you have the 'newQuantities' data available
            const patchResult = await PATCH(newQuantities);
            if (patchResult.error) {
              setError(patchResult.error);
              console.log(patchResult.error);
            } else {
              // If PATCH is successful, setSuccess to true
              setSuccess(true);
            }
          } catch (error) {
            setError(error.message);
          }
        }
      } catch (error) {
        setError(error.message);
      }
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
              
                  {newQuantities.map((entry, index) => {
                      if (entry.qty_available < 0) {
                        return (
                          <div key={index}>
                            <div
                              className="w-full p-1 mb-1 text-xs rounded-lg"
                              style={{
                                backgroundColor: "#9DB2BF",
                                color: "#27374D",
                              }}
                            >
                              <div className="text-center col-span-3 md:col-span-4 font-black text-lg">
                                {Math.abs(entry.qty_available)} {entry.metric} of {entry.name}
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null; // Return null for entries with non-negative qty_available
                    })}
                  

                  <div className="flex justify-center">
                    <button
                      className="text-white mt-4 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
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
      ) : null}
    </>
  );
};

export default RecordOrder;
