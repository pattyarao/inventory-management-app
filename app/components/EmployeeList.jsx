"use client";

import { useState, useEffect } from "react";
import AddEmployee from "./AddEmployee";
import { GET } from "../api/employees/route";

const EmployeeList = () => {
  const [isShowed, setShow] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getEmployees() {
      try {
        const response = await GET();
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

  // const [employees, setEmployees] = useState([
  //   { name: "Patty Arao", role: "Stock Controller", status: "Active" },
  //   { name: "Carlo Reyes", role: "Manufacturing Head", status: "Active" },
  //   { name: "Miguel Perez", role: "Sales Person", status: "Not Active" },
  //   { name: "Jerrick Santos", role: "Stock Controller", status: "Not Active" },
  // ]);

  // const handleClick = (employee, index) => {
  //   const temp = [...employees];
  //   let newStatus;
  //   employee.status === true
  //     ? (newStatus = "Not Active")
  //     : (newStatus = "Active");
  //   temp[index].status = newStatus;
  //   setEmployees(temp);
  // };

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

        {error && <div>{error}</div>}
        {employees.length > 0 && (
          <div className="w-full">
            {employees.map((employee) => (
              <div key={employee.id} className="w-full flex gap-10">
                <p className="w-[50%]">
                  {employee.first_name} {employee.last_name}
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
