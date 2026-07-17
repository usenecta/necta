export type NectaStatus = "idle" | "summarizing" | "summary" | "chatting" | "editing" | "error"

export interface WordPopupData {
  definicao: string
  exemplo: string
}

export interface WordPopupState {
  word: string
  x: number
  y: number
}

export interface SummarizeRequest {
  pageText: string
}

export interface SummarizeResponse {
  html: string
  truncated?: boolean
}

export interface RefineRequest {
  instruction: string
  currentHTML: string
}

export interface RefineResponse {
  html: string
  error?: boolean
}

export type FeedEntry =
  | { type: "user"; id: string; content: string }
  | { type: "error"; id: string; content: string }
  | { type: "ai"; id: string; html: string }

export interface DefineWordRequest {
  word: string
}

export type DefineWordResponse = WordPopupData
