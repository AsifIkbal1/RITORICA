export type CannedResponseCategory = "general" | "technical" | "billing" | "custom";

export type CannedResponse = {
  id: string;
  title: string;
  shortcut: string; // e.g. "/welcome" or "/smpp-logs"
  category: CannedResponseCategory;
  content: string;
};

export const DEFAULT_CANNED_RESPONSES: CannedResponse[] = [
  {
    id: "cr-welcome",
    title: "Initial Ticket Acknowledgment",
    shortcut: "/welcome",
    category: "general",
    content:
      "Hello {{customer_name}},\n\nThank you for reaching out to Ritorica Support. We have received your inquiry regarding ticket #{{ticket_number}} (\"{{subject}}\").\n\nOur technical support team is currently reviewing your request under our SLA guidelines. We will provide an update as soon as our investigation progresses.\n\nBest regards,\n{{agent_name}}\nRitorica Support Team",
  },
  {
    id: "cr-smpp-logs",
    title: "Request SMPP / API Logs & MSISDNs",
    shortcut: "/smpp-logs",
    category: "technical",
    content:
      "Hello {{customer_name}},\n\nTo assist you with investigating the messaging delivery issue reported in ticket #{{ticket_number}}, could you please provide:\n\n1. Sample recipient phone numbers (MSISDN) with country code (+880...)\n2. Approximate date and timestamps of the failed messages\n3. API request/response payload or SMPP sequence numbers / submit_sm_resp error codes\n\nOnce we receive this information, our engineering team will trace the operator gateway logs immediately.\n\nBest regards,\n{{agent_name}}\nRitorica Technical Support",
  },
  {
    id: "cr-carrier-latency",
    title: "Mobile Operator (MNO) Latency Advisory",
    shortcut: "/mno-delay",
    category: "technical",
    content:
      "Hello {{customer_name}},\n\nWe would like to inform you that our automated monitoring detected a temporary Delivery Receipt (DLR) delay from one of the upstream mobile network operators.\n\nAll outbound message queues have been automatically rerouted through our redundant high-priority direct SMPP routes to maintain deliverability. We are actively tracking the operator resolution.\n\nThank you for your patience.\n\nBest regards,\n{{agent_name}}\nRitorica NOC Team",
  },
  {
    id: "cr-dlt-template",
    title: "BTRC DLT / Content Template Issue",
    shortcut: "/dlt-fix",
    category: "technical",
    content:
      "Hello {{customer_name}},\n\nRegarding ticket #{{ticket_number}}, the message rejection is occurring due to a content template mismatch under BTRC DLT regulatory guidelines.\n\nPlease ensure your message body strictly matches your registered template on the Ritorica Portal, including fixed sender maskings and dynamic variable placeholders.\n\nBest regards,\n{{agent_name}}\nRitorica Compliance Team",
  },
  {
    id: "cr-resolved",
    title: "Issue Resolved Confirmation",
    shortcut: "/resolved",
    category: "general",
    content:
      "Hello {{customer_name}},\n\nWe are pleased to inform you that the issue reported in ticket #{{ticket_number}} has been successfully resolved and verified by our engineering team.\n\nPlease test on your end and let us know if everything is operating as expected. If you have any further questions, feel free to reply directly to this ticket.\n\nBest regards,\n{{agent_name}}\nRitorica Support Team",
  },
  {
    id: "cr-inactive",
    title: "Closing Inactive Ticket Notice",
    shortcut: "/closing",
    category: "general",
    content:
      "Hello {{customer_name}},\n\nAs we have not received a reply regarding our previous update on ticket #{{ticket_number}}, we are marking this ticket as resolved.\n\nIf you still need assistance, simply reply to this ticket at any time and it will automatically reopen.\n\nBest regards,\n{{agent_name}}\nRitorica Support Team",
  },
  {
    id: "cr-billing-balance",
    title: "Low SMS Credit / Top-Up Reminder",
    shortcut: "/low-balance",
    category: "billing",
    content:
      "Hello {{customer_name}},\n\nThis is a friendly reminder that your enterprise messaging wallet balance is approaching the threshold limit. To avoid any service interruptions or OTP queue stalls, please arrange a credit recharge via the portal or bank transfer.\n\nBest regards,\n{{agent_name}}\nRitorica Accounts & Billing",
  },
];

const CUSTOM_CANNED_KEY = "supportdesk_custom_canned_responses";

export function getCustomCannedResponses(): CannedResponse[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_CANNED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomCannedResponse(item: Omit<CannedResponse, "id" | "category">): CannedResponse {
  const custom = getCustomCannedResponses();
  const newItem: CannedResponse = {
    ...item,
    id: `custom-${Date.now()}`,
    category: "custom",
  };
  custom.unshift(newItem);
  if (typeof window !== "undefined") {
    localStorage.setItem(CUSTOM_CANNED_KEY, JSON.stringify(custom));
  }
  return newItem;
}

export function getAllCannedResponses(): CannedResponse[] {
  return [...DEFAULT_CANNED_RESPONSES, ...getCustomCannedResponses()];
}

export function interpolateCannedResponse(
  template: string,
  variables: {
    customer_name?: string;
    ticket_number?: string;
    subject?: string;
    agent_name?: string;
  }
): string {
  return template
    .replace(/\{\{customer_name\}\}/g, variables.customer_name || "Valued Customer")
    .replace(/\{\{ticket_number\}\}/g, variables.ticket_number || "TKT")
    .replace(/\{\{subject\}\}/g, variables.subject || "Support Inquiry")
    .replace(/\{\{agent_name\}\}/g, variables.agent_name || "Support Representative");
}
