export type LookupItem = {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
};

export type LookupsStore = {
  categories: LookupItem[];
  departments: LookupItem[];
};

export const DEFAULT_CATEGORIES: LookupItem[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    name: "General Support",
    description: "General support inquiries, questions, and onboarding assistance",
    is_active: true,
    created_at: "2026-10-18T00:00:00.000Z",
    updated_at: "2026-10-18T00:00:00.000Z",
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    name: "SMS Delivery & Routing",
    description: "Issues related to SMS routing, operator delivery, DLR reports, and OTP delays",
    is_active: true,
    created_at: "2026-10-18T00:00:00.000Z",
    updated_at: "2026-10-18T00:00:00.000Z",
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    name: "Billing & Invoicing",
    description: "Account balance, recharge, payment gateway, invoices, and billing issues",
    is_active: true,
    created_at: "2026-10-18T00:00:00.000Z",
    updated_at: "2026-10-18T00:00:00.000Z",
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    name: "API & Webhook Integration",
    description: "Technical integration, REST API issues, webhook callbacks, and SDK support",
    is_active: true,
    created_at: "2026-10-18T00:00:00.000Z",
    updated_at: "2026-10-18T00:00:00.000Z",
  },
  {
    id: "55555555-5555-4555-8555-555555555555",
    name: "Account & Security",
    description: "Two-factor authentication, email verification, password reset, and access controls",
    is_active: true,
    created_at: "2026-10-18T00:00:00.000Z",
    updated_at: "2026-10-18T00:00:00.000Z",
  },
  {
    id: "66666666-6666-4666-8666-666666666666",
    name: "Technical Support",
    description: "System bugs, platform downtime, and degraded performance",
    is_active: true,
    created_at: "2026-10-18T00:00:00.000Z",
    updated_at: "2026-10-18T00:00:00.000Z",
  },
];

export const DEFAULT_DEPARTMENTS: LookupItem[] = [
  {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    name: "Customer Support",
    description: "First-line customer help, general guidance, and account assistance",
    is_active: true,
    created_at: "2026-10-18T00:00:00.000Z",
    updated_at: "2026-10-18T00:00:00.000Z",
  },
  {
    id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    name: "Technical Support & Engineering",
    description: "Technical issues, API integrations, SMS gateway, and system stability",
    is_active: true,
    created_at: "2026-10-18T00:00:00.000Z",
    updated_at: "2026-10-18T00:00:00.000Z",
  },
  {
    id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    name: "Billing & Accounts",
    description: "Finance, invoices, balance top-ups, and subscription management",
    is_active: true,
    created_at: "2026-10-18T00:00:00.000Z",
    updated_at: "2026-10-18T00:00:00.000Z",
  },
  {
    id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    name: "NOC & Telecom Operations",
    description: "24/7 network operations center, carrier interconnects, and urgent outages",
    is_active: true,
    created_at: "2026-10-18T00:00:00.000Z",
    updated_at: "2026-10-18T00:00:00.000Z",
  },
];
