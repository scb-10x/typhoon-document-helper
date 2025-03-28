import { NextResponse } from 'next/server';
import axios from 'axios';

const TYPHOON_API_URL = process.env.TYPHOON_API_URL;
const TYPHOON_API_KEY = process.env.TYPHOON_API_KEY;

export async function POST(request: Request) {
    try {
        const { content, _plainText, action, prompt: customPrompt, preserveFormatting } = await request.json();

        if (!TYPHOON_API_URL || !TYPHOON_API_KEY) {
            return NextResponse.json(
                { error: 'Typhoon API configuration is missing' },
                { status: 500 }
            );
        }

        let prompt = '';
        switch (action) {
            case 'proofread':
                prompt = `Please proofread and correct any grammatical or spelling errors in the following text:\n\n${content}`;
                break;
            case 'extend':
                prompt = `Please extend and elaborate on the following text while maintaining its style and tone:\n\n${content}`;
                break;
            case 'summarize':
                prompt = `Please provide a concise summary of the following text:\n\n${content}`;
                break;
            case 'translate':
                prompt = `Please translate the following text to English:\n\n${content}`;
                break;
            case 'custom':
                if (!customPrompt) {
                    return NextResponse.json(
                        { error: 'Custom prompt is required for custom action' },
                        { status: 400 }
                    );
                }
                prompt = customPrompt;
                break;
            default:
                return NextResponse.json(
                    { error: 'Invalid action' },
                    { status: 400 }
                );
        }

        // Configure messages array with optional system message for format preservation
        const messages = [];

        // Add system message if we need to preserve HTML formatting
        if (preserveFormatting) {
            messages.push({
                role: "system",
                content: "You are a specialized text processor that preserves HTML formatting. When modifying text, you MUST keep all HTML tags intact and in the same structure as the input. DO NOT add markdown code blocks, backticks, or additional formatting. Return ONLY valid HTML with the exact same tag structure as the input."
            });
        }

        // Add the user prompt
        messages.push({
            role: "user",
            content: prompt
        });

        const response = await axios.post(
            TYPHOON_API_URL,
            {
                messages: messages,
                model: "typhoon-v2-70b-instruct",
                temperature: 0.7,
                max_tokens: 2048,
            },
            {
                headers: {
                    'Authorization': `Bearer ${TYPHOON_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return NextResponse.json(response.data);
    } catch (error: unknown) {
        const err = error as { message: string; response?: { data?: { error?: string }, status?: number } };
        console.error('Error processing AI request:', err.response?.data || err.message);
        return NextResponse.json(
            { error: err.response?.data?.error || 'Failed to process AI request' },
            { status: err.response?.status || 500 }
        );
    }
} 