export type SentimentAnalysisResult = {
  score: number; // -1.0 to 1.0
  sentiment: "frustrated" | "neutral" | "positive";
  risk_level: "high" | "medium" | "low";
  tone_keywords: string[];
  summary: string;
  recommended_action: string;
};

// High-impact negative/frustration keywords across English, Bengali and Banglish
const FRUSTRATION_KEYWORDS: Record<string, number> = {
  // Bengali
  "কাজ করছে না": 3,
  "কাজ করে না": 3,
  "খুব খারাপ": 3,
  "বাজে": 2,
  "বিরক্ত": 3,
  "হতাশ": 3,
  "ক্ষতি": 3,
  "দেরি": 2,
  "দেরী": 2,
  "সমাধান চাই": 2,
  "কখন ঠিক হবে": 3,
  "লজেন্স": 2,
  "ফালতু": 3,
  "ল্যাগ": 2,
  "সার্ভিস খারাপ": 3,
  "জরুরি": 2,
  "তাড়াতাড়ি": 2,
  "তাড়াতাড়ি": 2,
  "লুট": 3,
  "ভুক্তভোগী": 3,
  "সমস্যা হচ্ছে": 2,
  "বারবার": 2,
  "বন্ধ হয়ে আছে": 3,
  "বন্ধ হয়ে আছে": 3,
  "ডেলিভারি নেই": 3,
  "টাকা কেটেছে": 3,
  "ব্যর্থ": 2,
  "কোন উত্তর নেই": 3,

  // Banglish
  "kaj hocche na": 3,
  "kaj kore na": 3,
  "baje service": 3,
  "birokto": 3,
  "loss hocche": 3,
  "problem solve koren": 2,
  "late hocche": 2,
  "urgent fix lagbe": 3,
  "faulty": 2,
  "khubi biroktikor": 3,
  "kobe thik hobe": 3,
  "dhoka": 3,
  "sms jacche na": 3,
  "delivery hocche na": 3,
  "taka katsen": 3,
  "kono response nai": 3,
  "koto shomoy lagbe": 2,

  // English
  "frustrated": 3,
  "frustrating": 3,
  "disappointed": 3,
  "unacceptable": 3,
  "horrible": 3,
  "terrible": 3,
  "awful": 3,
  "ridiculous": 3,
  "severe impact": 3,
  "business halted": 3,
  "business down": 3,
  "losing customers": 3,
  "losing money": 3,
  "waste of time": 3,
  "escalate immediately": 3,
  "poor service": 3,
  "failed": 2,
  "broken": 2,
  "not working": 2,
  "down again": 3,
  "no reply": 2,
  "ignored": 3,
  "urgent": 2,
  "asap": 2,
};

// Positive / gratitude keywords
const POSITIVE_KEYWORDS: Record<string, number> = {
  // Bengali
  "ধন্যবাদ": 2,
  "ধন্যবাদ ভাই": 2,
  "অনেক ধন্যবাদ": 3,
  "ভালো": 2,
  "ঠিক হয়েছে": 3,
  "ঠিক হয়েছে": 3,
  "থ্যাংকস": 2,
  "দারুণ": 2,
  "অসাধারণ": 3,
  "সহায়তা": 1,
  "কাজ করছে": 2,
  "সমাধান হয়েছে": 3,

  // Banglish
  "dhonnobad": 2,
  "thik hoise": 3,
  "onek valo": 2,
  "thanks": 2,
  "great support": 3,
  "solved": 2,
  "working fine": 3,
  "onek sahajjo": 2,

  // English
  "thank you": 2,
  "thanks": 2,
  "great": 2,
  "awesome": 3,
  "appreciated": 2,
  "working now": 3,
  "kudos": 3,
  "perfect": 3,
  "excellent": 3,
  "fast response": 3,
  "helpful": 2,
};

export function analyzeCustomerSentiment(text: string): SentimentAnalysisResult {
  const normalized = text.toLowerCase();
  const matchedKeywords: string[] = [];

  let negativeScore = 0;
  let positiveScore = 0;

  // Check negative / frustration patterns
  for (const [kw, weight] of Object.entries(FRUSTRATION_KEYWORDS)) {
    if (normalized.includes(kw)) {
      matchedKeywords.push(kw);
      negativeScore += weight;
    }
  }

  // Check positive / satisfaction patterns
  for (const [kw, weight] of Object.entries(POSITIVE_KEYWORDS)) {
    if (normalized.includes(kw)) {
      matchedKeywords.push(kw);
      positiveScore += weight;
    }
  }

  // Check punctuation signals (e.g. "???", "!!!")
  const exclamationCount = (text.match(/!{2,}/g) || []).length;
  const questionCount = (text.match(/\?{2,}/g) || []).length;
  if (exclamationCount > 0) negativeScore += exclamationCount * 1.5;
  if (questionCount > 0) negativeScore += questionCount * 1.0;

  // Check ALL CAPS words (>4 letters)
  const allCapsWords = (text.match(/\b[A-Z]{4,}\b/g) || []).filter(
    (w) => !["HTTP", "SMPP", "BTRC", "MSISDN", "JSON", "REST", "SOAP"].includes(w)
  );
  if (allCapsWords.length > 0) {
    negativeScore += Math.min(allCapsWords.length * 1.5, 4);
    matchedKeywords.push(...allCapsWords);
  }

  // Calculate raw score between -1.0 and +1.0
  const net = positiveScore - negativeScore;
  const maxPossible = Math.max(Math.abs(positiveScore) + Math.abs(negativeScore), 6);
  const score = Math.max(-1.0, Math.min(1.0, Number((net / maxPossible).toFixed(2))));

  let sentiment: "frustrated" | "neutral" | "positive" = "neutral";
  let risk_level: "high" | "medium" | "low" = "low";
  let summary = "Customer sentiment is balanced and technical.";
  let recommended_action = "Provide direct diagnostic details and standard SLA resolution.";

  if (score <= -0.25 || negativeScore >= 4) {
    sentiment = "frustrated";
    risk_level = negativeScore >= 6 ? "high" : "medium";
    summary = "Customer expresses high urgency, irritation, or dissatisfaction with service impact.";
    recommended_action =
      "Acknowledge inconvenience empathetically, avoid technical defensiveness, and provide active timeline updates.";
  } else if (score >= 0.25) {
    sentiment = "positive";
    risk_level = "low";
    summary = "Customer is polite, appreciative, and receptive to support assistance.";
    recommended_action = "Maintain professional courteousness and confirm resolution satisfaction.";
  }

  return {
    score,
    sentiment,
    risk_level,
    tone_keywords: [...new Set(matchedKeywords)].slice(0, 5),
    summary,
    recommended_action,
  };
}
