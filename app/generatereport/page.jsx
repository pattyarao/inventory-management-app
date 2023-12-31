"use client";

import Navbar from "../components/Navbar";
import withAuthentication from "../auth";
import ReportSelect from "../components/ReportSelect";
import Loader from "../components/Loader";


const ReportGeneration = ({ userType, userInfo }) => {
  if (!userType) {
    return (
      <Loader/>
    );
  }
  return (
    <div className="w-full h-screen flex flex-col items-center justify-start bg-[#F1F3F8]">
      <Navbar userType={userType} email={userInfo.email} />
      <div className="w-full h-screen flex justify-center items-center">
        <ReportSelect />
      </div>
    </div>
  );
};

export default withAuthentication(ReportGeneration, ["Owner"]);
