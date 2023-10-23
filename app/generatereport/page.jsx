"use client";

import Navbar from "../components/Navbar";
import withAuthentication from "../auth";

const ReportGeneration = ({ userType, userInfo }) => {
  return (
    <div>
      <Navbar userType={userType} email={userInfo.email} />
      <p>Report Generation Page</p>
    </div>
  );
};

export default withAuthentication(ReportGeneration, [
  "Owner",
  "Stock Controller",
  "Manufacturing Head",
  "Sales Person",
]);
