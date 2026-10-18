import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  getLocalNotifications,
  createLocalNotification,
  markLocalNotificationRead,
  type NotificationRecord,
} from "./notifications.server";

export const getNotificationsListFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      userId: z.string().optional(),
      role: z.string().optional(),
      category: z.string().optional(),
      limit: z.number().default(20),
    }).parse(d),
  )
  .handler(async ({ data }): Promise<{ items: NotificationRecord[]; unread: number }> => {
    let list = getLocalNotifications(data.userId, data.role);
    if (data.category && data.category !== "all") {
      list = list.filter((n) => {
        if (data.category === "ticket") return !!n.ticket_id || n.type === "ticket";
        if (data.category === "chat") return !!n.chat_id || n.type.startsWith("chat");
        if (data.category === "email") return n.type === "email" || n.type.includes("mail");
        if (data.category === "account") return n.type === "account" || n.type.includes("password");
        return true;
      });
    }
    const unread = list.filter((n) => !n.is_read).length;
    return {
      items: list.slice(0, data.limit),
      unread,
    };
  });

export const markNotificationReadFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      id: z.string().optional(),
      userId: z.string().optional(),
    }).parse(d),
  )
  .handler(async ({ data }): Promise<{ success: boolean }> => {
    markLocalNotificationRead(data.id, data.userId);
    return { success: true };
  });

export const sendNotificationFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      user_id: z.string().optional(),
      target_role: z.enum(["admin", "agent", "customer", "all"]).optional(),
      type: z.string(),
      title: z.string(),
      message: z.string(),
      ticket_id: z.string().nullable().optional(),
      chat_id: z.string().nullable().optional(),
      ticket: z.object({
        ticket_number: z.string(),
        subject: z.string(),
      }).nullable().optional(),
    }).parse(d),
  )
  .handler(async ({ data }): Promise<NotificationRecord> => {
    const notif = createLocalNotification({
      user_id: data.user_id,
      target_role: data.target_role,
      type: data.type,
      title: data.title,
      message: data.message,
      ticket_id: data.ticket_id,
      chat_id: data.chat_id,
      ticket: data.ticket,
    });
    return notif;
  });
