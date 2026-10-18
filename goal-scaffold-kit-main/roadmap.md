# Roadmap

## Fixes & role UX (from "Critical UI & Notification Fixes" brief)
- [x] Fix notification error at root cause (duplicate realtime channel subscription)
- [x] Notification UI: unread count, related ticket, mark read / mark all, open ticket
- [x] Role portals: Admin / Agent / Customer with distinct sidebars, labels and role badge
- [x] Separate dashboards: Admin Dashboard, Agent Dashboard, My Support Dashboard
- [x] Ticket Analytics page for admins
- [x] Role-based redirect after login
- [x] Regression test as admin, agent and customer (incl. notification flow)

## Human + n8n AI chat (file-3 brief)
- [x] Database: chat conversations/messages, agent presence, n8n config (admin-only), AI logs, RPCs, realtime, chat attachments bucket
- [x] n8n server calls: send customer message → n8n → AI reply, escalation, error logging, test connection
- [x] Customer floating chat popup (status, typing, attachments, minimize/close, request human, create ticket, unavailable state)
- [x] Customer Chat History page
- [x] Staff Live Chat page (filters, take over, assign/transfer, end, switch AI/human, customer info, related tickets)
- [x] Agent Online/Away/Offline status + admin availability view
- [x] Admin AI / n8n Configuration page (URL, enable, test, status, errors/logs)
- [x] Chat notifications (customer/agent/admin) opening the right conversation
- [x] Sidebar updates for all three portals

## Extra menu sections (reference screenshots)
- [x] Tickets submenu (All / Opened / Closed), Chats submenu (All / Active / Ended / Assigned)
- [x] Add CC Emails / Manage CC Emails
- [x] Announcements broadcast (+ banner and notifications)
- [x] Custom Fields (shown on new ticket form and ticket page)
- [x] Knowledge Base: Categories, Subcategories, Articles + FAQs; Help Center for everyone
- [x] End-to-end test: customer → AI (n8n) → escalation → agent takeover → customer

## AI drafts + secure attachments + agent notifications (file-4 brief)
- [x] AI "Draft Reply with AI" for staff: KB suggestions/search/select, grounded draft via AI Gateway, edit, manual send, draft audit
- [x] Attachments: server-validated upload (content sniffing, size, type) with progress; no direct client uploads
- [x] Attachments: server-checked short-lived preview/download links (image/PDF/text preview, otherwise download) + access audit
- [x] Close storage path spoofing hole (attachment rows must match their ticket folder)
- [x] Agent notifications: New Ticket Assigned / Customer Replied / Urgent Ticket wording, read timestamp, indexes, polling fallback
- [x] Notification history pagination; conversation "load earlier" pagination
- [x] E2E: AI draft → edit → send; customer/agent attachments + unauthorized blocked; assignment/reply/urgent notifications

## UI refresh + messenger chat (file-6)
- [x] Login logo centered/larger, light panel
- [x] Light admin/agent sidebars + dashboard boxes, hover animations
- [x] Messenger-style chat (queue when offline, type-to-start, day separators, new-message pill)
- [x] Login: transparent logo above form (input width), centered heading/subtitle (file-7)

## file-10/11 brief (SMS support desk changes)
- [x] Profile: company name + company website URL
- [x] Help Center help line +880 (180) 599-1950
- [x] Activity logs split: customer vs admin/agent, filter by customer
- [x] Username login (admin-issued usernames/passwords, no self sign-up, Google removed) + forgot password → 6-digit code on admin dashboard, 2-min validity
- [x] Replace manual priority with auto Level 1–4 (SLA decision tree) + confirmation message on new ticket
- [ ] Send the ticket confirmation as a real email (blocked: needs an email domain set up)
- [x] Admin Mail section (fixed From/To, attachments, Drive links, replies, reply-time labels fast/on time/late)
- [ ] Mail: real sending + automatic inbound replies (blocked: needs the tech.support mailbox connected)
- [x] Notifications split chat/ticket/email/account + popup + sound
- [x] Remove "Add CC Emails" + "Manage CC Emails" from admin menu (file-12)
- [x] Reports + admin dashboard: line graph above pie chart
- [x] Background with brand line art (no QR, border or text)

## Auth & email notification brief (file-2)
- [x] First-time setup: verify company email by code, then new password; enforced in the database
- [x] Forgot password: 6-digit code to verified company email (2 min, single use, 5 tries, 1/min, 5/hour)
- [x] Login + password-changed alerts; sign-in/setup/reset/email audit log with filters
- [x] First Super Admin form on an empty database
- [ ] Send real emails as Ritorica (blocked: user must set up ritorica.com.bd as the email domain; then wire Lovable Emails, send test, test OTP/login/password alerts)

## Security review, no regressions (file-11 / attachment-2)
- [x] Baseline: tests, types, build, security scan
- [x] Limit permission list, role-permission map and settings to the people who use them
- [x] Fill the empty permission list (list restored; which role gets what is ticked by the Super Admin on the Permissions page)
- [ ] Mark the safe "everyone can read" findings (custom fields, departments, categories, ticket files) as accepted (blocked: user approval)
