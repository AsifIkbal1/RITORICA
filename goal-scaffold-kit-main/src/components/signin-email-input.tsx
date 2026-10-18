import type { ComponentProps } from "react";
import { SIGNIN_SUFFIX } from "@/lib/signin-domain";
import { cn } from "@/lib/utils";

/**
 * Text box for the part before "@"; the fixed company domain is shown after it and can't be edited.
 * Pasting a full address on the company domain keeps only the name part.
 */
export function SignInEmailInput({ value, onValueChange, className, id, ...rest }: Omit<ComponentProps<"input">, "value" | "onChange"> & {
  value: string;
  onValueChange: (v: string) => void;
}) {
  return (
    <div
      className={cn(
        "flex h-9 w-full items-center overflow-hidden rounded-md border border-input bg-background shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
        className,
      )}
    >
      <input
        id={id}
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        className="h-full min-w-0 flex-1 bg-transparent px-3 text-base outline-none placeholder:text-muted-foreground md:text-sm"
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          onValueChange(v.toLowerCase().endsWith(SIGNIN_SUFFIX) ? v.slice(0, -SIGNIN_SUFFIX.length) : v);
        }}
        {...rest}
      />
      <span className="flex h-full select-none items-center border-l border-input bg-muted px-2.5 text-sm text-muted-foreground" aria-hidden>
        {SIGNIN_SUFFIX}
      </span>
    </div>
  );
}
