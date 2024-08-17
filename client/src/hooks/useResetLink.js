import { useMutation } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { fetchResetPass } from "../utils/login.api";

export const useResetLink = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const abortControllerRef = useRef(null);

  const mutation = useMutation({
    mutationFn: ({ email }) => {
      abortControllerRef.current = new AbortController();
      return fetchResetPass(email, {
        signal: abortControllerRef.current.signal,
      });
    },

    onSuccess: (data) => {
      setSuccessMessage("Reset link sent successfully!");
      setErrorMessage(""); // Clear any previous errors
    },
    onError: (error) => {
      setErrorMessage(error.message);
      setSuccessMessage(""); // Clear any previous success message
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && email.trim() !== "") {
      mutation.mutate({ email });
    }
  };

  const cancelRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return {
    email,
    setEmail,
    handleSubmit,
    isLoading: mutation.isLoading,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    isPending: mutation.isPending,
    errorMessage,
    successMessage,
    setErrorMessage,
    setSuccessMessage,
    cancelRequest,
  };
};
