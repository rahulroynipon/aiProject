import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext({
  user: {},
  addUser: () => {},
  removeUser: () => {},
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const addUser = (data) => {
    setUser(data);
  };

  const removeUser = () => {
    setUser({});
  };

  return (
    <AuthContext.Provider value={{ user, addUser, removeUser }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuthContext = () => useContext(AuthContext);

export { AuthContext, AuthProvider, useAuthContext };
