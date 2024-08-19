import React from "react";
import { cn } from "../../lib/cn";
import { motion } from "framer-motion";

const Button = ({
  type = "button",
  clName,
  children,
  onClick,
  disabled,
  ...props
}) => {
  return (
    <motion.button
      whileTap={{ scale: 0.98, opacity: 0.8 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 30,
        duration: 5,
      }}
      type={type}
      className={cn("ring-1 ring-black/25 input ", clName, {
        "opacity-50 cursor-not-allowed": disabled,
      })}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
