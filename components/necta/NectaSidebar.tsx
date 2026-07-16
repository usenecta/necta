import React, { useRef, useState, useCallback, useEffect } from "react"
import { sendToBackground } from "@plasmohq/messaging"
import { Loader2, Send } from "lucide-react"
import NectaEditor, { type NectaEditorHandle } from "./NectaEditor"
import NectaLogo from "./NectaLogo"
import WordPopup from "./WordPopup"
import { extractPageContent } from "../../lib/extractContent"
import type {
  NectaStatus,
  WordPopupData,
  WordPopupState,
  FeedEntry,
  SummarizeResponse,
  RefineResponse,
  DefineWordResponse
} from "../../types/necta"

const EMPTY_HTML = "<p></p>"
let idCounter = 0

const NectaSidebar: React.FC = () => {
  const [status, setStatus] = useState<NectaStatus>("idle")
  const [chatInput, setChatInput] = useState("")
  const [entries, setEntries] = useState<FeedEntry[]>([])
  const [popup, setPopup] = useState<WordPopupState | null>(null)
  const [popupData, setPopupData] = useState<WordPopupData | null>(null)
  const [loadingDef, setLoadingDef] = useState(false)

  const feedRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const latestAiRef = useRef<NectaEditorHandle | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [entries, status])

  const handleNecta = useCallback(async () => {
    setStatus("summarizing")
    try {
      const pageText = extractPageContent()
      const { html } = await sendToBackground<
        { pageText: string },
        SummarizeResponse
      >({ name: "summarize", body: { pageText } })
      const entry: FeedEntry = { type: "ai", id: `e-${++idCounter}`, html }
      setEntries((prev) => [...prev, entry])
      setStatus("summary")
    } catch {
      setStatus("error")
    }
  }, [])

  const handleSendChat = useCallback(async () => {
    if (!chatInput.trim()) return
    const instruction = chatInput.trim()
    setChatInput("")

    const userEntry: FeedEntry = {
      type: "user",
      id: `e-${++idCounter}`,
      content: instruction
    }
    setEntries((prev) => [...prev, userEntry])
    setStatus("chatting")

    try {
      const currentHTML = latestAiRef.current?.getHTML() || EMPTY_HTML
      const { html, error } = await sendToBackground<
        { instruction: string; currentHTML: string },
        RefineResponse
      >({ name: "refine", body: { instruction, currentHTML } })

      if (error) {
        const errEntry: FeedEntry = {
          type: "error",
          id: `e-${++idCounter}`,
          content: html
        }
        setEntries((prev) => [...prev, errEntry])
      } else {
        const aiEntry: FeedEntry = {
          type: "ai",
          id: `e-${++idCounter}`,
          html
        }
        setEntries((prev) => [...prev, aiEntry])
      }
    } catch {
      const errEntry: FeedEntry = {
        type: "error",
        id: `e-${++idCounter}`,
        content: "Erro ao processar. Tente novamente."
      }
      setEntries((prev) => [...prev, errEntry])
    }

    setStatus("summary")
  }, [chatInput])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSendChat()
      }
    },
    [handleSendChat]
  )

  const handleWordClick = useCallback(
    async (word: string, x: number, y: number) => {
      setPopup({ word, x, y })
      setLoadingDef(true)
      setPopupData(null)
      try {
        const data = await sendToBackground<
          { word: string },
          DefineWordResponse
        >({ name: "define-word", body: { word } })
        setPopupData(data)
      } catch {
        setPopupData({ definicao: "Erro ao buscar definição.", exemplo: "" })
      } finally {
        setLoadingDef(false)
      }
    },
    []
  )

  const handleStartOver = useCallback(() => {
    setEntries([])
    setStatus("idle")
  }, [])

  const closePopup = useCallback(() => {
    setPopup(null)
    setPopupData(null)
    setLoadingDef(false)
  }, [])

  const lastAiIndex = (() => {
    for (let i = entries.length - 1; i >= 0; i--) {
      if (entries[i].type === "ai") return i
    }
    return -1
  })()

  return (
    <div
      className="flex flex-col h-full bg-background text-foreground"
      style={{ width: 360 }}
    >
      <header className="flex items-center h-12 px-4 border-b border-border shrink-0">
        <NectaLogo size={16} />
        <span
          className="ml-2 text-[13px] font-mono font-medium"
          style={{ fontFamily: "'DM Mono', monospace", letterSpacing: "-0.01em" }}
        >
          Necta
        </span>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden">
        {status === "idle" && <EmptyState />}

        {status === "error" && <ErrorState onRetry={() => setStatus("idle")} />}

        {(status === "summarizing" || status === "summary" || status === "chatting") && (
          <div ref={feedRef} className="flex-1 overflow-y-auto flex flex-col">
            {status === "summarizing" && entries.length === 0 && (
              <div className="flex items-center justify-center h-full px-8 text-center">
                <p className="text-[13.5px] text-muted-foreground">
                  Lendo a página e gerando seu resumo...
                </p>
              </div>
            )}

            {entries.map((entry, i) => {
              if (entry.type === "user") {
                return (
                  <div key={entry.id} className="flex justify-end px-4 py-1.5">
                    <div className="necta-chat-balloon necta-chat-balloon--user px-3 py-2 text-[13px] max-w-[85%] w-fit">
                      {entry.content}
                    </div>
                  </div>
                )
              }

              if (entry.type === "error") {
                return (
                  <div key={entry.id} className="flex justify-start px-4 py-1.5">
                    <div className="necta-chat-balloon necta-chat-balloon--error px-3 py-2 text-[13px] max-w-[85%] w-fit">
                      {entry.content}
                    </div>
                  </div>
                )
              }

              return (
                <div key={entry.id}>
                  <NectaEditor
                    ref={i === lastAiIndex ? latestAiRef : undefined}
                    initialHtml={entry.html}
                    onWordClick={handleWordClick}
                    compact
                  />
                </div>
              )
            })}

            <div ref={bottomRef} />
          </div>
        )}

        {popup && (
          <WordPopup
            popup={popup}
            popupData={popupData}
            loadingDef={loadingDef}
            onClose={closePopup}
          />
        )}
      </main>

      <footer className="px-4 py-4 border-t border-border shrink-0 flex flex-col gap-3">
        {(status === "summary" || status === "chatting") && (
          <>
            <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 transition-colors focus-within:bg-accent">
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Deixe menor, organize em tópicos, traduza..."
                disabled={status === "chatting"}
                rows={1}
                className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground resize-none focus:outline-none leading-normal max-h-20"
              />
              <button
                onClick={handleSendChat}
                disabled={!chatInput.trim() || status === "chatting"}
                className="text-muted-foreground disabled:opacity-25 hover:text-foreground transition-colors shrink-0"
              >
                {status === "chatting" ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>

            <button
              onClick={handleStartOver}
              className="flex items-center justify-center gap-2 w-full h-9 rounded-md bg-accent text-foreground text-[13.5px] font-medium hover:opacity-[0.88] active:scale-[0.985] transition-all"
            >
              <span>Começar do zero</span>
            </button>
          </>
        )}

        {status !== "summary" && status !== "chatting" && (
          <button
            onClick={handleNecta}
            disabled={status === "summarizing"}
            className="flex items-center justify-center gap-2 w-full h-9 rounded-md bg-primary text-primary-foreground text-[13.5px] font-medium hover:opacity-[0.88] active:scale-[0.985] transition-all disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed disabled:hover:opacity-100 disabled:active:scale-100"
          >
            <NectaLogo size={14} />
            <span>Necta</span>
          </button>
        )}
      </footer>
    </div>
  )
}

const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full px-8 text-center">
    <NectaLogo size={28} opacity={0.4} />
    <p className="mt-4 text-[13.5px] font-medium text-foreground">
      Clique em Necta para resumir esta página.
    </p>
    <p
      className="mt-2 text-[12.5px] text-muted-foreground"
      style={{ maxWidth: 220 }}
    >
      O Necta vai ler a página atual e gerar anotações editáveis para você.
    </p>
  </div>
)

const ErrorState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div className="flex flex-col items-center justify-center h-full px-8 text-center">
    <p className="text-[13.5px] text-foreground">
      Algo deu errado. Tente novamente.
    </p>
    <button
      onClick={onRetry}
      className="mt-3 text-[13px] underline text-muted-foreground hover:text-foreground transition-colors"
    >
      Voltar ao início
    </button>
  </div>
)

export default NectaSidebar
