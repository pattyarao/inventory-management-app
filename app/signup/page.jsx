"use client";

import { useState } from "react";

const Signup = () => {
  const rolesList = [
    "Owner",
    "Stock Controller",
    "Manufacturing Head",
    "Sales Person",
  ];

  const [selectedRole, setRole] = useState("");

  const handleRoleSelect = (e) => {
    setRole(e.target.value);
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center gap-6">
      <div className="w-[30%] px-10 py-4 bg-blue-400 flex items-center justify-center rounded-lg">
        <h1 className="font-black text-xl ">Inventory Management System</h1>
      </div>
      <div className="w-[30%] p-10 bg-blue-300 flex flex-col items-center justify-center gap-6 rounded-lg">
        <h3 className="text-center text-2xl font-bold">Create an Account</h3>
        <hr className="w-full border-2 border-blue-800"></hr>
        <div className="w-full flex flex-col items-center gap-4">
          <div className="w-full flex flex-col text-xs">
            <p>Email</p>
            <input type="text" className="p-2 rounded-md" />
          </div>
          <div className="w-full flex flex-col text-xs">
            <p>Password</p>
            <input type="text" className="p-2 rounded-md" />
          </div>
          <div className="w-full flex flex-col text-xs">
            <p>Enter your role:</p>
            <div className="flex flex-col">
              {rolesList.map((role, index) => (
                <div key={index}>
                  <input
                    type="radio"
                    value={role}
                    checked={role === selectedRole}
                    onChange={handleRoleSelect}
                  />
                  <label>{role}</label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <button className="bg-blue-800 text-white py-2 px-4 rounded-md mt-4">
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
