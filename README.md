# Ritorica Support Portal & AI Priority Classification Engine

An enterprise AI-powered Support Management Platform built for **Ritorica Information Technology Bangladesh Limited**.

## 🌟 Key Features

- **🤖 AI Support Ticket SLA Classification Engine:**
  - Automatic classification of customer tickets based on the **Ritorica SLA** (P1 Critical, P2 High, P3 Medium, P4 Low) and **PMBOK 6th Edition** principles (Risk, Quality, Scope, Communications, Stakeholder Management).
  - Multilingual support: Bengali, English, and Banglish numeral and duration analysis.
  - Strict safety checks: emotional language ("urgent", "জরুরি") without service impact never triggers false P1 escalation.
  - Client priority lockdown: Customers are strictly prohibited from modifying priority; authorized staff and admins retain full oversight.

- **💬 Live Customer Support & n8n Automation:**
  - Real-time customer chat integrated directly with n8n workflow webhook.
  - Custom file and screenshot attachments with strict MIME-type and path traversal security validation.

- **📊 Support Staff Performance & Workload Analytics:**
  - Real-time agent monitoring: Active assigned tickets, open vs. solved ratios.
  - SLA tracking: Average First Response Time (FRT) and Average Resolution Time metrics.

- **📈 Real-Time Website Visitor Tracking:**
  - Live concurrent visitors, daily hits counter, and all-time visitor hit logging on the Admin Dashboard.
  - Debounced tracking with live 5-second polling updates.

- **📚 Knowledge Base & FAQs Management:**
  - Public Help Center for customers to search articles and FAQs.
  - Administrative CRUD controls to create, update, and manage company documentation.

- **🔒 Enterprise Security Hardening:**
  - PBKDF2-SHA512 salted password hashing with timing-safe verification.
  - In-memory brute-force protection with account locking after repeated failed login attempts.
  - Strict role-based authorization for customers, agents, and administrators.
  - HTTP security headers (`X-Content-Type-Options: nosniff`, `X-XSS-Protection`, `Referrer-Policy`).

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or bun

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AsifIkbal1/RITORICA.git
   cd RITORICA
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment Setup:
   Copy `.env.example` to `.env` and fill in your Supabase and SMTP details:
   ```bash
   cp .env.example .env
   ```

4. Run Development Server:
   ```bash
   npm run dev
   ```

---

## 🏛️ SLA Priority Guidelines (Ritorica SLA)

| Priority | Level | Definition | Response Target | Resolution Target |
| :--- | :--- | :--- | :--- | :--- |
| **P1** | **CRITICAL** | Complete messaging service outage; no messages can be submitted via Portal, API, or SMPP to any operator. | 30 Minutes | 2 Hours (24/7) |
| **P2** | **HIGH** | Complete message non-delivery or missing DLRs to one or more mobile operators for at least 15 minutes. | 60 Minutes | Confirmed by Provider (24/7) |
| **P3** | **MEDIUM** | Partial platform malfunction (portal reports, etc.) while message transmission remains operational. | 90 Minutes | 8 Business Hours |
| **P4** | **LOW** | Routine configuration questions, inquiries, and minor requests. | 120 Minutes | 3 Business Days |

---

## 🛡️ License

Private & Confidential - Proprietary to Ritorica Information Technology Bangladesh Limited.
