import React, { createContext, useContext, useState } from "react";

// ErrorsContext without default values as it will be provided by the ErrorProvider
const ErrorsContext = createContext();

const ErrorProvider = ({ children }) => {
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);

  const addError = (message) => {
    setError(message);
    setIsError(true);
  };

  const resetError = () => {
    setError("");
    setIsError(false);
  };

  return (
    <ErrorsContext.Provider value={{ error, isError, addError, resetError }}>
      {children}
    </ErrorsContext.Provider>
  );
};

// Custom hook to use the ErrorsContext
const useErrorContext = () => useContext(ErrorsContext);

export { ErrorProvider, useErrorContext };
