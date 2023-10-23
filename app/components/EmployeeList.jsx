"use client";

import { useState, useEffect } from "react";
import AddEmployee from "./AddEmployee";
import { GET } from "../api/employees/route";
import { useRouter } from "next/navigation";

const EmployeeList = () => {
  const [isShowed, setShow] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function getEmployees() {
      try {
        const response = await fetch("/api/employees", {
          cache: "no-store",
        });
        const { employees, error } = await response.json();

        if (error) {
          setError(error);
        } else {
          setEmployees(employees);
        }
      } catch (error) {
        setError(error.message);
      }
    }
    getEmployees();
  }, []);

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
          <p className="w-[50%]">Name</p>
          <p className="w-[25%]">Role</p>
          <p className="w-[25%]">Status</p>
        </div>

        {error && <div>{error}</div>}
        {employees.length > 0 && (
          <div className="w-full flex flex-col gap-4">
            {employees.map((employee, index) => (
              <div
                key={index}
                className="w-full p-2 flex gap-10 text-lg bg-[#F1F3F8] rounded-md"
              >
                <p className="w-[50%]">
                  <span className="font-bold">{employee.last_name}</span>,{" "}
                  {employee.first_name}
                </p>
                <p className="w-[25%]">
                  {employee.user_type === 1
                    ? "Owner"
                    : employee.user_type === 2
                    ? "Stock Controller"
                    : employee.user_type === 3
                    ? "Manufacturing Head"
                    : employee.user_type === 4
                    ? "Sales Person"
                    : "Invalid"}
                </p>
                <p className="w-[25%]">
                  {employee.status === true
                    ? "Active"
                    : employee.status === false
                    ? "Not Active"
                    : "No status"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default EmployeeList;
