"use client";

import { useState } from "react";
import supabase from "../supabase"; // Import your Supabase client

const Signup = () => {
  const rolesList = [
    "Owner",
    "Stock Controller",
    "Manufacturing Head",
    "Sales Person",
  ];

  const [selectedRole, setRole] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    if (!emailValue.includes("@")) {
      setErrors({ ...errors, email: "Email must contain an @" });
    } else {
      setErrors({ ...errors, email: "" });
    }
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRoleSelect = (e) => {
    setRole(e.target.value);
  };

  const handleSignup = async () => {
    // Form validation
    let isValid = true;
    const newErrors = {
      firstName: firstName ? "" : "First name is required",
      lastName: lastName ? "" : "Last name is required",
      email: email ? (email.includes("@") ? "" : "Email must contain an @") : "Email is required",
      password: password ? "" : "Password is required",
    };

    for (const error of Object.values(newErrors)) {
      if (error) {
        isValid = false;
        break;
      }
    }

    setErrors(newErrors);

    if (isValid) {
      try {

        //CREATE USER
        const { data, error } = await supabase.auth.admin.createUser({
          email: email,
          password: password,
        })

        // Sign up the user with email and password
        // const { data, error } = await supabase.auth.signUp({
        //   email: email,
        //   password: password,
        // });

        if (error) {
          console.error("Error signing up:", error.message);
          return;
        }

        const USER_ID =  data.user.id
        console.log("USER ID CHECK: " + USER_ID)
       
          console.log("SELECTED ROLE: " + selectedRole)
          // Query the REF_USERTYPE table to get the key for the selected role
          const { data: userTypeData, error: userTypeError } = await supabase
          .from('REF_USERTYPE')
          .select()
          .eq('description', selectedRole);

        console.log(userTypeData[0].id)

        if (userTypeError) {
          console.error("Error querying user type:", userTypeError.message);
          return;
        }

        // Create a user profile in MD_PROFILES
      const profileData = {
        id: data.user.id,
        first_name: firstName,
        last_name: lastName,
        user_type: userTypeData[0].id, // Use the key from REF_USERTYPE
      };

      console.log(profileData)

        const { data: profile, error: profileError } = await supabase
          .from("MD_PROFILES")
          .upsert([profileData]);

        if (profileError) {
          console.error("Error creating user profile:", profileError.message);
          return;
        }

        // Form submitted successfully
        console.log("Form submitted with data:", profileData);
      } catch (error) {
        console.error("Error during signup:", error.message);
      }
    }
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
            <p>First Name</p>
            <input type="text" className="p-2 rounded-md" onChange={handleFirstNameChange} />
          </div>
          <div className="w-full flex flex-col text-xs">
            <p>Last Name</p>
            <input type="text" className="p-2 rounded-md" onChange={handleLastNameChange} />
          </div>
          <div className="w-full flex flex-col text-xs">
            <p>Email</p>
            <input type="text" className="p-2 rounded-md" onChange={handleEmailChange} />
          </div>
          <div className="w-full flex flex-col text-xs">
            <p>Password</p>
            <input type="password" className="p-2 rounded-md" onChange={handlePasswordChange} />
          </div>

        {/* <div className="w-full flex flex-col text-xs">
            <p>First Name</p>
            <input type="text" className="p-2 rounded-md" />
          </div>

          <div className="w-full flex flex-col text-xs">
            <p>Last Name</p>
            <input type="text" className="p-2 rounded-md" />
          </div>


          <div className="w-full flex flex-col text-xs">
            <p>Email</p>
            <input type="text" className="p-2 rounded-md" />
          </div>

          <div className="w-full flex flex-col text-xs">
            <p>Password</p>
            <input type="text" className="p-2 rounded-md" />
          </div> */}

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
            <button className="bg-blue-800 text-white py-2 px-4 rounded-md mt-4"
            onClick={handleSignup}>
            
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
