import { useRef, useState } from "react";
import { toast } from "react-toastify";

const useUpdateStatus = () => {
  const [isLoading, setIsLoading] = useState(null);
  const [isError, setIsError] = useState(null);
  const toastID = useRef();
  const updateStatus = async (id, setEmployees, employees) => {
    toastID.current = toast.loading("Loading...");
    setIsLoading(true);
    setIsError(null);

    try {
      const response = await fetch(`/api/changestatus/${id}`, {
        method: "PATCH",
      });

      const data = await response.json();
      console.log(data);

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

      const updatedEmployees = employees.map((employee) =>
        employee.id === id
          ? { ...employee, status: !employee.status }
          : employee
      );
      setEmployees(updatedEmployees);
    } catch (error) {
      toast.update(toastID.current ?? "", {
        render: "Something went wrong",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        type: "error",
        isLoading: false,
      });
      console.error("Error:", error);
    }
  };

  return { updateStatus };
};

export default useUpdateStatus;
