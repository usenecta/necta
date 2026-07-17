import type { PlasmoMessaging } from "@plasmohq/messaging"
import { client, MODEL, stripCodeBlocks } from "../../lib/llm"
import { buildRefinePrompt } from "../../lib/prompts"
import type { RefineRequest, RefineResponse } from "../../types/necta"

const handler: PlasmoMessaging.MessageHandler<
  RefineRequest,
  RefineResponse
> = async (req, res) => {
  try {
    const result = await client.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: buildRefinePrompt(req.body!.instruction, req.body!.currentHTML) }],
      max_tokens: 4000
    })
    const text = stripCodeBlocks(result.choices[0].message.content ?? "")
    if (text.startsWith("ERROR:")) {
      res.send({ html: text.replace("ERROR:", "").trim(), error: true })
    } else {
      res.send({ html: text })
    }
  } catch (error) {
    console.error("refine error:", error)
    res.send({ html: "Erro ao refinar. Tente novamente.", error: true })
  }
}

export default handler
