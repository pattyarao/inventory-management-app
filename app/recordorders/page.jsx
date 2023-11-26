"use client";

import withAuthentication from "../auth";
import SalesOrderList from "../components/SalesOrderList";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
const RecordOrder = ({userType, userInfo}) => {
  if (!userType) {
    return (
      <Loader/>
    );
  }
  return (
    <>
     <Navbar userType={userType} email={userInfo.email}/>
    
    <div className="w-full min-h-screen flex flex-col justify-center items-center gap-2" style={{ backgroundColor: '#27374D', color: 'white' }}>
      
      <div className="w-[80%] px-10 py-4 bg-blue-400 rounded-lg" style={{ backgroundColor: '#526D82', color: 'white' }}>
        <h1 className="font-black text-xl">Record Sales Orders</h1>
      </div>
      

        <SalesOrderList userID={userInfo.user_id}/>

        
      </div>
      </>

    
  );
};

export default withAuthentication(RecordOrder, ['Sales Person'])
