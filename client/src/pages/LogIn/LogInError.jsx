import Modal from "../../components/Modal";
import Button from "../../components/Button";
import { CiCircleAlert } from "react-icons/ci";

export default function LoginError({ isOpen, setOpen, errorMessage }) {
  return (
    <Modal isOpen={isOpen} onClose={() => setOpen(false)}>
      <section className="flex flex-col items-center justify-center gap-3">
        <div className="text-red-500 flex flex-col items-center justify-center">
          <CiCircleAlert size={100} />
        </div>

        <button className="max-w-[20rem]  font-thin">{errorMessage}</button>

        <Button
          onClick={() => setOpen(false)}
          whileHover={{ scale: 1.1 }}
          clName={"border px-3 py-1 rounded font-semibold text-red-500"}
        >
          OK
        </Button>
      </section>
    </Modal>
  );
}
