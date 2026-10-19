import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  createLocalTicket,
  getLocalTickets,
  updateLocalTicket,
  deleteLocalTicket,
  getLocalTicketMessages,
  getAllLocalTicketMessages,
  addLocalTicketMessage,
  submitLocalCsat,
  escalateLocalTicket,
  mergeLocalTickets,
  addTicketTag,
  removeTicketTag,
  snoozeLocalTicket,
  unsnoozeLocalTicket,
  getOrComputeTicketSentiment,
  type TicketRecord,
} from "./tickets.server";
import { getLookupsServer } from "./lookups.server";
import { getLocalUsers } from "./local-users.server";

export const createTicketFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      customer_id: z.string(),
      customer_name: z.string().optional(),
      subject: z.string().min(4).max(200),
      description: z.string().min(10).max(20000),
      category_id: z.string(),
      department_id: z.string(),
      custom_fields: z.record(z.any()).optional(),
    }).parse(d),
  )
  .handler(async ({ data }): Promise<{ id: string; ticket_number: string }> => {
    let resultId = "";
    let resultNum = "";

    // 1. Run AI Priority Classification Engine based on Ritorica Official SLA & PMBOK
    const { classifySupportTicket } = await import("./ai-priority-classifier.server");
    const aiClassification = await classifySupportTicket(data.subject, data.description);
    const assignedPriority =
      aiClassification.incident_priority !== "UNDETERMINED" ? aiClassification.incident_priority : "medium";

    const customFieldsWithAi = {
      ...(data.custom_fields || {}),
      _ai_classification: aiClassification,
    };

    // 2. Attempt insertion via Supabase
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data: t, error } = await supabase
        .from("tickets")
        .insert({
          customer_id: data.customer_id,
          customer_name: data.customer_name || "Customer",
          subject: data.subject,
          description: data.description,
          category_id: data.category_id,
          department_id: data.department_id,
          ticket_number: "pending",
          priority: assignedPriority as any,
          custom_fields: customFieldsWithAi,
        })
        .select("id, ticket_number")
        .single();

      if (!error && t) {
        resultId = t.id;
        resultNum = t.ticket_number;
      }
    } catch {
      // Supabase RLS error - fallback to local storage
    }

    if (!resultId) {
      // 3. Fallback to server local storage with AI classification
      const local = createLocalTicket({
        customer_id: data.customer_id,
        customer_name: data.customer_name || "Customer",
        subject: data.subject,
        description: data.description,
        category_id: data.category_id,
        department_id: data.department_id,
        priority: assignedPriority,
        custom_fields: customFieldsWithAi,
        ai_classification: aiClassification,
      });
      resultId = local.id;
      resultNum = local.ticket_number;
    }

    // 4. Automatically create an admin notification with SLA classification badge
    try {
      const { createLocalNotification } = await import("./notifications.server");
      createLocalNotification({
        user_id: "00000000-0000-0000-0000-000000000001",
        target_role: "admin",
        type: "ticket",
        title: `[${aiClassification.sla_code} · ${assignedPriority.toUpperCase()}] New Ticket: ${resultNum}`,
        message: `${data.customer_name || "Customer"} submitted: "${data.subject}" (SLA Target: ${aiClassification.response_target_minutes || 90}m)`,
        ticket_id: resultId,
        chat_id: null,
        ticket: { ticket_number: resultNum, subject: data.subject },
      });
    } catch (e) {
      console.error("Failed to create admin notification:", e);
    }

    try {
      const { recordActivityLog } = await import("./activity-logs.server");
      recordActivityLog({
        userId: data.customer_id,
        userName: data.customer_name || "Customer",
        action: "ticket.created",
        entityType: "ticket",
        entityId: resultId,
        description: `Created ticket ${resultNum}: "${data.subject}"`,
        metadata: { ticket_number: resultNum, subject: data.subject },
      });
    } catch {}

    return { id: resultId, ticket_number: resultNum };
  });

export const getTicketsListFn = createServerFn({ method: "GET" })
  .handler(async (): Promise<TicketRecord[]> => {
    return getLocalTickets();
  });

export const getTicketByIdFn = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ data }): Promise<any | null> => {
    const list = getLocalTickets();
    const found = list.find((t) => t.id === data.id);
    if (!found) return null;
    const cats = getLookupsServer("categories");
    const deps = getLookupsServer("departments");
    const cat = cats.find((c) => c.id === found.category_id);
    const dep = deps.find((d) => d.id === found.department_id);
    return {
      ...found,
      customer_name: found.customer_name || "demo_test",
      customer_email: found.customer_email || `${found.customer_name || "demo_test"}@ritorica.invalid`,
      customer_phone: found.customer_phone || "+8801800000000",
      assigned_agent_id: found.assigned_agent_id || null,
      category: cat ? { name: cat.name } : null,
      department: dep ? { name: dep.name } : null,
    };
  });

export const getDashboardStatsFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ days: z.number().default(30) }).parse(d))
  .handler(async ({ data }): Promise<any> => {
    let rpcStats: any = null;
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data: st, error } = await supabase.rpc("dashboard_stats", { _days: data.days });
      if (!error && st && typeof st === "object" && (st as any).total !== undefined) {
        rpcStats = st;
      }
    } catch {}

    const localTickets = getLocalTickets();
    const deps = getLookupsServer("departments");
    const depMap = new Map(deps.map((d) => [d.id, d.name]));

    const OPEN_STATUSES = new Set(["unanswered", "answered", "awaiting_user_reply", "in_progress", "reopened"]);

    const by_status: Record<string, number> = {
      unanswered: 0,
      answered: 0,
      awaiting_user_reply: 0,
      in_progress: 0,
      solved: 0,
      closed: 0,
      reopened: 0,
    };

    const by_priority: Record<string, number> = {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0,
    };

    const depCounts = new Map<string, number>();
    deps.forEach((d) => depCounts.set(d.name, 0));

    const now = Date.now();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayTs = todayStart.getTime();
    const weekTs = now - 7 * 86400000;
    const monthTs = now - 30 * 86400000;

    let today = 0;
    let week = 0;
    let month = 0;
    let urgent_open = 0;
    let high_open = 0;
    let unassigned = 0;

    for (const t of localTickets) {
      const st = t.status || "unanswered";
      by_status[st] = (by_status[st] || 0) + 1;

      const pr = t.priority || "medium";
      by_priority[pr] = (by_priority[pr] || 0) + 1;

      const isOpen = OPEN_STATUSES.has(st);
      if (pr === "urgent" && isOpen) urgent_open++;
      if (pr === "high" && isOpen) high_open++;
      if (!(t as any).assigned_agent_id && isOpen) unassigned++;

      const cTime = new Date(t.created_at).getTime();
      if (!isNaN(cTime)) {
        if (cTime >= todayTs) today++;
        if (cTime >= weekTs) week++;
        if (cTime >= monthTs) month++;
      }

      const depName = depMap.get(t.department_id) || "Support";
      depCounts.set(depName, (depCounts.get(depName) || 0) + 1);
    }

    if (rpcStats) {
      return {
        ...rpcStats,
        total: (rpcStats.total || 0) + localTickets.length,
        urgent_open: (rpcStats.urgent_open || 0) + urgent_open,
        high_open: (rpcStats.high_open || 0) + high_open,
        unassigned: (rpcStats.unassigned || 0) + unassigned,
        today: (rpcStats.today || 0) + today,
        week: (rpcStats.week || 0) + week,
        month: (rpcStats.month || 0) + month,
        by_status: Object.fromEntries(
          Object.keys(by_status).map((k) => [k, (rpcStats.by_status?.[k] || 0) + by_status[k]]),
        ),
        by_priority: Object.fromEntries(
          Object.keys(by_priority).map((k) => [k, (rpcStats.by_priority?.[k] || 0) + by_priority[k]]),
        ),
      };
    }

    // Build trend for the last N days
    const trend: { day: string; count: number }[] = [];
    for (let i = data.days - 1; i >= 0; i--) {
      const d = new Date(now - i * 86400000);
      const dayStr = d.toISOString().slice(0, 10);
      const count = localTickets.filter((t) => t.created_at?.startsWith(dayStr)).length;
      trend.push({ day: dayStr, count });
    }

    const by_department = Array.from(depCounts.entries()).map(([name, count]) => ({ name, count }));

    return {
      total: localTickets.length,
      by_status,
      by_priority,
      urgent_open,
      high_open,
      unassigned,
      today,
      week,
      month,
      trend,
      by_department,
      agents: [
        {
          id: "00000000-0000-0000-0000-000000000002",
          name: "Support Agent",
          assigned: localTickets.filter((t) => (t as any).assigned_agent_id === "00000000-0000-0000-0000-000000000002").length,
          solved: localTickets.filter((t) => t.status === "solved").length,
          open: localTickets.filter((t) => OPEN_STATUSES.has(t.status)).length,
          avg_first_response_ms: null,
        },
      ],
    };
  });

export const updateTicketFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      id: z.string(),
      status: z.string().optional(),
      priority: z.string().optional(),
      assigned_agent_id: z.string().nullable().optional(),
      department_id: z.string().nullable().optional(),
      category_id: z.string().nullable().optional(),
      caller_role: z.string().optional(),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    // Clients/Customers are strictly prohibited from changing ticket priority or assignments
    if (data.caller_role === "customer" && data.priority) {
      throw new Error("Clients are not permitted to change ticket priority.");
    }

    try {
      const { supabase } = await import("@/integrations/supabase/client");
      await supabase.from("tickets").update({
        ...(data.status ? { status: data.status as any } : {}),
        ...(data.priority ? { priority: data.priority as any } : {}),
        ...(data.assigned_agent_id !== undefined ? { assigned_agent_id: data.assigned_agent_id } : {}),
        ...(data.department_id !== undefined ? { department_id: data.department_id } : {}),
        ...(data.category_id !== undefined ? { category_id: data.category_id } : {}),
      }).eq("id", data.id);
    } catch {}

    const updated = updateLocalTicket(data.id, {
      ...(data.status ? { status: data.status } : {}),
      ...(data.priority ? { priority: data.priority } : {}),
      ...(data.assigned_agent_id !== undefined ? { assigned_agent_id: data.assigned_agent_id } : {}),
      ...(data.department_id !== undefined ? { department_id: data.department_id } : {}),
      ...(data.category_id !== undefined ? { category_id: data.category_id } : {}),
    });

    return { success: true, ticket: updated };
  });

export const reclassifyTicketPriorityFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ ticket_id: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const { getLocalTickets, updateLocalTicket } = await import("./tickets.server");
    const { classifySupportTicket } = await import("./ai-priority-classifier.server");
    const tickets = getLocalTickets();
    const t = tickets.find((x) => x.id === data.ticket_id);
    if (!t) throw new Error("Ticket not found");

    const aiResult = await classifySupportTicket(t.subject, t.description);
    const newPriority = aiResult.incident_priority !== "UNDETERMINED" ? aiResult.incident_priority : t.priority;

    try {
      const { supabase } = await import("@/integrations/supabase/client");
      await supabase.from("tickets").update({
        priority: newPriority as any,
        custom_fields: {
          ...((t.custom_fields as any) || {}),
          _ai_classification: aiResult,
        },
      } as any).eq("id", t.id);
    } catch {}

    const updated = updateLocalTicket(t.id, {
      priority: newPriority,
      ai_classification: aiResult,
      custom_fields: {
        ...(t.custom_fields || {}),
        _ai_classification: aiResult,
      },
    });

    return { success: true, ai_classification: aiResult, priority: newPriority, ticket: updated };
  });

export const sendTicketMessageFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      ticket_id: z.string(),
      sender_id: z.string(),
      sender_name: z.string().optional(),
      message: z.string().min(1).max(20000),
      message_type: z.enum(["customer_reply", "agent_reply", "internal_note", "system_event"]),
      after_status: z.string().optional(),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    let msgId = "";
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data: res } = await supabase
        .from("ticket_messages")
        .insert({
          ticket_id: data.ticket_id,
          sender_id: data.sender_id,
          message: data.message,
          message_type: data.message_type,
        })
        .select("id")
        .single();
      if (res?.id) msgId = res.id;
    } catch {}

    const localMsg = addLocalTicketMessage({
      ticket_id: data.ticket_id,
      sender_id: data.sender_id,
      sender_name: data.sender_name,
      message: data.message,
      message_type: data.message_type,
    });
    if (!msgId) msgId = localMsg.id;

    let newStatus = data.after_status;
    if (!newStatus || newStatus === "auto") {
      if (data.message_type === "agent_reply") {
        newStatus = "answered";
      } else if (data.message_type === "customer_reply") {
        newStatus = "unanswered";
      }
    }

    if (newStatus && newStatus !== "auto") {
      updateLocalTicket(data.ticket_id, { status: newStatus });
      try {
        const { supabase } = await import("@/integrations/supabase/client");
        await supabase.from("tickets").update({ status: newStatus as any }).eq("id", data.ticket_id);
      } catch {}
    }

    try {
      const { recordActivityLog } = await import("./activity-logs.server");
      recordActivityLog({
        userId: data.sender_id,
        userName: data.sender_name,
        action: "ticket.replied",
        entityType: "ticket",
        entityId: data.ticket_id,
        description: `${data.sender_name} replied: "${data.message.slice(0, 80)}"`,
        metadata: { message_type: data.message_type },
      });
    } catch {}

    return { success: true, id: msgId };
  });

export const deleteTicketFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ data }) => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      await supabase.from("tickets").delete().eq("id", data.id);
    } catch {}
    deleteLocalTicket(data.id);
    return { success: true };
  });

export const getTicketMessagesFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ ticket_id: z.string() }).parse(d))
  .handler(async ({ data }) => {
    return getLocalTicketMessages(data.ticket_id);
  });

export const getReportStatsFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      from: z.string(),
      to: z.string(),
      bucket: z.string().default("day"),
    }).parse(d),
  )
  .handler(async ({ data }): Promise<any> => {
    const fromDate = new Date(data.from);
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date(data.to);
    toDate.setHours(23, 59, 59, 999);
    const fromTs = fromDate.getTime();
    const toTs = toDate.getTime();

    let rpcStats: any = null;
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data: st, error } = await supabase.rpc("report_stats", {
        _from: fromDate.toISOString(),
        _to: toDate.toISOString(),
        _bucket: data.bucket,
      });
      if (!error && st && typeof st === "object" && (st as any).total !== undefined) {
        rpcStats = st;
      }
    } catch {}

    const localTickets = getLocalTickets();
    const localMessages = getAllLocalTicketMessages();
    const localUsers = getLocalUsers();
    const deps = getLookupsServer("departments");
    const depMap = new Map(deps.map((d) => [d.id, d.name]));

    const ticketsInRange = localTickets.filter((t) => {
      const cTime = new Date(t.created_at).getTime();
      if (isNaN(cTime)) return true;
      return cTime >= fromTs && cTime <= toTs;
    });

    const total = ticketsInRange.length;
    const resolved = ticketsInRange.filter((t) => t.status === "solved" || t.status === "closed").length;

    const firstResponses: number[] = [];
    for (const t of ticketsInRange) {
      const tCreate = new Date(t.created_at).getTime();
      const msgs = localMessages.filter((m) => m.ticket_id === t.id && m.message_type === "agent_reply");
      msgs.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      if (msgs.length > 0) {
        const firstReplyTime = new Date(msgs[0].created_at).getTime();
        const diff = firstReplyTime - tCreate;
        if (diff > 0) firstResponses.push(diff);
      }
    }
    const avg_first_response_ms =
      firstResponses.length > 0 ? Math.round(firstResponses.reduce((a, b) => a + b, 0) / firstResponses.length) : null;

    const resolutionTimes: number[] = [];
    for (const t of ticketsInRange) {
      if (t.status === "solved" || t.status === "closed") {
        const tCreate = new Date(t.created_at).getTime();
        const tUpdate = new Date(t.updated_at).getTime();
        const diff = tUpdate - tCreate;
        if (diff > 0) resolutionTimes.push(diff);
      }
    }
    const avg_resolution_ms =
      resolutionTimes.length > 0
        ? Math.round(resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length)
        : null;

    const volume: { period: string; created: number; resolved: number }[] = [];
    const cur = new Date(fromDate);
    while (cur <= toDate) {
      const dayStr = cur.toISOString().slice(0, 10);
      const createdOnDay = ticketsInRange.filter((t) => t.created_at?.startsWith(dayStr)).length;
      const resolvedOnDay = ticketsInRange.filter(
        (t) => (t.status === "solved" || t.status === "closed") && t.updated_at?.startsWith(dayStr),
      ).length;
      volume.push({
        period: cur.toISOString(),
        created: createdOnDay,
        resolved: resolvedOnDay,
      });
      cur.setDate(cur.getDate() + 1);
    }

    const by_status: Record<string, number> = {
      unanswered: 0,
      answered: 0,
      awaiting_user_reply: 0,
      in_progress: 0,
      solved: 0,
      closed: 0,
      reopened: 0,
    };
    for (const t of ticketsInRange) {
      const s = t.status || "unanswered";
      by_status[s] = (by_status[s] || 0) + 1;
    }

    const by_priority: Record<string, number> = {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0,
    };
    for (const t of ticketsInRange) {
      const p = t.priority || "medium";
      by_priority[p] = (by_priority[p] || 0) + 1;
    }

    const depCountMap = new Map<string, { count: number; solved: number }>();
    deps.forEach((d) => depCountMap.set(d.name, { count: 0, solved: 0 }));
    for (const t of ticketsInRange) {
      const depName = depMap.get(t.department_id) || "Support";
      const existing = depCountMap.get(depName) || { count: 0, solved: 0 };
      existing.count++;
      if (t.status === "solved" || t.status === "closed") existing.solved++;
      depCountMap.set(depName, existing);
    }
    const by_department = Array.from(depCountMap.entries()).map(([name, val]) => ({
      name,
      count: val.count,
      solved: val.solved,
    }));

    const staffUsers = localUsers.filter((u) =>
      u.roles.some((r) => r === "agent" || r === "admin" || r === "super_admin"),
    );
    const agents = staffUsers.map((u) => {
      const repliedTicketIds = new Set(
        localMessages.filter((m) => m.sender_id === u.id && m.message_type === "agent_reply").map((m) => m.ticket_id),
      );
      const relevantTickets = ticketsInRange.filter(
        (t) => t.assigned_agent_id === u.id || (!t.assigned_agent_id && repliedTicketIds.has(t.id)),
      );
      const assigned = relevantTickets.length;
      const solved = relevantTickets.filter((t) => t.status === "solved" || t.status === "closed").length;
      const open = relevantTickets.filter((t) => !["solved", "closed"].includes(t.status)).length;
      const reopened = relevantTickets.filter((t) => t.status === "reopened").length;

      const agentReplies = localMessages.filter((m) => m.sender_id === u.id && m.message_type === "agent_reply");
      const respTimes: number[] = [];
      for (const t of relevantTickets) {
        const tCreate = new Date(t.created_at).getTime();
        const firstReply = agentReplies.find((m) => m.ticket_id === t.id);
        if (firstReply) {
          const diff = new Date(firstReply.created_at).getTime() - tCreate;
          if (diff > 0) respTimes.push(diff);
        }
      }
      const agent_first_response =
        respTimes.length > 0 ? Math.round(respTimes.reduce((a, b) => a + b, 0) / respTimes.length) : null;

      const resTimes: number[] = [];
      for (const t of relevantTickets) {
        if (t.status === "solved" || t.status === "closed") {
          const diff = new Date(t.updated_at).getTime() - new Date(t.created_at).getTime();
          if (diff > 0) resTimes.push(diff);
        }
      }
      const agent_resolution =
        resTimes.length > 0 ? Math.round(resTimes.reduce((a, b) => a + b, 0) / resTimes.length) : null;

      return {
        name: u.full_name || u.username,
        assigned,
        solved,
        open,
        reopened,
        avg_first_response_ms: agent_first_response,
        avg_resolution_ms: agent_resolution,
      };
    }).filter((a) => a.assigned > 0 || staffUsers.length <= 2);

    const custMap = new Map<string, { name: string; email: string; count: number }>();
    for (const t of ticketsInRange) {
      const custId = t.customer_id;
      const user = localUsers.find((u) => u.id === custId);
      const name = t.customer_name || user?.full_name || user?.username || "Customer";
      const email =
        t.customer_email || user?.company_email || user?.email || `${t.customer_name || "customer"}@ritorica.invalid`;
      const key = custId || email;
      const existing = custMap.get(key) || { name, email, count: 0 };
      existing.count++;
      custMap.set(key, existing);
    }
    const customers = Array.from(custMap.values()).sort((a, b) => b.count - a.count);

    if (rpcStats && (rpcStats.total || 0) > 0) {
      return {
        total: (rpcStats.total || 0) + total,
        resolved: (rpcStats.resolved || 0) + resolved,
        avg_first_response_ms: avg_first_response_ms ?? rpcStats.avg_first_response_ms ?? null,
        avg_resolution_ms: avg_resolution_ms ?? rpcStats.avg_resolution_ms ?? null,
        volume: rpcStats.volume?.length ? rpcStats.volume : volume,
        by_status: Object.fromEntries(
          Object.keys(by_status).map((k) => [k, (rpcStats.by_status?.[k] || 0) + by_status[k]]),
        ),
        by_priority: Object.fromEntries(
          Object.keys(by_priority).map((k) => [k, (rpcStats.by_priority?.[k] || 0) + by_priority[k]]),
        ),
        by_department: by_department.length ? by_department : (rpcStats.by_department || []),
        agents: agents.length ? agents : (rpcStats.agents || []),
        customers: customers.length ? customers : (rpcStats.customers || []),
      };
    }

    return {
      total,
      resolved,
      avg_first_response_ms,
      avg_resolution_ms,
      volume,
      by_status,
      by_priority,
      by_department,
      agents,
      customers,
    };
  });

export const getCustomersListFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      q: z.string().optional(),
      page: z.number().default(1),
      size: z.number().default(25),
    }).parse(d),
  )
  .handler(async ({ data }): Promise<any[]> => {
    let rpcList: any[] = [];
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data: rows, error } = await supabase.rpc("customer_list", ({
        _q: data.q || undefined,
        _limit: data.size,
        _offset: (data.page - 1) * data.size,
      } as never));
      if (!error && Array.isArray(rows)) {
        rpcList = rows;
      }
    } catch {}

    const localUsers = getLocalUsers();
    const localTickets = getLocalTickets();

    const customerUsers = localUsers.filter((u) => u.roles.includes("customer"));
    for (const t of localTickets) {
      if (t.customer_id && !customerUsers.some((u) => u.id === t.customer_id)) {
        const found = localUsers.find((u) => u.id === t.customer_id);
        if (found) customerUsers.push(found);
      }
    }

    const localMapped = customerUsers.map((u) => {
      const myTickets = localTickets.filter((t) => t.customer_id === u.id);
      const solved = myTickets.filter((t) => t.status === "solved" || t.status === "closed").length;
      const open = myTickets.filter((t) => !["solved", "closed"].includes(t.status)).length;
      const lastAct = myTickets.length > 0 ? myTickets[0].updated_at : u.last_login_at || u.created_at;

      return {
        id: u.id,
        full_name: u.full_name || u.username,
        email: u.company_email || u.email,
        phone: u.phone || null,
        total: myTickets.length,
        open,
        solved,
        last_activity: lastAct,
        created_at: u.created_at,
        is_active: u.is_active,
        total_count: rpcList.length + customerUsers.length,
      };
    });

    const query = data.q?.toLowerCase().trim();
    const filteredLocal = query
      ? localMapped.filter(
          (c) =>
            c.full_name.toLowerCase().includes(query) ||
            c.email.toLowerCase().includes(query) ||
            (c.phone && c.phone.includes(query)),
        )
      : localMapped;

    const existingIds = new Set(rpcList.map((r) => r.id));
    const combined = [...rpcList];
    for (const item of filteredLocal) {
      if (!existingIds.has(item.id)) {
        combined.push(item);
      }
    }
    return combined;
  });

export const getCustomerDetailsFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ data }): Promise<any> => {
    let profile: any = null;
    let tickets: any[] = [];
    let activity: any[] = [];

    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const [p, t, a] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", data.id).maybeSingle(),
        supabase
          .from("tickets")
          .select("id, ticket_number, subject, status, priority, created_at")
          .eq("customer_id", data.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("ticket_activity")
          .select("id, description, created_at, ticket_id")
          .eq("user_id", data.id)
          .order("created_at", { ascending: false })
          .limit(20),
      ]);
      if (p.data) profile = p.data;
      if (t.data) tickets = t.data;
      if (a.data) activity = a.data;
    } catch {}

    if (!profile) {
      const localUsers = getLocalUsers();
      const u = localUsers.find((x) => x.id === data.id);
      if (u) {
        profile = {
          id: u.id,
          full_name: u.full_name || u.username,
          email: u.company_email || u.email,
          phone: u.phone,
          is_active: u.is_active,
          created_at: u.created_at,
          last_login_at: u.last_login_at,
        };
      }
    }

    const localTickets = getLocalTickets();
    const myLocalTickets = localTickets.filter((t) => t.customer_id === data.id);
    const existingIds = new Set(tickets.map((t) => t.id));
    for (const lt of myLocalTickets) {
      if (!existingIds.has(lt.id)) {
        tickets.push({
          id: lt.id,
          ticket_number: lt.ticket_number,
          subject: lt.subject,
          status: lt.status,
          priority: lt.priority,
          created_at: lt.created_at,
        });
      }
    }

    return { profile, tickets, activity };
  });

export const getAgentsListFn = createServerFn({ method: "GET" })
  .handler(async (): Promise<any[]> => {
    let rpcAgents: any[] = [];
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data: roles } = await supabase.from("user_roles").select("user_id, role").in("role", ["agent", "admin", "super_admin"]);
      const ids = [...new Set((roles ?? []).map((r) => r.user_id))];
      if (ids.length > 0) {
        const { data } = await supabase.from("profiles").select("*").in("id", ids).order("full_name");
        if (data) {
          rpcAgents = data.map((p) => ({ ...p, roles: (roles ?? []).filter((r) => r.user_id === p.id).map((r) => r.role) }));
        }
      }
    } catch {}

    const localUsers = getLocalUsers();
    const localTickets = getLocalTickets();
    const localMessages = getAllLocalTicketMessages();
    const staff = localUsers.filter((u) => u.roles.some((r) => r === "agent" || r === "admin" || r === "super_admin"));

    const mappedStaff = staff.map((u) => {
      const repliedTicketIds = new Set(
        localMessages.filter((m) => m.sender_id === u.id && m.message_type === "agent_reply").map((m) => m.ticket_id),
      );
      const relevantTickets = localTickets.filter(
        (t) => t.assigned_agent_id === u.id || (!t.assigned_agent_id && repliedTicketIds.has(t.id)),
      );
      const assigned = relevantTickets.length;
      const solved = relevantTickets.filter((t) => t.status === "solved" || t.status === "closed").length;
      const open = relevantTickets.filter((t) => !["solved", "closed"].includes(t.status)).length;

      const agentReplies = localMessages.filter((m) => m.sender_id === u.id && m.message_type === "agent_reply");
      const respTimes: number[] = [];
      for (const t of relevantTickets) {
        const tCreate = new Date(t.created_at).getTime();
        const firstReply = agentReplies.find((m) => m.ticket_id === t.id);
        if (firstReply) {
          const diff = new Date(firstReply.created_at).getTime() - tCreate;
          if (diff > 0) respTimes.push(diff);
        }
      }
      const avg_first_response_ms =
        respTimes.length > 0 ? Math.round(respTimes.reduce((a, b) => a + b, 0) / respTimes.length) : null;

      const resTimes: number[] = [];
      for (const t of relevantTickets) {
        if (t.status === "solved" || t.status === "closed") {
          const diff = new Date(t.updated_at).getTime() - new Date(t.created_at).getTime();
          if (diff > 0) resTimes.push(diff);
        }
      }
      const avg_resolution_ms =
        resTimes.length > 0 ? Math.round(resTimes.reduce((a, b) => a + b, 0) / resTimes.length) : null;

      return {
        id: u.id,
        full_name: u.full_name || u.username,
        email: u.company_email || u.email,
        phone: u.phone,
        department_id: u.department_id,
        roles: u.roles,
        is_active: u.is_active,
        created_at: u.created_at,
        last_login_at: u.last_login_at,
        assigned,
        open,
        solved,
        avg_first_response_ms,
        avg_resolution_ms,
      };
    });

    const existingIds = new Set(rpcAgents.map((a) => a.id));
    const combined = [...rpcAgents.map((a) => {
      const match = mappedStaff.find((s) => s.id === a.id);
      return match ? { ...a, ...match } : a;
    })];
    for (const s of mappedStaff) {
      if (!existingIds.has(s.id)) {
        combined.push(s);
      }
    }
    return combined;
  });

export const getAgentDetailsFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ data }): Promise<any> => {
    let profile: any = null;
    let tickets: any[] = [];
    let activity: any[] = [];

    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const [p, t, a] = await Promise.all([
        supabase.from("profiles").select("*, department:departments(name)").eq("id", data.id).maybeSingle(),
        supabase.from("tickets").select("id, ticket_number, subject, status, priority, created_at, reopened_at").eq("assigned_agent_id", data.id).order("created_at", { ascending: false }),
        supabase.from("ticket_activity").select("id, description, created_at, ticket_id").eq("user_id", data.id).order("created_at", { ascending: false }).limit(20),
      ]);
      if (p.data) profile = p.data;
      if (t.data) tickets = t.data;
      if (a.data) activity = a.data;
    } catch {}

    if (!profile) {
      const localUsers = getLocalUsers();
      const u = localUsers.find((x) => x.id === data.id);
      if (u) {
        const deps = getLookupsServer("departments");
        const dep = deps.find((d) => d.id === u.department_id);
        profile = {
          id: u.id,
          full_name: u.full_name || u.username,
          email: u.company_email || u.email,
          phone: u.phone,
          department_id: u.department_id,
          department: dep ? { name: dep.name } : null,
          roles: u.roles,
          is_active: u.is_active,
          created_at: u.created_at,
          last_login_at: u.last_login_at,
        };
      }
    }

    const localTickets = getLocalTickets();
    const localMessages = getAllLocalTicketMessages();
    const myLocalTickets = localTickets.filter(
      (t) => t.assigned_agent_id === data.id || localMessages.some((m) => m.ticket_id === t.id && m.sender_id === data.id && m.message_type === "agent_reply")
    );
    const existingIds = new Set(tickets.map((t) => t.id));
    for (const lt of myLocalTickets) {
      if (!existingIds.has(lt.id)) {
        tickets.push({
          id: lt.id,
          ticket_number: lt.ticket_number,
          subject: lt.subject,
          status: lt.status,
          priority: lt.priority,
          created_at: lt.created_at,
          reopened_at: null,
        });
      }
    }

    const agentReplies = localMessages.filter((m) => m.sender_id === data.id && m.message_type === "agent_reply");
    const respTimes: number[] = [];
    for (const t of myLocalTickets) {
      const tCreate = new Date(t.created_at).getTime();
      const firstReply = agentReplies.find((m) => m.ticket_id === t.id);
      if (firstReply) {
        const diff = new Date(firstReply.created_at).getTime() - tCreate;
        if (diff > 0) respTimes.push(diff);
      }
    }
    const avg_first_response_ms = respTimes.length > 0 ? Math.round(respTimes.reduce((a, b) => a + b, 0) / respTimes.length) : null;

    const resTimes: number[] = [];
    for (const t of myLocalTickets) {
      if (t.status === "solved" || t.status === "closed") {
        const diff = new Date(t.updated_at).getTime() - new Date(t.created_at).getTime();
        if (diff > 0) resTimes.push(diff);
      }
    }
    const avg_resolution_ms = resTimes.length > 0 ? Math.round(resTimes.reduce((a, b) => a + b, 0) / resTimes.length) : null;

    return {
      profile,
      tickets,
      activity,
      stats: {
        assigned: myLocalTickets.length,
        open: myLocalTickets.filter((t) => !["solved", "closed"].includes(t.status)).length,
        solved: myLocalTickets.filter((t) => t.status === "solved" || t.status === "closed").length,
        avg_first_response_ms,
        avg_resolution_ms,
      },
    };
  });

export const submitCsatRatingFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      ticket_id: z.string(),
      rating: z.number().int().min(1).max(5),
      comment: z.string().max(1000).optional(),
      customer_name: z.string().optional(),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      await supabase
        .from("tickets")
        .update({
          custom_fields: {
            csat_rating: data.rating,
            csat_comment: data.comment || "",
            csat_submitted_at: new Date().toISOString(),
          },
        } as any)
        .eq("id", data.ticket_id);
    } catch {}

    const updated = submitLocalCsat(data.ticket_id, data.rating, data.comment);

    try {
      const { recordActivityLog } = await import("./activity-logs.server");
      recordActivityLog({
        userId: "customer",
        userName: data.customer_name || "Customer",
        action: "ticket.csat_submitted",
        entityType: "ticket",
        entityId: data.ticket_id,
        description: `Customer submitted ${data.rating}/5 CSAT feedback: "${data.comment || "No comment"}"`,
        metadata: { rating: data.rating, comment: data.comment },
      });
    } catch {}

    try {
      const { createLocalNotification } = await import("./notifications.server");
      createLocalNotification({
        user_id: "00000000-0000-0000-0000-000000000001",
        target_role: "admin",
        type: "ticket",
        title: `CSAT Rating: ${data.rating}/5 Stars`,
        message: `${data.customer_name || "Customer"} rated ticket #${updated?.ticket_number || data.ticket_id}: ${data.rating}/5 stars.`,
        ticket_id: data.ticket_id,
        chat_id: null,
      });
    } catch {}

    return { success: true, ticket: updated };
  });

export const escalateTicketFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      ticket_id: z.string(),
      reason: z.string().optional(),
      escalated_by: z.string().optional(),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const updated = escalateLocalTicket(data.ticket_id);
    if (!updated) throw new Error("Ticket not found");

    try {
      const { supabase } = await import("@/integrations/supabase/client");
      await supabase
        .from("tickets")
        .update({
          priority: "urgent" as any,
          assigned_agent_id: "00000000-0000-0000-0000-000000000001",
        })
        .eq("id", data.ticket_id);
    } catch {}

    // Add system message
    addLocalTicketMessage({
      ticket_id: data.ticket_id,
      sender_id: "00000000-0000-0000-0000-000000000001",
      sender_name: "SLA Escalation Engine",
      message: `🚨 ESCALATION NOTICE: Ticket #${updated.ticket_number} has been escalated to L1 Urgent priority by ${data.escalated_by || "SLA Engine"}. Reason: ${data.reason || "SLA Target Breach Prevention / Customer Escalation"}. Reassigned to Super Admin team.`,
      message_type: "internal_note",
    });

    try {
      const { recordActivityLog } = await import("./activity-logs.server");
      recordActivityLog({
        userId: "system",
        userName: data.escalated_by || "Support Staff",
        action: "ticket.escalated",
        entityType: "ticket",
        entityId: data.ticket_id,
        description: `Escalated ticket #${updated.ticket_number} to L1 Urgent priority.`,
        metadata: { ticket_number: updated.ticket_number, reason: data.reason },
      });
    } catch {}

    try {
      const { createLocalNotification } = await import("./notifications.server");
      createLocalNotification({
        user_id: "00000000-0000-0000-0000-000000000001",
        target_role: "admin",
        type: "ticket",
        title: `🚨 Urgent Escalation: #${updated.ticket_number}`,
        message: `Ticket #${updated.ticket_number} was escalated to L1 Urgent! Assigned to Super Admin.`,
        ticket_id: data.ticket_id,
        chat_id: null,
      });
    } catch {}

    return { success: true, ticket: updated };
  });

export const mergeTicketsFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      source_ticket_id: z.string(),
      target_ticket_id: z.string(),
      merged_by: z.string().optional(),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    if (data.source_ticket_id === data.target_ticket_id) {
      throw new Error("Cannot merge a ticket into itself.");
    }

    const res = mergeLocalTickets(data.source_ticket_id, data.target_ticket_id, data.merged_by);
    if (!res) throw new Error("One or both tickets could not be found.");

    try {
      const { supabase } = await import("@/integrations/supabase/client");
      await supabase
        .from("tickets")
        .update({
          status: "closed" as any,
          subject: res.source.subject,
        })
        .eq("id", data.source_ticket_id);
    } catch {}

    try {
      const { recordActivityLog } = await import("./activity-logs.server");
      recordActivityLog({
        userId: "system",
        userName: data.merged_by || "Support Agent",
        action: "ticket.merged",
        entityType: "ticket",
        entityId: data.target_ticket_id,
        description: `Merged ticket #${res.source.ticket_number} into #${res.target.ticket_number}`,
        metadata: {
          source_ticket_number: res.source.ticket_number,
          target_ticket_number: res.target.ticket_number,
        },
      });
    } catch {}

    return {
      success: true,
      source: res.source,
      target: res.target,
    };
  });

export const addTicketTagFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      ticket_id: z.string(),
      tag: z.string().min(1).max(50),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const updated = addTicketTag(data.ticket_id, data.tag);
    if (!updated) throw new Error("Ticket not found");
    return { success: true, ticket: updated };
  });

export const removeTicketTagFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      ticket_id: z.string(),
      tag: z.string(),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const updated = removeTicketTag(data.ticket_id, data.tag);
    if (!updated) throw new Error("Ticket not found");
    return { success: true, ticket: updated };
  });

export const snoozeTicketFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      ticket_id: z.string(),
      until_iso: z.string(),
      reason: z.string().optional(),
      snoozed_by: z.string().optional(),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const updated = snoozeLocalTicket(data.ticket_id, data.until_iso, data.reason);
    if (!updated) throw new Error("Ticket not found");

    try {
      const { recordActivityLog } = await import("./activity-logs.server");
      recordActivityLog({
        userId: "system",
        userName: data.snoozed_by || "Support Agent",
        action: "ticket.snoozed",
        entityType: "ticket",
        entityId: data.ticket_id,
        description: `Snoozed ticket #${updated.ticket_number} until ${data.until_iso} (Reason: ${data.reason || "Waiting"})`,
        metadata: { snoozed_until: data.until_iso, reason: data.reason },
      });
    } catch {}

    return { success: true, ticket: updated };
  });

export const unsnoozeTicketFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ ticket_id: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const updated = unsnoozeLocalTicket(data.ticket_id);
    if (!updated) throw new Error("Ticket not found");
    return { success: true, ticket: updated };
  });

export const getTicketSentimentFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ ticket_id: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const result = getOrComputeTicketSentiment(data.ticket_id);
    return { success: true, sentiment: result };
  });


