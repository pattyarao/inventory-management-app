"use client";

import { useState } from "react";

const AddEmployee = ({ handleClose, employees, setEmployees }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const handleAddEmployee = () => {
    const newEmployee = { name, role, status: "Active" };
    if ((name === "") | (role === "")) return;
    setEmployees([...employees, newEmployee]);
    handleClose();
  };

  return (
    <div className="absolute min-w-full min-h-screen flex flex-col items-center justify-center bg-black/50">
      <div className="w-[30%] p-4 flex justify-between items-center bg-[#526D82] rounded-t-md">
        <p>Add New Employee</p>
        <p onClick={handleClose}>Cancel</p>
      </div>
      <div className="w-[30%] px-4 py-8 bg-[#DDE6ED] flex flex-col items-center justify-center gap-6 rounded-b-md">
        <div>
          <p>Employee Name</p>
          <input
            type="text"
            required="true"
            className="p-1.5 bg-white border border-black rounded-lg"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>
        <div>
          <p>Role</p>
          <input
            type="text"
            required="true"
            className="p-1.5 bg-white border border-black rounded-lg"
            onChange={(e) => setRole(e.target.value)}
            value={role}
          />
        </div>
        <div>
          <button
            className="bg-[#526D82] py-2 px-4 text-white font-semibold rounded-md"
            onClick={handleAddEmployee}
          >
            Add Employee
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
