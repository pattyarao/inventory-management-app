"use client";

import Navbar from "../components/Navbar";
import withAuthentication from "../auth";
import AuditLog from "../components/AuditLog";
import Loader from "../components/Loader";


const AuditViewing = ({ userType, userInfo }) => {
  if (!userType) {
    return (
      <Loader/>
    );
  }
  return (
    <div className="w-full h-screen flex flex-col items-center justify-start bg-[#F1F3F8]">
      <Navbar userType={userType} email={userInfo.email} />
      <div className="w-full h-screen flex justify-center items-center">
        <AuditLog />
      </div>
    </div>
  );
};

export default withAuthentication(AuditViewing, ["Owner"]);
