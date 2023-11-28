"use client";

import { useState } from "react";
import useSignup from "../../hooks/useSignup";
import { New_Tegomin } from "next/font/google";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const AddEmployee = ({
  handleClose,
  employees,
  setEmployees,
  setEmployeeListChanged,
}) => {
  const { signup } = useSignup();
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [role, setRole] = useState("Owner");
  const router = useRouter();

  const handleFirstnameChange = (e) => {
    setFirstName(e.target.value);
  };
  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleConfirmPassword = (e) => {
    setConfirmPass(e.target.value);
  };

  const handleSelectRole = (event) => {
    setRole(event.target.value);
  };

  const handleAddEmployee = async (
    firstName,
    lastName,
    email,
    password,
    selectedRole
  ) => {
    if (confirmPass !== password) {
      return toast("Passwords do not match.", {
        type: "error",
      });
    }
    const newEmployeeData = await signup(
      firstName,
      lastName,
      email,
      password,
      selectedRole
    );

    let newRole;
    if (selectedRole === "Owner") {
      newRole = 1;
    } else if (selectedRole === "Stock Controller") {
      newRole = 2;
    } else if (selectedRole === "Manufacturing Head") {
      newRole = 3;
    } else if (selectedRole === "Sales Person") {
      newRole = 4;
    }

    if (newEmployeeData === "success") {
      setEmployees([
        ...employees,
        {
          first_name: firstName,
          last_name: lastName,
          user_type: newRole,
          status: true,
        },
      ]);
    }
    setEmployeeListChanged((old) => !old);
    handleClose();
    console.log(selectedRole);
  };

  return (
    
    <div className="fixed w-full h-screen flex items-center justify-center bg-black/80">
      <div className="w-[70%] h-[70vh] p-8 bg-slate-300 rounded-md drop-shadow-md flex flex-col justify-center items-center gap-8">
        <div className="w-full flex items-center justify-between">
          <div className="">
            <h1 className="font-black text-lg">Add an employee.</h1>
            <p className="text-sm">
              Input employee details in the given fields.
            </p>
          </div>
          <div className="w-[50%] p-4 flex flex-col items-center justify-between gap-4 bg-white rounded-md drop-shadow-lg">
            <div className="w-full text-sm flex items-center justify-between gap-4">
              <p>First Name</p>
              <input
                className="w-[250px] border border-black rounded-md py-0.5 px-2 focus:outline-none"
                type="text"
                onChange={handleFirstnameChange}
                value={firstname}
              />
            </div>
            <div className="w-full text-sm flex items-center justify-between gap-4">
              <p>Last Name</p>
              <input
                className="w-[250px] border border-black rounded-md py-0.5 px-2 focus:outline-none"
                type="text"
                onChange={handleLastNameChange}
                value={lastname}
              />
            </div>
            <div className="w-full text-sm flex items-center justify-between gap-4">
              <p>Email</p>
              <input
                className="w-[250px] border border-black rounded-md py-0.5 px-2 focus:outline-none"
                type="text"
                onChange={handleEmailChange}
                value={email}
              />
            </div>
            <div className="w-full text-sm flex items-center justify-between gap-4">
              <p>Password</p>
              <input
                className="w-[250px] border border-black rounded-md py-0.5 px-2 focus:outline-none"
                type="password"
                onChange={handlePasswordChange}
                value={password}
              />
            </div>
            <div className="w-full text-sm flex items-center justify-between gap-4">
              <p>Confirm Password</p>
              <input
                className="w-[250px] border border-black rounded-md py-0.5 px-2 focus:outline-none"
                type="password"
                onChange={handleConfirmPassword}
                value={confirmPass}
              />
            </div>
            <div className="w-full text-sm flex items-center justify-between gap-4">
              <p>Select Role</p>
              <select
              className="w-[250px] border border-black rounded-md py-0.5 px-2 focus:outline-none"
              id="role"
              onChange={handleSelectRole}
              value={role}
            >
              <option value="Owner">Owner</option>
              <option value="Stock Controller">Stock Controller</option>
              <option value="Manufacturing Head">Manufacturing Head</option>
              <option value="Sales Person">Sales Person</option>
            </select>

            </div>
          </div>
        </div>
        <div className="w-full flex items-center justify-end gap-10">
          <p onClick={handleClose} className="cursor-pointer">
           Cancel
         </p>
          <button
            className="bg-[#526D82] py-2 px-4 text-white font-semibold rounded-md"
            onClick={(e) =>
              handleAddEmployee(firstname, lastname, email, password, role)
            }
          >
            Add Employee
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
