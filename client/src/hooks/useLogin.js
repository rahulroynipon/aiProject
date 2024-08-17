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
    onError: (error) => {
      setErrorMessage(error.message);
      setOpen(true);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password && !mutation.isLoading) {
      mutation.mutate({ email, password });
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
