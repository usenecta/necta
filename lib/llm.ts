import OpenAI from "openai"

export const client = new OpenAI({
  apiKey: process.env.PLASMO_PUBLIC_GITHUB_TOKEN!,
  baseURL: "https://models.github.ai/inference",
  defaultHeaders: {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
  }
})

export const MODEL = "openai/gpt-4o-mini"

export function stripCodeBlocks(text: string): string {
  return text.replace(/^```html?\s*/i, "").replace(/\s*```\s*$/i, "").trim()
}
