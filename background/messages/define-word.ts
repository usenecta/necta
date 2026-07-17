import type { PlasmoMessaging } from "@plasmohq/messaging"
import { client, MODEL } from "../../lib/llm"
import { buildDefinePrompt } from "../../lib/prompts"
import type { DefineWordRequest, DefineWordResponse } from "../../types/necta"

const handler: PlasmoMessaging.MessageHandler<
  DefineWordRequest,
  DefineWordResponse
> = async (req, res) => {
  try {
    const result = await client.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: buildDefinePrompt(req.body!.word) }],
      response_format: { type: "json_object" },
      max_tokens: 500
    })
    const { definicao, exemplo } = JSON.parse(result.choices[0].message.content ?? "{}")
    res.send({ definicao, exemplo })
  } catch (error) {
    console.error("define-word error:", error)
    res.send({ definicao: "Erro ao buscar definição.", exemplo: "" })
  }
}

export default handler
