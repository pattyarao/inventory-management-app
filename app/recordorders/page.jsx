"use client";

import SalesOrderList from "../components/SalesOrderList";
import Navbar from "../components/Navbar";

const RecordOrder = () => {
 
  return (
    <>
     <Navbar userType={"Sales Person"}/>
    
    <div className="w-full min-h-screen flex flex-col justify-center items-center gap-2" style={{ backgroundColor: '#27374D', color: 'white' }}>
      
      <div className="w-[80%] px-10 py-4 bg-blue-400 rounded-lg" style={{ backgroundColor: '#526D82', color: 'white' }}>
        <h1 className="font-black text-xl">Record Sales Orders</h1>
      </div>
      

        <SalesOrderList/>

        
      </div>
      </>

    
  );
};

export default RecordOrder;
