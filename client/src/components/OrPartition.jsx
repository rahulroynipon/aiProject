<<<<<<< HEAD
import cn from "../../lib/cn";

=======
import { cn } from "../../lib/cn";
>>>>>>> 7a6c11d8aa51212c43914995b5451fcdc55dc0d4

export default function OrPartition({ text, clName }) {
  return (
    <div className={cn("flex items-center gap-3 my-2 xxl:my-3", clName)}>
      <hr className="h-[1px] bg-black/20 border-none w-full" />
      <span className="text-sm font-semibold opacity-90 shrink-0">{text}</span>
      <hr className="h-[1px] bg-black/20 border-none w-full" />
    </div>
  );
}
