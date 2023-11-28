"use client";

import withAuthentication from "../auth";
import PurchaseList from "../components/PurchaseList";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";

const RecordPurchases = ({ userType, userInfo }) => {
  if (!userType) {
    return <Loader />;
  }
  return (
    <div className="w-full">
      <Navbar userType={userType} email={userInfo.email} />
      <div
        className="w-full min-h-screen flex flex-col items-center gap-2 p-5 bg-white"
        
      >
        <div
          className="w-[100%] px-10 py-4 bg-[#D6E0F0] rounded-lg"
          
        >
          <h1 className="font-black text-xl">Record Purchases</h1>
        </div>
        <PurchaseList userID={userInfo.user_id} />
      </div>
    </div>
  );
};

export default withAuthentication(RecordPurchases, ["Stock Controller"]);
