import React, { useEffect, useState } from "react";
import Modal from "../components/Modal"; // Assuming you have a Modal component
import Button from "../components/Button"; // Assuming you have a Button component
import { CiCircleAlert } from "react-icons/ci";
import { useErrorContext } from "../Context/Error.context";

export default function ErrorModal() {
  const { error, isError, resetError } = useErrorContext();
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    if (isError) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isError]);

  const closeError = () => {
    resetError(); // Resets the error in context
    setOpen(false); // Closes the modal
  };

  return (
    <Modal
      isOpen={isOpen && !!error} // Open the modal only if there's an error
      onClose={closeError} // Call closeError when the modal is closed
      clName={"min-w-[15rem] max-w-[20rem]"}
    >
      <section className="flex flex-col items-center justify-center gap-3 ">
        <div className="text-red-500 flex flex-col items-center justify-center">
          <CiCircleAlert size={100} />
        </div>

        <p className="max-w-[20rem] font-thin text-center">
          {error} {/* Display the error message */}
        </p>

        <Button
          onClick={closeError} // Close the modal on click
          whileHover={{ scale: 1.1 }}
          clName={"ring-red-400 px-3 py-1 rounded font-semibold text-red-500"}
        >
          OK
        </Button>
      </section>
    </Modal>
  );
}
