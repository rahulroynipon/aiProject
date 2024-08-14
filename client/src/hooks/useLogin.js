import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { fetchLogin, fetchResetPass } from "../utils/login.api";

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPass, setShowPass] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Mutation configuration
  const mutation = useMutation({
    mutationFn: fetchLogin,
    onSuccess: (data) => {
      console.log("Login successful:", data);
    },
    onError: (error) => {
      console.error("Login error:", error);
      if (error.status === 401) {
        setErrorMessage("Invalid username or password");
      } else if (error.status) {
        setErrorMessage(
          error.message || "An unexpected error occurred. Please try again."
        );
      } else {
        setErrorMessage(
          "An unexpected error occurred. Please check your network connection and try again."
        );
      }
      setOpen(true);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password && !mutation.isLoading) {
      mutation.mutate({ email, password });
    } else {
      console.error("Please provide both email and password");
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isShowPass,
    setShowPass,
    handleSubmit,
    isLoading: mutation.isLoading,
    isError: mutation.isError,
    error: mutation.error,
    isPending: mutation.isPending,
    isOpen,
    setOpen,
    errorMessage,
    setErrorMessage,
  };
};

export const useResetPass = () => {
  return useMutation(fetchResetPass);
};
