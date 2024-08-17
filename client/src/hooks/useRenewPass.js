import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { fetchRenewPass } from "../utils/renewPass.api";

export const useRenewPass = () => {
  const [password, setPassword] = useState("");
  const [retype, setRetype] = useState("");
  const [code, setCode] = useState("");
  const [token, setToken] = useState("");
  const [isShowPass, setShowPass] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [successModal, setSuccessModal] = useState(false);

  const mutation = useMutation({
    mutationFn: fetchRenewPass,
    onSuccess: (data) => {
      setSuccessMessage("Password updated successfully");
      setSuccessModal(true);
    },
    onError: (error) => {
      setErrorMessage(error.message);
      setOpen(true);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password && retype) {
      mutation.mutate({ code, token, password, retype });
    }
  };

  return {
    password,
    setPassword,
    retype,
    setRetype,
    code,
    setCode,
    token,
    setToken,
    isShowPass,
    setShowPass,
    isOpen,
    setOpen,
    errorMessage,
    setErrorMessage,
    successMessage,
    setSuccessMessage,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    isPending: mutation.isPending,
    isLoading: mutation.isLoading,
    handleSubmit,
    successModal,
    setSuccessModal,
  };
};
