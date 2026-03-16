export async function POST(request) {
  try {
    const { image, mimeType, notes } = await request.json();

    const prompt = notes
      ? `Analiza esta comida y estima las calorías. El usuario indica: "${notes}". Responde SOLO en JSON con este formato exacto sin markdown: {"descripcion":"nombre del plato","ingredientes":[{"nombre":"ingrediente","cantidad":"cantidad estimada","kcal":numero}],"total_kcal":numero,"notas":"observaciones breves"}`
      : `Analiza esta comida y estima las calorías. Responde SOLO en JSON con este formato exacto sin markdown: {"descripcion":"nombre del plato","ingredientes":[{"nombre":"ingrediente","cantidad":"cantidad estimada","kcal":numero}],"total_kcal":numero,"notas":"observaciones breves"}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mimeType, data: image } },
            { type: "text", text: prompt }
          ]
        }]
      })
    });

    const data = await response.json();
    const text = data.content[0].text.replace(/```json|```/g, "").trim();
    const result = JSON.parse(text);
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: "Error analizando la imagen" }, { status: 500 });
  }
}
