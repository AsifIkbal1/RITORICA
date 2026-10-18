/**
 * Ritorica Information Technology Bangladesh Limited
 * AI Support Ticket Priority Classification Engine
 *
 * Implements PMBOK 6th Ed. principles (Risk, Quality, Scope, Communications, Stakeholder Management)
 * combined with Ritorica's Official Service Level Agreement (SLA):
 *   - P1 (Critical / Urgent): Complete messaging service outage (Portal, API, SMPP down or all operators down). Response: 30m, Resolution: 2h, 24/7.
 *   - P2 (High): Operator delivery stopped or DLRs missing for >= 15 minutes. Response: 60m, 24/7.
 *   - P3 (Medium): Partial platform malfunction while message transmission is operational. Response: 90m, Resolution: 8h.
 *   - P4 (Low): Routine questions, Sender ID configuration, general inquiries. Response: 120m, Resolution: 3 days.
 *
 * Safety rules: Never classifies based purely on words like "urgent" or "emergency".
 * Fully supports English, Bengali (বাংলা), and Banglish.
 */

export type AiClassificationResult = {
  problem_category: string;
  affected_service: string;
  business_impact: string;
  service_availability_status: string;
  problem_duration: string | null;
  incident_priority: "urgent" | "high" | "medium" | "low" | "UNDETERMINED";
  sla_code: "P1" | "P2" | "P3" | "P4" | "UNDETERMINED";
  classification_status: "CLASSIFIED" | "NEEDS_REVIEW";
  classification_reason: string;
  required_support_action: string;
  response_target_minutes: number | null;
  resolution_target: string | null;
  support_availability: string;
};

export const AI_CLASSIFICATION_SYSTEM_PROMPT = `# ROLE: AI Support Ticket Priority Classification Engine

You are an AI-powered Support Ticket Classification Assistant for Ritorica Information Technology Bangladesh Limited.
Your responsibility is to analyze incoming customer support tickets and automatically recommend the appropriate priority based on the company's Service Level Agreement (SLA).

Your classification methodology must incorporate relevant principles from the PMBOK Guide, Sixth Edition, including:
- Risk Management
- Quality Management
- Scope Management
- Communications Management
- Stakeholder Management

The PMBOK Guide provides management principles, while the Ritorica SLA defines the actual incident priority criteria.

## 1. OFFICIAL SLA PRIORITY CLASSIFICATION
- P1 — CRITICAL (urgent): Complete messaging service outage for the customer. Cannot submit messages through any interface (Customer Portal, HTTP API, SMPP) OR messages not delivered to any mobile operator. Response Target: 30 minutes. Resolution: 2 hours. Support: 24/7.
- P2 — HIGH (high): Complete message non-delivery to one or more mobile operators for at least 15 minutes OR missing DLRs for at least 15 minutes. Response Target: 60 minutes. Support: 24/7.
- P3 — MEDIUM (medium): Customer Portal or internal messaging platform partial malfunction while message transmission is still operational. Response Target: 90 minutes. Resolution: 8 business hours.
- P4 — LOW (low): Routine configuration questions, general technical inquiries, minor functionality requests (e.g. Sender ID configuration). Response Target: 120 minutes. Resolution: 3 business days.

## 2. IMPORTANT SAFETY AND ACCURACY RULES
- Never assign priority based only on words like "urgent", "ASAP" or "emergency".
- Classify tickets based on actual service impact, not emotional wording.
- A failed OTP for one recipient does NOT establish a P1 incident.
- Preserve customer's technical meaning in Bangla, English or Banglish.
- Return valid JSON only with keys: problem_category, affected_service, business_impact, service_availability_status, problem_duration, incident_priority ("urgent"|"high"|"medium"|"low"|"UNDETERMINED"), sla_code ("P1"|"P2"|"P3"|"P4"|"UNDETERMINED"), classification_status ("CLASSIFIED"|"NEEDS_REVIEW"), classification_reason, required_support_action, response_target_minutes, resolution_target, support_availability.`;

/**
 * Robust local classification engine implementing the complete SLA & PMBOK decision rules.
 * Handles English, Bengali, and Banglish input with strict safety guardrails.
 */
export function classifyTicketLocally(subject: string, description: string): AiClassificationResult {
  // Convert Bengali numerals to ASCII digits and normalize text
  const normalizeBengaliDigits = (s: string) =>
    s.replace(/[০-৯]/g, (d) => String("০১২৩৪৫৬৭৮৯".indexOf(d)));

  const text = `${subject} ${description}`.toLowerCase();
  const normalizedText = normalizeBengaliDigits(text);

  // Helper patterns
  const has = (patterns: (string | RegExp)[]) =>
    patterns.some((p) =>
      typeof p === "string"
        ? text.includes(p) || normalizedText.includes(p)
        : p.test(text) || p.test(normalizedText)
    );

  // Extract duration if mentioned
  let detectedDuration: string | null = null;
  const durationMatch = normalizedText.match(/(\d+)\s*(min|minute|minutes|মিনিট|ঘণ্টা|ঘন্টা|hour|hours|ghonta|m|h)/i);
  if (durationMatch) {
    detectedDuration = durationMatch[0];
  }

  // Operator mentions
  const mentionsOperator = has([
    "grameenphone", "gp", "robi", "banglalink", "bl", "teletalk", "airtel",
    "অপারেটর", "গ্রামীনফোন", "গ্রামীণফোন", "রবি", "বাংলালিংক", "টেলিটক", "জিপি"
  ]);

  // Interfaces
  const mentionsPortal = has(["portal", "dashboard", "ওয়েবসাইট", "web"]);
  const mentionsApi = has(["api", "http", "https", "endpoint", "webhook"]);
  const mentionsSmpp = has(["smpp", "smsc", "bind"]);
  const mentionsDlr = has(["dlr", "delivery report", "delivery receipt", "status report", "রিপোর্ট আসছে না"]);

  // -------------------------------------------------------------
  // STEP 4: CHECK P1 — CRITICAL
  // Criteria: Complete messaging outage, cannot send through ANY interface, or zero delivery across all operators
  // -------------------------------------------------------------
  const isCompleteOutage =
    has([
      "entire sms system is down",
      "complete messaging service outage",
      "puro system down",
      "puro system bondho",
      "all messages failing",
      "no messages can be sent",
      "zero delivery",
      "kono message jacche na",
      "kono operator e jacche na",
      "all operators down",
      "gateway fully down",
      "full outage",
      "completely down",
      "sms bondho hoye ache",
      "সম্পূর্ণ সিস্টেম ডাউন",
      "কোনো মেসেজ যাচ্ছে না",
      "সব মেসেজ ফেইল"
    ]) ||
    ((mentionsPortal || mentionsApi || mentionsSmpp) &&
      has(["all down", "totally down", "shut down", "completely broken", "unable to send any message", "সব বন্ধ"]));

  // SAFETY RULE: Single OTP failure is NOT P1
  const isSingleRecipientIssue = has([
    "single number", "one number", "one recipient", "ekta number", "1ta number",
    "one user", "single otp failed", "amar number e ashe nai"
  ]);

  if (isCompleteOutage && !isSingleRecipientIssue) {
    return {
      problem_category: "Outage / Availability",
      affected_service: "Core Messaging Pipeline (Portal, API, SMPP)",
      business_impact: "Critical — Complete halt of customer messaging capabilities across all channels.",
      service_availability_status: "Complete Service Outage",
      problem_duration: detectedDuration || "Ongoing",
      incident_priority: "urgent",
      sla_code: "P1",
      classification_status: "CLASSIFIED",
      classification_reason:
        "Evidence indicates complete messaging service outage where messages cannot be transmitted or delivered to mobile operators across enabled interfaces.",
      required_support_action:
        "Trigger P1 critical incident protocol. Notify Tier-3 NOC & Engineering immediately. Response SLA: 30 minutes, Resolution target: 2 hours.",
      response_target_minutes: 30,
      resolution_target: "2 hours",
      support_availability: "24/7 Priority Support",
    };
  }

  // -------------------------------------------------------------
  // STEP 5: CHECK P2 — HIGH
  // Criteria: Message non-delivery to one/more operators for >= 15 min OR DLRs missing for >= 15 min
  // -------------------------------------------------------------
  const durationMinutes = (() => {
    if (!durationMatch) return null;
    const num = parseInt(durationMatch[1], 10);
    const unit = durationMatch[2].toLowerCase();
    if (unit.startsWith("h") || unit.includes("ঘণ্টা") || unit.includes("ঘন্টা") || unit.includes("ghonta")) return num * 60;
    return num;
  })();

  const isOperatorDeliveryDown =
    mentionsOperator &&
    has([
      "stopped", "down", "not delivering", "message failed", "failed to deliver",
      "delivery stopped", "jacche na", "bondho", "dhore jacche na", "failed",
      "ডেলিভারি হচ্ছে না", "ডেলিভারি সমস্যা", "ডেলিভারি বন্ধ", "মেসেজ ডেলিভারি হচ্ছে না"
    ]);

  const isDlrDown =
    mentionsDlr &&
    has(["missing", "not received", "stopped", "no dlr", "ashe na", "pacchina", "delay", "not updated"]);

  const hasFifteenMinEvidence = durationMinutes !== null ? durationMinutes >= 15 : has(["15 min", "20 min", "30 min", "45 min", "1 hour", "shokal theke", "অনেকক্ষণ", "১৫ মিনিট", "২০ মিনিট", "৩০ মিনিট"]);

  if ((isOperatorDeliveryDown || isDlrDown) && hasFifteenMinEvidence) {
    return {
      problem_category: "Operator Delivery / DLR Status",
      affected_service: isDlrDown ? "Delivery Status Reports (DLR)" : "Mobile Operator Delivery Route",
      business_impact: "High — Messages to specific operator(s) or critical DLR tracking halted for at least 15 minutes.",
      service_availability_status: "Partial Operator Outage",
      problem_duration: detectedDuration || "At least 15 minutes",
      incident_priority: "high",
      sla_code: "P2",
      classification_status: "CLASSIFIED",
      classification_reason:
        "Evidence confirms non-delivery to mobile operator or DLR disruption sustained for at least 15 minutes in accordance with P2 SLA guidelines.",
      required_support_action:
        "Reroute operator traffic to backup SMPP/telecom interconnect. Investigate operator telco bind status. Response SLA: 60 minutes.",
      response_target_minutes: 60,
      resolution_target: "To be confirmed by Service Provider",
      support_availability: "24/7 Support",
    };
  }

  // -------------------------------------------------------------
  // STEP 6: CHECK P3 — MEDIUM
  // Criteria: Partial platform/portal malfunction while message transmission continues
  // -------------------------------------------------------------
  const isPartialPlatformMalfunction =
    has([
      "reporting feature", "report download", "dashboard issue", "analytics",
      "export", "contact upload", "phonebook", "ui issue", "login slow",
      "template update", "display error", "balance display", "recharge history",
      "report asche na", "download hocche na kintu sms jacche",
      "portal e problem", "sms jacche kintu", "partial"
    ]) ||
    (has(["portal", "dashboard"]) && has(["slow", "error", "not loading", "problem", "সমস্যা"]) && !has(["sms bondho", "no sms"]));

  if (isPartialPlatformMalfunction) {
    return {
      problem_category: "Platform / Portal Functionality",
      affected_service: "Customer Portal / Reporting Feature",
      business_impact: "Moderate — Core SMS transmission operational; auxiliary dashboard or analytics feature degraded.",
      service_availability_status: "Partial Degradation (Core Operational)",
      problem_duration: detectedDuration || null,
      incident_priority: "medium",
      sla_code: "P3",
      classification_status: "CLASSIFIED",
      classification_reason:
        "Portal or reporting functionality is partially impaired while core message transmission remains functional (P3 SLA criteria).",
      required_support_action:
        "Investigate reporting service worker and database query latency. Response SLA: 90 minutes. Resolution target: 8 business hours.",
      response_target_minutes: 90,
      resolution_target: "8 business hours",
      support_availability: "Business Hours Support",
    };
  }

  // -------------------------------------------------------------
  // STEP 7: CHECK P4 — LOW
  // Criteria: Routine configuration, general inquiry, Sender ID questions, documentation
  // -------------------------------------------------------------
  const isRoutineOrConfig =
    has([
      "sender id", "senderid", "how to configure", "how to setup", "explain",
      "documentation", "api doc", "sample code", "masking approval",
      "sender id approval", "kivabe korbo", "ki bhabe", "ki kore",
      "new template", "inquiry", "question", "help with configuration",
      "pricing", "recharge kivabe", "জানতে চাই", "কীভাবে"
    ]) ||
    has(["setup", "configure", "guide", "tutorial", "instructions"]);

  if (isRoutineOrConfig) {
    return {
      problem_category: "Configuration / General Inquiry",
      affected_service: "Account Configuration & Technical Inquiries",
      business_impact: "Low — No service degradation. Technical assistance or account management request.",
      service_availability_status: "Service Fully Available",
      problem_duration: null,
      incident_priority: "low",
      sla_code: "P4",
      classification_status: "CLASSIFIED",
      classification_reason:
        "Ticket concerns routine configuration guidance, Sender ID procedures, or documentation request with no service outage.",
      required_support_action:
        "Provide configuration instructions, relevant knowledge base article, or route to account management. Response SLA: 120 minutes.",
      response_target_minutes: 120,
      resolution_target: "3 business days",
      support_availability: "Business Hours Support",
    };
  }

  // -------------------------------------------------------------
  // STEP 8: AMBIGUOUS / MISSING FACTS -> NEEDS_REVIEW
  // -------------------------------------------------------------
  const isPurelyEmotional = has(["urgent", "জরুরি", "asap", "emergency", "please help fast", "taratari"]) &&
    !has(["down", "outage", "stopped", "smpp", "api", "operator", "sms", "dlr"]);

  return {
    problem_category: "General Support",
    affected_service: "Customer Inquiries",
    business_impact: isPurelyEmotional ? "Low — Emotional escalation without specified technical impact" : "Low to Moderate",
    service_availability_status: "Undetermined / Normal",
    problem_duration: detectedDuration || null,
    incident_priority: "medium",
    sla_code: "P3",
    classification_status: isPurelyEmotional ? "NEEDS_REVIEW" : "CLASSIFIED",
    classification_reason: isPurelyEmotional
      ? "Customer requested urgent handling but did not provide technical impact evidence. Priority assigned to P3 pending manual agent assessment."
      : "Standard technical support inquiry evaluated against Ritorica SLA criteria.",
    required_support_action:
      "Review ticket details with customer to clarify specific service impact and adjust priority if evidence warrants.",
    response_target_minutes: 90,
    resolution_target: "8 business hours",
    support_availability: "Business Hours Support",
  };
}

/**
 * Main AI Classification Runner:
 * Evaluates ticket with optional AI gateway/n8n integration, and falls back seamlessly
 * to the deterministic PMBOK & Ritorica SLA local classifier.
 */
export async function classifySupportTicket(subject: string, description: string): Promise<AiClassificationResult> {
  const localResult = classifyTicketLocally(subject, description);

  // If an external LLM / n8n is configured, attempt intelligent classification
  try {
    const fs = (await import("node:fs")).default;
    const path = (await import("node:path")).default;
    const cfgPath = path.resolve(process.cwd(), "data", "chat_config.json");
    if (fs.existsSync(cfgPath)) {
      const cfg = JSON.parse(fs.readFileSync(cfgPath, "utf-8"));
      if (cfg.n8n_webhook_url && cfg.ai_enabled) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(cfg.n8n_webhook_url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "classify_ticket",
            subject,
            description,
            system_prompt: AI_CLASSIFICATION_SYSTEM_PROMPT,
          }),
          signal: controller.signal,
        });
        clearTimeout(timer);
        if (res.ok) {
          const json = await res.json();
          if (json && json.sla_code && json.incident_priority) {
            return {
              ...localResult,
              ...json,
            };
          }
        }
      }
    }
  } catch {
    // Graceful fallback to verified local PMBOK SLA engine
  }

  return localResult;
}
