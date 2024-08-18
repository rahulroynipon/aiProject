import { useState } from "react";
import { useErrorContext } from "../Context/Error.context";
import { useMutation } from "@tanstack/react-query";
import { apiGet } from "../utils/apiAxios.util";

const useResetLink = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const mutation = useMutation({
    mutationFn: async ({ email }) => {
      return await apiGet(`/api/users/reset-link/${email}`);
    },
    onSuccess: (data) => {
      console.log(data);
      setErrorMessage("");
      setSuccessMessage(data.message);
    },
    onError: (error) => {
      setSuccessMessage("");
      setErrorMessage(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || email.trim() === "") {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    mutation.mutate({ email });
  };

  return {
    email,
    setEmail,
    handleSubmit,
    isLoading: mutation.isLoading,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    errorMessage,
    successMessage,
    setErrorMessage,
    setSuccessMessage,
  };
};

export default useResetLink;
