import { useState } from "react";
import { Button, Modal } from "./reactComponent/reactComp";
import { cn } from "../lib/cn";

export default function App() {
  const [open, setOpen] = useState(false);

  return (
    <main>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. A soluta
        commodi aliquam totam velit. Unde, incidunt minus odio quis quidem
        debitis quod perspiciatis itaque, atque modi, delectus nisi natus.
        Similique?
      </p>
      <Button onClick={() => setOpen(true)}>click me</Button>
      <Modal clName={cn("h-[300px] w-[400px]")} isOpen={open} setOpen={setOpen}>
        <section className="flex items-center justify-between">
          <div>Header</div>
        </section>
      </Modal>
    </main>
  );
}
