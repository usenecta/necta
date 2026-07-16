import React from "react"
import { Loader2, X } from "lucide-react"
import type { WordPopupState, WordPopupData } from "../../types/necta"

interface WordPopupProps {
  popup: WordPopupState | null
  popupData: WordPopupData | null
  loadingDef: boolean
  onClose: () => void
}

const WordPopup: React.FC<WordPopupProps> = ({
  popup,
  popupData,
  loadingDef,
  onClose
}) => {
  if (!popup) return null

  const popupWidth = 240
  const gap = 8

  let left = popup.x - popupWidth / 2
  if (left < 8) left = 8
  if (left + popupWidth > window.innerWidth - 8)
    left = window.innerWidth - popupWidth - 8

  let top = popup.y + gap
  let above = false
  if (top + 200 > window.innerHeight) {
    top = popup.y - 200 - gap
    above = true
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ background: "transparent" }}
        onClick={onClose}
      />
      <div
        className="fixed z-50 bg-card shadow-xl rounded-lg overflow-hidden"
        style={{
          width: popupWidth,
          left,
          top,
          borderRadius: "0.5rem"
        }}
      >
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <span className="text-xs font-medium text-foreground">
            {popup.word}
          </span>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={14} />
          </button>
        </div>
        <div className="px-3 py-2">
          {loadingDef ? (
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Loader2 size={14} className="animate-spin" />
              <span>Buscando definição...</span>
            </div>
          ) : popupData ? (
            <>
              <p className="text-xs text-foreground leading-relaxed mb-2">
                {popupData.definicao}
              </p>
              {popupData.exemplo && (
                <div className="bg-amber-50 rounded px-2 py-1.5">
                  <p className="text-xs italic text-amber-800 leading-relaxed">
                    &ldquo;{popupData.exemplo}&rdquo;
                  </p>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </>
  )
}

export default WordPopup
