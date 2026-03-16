import type { NextApiRequest, NextApiResponse } from 'next';

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { imageBase64, mimeType = 'image/jpeg' } = req.body;
  if (!imageBase64) return res.status(400).json({ error: 'No image provided' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mimeType, data: imageBase64 } },
            { type: 'text', text: `Analiza esta comida y devuelve SOLO un JSON con este formato exacto, sin explicaciones:
{
  "nombre": "nombre descriptivo del plato",
  "momento": "Desayuno|Almuerzo|Comida|Merienda|Cena|Snack",
  "ingredientes": ["ingrediente1", "ingrediente2"],
  "kcal": número_entero,
  "proteinas": número_en_gramos,
  "carbohidratos": número_en_gramos,
  "grasas": número_en_gramos,
  "notas": "observaciones breves sobre la estimación"
}
Sé preciso con las calorías. Si hay varios platos en la imagen, suma el total.` }
          ]
        }]
      })
    });

    const data = await response.json();
    const text = data.content[0].text;
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    res.status(200).json(parsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error analyzing image' });
  }
}
