import type { PlasmoMessaging } from "@plasmohq/messaging"
import { client, MODEL, stripCodeBlocks } from "../../lib/llm"
import { buildSummaryPrompt } from "../../lib/prompts"
import type { SummarizeRequest, SummarizeResponse } from "../../types/necta"

const handler: PlasmoMessaging.MessageHandler<
  SummarizeRequest,
  SummarizeResponse
> = async (req, res) => {
  try {
    const result = await client.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: buildSummaryPrompt(req.body!.pageText) }]
    })
    const html = stripCodeBlocks(result.choices[0].message.content ?? "")
    res.send({ html })
  } catch (error) {
    console.error("summarize error:", error)
    res.send({ html: "<p>Erro ao gerar resumo. Tente novamente.</p>" })
  }
}

export default handler
