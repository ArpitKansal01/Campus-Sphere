import { NextResponse, NextRequest } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { authenticateRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const auth = await authenticateRequest(req);
    if (auth.error) {
      return NextResponse.json({ message: auth.error }, { status: 401 });
    }

    const { message, category, history } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      console.error('Missing Gemini API key');
      return NextResponse.json(
        { response: 'Server configuration error.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // Build a system prompt depending on the category
    let systemPrompt =
      'You are a helpful AI Campus Tutor. Keep your answers concise, friendly, and under 100 words. ';

    switch (category) {
      case 'studies':
        systemPrompt +=
          'Focus on explaining academic topics clearly with short examples.';
        break;
      case 'career':
        systemPrompt +=
          'Provide actionable career guidance, resume feedback, and interview preparation tips.';
        break;
      case 'resources':
        systemPrompt +=
          'Guide students to relevant academic resources, mental health services, or campus help centers.';
        break;
      default:
        systemPrompt +=
          'Assist the user helpfully based on the given question.';
    }

    let fullPrompt = `${systemPrompt}\n\n`;
    if (history?.length) {
      fullPrompt += 'Recent conversation:\n';
      for (const msg of history.slice(-3)) {
        const role = msg.role === 'assistant' ? 'AI Tutor' : 'Student';
        fullPrompt += `${role}: ${msg.content}\n`;
      }
      fullPrompt += '\n';
    }

    fullPrompt += `Student's current question: ${message}\n\n`;
    fullPrompt += "AI Tutor's response (under 100 words):";

    const result = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: fullPrompt,
    });

    return NextResponse.json({ response: result.text });
  } catch (error: any) {
    console.error('AI chat error:', error);
    return NextResponse.json(
      {
        response:
          "I'm having trouble connecting to the AI service right now. Please try again later.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
