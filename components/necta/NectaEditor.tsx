import React, { forwardRef, useCallback, useImperativeHandle, useEffect, useRef } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import type { Editor } from "@tiptap/core"
import { Extension } from "@tiptap/core"
import {
  createWordHighlightPlugin,
  type WordClickHandler
} from "./WordHighlightPlugin"

export interface NectaEditorHandle {
  setContent: (html: string) => void
  getHTML: () => string
  clearContent: () => void
  getEditor: () => Editor | null
}

interface NectaEditorProps {
  placeholder?: string
  editable?: boolean
  onUpdate?: (html: string) => void
  onWordClick?: WordClickHandler
  initialHtml?: string
  compact?: boolean
}

const NectaEditor = forwardRef<NectaEditorHandle, NectaEditorProps>(
  ({ placeholder = "", editable = true, onUpdate, onWordClick, initialHtml, compact }, ref) => {
    const initialized = useRef(false)

    const WordHighlight = useCallback(
      () =>
        Extension.create({
          addProseMirrorPlugins() {
            return [createWordHighlightPlugin(onWordClick || (() => {}))]
          }
        }),
      [onWordClick]
    )

    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [2, 3]
          }
        }),
        Placeholder.configure({
          placeholder
        }),
        WordHighlight()
      ],
      editable,
      onUpdate: ({ editor }) => {
        onUpdate?.(editor.getHTML())
      },
      editorProps: {
        attributes: {
          class:
            "prose prose-sm max-w-none focus:outline-none [&_h2]:text-[15px] [&_h2]:font-semibold [&_h2]:tracking-[-0.02em] [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-[10px] [&_h3]:font-semibold [&_h3]:uppercase [&_h3]:tracking-[0.05em] [&_h3]:text-muted-foreground [&_h3]:mt-5 [&_h3]:mb-2 [&_p]:text-[13.5px] [&_p]:leading-[1.75] [&_ul]:list-none [&_ul_li]:text-[13.5px] [&_ul_li]:leading-[1.75] [&_ol]:list-decimal [&_ol_li]:text-[13.5px] [&_ol_li]:leading-[1.75] [&_blockquote]:border-l-2 [&_blockquote]:border-amber-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_pre]:bg-accent [&_pre]:rounded [&_pre]:p-3 [&_pre]:text-xs [&_code]:bg-accent [&_code]:rounded [&_code]:px-1 [&_code]:text-xs",
          style: "white-space: pre-wrap"
        }
      }
    })

    useEffect(() => {
      if (editor && initialHtml && !initialized.current) {
        initialized.current = true
        editor.commands.setContent(initialHtml, { emitUpdate: false })
      }
    }, [editor, initialHtml])

    useImperativeHandle(
      ref,
      () => ({
        setContent: (html: string) => {
          editor?.commands.setContent(html, { emitUpdate: false })
        },
        getHTML: () => editor?.getHTML() || "",
        clearContent: () => {
          editor?.commands.clearContent()
        },
        getEditor: () => editor
      }),
      [editor]
    )

    return (
      <div className={compact ? "px-4 py-2" : "h-full overflow-y-auto px-4 py-3"}>
        <EditorContent editor={editor} />
      </div>
    )
  }
)

NectaEditor.displayName = "NectaEditor"

export default NectaEditor
