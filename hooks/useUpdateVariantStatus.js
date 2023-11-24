import { useRef, useState } from "react";
import { toast } from "react-toastify";

const useUpdateVariantStatus = () => {
  const [isLoading, setIsLoading] = useState(null);
  const [isError, setIsError] = useState(null);
  const toastID = useRef();
  const updateVariantStatus = async (id) => {
    toastID.current = toast.loading("Loading...");
    setIsLoading(true);
    setIsError(null);

    try {
      const response = await fetch(`/api/changevariantstatus/${id}`, {
        method: "PATCH",
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        setIsLoading(false);
        setIsError(json.error);
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
        render: "Status updated!",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        type: "success",
        isLoading: false,
      });

      
    // setChange((old) => !old)
    // const updatedVariant = material.variants?.map((variant) =>
    //     variant.id === id
    //       ? { ...variant, status: !variant.status }
    //       : variant
    //   );
    //   setSelectedMaterial(updatedVariant);
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

  return { updateVariantStatus };
};

export default useUpdateVariantStatus;
