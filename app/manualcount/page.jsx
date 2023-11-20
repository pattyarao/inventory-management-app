"use client";
import { useState } from "react";
import ManualInventoryList from "../components/ManualInventoryList";
import Navbar from "../components/Navbar";







const RecordManualCount = () => {
  return (
    <>
    <Navbar userType={"Stock Controller"}/>
    <div className="w-full min-h-screen flex flex-col justify-center items-center gap-2" style={{ backgroundColor: '#27374D', color: 'white' }}>
      
      <div className="mt-1 w-[100%] px-10 py-4 bg-blue-400 rounded-lg" style={{ backgroundColor: '#526D82', color: 'white' }}>
        <h1 className="font-black text-xl">Manual Inventory Count</h1>
      </div>
        <ManualInventoryList/>
      </div>
    </>


    
  );
};

export default RecordManualCount;
