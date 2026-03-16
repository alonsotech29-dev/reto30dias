import type { NextApiRequest, NextApiResponse } from 'next';

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { imageBase64, mimeType = 'image/jpeg', notes = '' } = req.body;
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });
  if (!imageBase64) return res.status(400).json({ error: 'No image provided' });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mimeType, data: imageBase64 }
            },
            {
              type: 'text',
              text: `Analiza esta comida y proporciona el conteo calórico. ${notes ? `Nota adicional: ${notes}` : ''}
              
Responde SOLO con un JSON válido con este formato exacto, sin texto adicional:
{
  "nombre": "nombre descriptivo del plato",
  "momento": "Desayuno|Almuerzo|Comida|Merienda|Cena|Snack",
  "kcal": número_entero,
  "desglose": [
    {"ingrediente": "nombre", "cantidad": "cantidad estimada", "kcal": número}
  ],
  "confianza": "alta|media|baja",
  "notas": "observaciones breves"
}`
            }
          ]
        }]
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'API error');

    const text = data.content[0].text.trim();
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const result = JSON.parse(clean);
    res.status(200).json(result);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Analysis failed' });
  }
}
