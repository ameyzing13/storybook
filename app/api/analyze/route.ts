import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'No content provided' },
        { status: 400 }
      );
    }

    const prompt = `As an empathetic friend and life coach, analyze this journal entry and create 6 questions that will help the writer write more and reflect deeper. Each question should be concise and focused on a particular aspect (information gathering, emotion, growth, or action). I'd like 3 short questions on information gathering. Format the response as a JSON array with objects containing 'question' and 'category' fields.

Journal entry:
${content}

Generate questions that are concise, creative, personal, specific to the content (prioritising the latter content more than the earlier). Avoid generic questions. `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const response = JSON.parse(completion.choices[0].message.content);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Error analyzing content' },
      { status: 500 }
    );
  }
} 