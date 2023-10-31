"use client";

import { useState, useEffect } from "react";
import AddEmployee from "./AddEmployee";
import { GET } from "../api/employees/route";
import { useRouter } from "next/navigation";

//icons
import { FaUserAlt } from "react-icons/fa";
import { BsFillGrid3X2GapFill } from "react-icons/bs";
import { BsViewList } from "react-icons/bs";
import { BiDotsHorizontalRounded } from "react-icons/bi";

const EmployeeList = () => {
  const [isShowed, setShow] = useState(false);
  const [view, setView] = useState("");
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  // const router = useRouter();

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
          <h3 className="font-bold text-4xl">Employee Masterlist</h3>
          <button
            onClick={() => setShow(true)}
            className="bg-[#8D93AB] py-2 px-6 rounded-md text-[#F1F3F8] font-bold"
          >
            Add Employee
          </button>
        </div>
        <div className="w-full flex justify-end">
          <div className="w-[10%] px-4 py-2 flex items-center justify-center gap-4 bg-slate-400 rounded-lg">
            <BsFillGrid3X2GapFill
              className={`${
                view === "grid"
                  ? "scale-125 text-white"
                  : "hover:scale-125 hover:text-white transition ease-in ease-out duration-70"
              }`}
              onClick={(e) => setView("grid")}
              value="grid"
            />
            <BsViewList
              className={`${
                view === "list"
                  ? "scale-125 text-white"
                  : "hover:scale-125 hover:text-white transition ease-in ease-out duration-70"
              }`}
              onClick={(e) => setView("list")}
              value="list"
            />
            {console.log(view)}
          </div>
        </div>

        {error && <div>{error}</div>}
        {employees.length > 0 && (
          <div
            className={`m-auto w-full flex ${
              view === "grid"
                ? "flex-wrap items-center justify-center gap-6"
                : "flex flex-col gap-4"
            }`}
          >
            {employees.map((employee, index) => (
              // parent div
              <div
                key={employee}
                className={`${
                  view === "grid"
                    ? "w-[30%] bg-[#F1F3F8] p-4 rounded-lg flex flex-col gap-2"
                    : "w-full bg-[#F1F3F8] flex justify-between items-baseline p-4 rounded-lg"
                }`}
              >
                <div className="flex w-full justify-between">
                  <div className="w-full flex flex-col gap-2">
                    <div className="flex gap-2 items-center">
                      <div className="bg-slate-400 p-2 rounded-full">
                        <FaUserAlt />
                      </div>
                      <div>
                        <p className="font-semibold">
                          {employee.last_name}, {employee.first_name}
                        </p>

                        <p className="text-xs">
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
                      </div>
                    </div>
                    <div>
                      <p
                        className={`w-fit rounded-md px-2 py-0.5 text-xs ${
                          employee.status === true
                            ? "bg-green-300"
                            : employee.status === false
                            ? "bg-neutral-400"
                            : "bg-red-200"
                        }`}
                      >
                        Status:{" "}
                        {employee.status === true
                          ? "Active"
                          : employee.status === false
                          ? "Not Active"
                          : "No Status"}
                      </p>
                    </div>
                  </div>
                  <div className="h-fit rounded-full p-1.5 transition ease-in duration-70 hover:bg-slate-300">
                    <BiDotsHorizontalRounded className="text-lg text-neutral-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default EmployeeList;
