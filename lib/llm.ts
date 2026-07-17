import OpenAI from "openai"

export const client = new OpenAI({
  apiKey: process.env.PLASMO_PUBLIC_OPENROUTER_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://necta-extension.app",
    "X-Title": "Necta"
  }
})

export const MODEL = "google/gemini-2.5-flash"

export function stripCodeBlocks(text: string): string {
  return text.replace(/^```html?\s*/i, "").replace(/\s*```\s*$/i, "").trim()
}
