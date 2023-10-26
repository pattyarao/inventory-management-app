"use client";

import Navbar from "../components/Navbar";
import withAuthentication from "../auth";
import ReportSelect from "../components/ReportSelect";


const ReportGeneration = ({ userType, userInfo }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-between gap-8 bg-[#F1F3F8]">
      <Navbar userType={userType} email={userInfo.email} />
      <ReportSelect />
      
    </div>
  );
};

export default withAuthentication(ReportGeneration, [
  "Owner",
  "Stock Controller",
  "Manufacturing Head",
  "Sales Person",
]);
