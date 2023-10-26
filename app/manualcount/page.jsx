"use client";

import { useState } from "react";
import ManualInventoryList from "../components/ManualInventoryList";



const RecordManualCount = () => {
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center gap-2" style={{ backgroundColor: '#F1F3F8', color: 'white' }}>
      <div className="w-[80%] px-10 py-4 bg-blue-400 rounded-lg" style={{ backgroundColor: '#8D93AB', color: 'white' }}>
        <h1 className="font-black text-xl" style={{ color: 'black'}}>Perform Manual Inventory Count</h1>
      </div>
      

        <ManualInventoryList/>
        
      </div>
   

    
  );
};

export default RecordManualCount;
