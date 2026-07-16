export function buildSummaryPrompt(pageText: string): string {
  return `Você é o Necta, um assistente que cria resumos estruturados em HTML.
Resuma o texto abaixo em português, retornando APENAS HTML puro (sem blocos de código markdown).
Use a seguinte estrutura:
- <h2> para o título principal
- <h3> para subtítulos (em maiúsculo, curto)
- <p> para parágrafos
- <ul><li> para listas com bullet (use travessão – como marcador)
- Destaque palavras importantes ou técnicas com <strong>

Texto:
${pageText}`
}

export function buildRefinePrompt(instruction: string, currentHTML: string): string {
  return `Você é o Necta, um assistente que modifica resumos em HTML.
Aplique a seguinte instrução ao conteúdo HTML existente.
- Se conseguir aplicar a instrução, retorne APENAS o HTML modificado (sem blocos de código markdown), mantendo a estrutura de <h2>, <h3>, <p>, <ul><li>.
- Se NÃO conseguir entender ou aplicar a instrução, retorne "ERROR: " seguido de uma mensagem educada explicando que não entendeu.

Instrução: ${instruction}

Conteúdo atual:
${currentHTML}`
}

export function buildDefinePrompt(word: string): string {
  return `Defina a palavra "${word}" em português em 1-2 frases e dê um exemplo de uso.
Responda APENAS com um JSON com os campos "definicao" (string) e "exemplo" (string).`
}
