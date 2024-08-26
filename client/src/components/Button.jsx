<<<<<<< HEAD

import { motion } from "framer-motion";
import cn from "../../lib/cn";
=======
import React from "react";
import { cn } from "../../lib/cn";
import { motion } from "framer-motion";
>>>>>>> 7a6c11d8aa51212c43914995b5451fcdc55dc0d4

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
        "opacity-50 cursor-not-allowed": type == "submit" && disabled,
        "opacity-50 cursor-not-allowed bg-gray-300 border-gray-400 text-gray-500":
          disabled && type != "submit",
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
