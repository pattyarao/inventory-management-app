"use client";

import withAuthentication from "../auth";
import SalesOrderList from "../components/SalesOrderList";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";

const RecordOrder = ({ userType, userInfo }) => {
  if (!userType) {
    return <Loader />;
  }
  return (
    <>
      <Navbar userType={userType} email={userInfo.email} />

      <div
        className="w-full min-h-screen flex flex-col items-center gap-2 p-5"
        style={{ backgroundColor: "#27374D", color: "white" }}
      >
        <div
          className="w-[100%] px-10 py-4 bg-blue-400 rounded-lg"
          style={{ backgroundColor: "#526D82", color: "white" }}
        >
          <h1 className="font-black text-xl">Record Sales Orders</h1>
        </div>

        <SalesOrderList userID={userInfo.user_id} />
      </div>
    </>
  );
};

export default withAuthentication(RecordOrder, ["Sales Person"]);
