import OpenAI from 'openai';
import { Origami } from './types';

export async function parseOrigamiInstructions(
  content: string,
  query: string,
  apiKey: string
): Promise<Origami | null> {
  try {
    const openai = new OpenAI({ apiKey });

    const prompt = `You are a helpful assistant that extracts origami instructions from web content.

Given the following web content, extract origami folding instructions and return them in JSON format.

Query: "${query}"

Web Content:
${content.substring(0, 15000)}

Please return a JSON object with this exact structure:
{
  "name": "Name of the origami",
  "difficulty": "easy" | "medium" | "hard",
  "category": "animals" | "toys" | "flowers" | "decorations" | "other",
  "steps": [
    {
      "stepNumber": 1,
      "instruction": "Clear step-by-step instruction",
      "imageUrl": "URL to image if found, or empty string"
    }
  ],
  "sourceUrl": "Original URL",
  "thumbnailUrl": "URL to thumbnail image if found, or empty string"
}

Make the instructions clear and kid-friendly. If you can't find complete instructions, return null.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that extracts and formats origami instructions. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const result = response.choices[0]?.message?.content;
    if (!result) {
      return null;
    }

    const parsed = JSON.parse(result);

    // Generate a unique ID
    const id = `origami-${query.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

    return {
      id,
      ...parsed,
    };
  } catch (error) {
    console.error('Error parsing origami instructions:', error);
    throw error;
  }
}
