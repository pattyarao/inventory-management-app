"use client";

import { useState, useEffect } from "react";
import AddEmployee from "./AddEmployee";

const EmployeeList = () => {
  const [isShowed, setShow] = useState(false);

  const [employees, setEmployees] = useState([
    { name: "Patty Arao", role: "Stock Controller", status: "Active" },
    { name: "Carlo Reyes", role: "Manufacturing Head", status: "Active" },
    { name: "Miguel Perez", role: "Sales Person", status: "Not Active" },
    { name: "Jerrick Santos", role: "Stock Controller", status: "Not Active" },
  ]);

  useEffect(() => {
    console.log(employees);
  }, [employees]);

  const handleClick = (employee, index) => {
    const temp = [...employees];
    let newStatus;
    employee.status === "Active"
      ? (newStatus = "Not Active")
      : (newStatus = "Active");
    temp[index].status = newStatus;
    setEmployees(temp);
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    <>
      {isShowed && (
        <AddEmployee
          handleClose={handleClose}
          employees={employees}
          setEmployees={setEmployees}
        />
      )}
      <div className="w-[90%] h-fit mb-8 bg-[#D6E0F0] p-4 flex flex-col gap-4 rounded-md">
        <div className="py-4 flex justify-between items-center border-b-2 border-black">
          <h3 className="font-bold text-4xl">Employee Roles</h3>
          <button
            onClick={() => setShow(true)}
            className="bg-[#8D93AB] py-2 px-6 rounded-md text-[#F1F3F8] font-bold"
          >
            Add Employee
          </button>
        </div>
        <div className="w-full py-4 px-2 flex justify-between items-center bg-[#8D93AB] rounded-md text-[#F1F3F8] font-bold">
          <p className="w-[45%]">Name</p>
          <p className="w-[45%]">Role</p>
          <p className="w-[10%]">Status</p>
        </div>
        <div className="flex flex-col gap-4">
          {employees.map((employee, index) => (
            <div
              key={index}
              className="w-full flex items-center p-4 border-b border-black"
            >
              <p className="w-[45%]">{employee.name}</p>
              <p className="w-[45%]">{employee.role}</p>
              <button
                className={`w-[10%] p-2 rounded-md text-center ${
                  employee.status === "Active" ? "bg-green-500" : "bg-red-500"
                }`}
                onClick={() => handleClick(employee, index)}
              >
                {employee.status}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default EmployeeList;
