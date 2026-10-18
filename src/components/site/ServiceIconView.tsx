import type { ServiceIcon } from "@/content/services";
import { cn } from "@/lib/utils";

export function ServiceIconView({ icon, size = "md" }: { icon: ServiceIcon; size?: "sm" | "md" | "lg" }) {
  const box = size === "sm" ? "size-7" : size === "lg" ? "size-16" : "size-14";
  if ("image" in icon) {
    return <img src={icon.image} alt="" aria-hidden width={64} height={64} loading="lazy" className={cn(box, "rounded-xl object-contain")} />;
  }
  const Icon = icon.lucide;
  return (
    <span aria-hidden className={cn(box, "inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground")}>
      <Icon className={size === "sm" ? "size-4" : "size-7"} />
    </span>
  );
}
