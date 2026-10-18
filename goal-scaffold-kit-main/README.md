# SupportDesk

A production-ready customer support / helpdesk web application: customers submit and follow tickets, support staff triage and resolve them, administrators manage the platform.

## 1. Architecture

- **Frontend & server**: TanStack Start (React 19, Vite, file-based routing in `src/routes`), Tailwind CSS v4 with design tokens in `src/styles.css`, shadcn/ui components in `src/components/ui`.
- **Backend**: Lovable Cloud (PostgreSQL, Auth, Storage). The browser talks to the database through the Supabase JS client; **every authorization rule is enforced in the database** (Row-Level Security policies, `SECURITY DEFINER` helper functions and triggers), never in the UI.
- **Server functions**: `src/lib/admin.functions.ts` — privileged actions that need the service key (creating users). It verifies the caller's `users.manage` permission before acting.
- **Business logic in the database**: ticket numbering, automatic status transitions, activity history, audit logs and notifications are implemented as Postgres triggers, so they apply regardless of which client writes the data.

```text
src/
  routes/               pages (public: login, register, forgot/reset-password)
  routes/_app/          signed-in area (layout gate + sidebar shell)
  components/           app components (shell, badges, states, file picker…)
  lib/auth.tsx          session, profile, roles, permissions context
  lib/constants.ts      statuses, priorities, roles, error mapping
  lib/attachments.ts    private file upload / signed download helpers
  lib/admin.functions.ts server-side admin operations
drizzle/migrations/     SQL migrations (schema, policies, functions, seed)
```

## 2. Database structure

| Table | Purpose |
|---|---|
| `profiles` | One row per user (name, email, phone, avatar, department, active flag, last login) |
| `user_roles` | Role assignments (`super_admin`, `admin`, `agent`, `customer`) — separate table to prevent privilege escalation |
| `permissions`, `role_permissions` | Permission keys (e.g. `tickets.assign`) and which roles hold them |
| `departments`, `categories` | Configurable lookups with active/inactive flag |
| `tickets` | Ticket with `ticket_number` (TKT-000001), customer snapshot, status, priority, category, department, assigned agent, first-response/solved/closed/reopened timestamps |
| `ticket_messages` | Conversation: `customer_reply`, `agent_reply`, `internal_note`, `system_event` |
| `ticket_attachments` | File metadata (ticket, message, uploader, original name, storage path, type, size) |
| `ticket_activity` | Per-ticket history (status/priority/category/department/assignment changes, replies, attachments). Internal entries are hidden from customers |
| `activity_logs` | Append-only system audit trail (logins, logouts, user/role changes, settings, deletions) |
| `notifications` | In-app notifications per user (realtime-enabled) |
| `settings` | Key/value system settings |

Ticket numbers come from the `ticket_number_seq` sequence and are never reused. Indexes cover ticket number, customer, agent, status, priority, category, department, created/updated dates, customer email/phone, plus a full-text index on message content.

Key RPC functions: `search_tickets` (server-side search/filter/sort/pagination across ID, subject, customer name/email/phone, agent and message content), `dashboard_stats`, `report_stats`, `customer_list`, `my_permissions`, `record_login`. Reporting functions run with the caller's privileges, so results respect data isolation.

## 3. Authentication

Email + password (with email confirmation) and Google sign-in. Pages: `/login`, `/register`, `/forgot-password`, `/reset-password`, profile with password change, sign-out. Passwords are handled by the auth service — never stored by the app. Sessions persist and refresh automatically. Disabled accounts are blocked in the UI and lose all staff permissions in the database.

**The first account that registers becomes Super Admin.** Every later sign-up is a Customer. Staff accounts are created or promoted by an administrator from **Users**.

## 4. User roles

- **Super Admin** — everything, including users, roles, permissions, settings and deleting tickets.
- **Admin** — tickets, customers, agents, departments, categories, reports, activity logs, notifications.
- **Support Agent** — tickets assigned to them, unassigned tickets, and tickets in their department; reply, internal notes, status, priority, assignment; customer info.
- **Customer** — own tickets only: create, search, reply, attach files, view status/priority/history, manage profile.

## 5. Permissions

Permission keys live in `permissions`; the role matrix is editable by Super Admin at `/admin/permissions`. The database function `has_permission(user, key)` is used inside policies and triggers (e.g. changing priority requires `tickets.change_priority`). Customers can never read internal notes, internal activity, other customers or their tickets.

## 6. Storage

Attachments live in the private `ticket-attachments` bucket under `{ticket_id}/{uuid}-{filename}`. Downloads use short-lived (5-minute) signed URLs. Storage policies only allow reading files that have a metadata row the user can see, and uploads only into tickets the user can access. File types and a 10 MB limit are validated in the UI and the bucket enforces the size cap.

## 7. Environment configuration

Provided automatically by Lovable Cloud:

- `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID` (browser-safe)
- `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server only)

No secrets are stored in frontend code. Email notifications are switched off by default (`email_notifications_enabled` setting); to add them, connect an email provider and send from a server function reading credentials from server-side environment variables.

## 8. Deployment

Publish from Lovable. The app runs as a standalone web application on its own URL (or a custom domain) and does not depend on the editor. Database migrations in `drizzle/migrations` describe the full schema and can be applied to any PostgreSQL/Supabase project.

## 9. Backup & export

- Code: sync to GitHub from Lovable and maintain anywhere.
- Data: export tables as CSV from the Cloud dashboard, or `pg_dump` when self-hosting.
- Files: download the `ticket-attachments` bucket contents; metadata maps each file to its ticket/message.
- The stack is standard (React, PostgreSQL, Supabase-compatible auth/storage) with no proprietary runtime lock-in.

## 10. Maintaining the project

- Add a status/priority: extend the enum in a migration, then `STATUSES`/`PRIORITIES` in `src/lib/constants.ts` and its colour token in `src/styles.css`.
- Add a permission: insert into `permissions`, grant it in `/admin/permissions`, check it with `has_permission` in policies and `can()` in the UI.
- Change the look: edit tokens in `src/styles.css` (colours, status/priority colours, fonts, shadows).
- Never trust UI checks alone — put every new rule in a database policy or trigger.
