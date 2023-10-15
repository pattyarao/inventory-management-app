"use client";

import { useState, useEffect } from "react";
import AddProductOffer from "./AddProductOffer";
import ViewProduct from "./ViewProduct";
//import RecordOrder from "./RecordOrder";

const ProductOfferList = () => {
  //stores all ordered products
  const [productList, setProductList] = useState([
    {
      name: "Product 1",
      status: "active",
      materials: [
        { name: "Material A", amount: 100, unit: "g" },
        { name: "Material B", amount: 200, unit: "g" },
      ],
    },
    {
      name: "Product 2",
      status: "active",
      materials: [{ name: "Material C", amount: 500, unit: "ml" }],
    },
    {
      name: "Product 3",
      status: "active",
      materials: [
        { name: "Material D", amount: 50, unit: "g" },
        { name: "Material E", amount: 1, unit: "L" },
      ],
    },
    {
      name: "Product 4",
      status: "active",
      materials: [{ name: "Material F", amount: 250, unit: "mg" }],
    },
]);

const [selectedProduct, setSelectedProduct] = useState(null);
const [showProductDetailsModal, setShowProductDetailsModal] = useState(false);

const handleProductClick = (product) => {
  setSelectedProduct(product);
  setShowProductDetailsModal(true);
};

const handleCloseProductDetailsModal = () => {
  setSelectedProduct(null);
  setShowProductDetailsModal(false);
};

const handleToggleStatus = (index) => {
    const updatedProductList = [...productList];
    updatedProductList[index].status =
    updatedProductList[index].status === "active" ? "inactive" : "active";
    setProductList(updatedProductList);
  };

  const addProductToList = (newProduct) => {
    const productWithStatus = { ...newProduct, status: "active" };
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
                      Your Product List is Empty
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                <AddProductOffer addProductToList={addProductToList}/>
                {showProductDetailsModal && selectedProduct && (
                  <ViewProduct
                    product={selectedProduct}
                    onClose={handleCloseProductDetailsModal}
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
