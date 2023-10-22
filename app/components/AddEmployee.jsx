"use client";

import { useState } from "react";

const AddEmployee = ({ handleClose, employees, setEmployees }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const handleSelect = (event) => {
    setRole(event.target.value);
  };

  const handleAddEmployee = () => {
    const newEmployee = { name, role, status: "Active" };
    if ((name === "") | (role === "")) return;
    setEmployees([...employees, newEmployee]);
    handleClose();
  };

  return (
    <div className="absolute min-w-full min-h-screen flex flex-col items-center justify-center bg-black/70">
      <div className="w-[30%] p-4 flex justify-between items-center bg-[#526D82] rounded-t-md">
        <p>Add New Employee</p>
        <p onClick={handleClose} className="cursor-pointer">
          Cancel
        </p>
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
          <div className="">
            <select
              className="pl-2 pr-16 py-2 bg-white border border-black rounded-lg text-sm focus:outline-none"
              id="role"
              onChange={handleSelect}
              value={role || ""}
            >
              <option value="stockController">Stock Controller</option>
              <option value="manufacturingHead">Manufacturing Head</option>
              <option value="salesPerson">Sales Person</option>
            </select>
          </div>
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
