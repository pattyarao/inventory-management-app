"use client";

import { useState } from "react";
import useSignup from "../../hooks/useSignup";
import { New_Tegomin } from "next/font/google";
import { useRouter } from "next/navigation";

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
          status: false,
        },
      ]);
    }
    setEmployeeListChanged((old) => !old);
    handleClose();
    console.log(selectedRole);
  };

  return (
    <div className="fixed min-w-full min-h-screen flex flex-col items-center justify-center bg-black/80">
      <div className="w-[50%] p-4 flex justify-between items-center bg-[#393B44] rounded-t-md">
        <p className="text-xl text-white font-bold uppercase">
          Add New Employee
        </p>
        <p onClick={handleClose} className="cursor-pointer">
          Cancel
        </p>
      </div>
      <div className="w-[50%] px-4 py-8 bg-[#D6E0F0] flex flex-col items-center justify-center gap-6 rounded-b-md">
        <div className="flex justify-between items-center gap-6">
          <div className="firstname_input">
            <p>First Name</p>
            <input
              className="border border-black rounded-md py-0.5 px-2 focus:outline-none"
              type="text"
              onChange={handleFirstnameChange}
              value={firstname}
            />
          </div>
          <div className="lastname_input">
            <p>Last Name</p>
            <input
              className="border border-black rounded-md py-0.5 px-2 focus:outline-none"
              type="text"
              onChange={handleLastNameChange}
              value={lastname}
            />
          </div>
        </div>
        <div className="flex justify-between items-center gap-6">
          <div className="email_input">
            <p>Email</p>
            <input
              className="border border-black rounded-md py-0.5 px-2 focus:outline-none"
              type="text"
              onChange={handleEmailChange}
              value={email}
            />
          </div>
          <div className="password_input">
            <p>Password</p>
            <input
              className="border border-black rounded-md py-0.5 px-2 focus:outline-none"
              type="password"
              onChange={handlePasswordChange}
              value={password}
            />
          </div>
        </div>

        <div className="w-[85%] py-2 flex items-center justify-center gap-6 bg-[#8D93AB] rounded-md ">
          <p className="font-bold">Assign Role</p>
          <div className="">
            <select
              className="w-full pl-2 pr-16 py-2 bg-white border border-black rounded-lg text-sm focus:outline-none"
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
        <div>
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
