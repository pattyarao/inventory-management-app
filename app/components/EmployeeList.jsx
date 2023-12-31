"use client";

import { useState, useEffect, useRef } from "react";
import AddEmployee from "./AddEmployee";
import { GET } from "../api/employees/route";
import { useRouter } from "next/navigation";

//icons
import { FaUserAlt } from "react-icons/fa";
import { BsFillGrid3X2GapFill } from "react-icons/bs";
import { BsViewList } from "react-icons/bs";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { HiSortDescending } from "react-icons/hi";
import { HiSortAscending } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";
import { FaSortAlphaDown } from "react-icons/fa";
import { FaSortAlphaUp } from "react-icons/fa";

//toast
import { toast } from "react-toastify";

import useUpdateStatus from "../../hooks/useUpdateStatus";

const EmployeeList = () => {
  const { updateStatus } = useUpdateStatus();
  const [isAddModalShowed, setShowAddModal] = useState(false);
  const [selectedEmpIndex, setIndex] = useState(null);
  const [view, setView] = useState("");
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [isEmployeeListChanged, setEmployeeListChanged] = useState(false);
  const [sort, setSort] = useState("ascending");
  const [searchTerm, setSearchTerm] = useState("");
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
  }, [isEmployeeListChanged]);

  const handleClose = () => {
    setShowAddModal(false);
  };

  const handleShowEmployeeOptions = (index) => {
    setIndex(index);
  };

  const handleDeactivateUser = async (id) => {
    //function
    await updateStatus(id, setEmployees, employees);
    setEmployeeListChanged((old) => !old);
  };

  const sortEmployees = (a, b) => {
    const nameA = a.last_name.toUpperCase();
  const nameB = b.last_name.toUpperCase();

  // Sort by user type (owners first, then stock controllers, manufacturing heads, and sales persons)
  if (a.user_type !== b.user_type) {
    return a.user_type - b.user_type;
  }

  // Sort by last name
  return sort === "ascending" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredEmployees = employees.filter((employee) => {
    const fullName = `${employee.first_name} ${employee.last_name}`;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <>
      {isAddModalShowed && (
        <AddEmployee
          handleClose={handleClose}
          employees={employees}
          setEmployees={setEmployees}
          setEmployeeListChanged={setEmployeeListChanged}
        />
      )}
      <div className="w-[90%] h-full mb-8 bg-[#D6E0F0] p-4 flex flex-col gap-4 rounded-md">
        <div className="py-4 flex justify-between items-center border-b-2 border-black">
          <h3 className="font-bold text-4xl">Employee Masterlist</h3>
          <button
            onClick={() => {
              setShowAddModal(true);
              setIndex(null);
            }}
            className="bg-[#8D93AB] py-2 px-6 rounded-md text-[#F1F3F8] font-bold"
          >
            Add Employee
          </button>
        </div>
        <div className="w-full flex gap-4 justify-between">
          <div className="w-[300px] bg-white px-2 py-1 rounded-md flex items-center justify-between">
            <input
              type="text"
              placeholder="Search Employee..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="bg-inherit focus:outline-none"
            />
            <FiSearch className="text-slate-400" />
          </div>
          <div className="w-[50%] flex items-center justify-end gap-2">
            <div className="w-fit h-full px-4 py-2 flex items-center justify-center gap-4 bg-slate-400 rounded-lg">
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
            </div>
          </div>
        </div>

        {error && <div>{error}</div>}
        {filteredEmployees.length > 0 && (
          <div
            className={`m-auto w-full flex ${
              view === "grid"
                ? "flex-wrap items-center justify-center gap-6"
                : "flex flex-col gap-4"
            }`}
          >
            {filteredEmployees
              .slice() // Create a shallow copy to avoid modifying the original array
              .map((employee, index) => (
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
                    <div className="h-fit  p-1.5 flex flex-col items-end">
                      <BiDotsHorizontalRounded
                        className="text-lg text-neutral-600 rounded-full transition ease-in duration-70 hover:bg-slate-300"
                        onClick={() => handleShowEmployeeOptions(index)}
                      />
                      {selectedEmpIndex === index && (
                        <div className="absolute mt-6 py-2 rounded-md bg-white text-sm drop-shadow">
                          <ul className="flex flex-col gap-2">
                            <li
                              className="transition ease-in duration-50 hover:bg-slate-300 cursor-pointer px-6 py-2"
                              onClick={() => handleDeactivateUser(employee.id)}
                            >
                              {employee.status === true
                                ? "Deactivate"
                                : "Activate"}
                            </li>
                            <li
                              className="transition ease-in duration-50 hover:bg-slate-300 cursor-pointer px-6 py-2"
                              onClick={() => setIndex(null)}
                            >
                              Close
                            </li>
                          </ul>
                        </div>
                      )}
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
