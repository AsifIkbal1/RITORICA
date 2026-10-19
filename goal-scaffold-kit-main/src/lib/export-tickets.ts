import { format } from "date-fns";

export function exportTicketsToCsv(tickets: any[], filename?: string): void {
  if (!tickets || tickets.length === 0) return;

  const headers = [
    "Ticket ID",
    "Subject",
    "Customer Name",
    "Customer Email",
    "Customer Phone",
    "Status",
    "Priority",
    "SLA Level",
    "CSAT Rating",
    "Department",
    "Category",
    "Assigned Agent",
    "Created Date",
    "Updated Date",
  ];

  const escapeCsv = (val: any): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = tickets.map((t) => [
    escapeCsv(t.ticket_number || t.id),
    escapeCsv(t.subject),
    escapeCsv(t.customer_name),
    escapeCsv(t.customer_email),
    escapeCsv(t.customer_phone || ""),
    escapeCsv(t.status),
    escapeCsv(t.priority),
    escapeCsv(t.sla_level ? `Level ${t.sla_level}` : "Auto"),
    escapeCsv(t.csat_rating ? `${t.csat_rating}/5 Stars` : "Not rated"),
    escapeCsv(t.department_name || t.department?.name || ""),
    escapeCsv(t.category_name || t.category?.name || ""),
    escapeCsv(t.agent_name || t.assigned_agent?.full_name || "Unassigned"),
    escapeCsv(t.created_at ? format(new Date(t.created_at), "yyyy-MM-dd HH:mm") : ""),
    escapeCsv(t.updated_at ? format(new Date(t.updated_at), "yyyy-MM-dd HH:mm") : ""),
  ]);

  const csvContent =
    "\uFEFF" + // UTF-8 BOM so Excel opens Bengali and Unicode properly
    [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || `ritorica_tickets_export_${format(new Date(), "yyyy-MM-dd")}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
