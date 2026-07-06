// api/openrouter.ts — Vercel Serverless Function (secured)

// ============================================================
// Simple in-memory rate limiter (per Vercel instance)
// Limits each IP to a maximum number of requests per window.
// ============================================================
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10;      // max 10 requests per minute per IP

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

// ============================================================
// Allowed origins — add your Vercel domain(s) here.
// This prevents random websites from calling your API.
// ============================================================
const ALLOWED_ORIGINS: string[] = [
  // Production domain(s)
  "https://craftmit.cleoverly.online",
  // Localhost (development)
  "http://localhost:5173",   // Vite dev server
  "http://localhost:4173",   // Vite preview
  "http://localhost:3000",   // fallback
];

function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGINS.some((allowed) => origin.startsWith(allowed));
}

// ============================================================
// Maximum prompt length to prevent abuse (token stuffing)
// ============================================================
const MAX_PROMPT_LENGTH = 500_000; // characters

// ============================================================
// Handler
// ============================================================
export default async function handler(req: any, res: any) {
  // --- CORS headers ---
  const origin = req.headers?.origin || req.headers?.referer || "";
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (isOriginAllowed(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // --- Only POST allowed ---
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // --- Origin check ---
  if (!isOriginAllowed(origin)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  // --- Rate limiting ---
  const clientIp =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "unknown";

  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: "Too many requests. Please wait a moment." });
  }

  // --- Input validation ---
  const { prompt } = req.body || {};

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "A valid prompt string is required." });
  }

  if (prompt.trim().length === 0) {
    return res.status(400).json({ error: "Prompt cannot be empty." });
  }

  if (prompt.length > MAX_PROMPT_LENGTH) {
    return res.status(400).json({ error: "Prompt is too large." });
  }

  // --- API key check ---
  if (!process.env.OPENROUTER_API_KEY) {
    // Don't reveal internal config details to the client
    console.error("OPENROUTER_API_KEY is not set in environment variables.");
    return res.status(500).json({ error: "AI service is not configured." });
  }

  // --- Call OpenRouter ---
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-3-ultra-550b-a55b:free",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      // Log the real error server-side, send a generic message to the client
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenRouter API error:", response.status, errorData);
      return res.status(502).json({ error: "AI service returned an error. Please try again later." });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    // Never leak internal error messages to the client
    console.error("Server error calling OpenRouter:", error);
    return res.status(500).json({ error: "An internal error occurred. Please try again later." });
  }
}
