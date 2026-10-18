import logo from "@/assets/ritorica-logo.svg";

export function AuthLayout({ title, subtitle, children, footer }: { title: string; subtitle?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      <div className="hidden flex-col justify-between bg-gradient-to-br from-accent via-background to-card p-10 text-sidebar-foreground lg:flex">
        <div />
        <div className="max-w-md">
          <h2 className="font-display text-4xl font-semibold leading-tight text-sidebar-accent-foreground">
            Every request answered. Every issue tracked.
          </h2>
          <p className="mt-4 text-sm leading-relaxed">
            Submit tickets, follow the conversation and get a clear status at every step — from Unanswered to Solved.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3 text-xs">
            {["Unanswered", "In Progress", "Solved"].map((s, i) => (
              <div key={s} className="hover-lift rounded-md border border-sidebar-border bg-card p-3">
                <div className="font-mono text-sidebar-primary">0{i + 1}</div>
                <div className="mt-1 text-sidebar-accent-foreground">{s}</div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs">© {new Date().getFullYear()} SupportDesk</p>
      </div>
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex justify-center">
            <img src={logo} alt="Ritorica" className="h-auto w-full max-w-[220px] object-contain sm:max-w-[260px]" />
          </div>
          <h1 className="text-center text-2xl font-semibold">{title}</h1>
          {subtitle && <p className="mt-1.5 text-center text-sm text-muted-foreground">{subtitle}</p>}
          <div className="mt-6">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
