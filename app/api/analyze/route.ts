import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function getLastNWords(text: string, n: number): { recent: string, previous: string } {
  const words = text.trim().split(/\s+/);
  if (words.length <= n) {
    return { recent: text, previous: '' };
  }
  const recent = words.slice(-n).join(' ');
  const previous = words.slice(0, -n).join(' ');
  return { recent, previous };
}

export async function POST(request: Request) {
  try {
    const { content, contextBalance = 50 } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'No content provided' },
        { status: 400 }
      );
    }

    // If contextBalance is 0, use only last 50 words
    // If contextBalance is 100, use entire content
    // Otherwise, use last 50 words as Tier 1 and rest as Tier 2
    const { recent, previous } = contextBalance === 100 
      ? { recent: content, previous: '' }
      : getLastNWords(content, 50);

    const prompt = `As an empathetic friend and life coach, analyze this journal entry and create 6 questions that will help the writer write more and reflect deeper. 3 questions should be on information gathering. The other three can either be on emotion; or growth; or action.

${contextBalance === 100 
  ? `Analyze the entire journal entry equally:\n${content}`
  : `TIER 1 - Primary Focus (Most recent thoughts):\n${recent}\n\nTIER 2 - Context (Earlier content):\n${previous}`
}

Create questions that:
1. ${contextBalance === 100 
     ? 'Consider the entire content equally'
     : contextBalance === 0
       ? 'Focus only on the most recent content (Tier 1)'
       : 'Balance between recent content and earlier context'
   }
2. Are concise, creative, and personal
3. Avoid generic questions
4. Encourage deeper reflection and detail
5. ${contextBalance > 0 ? 'Make connections across different parts when relevant' : 'Focus on expanding the current thoughts'}

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

    const responseContent = completion.choices[0].message.content;
    if (!responseContent) {
      throw new Error('No response content from GPT');
    }

    const response = JSON.parse(responseContent);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Error analyzing content' },
      { status: 500 }
    );
  }
} 