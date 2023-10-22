"use client";

import { useState } from "react";
import ManualCountList from "../components/ManualCountList";
import RecordManualCount from "../components/RecordManualCount";


const RecordPurchases = () => {
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center gap-2" style={{ backgroundColor: '#27374D', color: 'white' }}>
      <div className="w-[80%] px-10 py-4 bg-blue-400 rounded-lg" style={{ backgroundColor: '#526D82', color: 'white' }}>
        <h1 className="font-black text-xl">Record Manual Count</h1>
      </div>
      

        <ManualCountList/>
        
      </div>
   

    
  );
};

export default RecordManualCount;