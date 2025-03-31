"use client";

import { useState } from "react";
import supabase from "../supabase";
import { useRouter } from "next/navigation"; // Import the useRouter hook
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3"; // Import reCAPTCHA v3

const Onboarding = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [loginAttempt, setLoginAttempt] = useState(0); // State variable for login attempts
  const { executeRecaptcha } = useGoogleReCaptcha(); // Hook to execute reCAPTCHA

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
      if (loginAttempt >= 5) {
        if (!executeRecaptcha) {
          console.error("Execute recaptcha not yet available");
          return;
        }

        const token = await executeRecaptcha("login");
        console.log("reCAPTCHA token:", token);

        // Send the token to your server for verification
        const response = await fetch("/api/verify-recaptcha", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();
        console.log("reCAPTCHA verification result:", data);

        if (!data.success) {
          setErrorMessage("Please complete the CAPTCHA to continue.");
          setLoginAttempt(0);
          return;
        } else {
          setErrorMessage("Congratulations! You have passed the reCAPTCHA.");
          setLoginAttempt(0);

        }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error("Error during login:", error.message);
        setLoginAttempt(prevAttempt => prevAttempt + 1); // Increment login attempt count
        setErrorMessage(`Invalid Email or Password. Attempt ${loginAttempt + 1}`);
        if (loginAttempt + 1 >= 5) {
          setErrorMessage("Too many login attempts. Please complete the CAPTCHA to continue.");
        }
      } else {
        const user_id = data.user.id;
        const { data: employee_data, error: employee_error } = await supabase
          .from("MD_PROFILES")
          .select("status")
          .eq("id", user_id);

        if (employee_error) {
          console.error("Error getting user:", employee_error.message);
        }

        const employee_status = employee_data[0].status;

        if (employee_status) {
          // Redirect to the home page after successful login
          console.log("success!");
          setErrorMessage("");
          router.push("/"); // Replace '/' with the actual path to your home page
        } else {
          alert("UNSUCCESSFUL LOGIN");
          router.push("/onboarding");
        }
          /*
       // Send magic link for MFA
       const { error: magicLinkError } = await supabase.auth.signInWithOtp({ email });
       if (magicLinkError) {
         console.error("Error sending magic link:", magicLinkError.message);
         setErrorMessage("Error sending magic link. Please try again.");
         return;
       }

       setErrorMessage(
        <>
          Magic link sent to your email. Please check your inbox.
          <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline ml-2">
            Go to Gmail
          </a>
        </>
      );*/
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

const App = () => (
  <GoogleReCaptchaProvider reCaptchaKey="6LcbnfoqAAAAAGgKp1okvkHi_dBgJ5fa3zWXNbzO">
    <Onboarding />
  </GoogleReCaptchaProvider>
);

export default App;
