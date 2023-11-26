"use client";

import AddEmployee from "../components/AddEmployee";
import EmployeeList from "../components/EmployeeList"
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import withAuthentication from "../auth";

const AssignRoles = ({ userType, userInfo }) => {
  if (!userType) {
    return (
      <Loader/>
    );
  }
  return (
    <main className="w-full h-full flex flex-col items-center justify-between gap-8 bg-[#F1F3F8]">
      <Navbar userType={userType} email={userInfo.email} />
      <EmployeeList />

      {/* <AddEmployee /> */}
    </main>
  );
};

export default withAuthentication(AssignRoles, ["Owner"]);
