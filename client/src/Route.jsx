import { motion } from "framer-motion";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/LogIn/Login";
import SignUp from "./pages/SignUp/SignUp";
import RenewPass from "./pages/RenewPass/RenewPass";
import { AnimatePresence } from "framer-motion";
import { ErrorProvider } from "./Context/Error.context";
import Error from "./pages/GlobalError";

export default function Render() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <ErrorProvider>
          <Error />
          <Routes>
            <Route
              path="/login"
              element={
                <RouteTransition>
                  <Login />
                </RouteTransition>
              }
            />
            <Route
              path="/signup"
              element={
                <RouteTransition>
                  <SignUp />
                </RouteTransition>
              }
            />
            <Route
              path="/reset-password/:code/:token"
              element={
                <RouteTransition>
                  <RenewPass />
                </RouteTransition>
              }
            />
          </Routes>
        </ErrorProvider>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export function RouteTransition({ children }) {
  const location = useLocation();

  const variants = {
    initial: {
      opacity: 0,
      scale: 0.8,
    },
    animate: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.8, 0.25, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.8, 0.25, 1],
      },
    },
  };

  return (
    <motion.div
      key={location.pathname}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      style={{ width: "100%" }}
    >
      {children}
    </motion.div>
  );
}
