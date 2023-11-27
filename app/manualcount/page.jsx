"use client";

import ManualInventoryList from "../components/ManualInventoryList";
import Navbar from "../components/Navbar";
import withAuthentication from "../auth";
import Loader from "../components/Loader";







const RecordManualCount = ({userType, userInfo}) => {
  if (!userType) {
    return (
      <Loader/>
    );
  }
  return (
    <>
    <Navbar userType={userType} email={userInfo.email} />
    <div className="w-full min-h-screen flex flex-col items-center gap-2 p-5" style={{ backgroundColor: '#27374D', color: 'white' }}>
      
      <div className="mt-1 w-[100%] px-10 py-4 bg-blue-400 rounded-lg" style={{ backgroundColor: '#526D82', color: 'white' }}>
        <h1 className="font-black text-xl">Manual Inventory Count</h1>
      </div>
        <ManualInventoryList userID={userInfo.user_id}/>
      </div>
    </>


    
  );
};

export default withAuthentication(RecordManualCount, ['Stock Controller'])
