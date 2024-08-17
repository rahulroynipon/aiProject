import React, { createContext, useContext, useState } from "react";
import { nanoid } from "nanoid";

const ErrorsContext = createContext({
  errors: [],
  addError: () => {},
  removeError: () => {},
});

const ErrorProvider = ({ children }) => {
  const [errors, setErrors] = useState([]);

  const addError = (errorMessage) => {
    const newError = { id: nanoid(), error: errorMessage };
    setErrors((prev) => [...prev, newError]);
  };

  const removeError = (id) => {
    setErrors((prev) => prev.filter((err) => err.id !== id));
  };

  return (
    <ErrorsContext.Provider value={{ errors, addError, removeError }}>
      {children}
    </ErrorsContext.Provider>
  );
};

const useErrorContext = () => useContext(ErrorsContext);

export { ErrorsContext, ErrorProvider, useErrorContext };
