"use client";

import { useState } from "react";
import supabase from "../supabase";
import { useRouter } from "next/navigation"; // Import the useRouter hook

const Onboarding = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

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

  const handleSignIn = async () => {
    let isValid = true;
    const newErrors = {
      email: email
        ? email.includes("@")
          ? ""
          : "Email must contain an @"
        : "Email is required",
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error("Error during login:", error.message);
        setErrorMessage("Invalid Email or Password")
      } else {
        // Redirect to the home page after successful login
        console.log("success!");
       setErrorMessage("")
          router.push("/"); // Replace '/' with the actual path to your home page
        
      }
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center gap-6 bg-gradient-to-br from-[#D6E0F0] to-[#393B44]">
      <div className="w-[30%] px-10 py-4 flex items-center justify-center rounded-lg">
        <h1 className="font-black text-3xl text-[#393B44]">Inventory Management System</h1>
      </div>
      <div className="w-[30%] p-10 bg-[#D6E0F0]/80 flex flex-col items-center justify-center gap-6 rounded-lg">
        <h3 className="text-center text-2xl font-bold">Sign In</h3>
        <hr className="w-full border-2 border-[#8D93AB]"></hr>
        <div className="w-full flex flex-col items-center gap-4">
        {errorMessage && (
            <div className="text-red-500 text-sm">{errorMessage}</div>
          )}
          <div className="w-full flex flex-col text-xs">
            <p>Email</p>
            <input
              type="text"
              className="p-2 rounded-md"
              onChange={handleEmailChange}
            />
          </div>

          <div className="w-full flex flex-col text-xs">
            <p>Password</p>
            <input
              type="password"
              className="p-2 rounded-md"
              onChange={handlePasswordChange}
            />
          </div>
          <div clasName="">
            <button
              className="bg-[#8D93AB] text-white py-2 px-4 rounded-md mt-4"
              onClick={handleSignIn}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
