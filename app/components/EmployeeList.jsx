"use client";

import { useState } from "react";

const EmployeeList = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  const employees = [
    { name: "Patty Arao", role: "Stock Controller", status: "Active" },
    { name: "Carlo Reyes", role: "Manufacturing Head", status: "Active" },
    { name: "Miguel Perez", role: "Sales Person", status: "Not Active" },
    { name: "Jerrick Santos", role: "Stock Controller", status: "Not Active" },
  ];

  return (
    <div className="w-[50%] bg-[#9DB2BF] p-4">
      <div className="py-4 flex justify-between items-center border-b-2 border-black">
        <h3>Employee Roles</h3>
        <button>Add Employee</button>
      </div>
      <div className="w-full py-4 flex justify-between items-center">
        <p className="w-[33.33%]">Name</p>
        <p className="w-[33.33%]">Role</p>
        <p className="w-[33.33%]">Status</p>
      </div>
      <div className="flex flex-col gap-4">
        {employees.map((employee, index) => (
          <div
            key={index}
            className="w-full flex items-center bg-[#DDE6ED] p-4"
          >
            <p className="w-[33.33%]">{employee.name}</p>
            <p className="w-[33.33%]">{employee.role}</p>
            <button
              className={`w-[33.33%] p-2 text-center ${
                employee.status === "Active" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {employee.status}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeList;
