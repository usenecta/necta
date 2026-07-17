import type { PlasmoMessaging } from "@plasmohq/messaging"
import { client, MODEL, stripCodeBlocks } from "../../lib/llm"
import { buildSummaryPrompt } from "../../lib/prompts"
import type { SummarizeRequest, SummarizeResponse } from "../../types/necta"

const MAX_CHARS = 24000

const handler: PlasmoMessaging.MessageHandler<
  SummarizeRequest,
  SummarizeResponse
> = async (req, res) => {
  try {
    let pageText = req.body!.pageText
    let truncated = pageText.length > MAX_CHARS
    if (truncated) {
      pageText = pageText.slice(0, MAX_CHARS)
    }
    const result = await client.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: buildSummaryPrompt(pageText) }],
      max_tokens: 4000
    })
    const html = stripCodeBlocks(result.choices[0].message.content ?? "")
    res.send({ html, truncated })
  } catch (error) {
    console.error("summarize error:", error)
    res.send({ html: "<p>Erro ao gerar resumo. Tente novamente.</p>" })
  }
}

export default handler
