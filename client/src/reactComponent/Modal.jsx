import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";
import { VscClose } from "react-icons/vsc";
import { cn } from "../../lib/cn";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      type: "spring",
      damping: 25,
      stiffness: 300,
    },
  },
  exit: { y: -20, opacity: 0, transition: { duration: 0.3 } },
};

export default function Modal({ children, isOpen, setOpen, clName }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.section
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-50"
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "relative border shadow-lg rounded-2xl px-5 py-6 md:px-7 md:py-6 bg-white",
              clName
            )}
          >
            <Button
              clName="border-none shadow-none absolute 
              right-2 top-2 rounded-full -mt-1 -mr-3"
              onClick={() => setOpen(false)}
            >
              <VscClose
                className="hover:bg-black/15 rounded-full p-1 transition-all duration-300"
                size={30}
                opacity={0.7}
              />
            </Button>
            {children}
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
