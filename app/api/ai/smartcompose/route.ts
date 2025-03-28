import { NextResponse } from 'next/server';
import axios from 'axios';

const TYPHOON_API_URL = process.env.TYPHOON_API_URL || 'https://api.opentyphoon.ai/v1/chat/completions';
const TYPHOON_API_KEY = process.env.TYPHOON_API_KEY;

interface SmartComposeRequest {
  context: string;
  maxWords?: number;
}

export async function POST(request: Request) {
  try {
    // Ensure API key is available
    if (!TYPHOON_API_URL || !TYPHOON_API_KEY) {
      return NextResponse.json(
        { error: 'Typhoon API configuration is missing' },
        { status: 500 }
      );
    }

    // Parse the request body
    const { context, maxWords = 5 }: SmartComposeRequest = await request.json();

    // Validate required parameters
    if (!context) {
      return NextResponse.json(
        { error: 'Context is required for prediction' },
        { status: 400 }
      );
    }

    // Create a structured prompt for the AI model
    const prompt = `
      You are a helpful AI assistant providing smart text completion suggestions.
      
      I'm currently typing a document and need a suggestion for what might come next.
      The context of what I've written so far is:
      
      "${context}"
      
      Provide a natural and relevant continuation of this text. 
      Respond with ONLY the suggested text continuation, limited to ${maxWords} words maximum.
      Make sure your suggestion flows naturally from what I've written.
      DO NOT include any other text, explanations, or formatting in your response.
    `;

    // Make API call to the Typhoon AI endpoint
    const response = await axios.post(
      TYPHOON_API_URL,
      {
        messages: [
          {
            role: "system",
            content: "You are an intelligent text completion system that provides natural, contextually appropriate text continuations. Your responses should contain ONLY the suggested text - no explanations, no headers, no additional formatting. also, contain space if it's a seperate word, don't put the quote marks"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: "typhoon-v2.1-12b-instruct",
        temperature: 0.7,
        max_tokens: 8,
      },
      {
        headers: {
          'Authorization': `Bearer ${TYPHOON_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Extract and clean the suggestion
    let suggestion = response.data.choices[0].message.content;
    
    // Return the suggestion
    return NextResponse.json({
      suggestion
    });
  } catch (error: unknown) {
    const err = error as { message: string; response?: { data?: { error?: string }, status?: number } };
    console.error('Error processing smart compose request:', err.response?.data || err.message);
    
    return NextResponse.json(
      { error: err.response?.data?.error || 'Failed to process smart compose request' },
      { status: err.response?.status || 500 }
    );
  }
} 