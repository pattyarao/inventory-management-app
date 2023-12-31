"use client";

import withAuthentication from "../auth";
import ProductOfferList from "../components/ProductOfferList";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
//import AddProductSales from "../components/AddProductSales";

const ProductOfferings = ({userType, userInfo}) => {
  if (!userType) {
    return (
      <Loader/>
    );
  }
  return (
    <>
    <Navbar  userType={userType} email={userInfo.email}/>
    <div className="w-full min-h-screen flex flex-col items-center gap-2 p-5 bg-white">
      <div className="w-[100%] px-10 py-4 bg-[#D6E0F0] rounded-lg">
        <h1 className="font-black text-xl">Product Offerings</h1>
      </div>
      <div className="w-[100%] p-10 pt-7 bg-[#D6E0F0] gap-6 rounded-lg">
        {/*<h3 className="text-xl font-bold">&nbsp;Name</h3>
        <hr className="w-full border-2 mb-4" style={{ backgroundColor: '#DDE6ED', color: 'white' }}></hr>*/}

        <ProductOfferList/>

        
      </div>
    </div>
        </>
    
  );
};

export default withAuthentication(ProductOfferings, ['Manufacturing Head'])
