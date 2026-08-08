/**
 * DhanAI Multi-Provider AI Engine
 * Supports: Google Gemini, OpenAI (ChatGPT), Anthropic (Claude), Local AI (Ollama/LM Studio), and Local Offline Rule Engine.
 * Features: LRU Response Caching, Cooldown Rate-Limiting, Zero-Cost Rule Fallback.
 */

export type AIProvider = 'auto' | 'gemini' | 'openai' | 'claude' | 'local' | 'offline';

type AIRequestOptions = {
  provider?: AIProvider;
  prompt: string;
  systemPrompt?: string;
  userKey?: string;
};

type ProviderStatus = {
  name: string;
  key: string;
  configured: boolean;
  status: 'ACTIVE' | 'STANDBY' | 'NOT_CONFIGURED';
};

// In-Memory Response Cache (TTL 10 minutes to eliminate duplicate API calls)
const responseCache = new Map<string, { response: string; timestamp: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000;

// Rate Limiter: Track call timestamps per user (Max 5 cloud API calls per minute)
const userCallTimestamps = new Map<string, number[]>();
const MAX_CALLS_PER_MINUTE = 5;

function getCacheKey(prompt: string, systemPrompt?: string): string {
  const raw = `${systemPrompt || ''}::${prompt}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }
  return `ai_cache_${hash}`;
}

function isRateLimited(userKey: string): boolean {
  const now = Date.now();
  const timestamps = userCallTimestamps.get(userKey) || [];
  const validTimestamps = timestamps.filter((ts) => now - ts < 60000);
  userCallTimestamps.set(userKey, validTimestamps);
  return validTimestamps.length >= MAX_CALLS_PER_MINUTE;
}

function recordCall(userKey: string) {
  const now = Date.now();
  const timestamps = userCallTimestamps.get(userKey) || [];
  timestamps.push(now);
  userCallTimestamps.set(userKey, timestamps);
}

// 1. Google Gemini Provider
async function callGemini(prompt: string, systemPrompt?: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt }
          ]
        }
      ]
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini API returned empty response');
  return text;
}

// 2. OpenAI (ChatGPT) Provider
async function callOpenAI(prompt: string, systemPrompt?: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not configured');

  const messages: any[] = [];
  if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
  messages.push({ role: 'user', content: prompt });

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages,
      max_tokens: 1000,
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('OpenAI API returned empty response');
  return text;
}

// 3. Anthropic (Claude) Provider
async function callClaude(prompt: string, systemPrompt?: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-3-haiku-20240307',
      max_tokens: 1000,
      system: systemPrompt || undefined,
      messages: [{ role: 'user', content: prompt }],
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Claude API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const text = data.content?.[0]?.text;
  if (!text) throw new Error('Claude API returned empty response');
  return text;
}

// 4. Local AI Provider (Ollama / LocalAI / LM Studio OpenAI-compatible endpoint)
async function callLocalAI(prompt: string, systemPrompt?: string): Promise<string> {
  const baseUrl = process.env.LOCAL_AI_BASE_URL || 'http://localhost:11434/v1';
  const model = process.env.LOCAL_AI_MODEL || 'llama3';

  const messages: any[] = [];
  if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
  messages.push({ role: 'user', content: prompt });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout for local AI

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 1000,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Local AI error ${res.status}`);
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error('Local AI returned empty response');
    return text;
  } catch (err: any) {
    clearTimeout(timeoutId);
    throw new Error(`Local AI unreachable at ${baseUrl}: ${err.message}`);
  }
}

// Main Dispatcher Function
export async function queryMultiAI(options: AIRequestOptions): Promise<{ response: string; providerUsed: string; cached: boolean }> {
  const { prompt, systemPrompt, provider = 'auto', userKey = 'default_user' } = options;

  // 1. Check Response Cache
  const cacheKey = getCacheKey(prompt, systemPrompt);
  const cached = responseCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return { response: cached.response, providerUsed: 'Cache', cached: true };
  }

  // 2. Check Rate Limiting for Cloud Calls
  const userLimited = isRateLimited(userKey);

  // If specific provider requested:
  if (provider === 'gemini') {
    try {
      if (userLimited) throw new Error('Rate limit exceeded');
      const res = await callGemini(prompt, systemPrompt);
      recordCall(userKey);
      responseCache.set(cacheKey, { response: res, timestamp: Date.now() });
      return { response: res, providerUsed: 'Google Gemini', cached: false };
    } catch (e: any) {
      console.warn('Gemini failed:', e.message);
    }
  }

  if (provider === 'openai') {
    try {
      if (userLimited) throw new Error('Rate limit exceeded');
      const res = await callOpenAI(prompt, systemPrompt);
      recordCall(userKey);
      responseCache.set(cacheKey, { response: res, timestamp: Date.now() });
      return { response: res, providerUsed: 'ChatGPT (OpenAI)', cached: false };
    } catch (e: any) {
      console.warn('OpenAI failed:', e.message);
    }
  }

  if (provider === 'claude') {
    try {
      if (userLimited) throw new Error('Rate limit exceeded');
      const res = await callClaude(prompt, systemPrompt);
      recordCall(userKey);
      responseCache.set(cacheKey, { response: res, timestamp: Date.now() });
      return { response: res, providerUsed: 'Anthropic Claude', cached: false };
    } catch (e: any) {
      console.warn('Claude failed:', e.message);
    }
  }

  if (provider === 'local') {
    try {
      const res = await callLocalAI(prompt, systemPrompt);
      responseCache.set(cacheKey, { response: res, timestamp: Date.now() });
      return { response: res, providerUsed: 'Local AI (Ollama)', cached: false };
    } catch (e: any) {
      console.warn('Local AI failed:', e.message);
    }
  }

  // Auto Fallback Cascade Order: Local AI -> Gemini -> OpenAI -> Claude -> Offline Rules
  if (!userLimited) {
    // Try Local AI first if configured
    if (process.env.LOCAL_AI_BASE_URL) {
      try {
        const res = await callLocalAI(prompt, systemPrompt);
        responseCache.set(cacheKey, { response: res, timestamp: Date.now() });
        return { response: res, providerUsed: 'Local AI (Ollama)', cached: false };
      } catch {}
    }

    // Try Gemini
    if (process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY) {
      try {
        const res = await callGemini(prompt, systemPrompt);
        recordCall(userKey);
        responseCache.set(cacheKey, { response: res, timestamp: Date.now() });
        return { response: res, providerUsed: 'Google Gemini', cached: false };
      } catch (e: any) {
        console.warn('Auto Gemini fallback failed:', e.message);
      }
    }

    // Try OpenAI
    if (process.env.OPENAI_API_KEY) {
      try {
        const res = await callOpenAI(prompt, systemPrompt);
        recordCall(userKey);
        responseCache.set(cacheKey, { response: res, timestamp: Date.now() });
        return { response: res, providerUsed: 'ChatGPT (OpenAI)', cached: false };
      } catch (e: any) {
        console.warn('Auto OpenAI fallback failed:', e.message);
      }
    }

    // Try Claude
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const res = await callClaude(prompt, systemPrompt);
        recordCall(userKey);
        responseCache.set(cacheKey, { response: res, timestamp: Date.now() });
        return { response: res, providerUsed: 'Anthropic Claude', cached: false };
      } catch (e: any) {
        console.warn('Auto Claude fallback failed:', e.message);
      }
    }
  }

  // Guaranteed Zero-Cost Local Rule-based Fallback
  const fallbackAdvice = `[DhanAI Autonomous Guidance]: Always maintain 6-month liquid reserves first. Prioritize high-interest EMI debt reduction, maximize 80C/80D tax deductions, and allocate monthly surplus into goal-linked mutual fund SIPs.`;
  responseCache.set(cacheKey, { response: fallbackAdvice, timestamp: Date.now() });
  return { response: fallbackAdvice, providerUsed: 'Local Offline Engine (Zero Cost)', cached: false };
}

// Get Active AI Provider Statuses for Admin Diagnostic View
export function getAIProviderStatuses(): ProviderStatus[] {
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const claudeKey = process.env.ANTHROPIC_API_KEY;
  const localUrl = process.env.LOCAL_AI_BASE_URL;

  return [
    {
      name: 'Google Gemini',
      key: 'GEMINI_API_KEY',
      configured: !!geminiKey,
      status: geminiKey ? 'ACTIVE' : 'NOT_CONFIGURED',
    },
    {
      name: 'ChatGPT (OpenAI)',
      key: 'OPENAI_API_KEY',
      configured: !!openaiKey,
      status: openaiKey ? 'ACTIVE' : 'NOT_CONFIGURED',
    },
    {
      name: 'Anthropic Claude',
      key: 'ANTHROPIC_API_KEY',
      configured: !!claudeKey,
      status: claudeKey ? 'ACTIVE' : 'NOT_CONFIGURED',
    },
    {
      name: 'Local AI (Ollama / LM Studio)',
      key: 'LOCAL_AI_BASE_URL',
      configured: !!localUrl,
      status: localUrl ? 'ACTIVE' : 'STANDBY',
    },
    {
      name: 'Local Offline Rule Engine',
      key: 'BUILTIN',
      configured: true,
      status: 'ACTIVE',
    },
  ];
}
