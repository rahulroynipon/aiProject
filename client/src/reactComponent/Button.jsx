import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

export default function Button({ children, clName, onClick }) {
  return (
    <motion.button
      className={cn("border px-4 py-2 rounded-md shadow-lg", clName)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
