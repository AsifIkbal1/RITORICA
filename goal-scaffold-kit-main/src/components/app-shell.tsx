import logo from "@/assets/ritorica-logo.svg";
import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, Ticket, PlusCircle, Users, Headset, Building2, Tags, BarChart3, ScrollText, Settings, Bell,
  UserCog, ShieldCheck, KeyRound, LifeBuoy, Menu, LogOut, User, LineChart, Inbox, UserCheck,
  List, ListPlus, CircleDot, CheckCircle2, MessagesSquare, MessageCircle, Clock, Megaphone, ClipboardList, BookOpen,
  Folder, FolderTree, FileText, HelpCircle, Bot, History, ChevronRight, Mail,
} from "lucide-react";
import { useAuth, PORTALS, type Portal } from "@/lib/auth";
import { roleLabel } from "@/lib/constants";
import { useNotificationsRealtime, useNotifications } from "@/lib/notifications";
import { useChatListRealtime, usePresenceHeartbeat, useUnreadChats } from "@/lib/chat";
import { ChatWidgetProvider, useChatWidget } from "./chat/chat-widget";
import { PresenceToggle } from "./chat/presence-toggle";
import { AnnouncementBanner } from "./announcement-banner";
import { NotificationBell, useOpenNotification } from "./notification-bell";
import { showNotificationToast } from "./notification-toast";
import { GlobalSearch } from "./global-search";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type NavItem = {
  to?: string;
  label: string;
  icon: typeof Ticket;
  show: boolean;
  search?: Record<string, unknown>;
  badge?: number;
  onClick?: () => void;
  children?: NavItem[];
};
type NavGroup = { title: string; items: NavItem[] };

const OPEN_TICKETS = "unanswered,answered,awaiting_user_reply,in_progress,reopened";

function useNav(): NavGroup[] {
  const { can, isSuperAdmin, portal, session } = useAuth();
  const uid = session?.user.id ?? "";
  const unread = useNotifications(1).data?.unread ?? 0;
  const chatUnread = Object.values(useUnreadChats().data ?? {}).reduce((a, b) => a + b, 0);
  const widget = useChatWidget();
  const notifications: NavItem = { to: "/notifications", label: "Notifications", icon: Bell, show: true, badge: unread };
  const profile: NavItem = { to: "/profile", label: "My Profile", icon: User, show: true };
  const help: NavItem = { to: "/help", label: "Help Center", icon: LifeBuoy, show: true };
  const cc: NavItem[] = [
    { to: "/cc-emails/new", label: "Add CC Emails", icon: ListPlus, show: true },
    { to: "/cc-emails", label: "Manage CC Emails", icon: List, show: true },
  ];

  let groups: NavGroup[];
  if (portal === "admin") {
    groups = [
      {
        title: "Tickets & Chats",
        items: [
          { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, show: true },
          {
            label: "Tickets", icon: Ticket, show: true, children: [
              { to: "/tickets", label: "All Tickets", icon: List, show: true },
              { to: "/tickets", label: "Opened", icon: CircleDot, show: true, search: { status: OPEN_TICKETS } },
              { to: "/tickets", label: "Closed", icon: CheckCircle2, show: true, search: { status: "solved,closed" } },
              { to: "/tickets/new", label: "Create Ticket", icon: PlusCircle, show: true },
            ],
          },
          {
            label: "Live Chat", icon: MessagesSquare, show: true, badge: chatUnread, children: [
              { to: "/live-chat", label: "All Chats", icon: List, show: true, search: { filter: "all" } },
              { to: "/live-chat", label: "Active", icon: CircleDot, show: true, search: { filter: "active" } },
              { to: "/live-chat", label: "Waiting for Agent", icon: Clock, show: true, search: { filter: "waiting" } },
              { to: "/live-chat", label: "Ended", icon: CheckCircle2, show: true, search: { filter: "closed" } },
              { to: "/live-chat", label: "Assigned", icon: UserCheck, show: true, search: { filter: "assigned" } },
            ],
          },
          { to: "/mail", label: "Mail", icon: Mail, show: true },
          {
            label: "Announcements", icon: Megaphone, show: true, children: [
              { to: "/announcements", label: "Announcement Broadcast", icon: Megaphone, show: true },
            ],
          },
        ],
      },
      {
        title: "Support Management",
        items: [
          { to: "/customers", label: "Customers", icon: Users, show: can("customers.view") },
          { to: "/agents", label: "Support Agents", icon: Headset, show: can("agents.view") },
          { to: "/departments", label: "Departments", icon: Building2, show: can("departments.manage") },
          { to: "/categories", label: "Categories", icon: Tags, show: can("categories.manage") },
        ],
      },
      {
        title: "Others",
        items: [
          { to: "/custom-fields", label: "Custom Fields", icon: ClipboardList, show: true },
          {
            label: "Knowledge Base", icon: BookOpen, show: true, children: [
              { to: "/knowledge-base/categories", label: "Categories", icon: Folder, show: true },
              { to: "/knowledge-base/subcategories", label: "Subcategories", icon: FolderTree, show: true },
              { to: "/knowledge-base/articles", label: "Articles", icon: FileText, show: true },
            ],
          },
          { to: "/faqs", label: "FAQs", icon: HelpCircle, show: true },
          help,
        ],
      },
      {
        title: "Analytics",
        items: [
          { to: "/reports", label: "Reports", icon: BarChart3, show: can("reports.view") },
          { to: "/analytics", label: "Ticket Analytics", icon: LineChart, show: can("reports.view") },
        ],
      },
      {
        title: "System",
        items: [
          notifications,
          { to: "/activity-logs", label: "Activity Logs", icon: ScrollText, show: can("activity_logs.view") },
          { to: "/admin/security", label: "Sign-in Security", icon: ShieldCheck, show: true },
          { to: "/admin/ai-config", label: "AI / n8n Configuration", icon: Bot, show: true },
          { to: "/settings", label: "Settings", icon: Settings, show: can("settings.manage") },
          { to: "/admin/users", label: "Users", icon: UserCog, show: can("users.manage") },
          { to: "/admin/roles", label: "Roles", icon: ShieldCheck, show: isSuperAdmin },
          { to: "/admin/permissions", label: "Permissions", icon: KeyRound, show: isSuperAdmin },
        ],
      },
      { title: "Account", items: [profile] },
    ];
  } else if (portal === "agent") {
    groups = [
      {
        title: "My Work",
        items: [
          { to: "/agent/dashboard", label: "Dashboard", icon: LayoutDashboard, show: true },
          { to: "/tickets", label: "My Tickets", icon: UserCheck, show: true, search: { agent: uid } },
          { to: "/tickets", label: "Ticket Queue", icon: Inbox, show: true },
          {
            label: "Live Chat", icon: MessagesSquare, show: true, badge: chatUnread, children: [
              { to: "/live-chat", label: "My Active Chats", icon: MessageCircle, show: true, search: { filter: "mine" } },
              { to: "/live-chat", label: "Chat Queue", icon: Clock, show: true, search: { filter: "queue" } },
              { to: "/live-chat", label: "Ended", icon: CheckCircle2, show: true, search: { filter: "closed" } },
            ],
          },
          { to: "/tickets/new", label: "New Ticket", icon: PlusCircle, show: true },
          ...cc,
        ],
      },
      {
        title: "Tools",
        items: [
          { to: "/customers", label: "Customers", icon: Users, show: can("customers.view") },
          { to: "/agents", label: "Support Agents", icon: Headset, show: can("agents.view") },
          { to: "/reports", label: "Reports", icon: BarChart3, show: can("reports.view") },
          { to: "/activity-logs", label: "Activity Logs", icon: ScrollText, show: can("activity_logs.view") },
          help,
        ],
      },
      { title: "Account", items: [notifications, profile] },
    ];
  } else {
    groups = [
      {
        title: "My Support",
        items: [
          { to: "/customer/dashboard", label: "Dashboard", icon: LayoutDashboard, show: true },
          { to: "/tickets", label: "My Tickets", icon: Ticket, show: true },
          { to: "/tickets/new", label: "Create New Ticket", icon: PlusCircle, show: true },
          { label: "Live Chat", icon: MessageCircle, show: true, badge: chatUnread, onClick: () => widget.open() },
          { to: "/chat-history", label: "Chat History", icon: History, show: true },
          help,
        ],
      },
      {
        // Only appears if an administrator explicitly granted extra permissions.
        title: "Extra Access",
        items: [
          { to: "/reports", label: "Reports", icon: BarChart3, show: can("reports.view") },
          { to: "/settings", label: "Settings", icon: Settings, show: can("settings.manage") },
        ],
      },
      { title: "Account", items: [notifications, profile] },
    ];
  }
  return groups.map((g) => ({ ...g, items: g.items.filter((i) => i.show) })).filter((g) => g.items.length);
}

const linkCls =
  "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-all duration-200 hover:translate-x-0.5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[status=active]:bg-sidebar-accent data-[status=active]:font-medium data-[status=active]:text-sidebar-accent-foreground data-[status=active]:[&>svg]:text-sidebar-primary";

function NavBadge({ n }: { n?: number | undefined }) {
  if (!n) return null;
  return <span className="rounded-full bg-destructive px-1.5 text-[10px] font-semibold text-destructive-foreground">{n > 99 ? "99+" : n}</span>;
}

function NavEntry({ i, onNavigate, nested }: { i: NavItem; onNavigate?: (() => void) | undefined; nested?: boolean }) {
  const pathname = useLocation({ select: (l) => l.pathname });
  const hasActiveChild = !!i.children?.some((c) => c.to && (pathname === c.to || pathname === `${c.to}/`));
  const [open, setOpen] = useState(hasActiveChild);
  useEffect(() => {
    if (hasActiveChild) setOpen(true);
  }, [hasActiveChild]);
  if (i.children) {
    return (
      <div>
        <button type="button" onClick={() => setOpen(!open)} className={linkCls} aria-expanded={open}>
          <i.icon className="size-4" />
          <span className="flex-1 text-left">{i.label}</span>
          <NavBadge n={i.badge} />
          <ChevronRight className={cn("size-3.5 opacity-60 transition-transform", open && "rotate-90")} />
        </button>
        {open && (
          <div className="ml-3 border-l border-sidebar-border pl-2">
            {i.children.filter((c) => c.show).map((c) => <NavEntry key={c.label} i={c} onNavigate={onNavigate} nested />)}
          </div>
        )}
      </div>
    );
  }
  if (i.onClick)
    return (
      <button type="button" onClick={() => { onNavigate?.(); i.onClick?.(); }} className={linkCls}>
        <i.icon className="size-4" />
        <span className="flex-1 text-left">{i.label}</span>
        <NavBadge n={i.badge} />
      </button>
    );
  return (
    <Link
      to={i.to as never}
      search={(i.search ?? {}) as never}
      onClick={onNavigate}
      activeOptions={{ exact: true, includeSearch: true }}
      className={cn(linkCls, nested && "py-1 text-[13px]")}
    >
      <i.icon className={nested ? "size-3.5" : "size-4"} />
      <span className="flex-1">{i.label}</span>
      <NavBadge n={i.badge} />
    </Link>
  );
}

const PORTAL_ICON: Record<Portal, typeof Ticket> = { admin: ShieldCheck, agent: Headset, customer: LifeBuoy };

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const groups = useNav();
  const { portal, signOut } = useAuth();
  const nav = useNavigate();
  const P = PORTALS[portal];
  const Icon = PORTAL_ICON[portal];
  return (
    <div className="flex h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="border-b border-sidebar-border px-5 py-3">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Ritorica" className="h-9 w-auto max-w-full object-contain" />
        </div>
        <div className="mt-2 flex items-center gap-1.5 rounded-md bg-sidebar-accent px-2 py-1 text-xs font-semibold text-sidebar-accent-foreground">
          <Icon className="size-3.5 text-sidebar-primary" />
          {P.label}
        </div>
      </div>
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {groups.map((g) => (
          <div key={g.title}>
            <div className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wider opacity-60">{g.title}</div>
            {g.items.map((i) => <NavEntry key={i.label} i={i} onNavigate={onNavigate} />)}
            {g.title === "Account" && (
              <button
                type="button"
                onClick={async () => { onNavigate?.(); await signOut(); nav({ to: portal === "admin" ? "/admin-login" : "/login" }); }}
                className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-all duration-200 hover:translate-x-0.5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <LogOut className="size-4" /> Logout
              </button>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { portal } = useAuth();
  return (
    <ChatWidgetProvider enabled={portal === "customer"}>
      <Shell>{children}</Shell>
    </ChatWidgetProvider>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { profile, roles, signOut, isStaff, portal } = useAuth();
  const nav = useNavigate();
  const openNotification = useOpenNotification();
  useNotificationsRealtime((n) => showNotificationToast(n, openNotification));
  useChatListRealtime();
  usePresenceHeartbeat();
  const initials = (profile?.full_name || profile?.email || "?").split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
  const topRole = (["super_admin", "admin", "agent", "customer"] as const).find((r) => roles.includes(r));
  const P = PORTALS[portal];

  // Expose the portal to CSS so each role gets its own colour scheme (also for portalled popovers).
  useEffect(() => {
    document.documentElement.dataset["portal"] = portal;
    return () => { delete document.documentElement.dataset["portal"]; };
  }, [portal]);

  return (
    <div className="flex h-screen w-full overflow-hidden" data-portal={portal}>
      <aside className="hidden h-full w-64 shrink-0 overflow-y-auto border-r border-sidebar-border lg:block">
        <SidebarContent />
      </aside>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 border-0 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <header className="shrink-0 z-30 flex h-14 items-center gap-3 border-b bg-card/95 px-4 backdrop-blur lg:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </Button>
          <span className="hidden whitespace-nowrap text-sm font-semibold text-foreground md:inline">{P.label}</span>
          <div className="min-w-0 flex-1">{isStaff && <GlobalSearch />}</div>
          {isStaff && <PresenceToggle />}
          <NotificationBell />
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-md p-1 hover:bg-muted">
              <Avatar className="size-8">
                {profile?.avatar_url && <AvatarImage src={profile.avatar_url} />}
                <AvatarFallback className="bg-primary text-xs text-primary-foreground">{initials}</AvatarFallback>
              </Avatar>
              <div className="hidden text-left sm:block">
                <div className="max-w-40 truncate text-sm font-medium leading-tight">{profile?.full_name}</div>
                <RoleBadge portal={portal} label={topRole === "super_admin" ? "Super Admin" : P.badge} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-xs font-normal">
                <div className="truncate text-muted-foreground">{profile?.email}</div>
                <div className="mt-1 font-medium">{topRole ? roleLabel(topRole) : ""} · {P.label}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => nav({ to: "/profile" })}>
                <User className="size-4" /> My Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await signOut();
                  nav({ to: portal === "admin" ? "/admin-login" : "/login" });
                }}
              >
                <LogOut className="size-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 overflow-y-auto px-4 py-6 lg:px-8">
          <AnnouncementBanner />
          {children}
        </main>
      </div>
    </div>
  );
}

function RoleBadge({ portal, label }: { portal: Portal; label: string }) {
  return (
    <span
      className={cn(
        "mt-0.5 inline-block rounded px-1.5 py-px text-[10px] font-bold uppercase tracking-wider",
        portal === "admin" && "bg-primary/10 text-primary",
        portal === "agent" && "bg-portal-agent/15 text-portal-agent",
        portal === "customer" && "bg-primary/10 text-primary",
      )}
    >
      {label}
    </span>
  );
}
