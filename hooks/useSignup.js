import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

const useSignup = () => {
  const [isLoading, setIsLoading] = useState(null);
  const [isError, setIsError] = useState(null);
  const toastID = useRef();
  const router = useRouter();

  const signup = async (firstName, lastName, email, password, selectedRole) => {
    toastID.current = toast.loading("Loading...");
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
        toast.update(toastID.current ?? "", {
          render: "Something went wrong",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          type: "error",
          isLoading: false,
        });
        return;
      }

      toast.update(toastID.current ?? "", {
        render: "Employee added!",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        type: "success",
        isLoading: false,
      });

      //   router.push("/assignroles");
    } catch (e) {
      console.log(e);
      toast.update(toastID.current ?? "", {
        render: "Something went wrong",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        type: "error",
        isLoading: false,
      });
    }
  };
  return { signup, isLoading, isError };
};

export default useSignup;
