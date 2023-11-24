"use client";

import ProductOfferList from "../components/ProductOfferList";
import Navbar from "../components/Navbar";
//import AddProductSales from "../components/AddProductSales";

const ProductOfferings = () => {
  return (
    <>
    <Navbar userType={"Manufacturer"}/>
    <div className="w-full min-h-screen flex flex-col justify-center items-center gap-2" style={{ backgroundColor: '#27374D', color: 'white' }}>
      <div className="w-[80%] px-10 py-4 bg-blue-400 rounded-lg" style={{ backgroundColor: '#526D82', color: 'white' }}>
        <h1 className="font-black text-xl">Product Offerings</h1>
      </div>
      <div className="w-[80%] p-10 pt-7 bg-blue-300 gap-6 rounded-lg" style={{ backgroundColor: '#526D82', color: 'white' }}>
        {/*<h3 className="text-xl font-bold">&nbsp;Name</h3>
        <hr className="w-full border-2 mb-4" style={{ backgroundColor: '#DDE6ED', color: 'white' }}></hr>*/}

        <ProductOfferList/>

        
      </div>
    </div>
        </>
    
  );
};

export default ProductOfferings;
