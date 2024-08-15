import Modal from "./Modal";
import Button from "./Button";
import { CiCircleAlert } from "react-icons/ci";

export default function Error({ isOpen, setOpen, errorMessage }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setOpen(false)}
      clName={"min-w-[15rem] max-w-[20rem]"}
    >
      <section className="flex flex-col items-center justify-center gap-3 ">
        <div className="text-red-500 flex flex-col items-center justify-center">
          <CiCircleAlert size={100} />
        </div>

        <button className="max-w-[20rem] font-thin ">{errorMessage}</button>

        <Button
          onClick={() => setOpen(false)}
          whileHover={{ scale: 1.1 }}
          clName={"ring-red-400 px-3 py-1 rounded font-semibold text-red-500"}
        >
          OK
        </Button>
      </section>
    </Modal>
  );
}
