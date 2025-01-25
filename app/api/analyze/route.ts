import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { newContent, existingContent } = await request.json();

    if (!newContent) {
      return NextResponse.json(
        { error: 'No content provided' },
        { status: 400 }
      );
    }

    const prompt = `As an empathetic friend and life coach, analyze this journal entry and create 6 questions that will help the writer write more and reflect deeper. Each question should be concise and focused on a particular aspect (information gathering, emotion, growth, or action). I'd like 3 short questions on information gathering.

TIER 1 - Primary Information (Base your questions mainly on this recent content):
${newContent}

TIER 2 - Context (Use this existing content as helpful context):
${existingContent || 'No previous content'}

Create questions that:
1. Primarily focus on exploring and expanding the TIER 1 content
2. Use TIER 2 content to make connections and provide context
3. Are concise, creative, and personal
4. Avoid generic questions
5. Encourage deeper reflection and detail

Format the response as a JSON object with a 'questions' array containing objects with 'question' and 'category' fields.`;

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

    if (!completion.choices[0].message.content) {
      throw new Error('No response from GPT');
    }

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