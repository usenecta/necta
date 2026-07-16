import { Plugin, PluginKey } from "@tiptap/pm/state"
import { Decoration, DecorationSet } from "@tiptap/pm/view"
import type { EditorView } from "@tiptap/pm/view"

const key = new PluginKey("word-highlight")

export type WordClickHandler = (word: string, x: number, y: number) => void

class HighlightController {
  private currentFrom: number | null = null
  private currentTo: number | null = null
  private currentWord: string | null = null
  private onWordClick: WordClickHandler

  constructor(onWordClick: WordClickHandler) {
    this.onWordClick = onWordClick
  }

  handleMouseUp(view: EditorView) {
    const { state } = view
    const { selection } = state

    if (selection.empty) return

    const { from, to } = selection
    if (to - from <= 1) return

    const selectedText = state.doc.textBetween(from, to).trim()
    if (!selectedText || selectedText.length < 2) return

    this.clearHighlight(view)

    this.currentWord = selectedText
    this.currentFrom = from
    this.currentTo = to

    const deco = Decoration.inline(from, to, {
      class: "necta-word--marked"
    })
    const tr = view.state.tr.setMeta(
      key,
      DecorationSet.create(view.state.doc, [deco])
    )
    view.dispatch(tr)
  }

  handleClick(view: EditorView, event: MouseEvent) {
    const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })
    if (!pos) return

    if (
      this.currentFrom !== null &&
      this.currentTo !== null &&
      pos.pos >= this.currentFrom &&
      pos.pos <= this.currentTo
    ) {
      const word = this.currentWord!
      const x = event.clientX
      const y = event.clientY
      this.clearHighlight(view)
      this.onWordClick(word, x, y)
    }
  }

  private clearHighlight(view: EditorView) {
    const current = key.getState(view.state) as DecorationSet
    if (current && current.find().length > 0) {
      const tr = view.state.tr.setMeta(key, DecorationSet.empty)
      view.dispatch(tr)
    }
    this.currentWord = null
    this.currentFrom = null
    this.currentTo = null
  }
}

export function createWordHighlightPlugin(onWordClick: WordClickHandler) {
  const controller = new HighlightController(onWordClick)

  const plugin = new Plugin({
    key,
    state: {
      init() {
        return DecorationSet.empty
      },
      apply(tr, set: DecorationSet) {
        const meta = tr.getMeta(key)
        if (meta !== undefined) return meta
        return set.map(tr.mapping, tr.doc)
      }
    },
    props: {
      decorations(state) {
        return key.getState(state)
      },
      handleDOMEvents: {
        mouseup: (view) => {
          controller.handleMouseUp(view)
          return false
        },
        click: (view, event) => {
          controller.handleClick(view, event as MouseEvent)
          return false
        }
      }
    }
  })

  return plugin
}
