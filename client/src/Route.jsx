import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/LogIn/Login";
import SignUp from "./pages/SignUp/SignUp";

export default function Rander() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}
