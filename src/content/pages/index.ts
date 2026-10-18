import type { PageGroup, RichPage } from "./types";
import { page as smsMailing } from "./products-sms-mailing";
import { page as pushPlatform } from "./products-push-platform";
import { page as chatPlatform } from "./products-chat-platform";
import { page as cascaded } from "./products-cascaded-messaging";
import { page as verifyOtp } from "./products-verify-otp";
import { page as smsChannel } from "./channels-sms";
import { page as whatsapp } from "./channels-whatsapp-business";
import { page as appPush } from "./channels-app-push";
import { page as telegram } from "./channels-telegram-gateway";
import { page as viberBusiness } from "./channels-viber-business";
import { page as email } from "./channels-email-business";
import { page as viberBots } from "./channels-viber-bots";
import { page as industrySolutions } from "./solutions-industry-solutions";
import { page as useCases } from "./solutions-use-cases";
import { page as blog } from "./resources-blog";
import { page as caseStudies } from "./resources-case-studies";
import { page as guides } from "./resources-guides";
import { page as apiDocs } from "./developers-api-docs";
import { page as integrationGuides } from "./developers-integration-guides";

export type { RichPage, PageGroup } from "./types";

export const richPages: RichPage[] = [
  smsMailing, pushPlatform, chatPlatform, cascaded, verifyOtp,
  smsChannel, whatsapp, appPush, telegram, viberBusiness, email, viberBots,
  industrySolutions, useCases,
  blog, caseStudies, guides,
  apiDocs, integrationGuides,
];

export const getRichPage = (group: PageGroup, slug: string) => richPages.find((p) => p.group === group && p.slug === slug);

export const richPagePath = (p: Pick<RichPage, "group" | "slug">) => `/${p.group}/${p.slug}`;

export const groupLabel: Record<PageGroup, { en: string; bn: string }> = {
  products: { en: "Products", bn: "প্রোডাক্ট" },
  channels: { en: "Channels", bn: "চ্যানেল" },
  solutions: { en: "Solutions", bn: "সমাধান" },
  resources: { en: "Resources", bn: "রিসোর্স" },
  developers: { en: "Developers", bn: "ডেভেলপার" },
};
