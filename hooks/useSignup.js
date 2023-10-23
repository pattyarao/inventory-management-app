import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const useSignup = () => {
  const [isLoading, setIsLoading] = useState(null);
  const [isError, setIsError] = useState(null);
  const router = useRouter();

  const signup = async (firstName, lastName, email, password, selectedRole) => {
    setIsLoading(true);
    setIsError(null);
    try {
      const response = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          selectedRole,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setError(json.error);
        return "error";
      }
      return "success";

      //   router.push("/assignroles");
    } catch (e) {
      console.log(e);
    }
  };
  return { signup, isLoading, isError };
};

export default useSignup;
