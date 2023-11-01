"use client";

import { useState, useEffect } from "react";
import AddProductOffer from "./AddProductOffer";
import ViewProduct from "./ViewProduct";
import { GET } from "../api/productlist/route";
//import RecordOrder from "./RecordOrder";

const ProductOfferList = () => {
  //stores all ordered products

const [productList, setProductList] = useState([]);
const [selectedProduct, setSelectedProduct] = useState(null);
const [showProductDetailsModal, setShowProductDetailsModal] = useState(false);

useEffect(() => {
  // Fetch products from your Supabase API
  async function fetchProducts() {
    try {
      const response = await GET(); // Make an API request to get products
      const data = await response.json();

      if (response.status === 200) {
        // If the request is successful, update the productList state
        const productsWithStatus = data.products.map((product) => ({
          ...product,
          status: "Active", // Set the initial status as "Active"
        }));

        console.log("Products with materials:", productsWithStatus);
        setProductList(productsWithStatus);
      } else {
        // Handle any error here
        console.error("Error fetching products:", data.error);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  fetchProducts();
}, []);

const handleProductClick = (product) => {
  setSelectedProduct(product);
  setShowProductDetailsModal(true);
};

const handleCloseProductDetailsModal = () => {
  setSelectedProduct(null);
  setShowProductDetailsModal(false);
};

const toggleProductStatus = (productToToggle) => {
  const updatedProductList = productList.map((product) => {
    if (product.name === productToToggle.name) {
      // Toggle the status for the selected product
      return {
        ...product,
        status: product.status === "Active" ? "Inactive" : "Active",
      };
    }
    return product;
  });

  setProductList(updatedProductList);
};

{/*const handleToggleStatus = (index) => {
    const updatedProductList = [...productList];
    updatedProductList[index].status =
    updatedProductList[index].status === "Active" ? "Inactive" : "Active";
    setProductList(updatedProductList);
  };*/}

  const addProductToList = (newProduct) => {
    const productWithStatus = { ...newProduct, status: "Active" };
  setProductList([...productList, productWithStatus]);
  };

  const handleClear = () => {
    setProductList([]); // Clear orderList
  };
  

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="w-full flex flex-col text-xs">
        <div className="flex flex-col">
          <div className="w-full flex flex-col items-center gap-4">
            <div className="w-full flex flex-col text-xs">
              <div className="flex flex-col">
                {productList.length !== 0 ? (
                  <>
                    <div
                      className="px-3 w-full grid grid-cols-5 text-xs rounded-lg mb-3"
                      style={{ backgroundColor: "#526D82", color: "white" }}
                    >
                      <div className="col-span-3 md:col-span-4  text-xl font-semibold ms-5 ">
                        Name
                      </div>
                      <div className="col-span-2 md:col-span-1 text-xl font-semibold flex items-center justify-center">
                        Status
                      </div>
                    </div>

                    {productList.map((product, index) => (
                      <div key={index}>
                        <div
                          className="w-full p-3 mb-4 grid grid-cols-5 text-xs rounded-lg"
                          style={{
                            backgroundColor: "#9DB2BF",
                            color: "#27374D",
                          }}
                        >
                          <div className="col-span-3 md:col-span-4  font-black text-xl ms-5 mt-2" key={index} onClick={() => handleProductClick(product)} style={{ cursor: "pointer" }}>
                            {product.name}
                          </div>

                          <div className="col-span-2 md:col-span-1 flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
                            
                          <button
                              className={`${
                                product.status === "Active"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              } text-white text-lg font-bold w-1/2 mx-auto rounded-lg`}
                              disabled
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
                      Your Product List is Empty
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end pt-4">
                <AddProductOffer addProductToList={addProductToList}/>
                {showProductDetailsModal && selectedProduct && (
                  <ViewProduct
                    product={selectedProduct}
                    onClose={handleCloseProductDetailsModal}
                    toggleProductStatus={toggleProductStatus}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOfferList;
