import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-md",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
        "disabled:bg-slate-50 disabled:cursor-not-allowed",
        "placeholder:text-slate-400",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;