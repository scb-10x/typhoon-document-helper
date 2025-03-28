import { NextResponse } from 'next/server';
import axios from 'axios';

const TYPHOON_API_URL = process.env.TYPHOON_API_URL || 'https://api.opentyphoon.ai/v1/chat/completions';
const TYPHOON_API_KEY = process.env.TYPHOON_API_KEY;

// Define valid action types to improve type safety
type ActionType = 
    | 'proofread' | 'professional' | 'casual' | 'clarity' | 'concise' 
    | 'extend' | 'summarize' | 'bulletize' | 'action-items' | 'outline' 
    | 'brainstorm' | 'brainstorm-empty' | 'academic' | 'technical' 
    | 'marketing' | 'storytelling'
    | 'format-shorten' | 'format-lengthen' | 'format-professional' | 'format-casual';

// Centralized prompt templates for all AI actions
const PROMPT_TEMPLATES: Record<ActionType, string> = {
    'proofread': 'Proofread the following HTML text, fixing spelling, grammar, and punctuation errors while preserving the original meaning and HTML formatting:',
    'professional': 'Rewrite the following HTML text in a professional, formal tone suitable for business documents, while maintaining all HTML tags and formatting:',
    'casual': 'Rewrite the following HTML text in a casual, conversational tone while preserving all HTML formatting tags:',
    'clarity': 'Improve the clarity of the following HTML text, making it easier to understand while preserving its meaning and HTML formatting:',
    'concise': 'Make the following HTML text more concise without losing important information and preserve all HTML tags and structure:',
    'extend': 'Elaborate and expand on the following HTML text, adding more details and explanation while maintaining the HTML formatting:',
    'summarize': 'Summarize the key points of the following HTML text in a concise way, keeping essential HTML formatting:',
    'bulletize': 'Convert the following HTML text into a bulleted list using proper HTML <ul> and <li> tags, organizing the information into clear, distinct points:',
    'action-items': 'Convert the following HTML text into a list of actionable tasks or action items using proper HTML <ul> and <li> tags:',
    'outline': 'Create a structured outline from the following HTML text, using hierarchical organization and preserve with proper HTML heading tags:',
    'brainstorm': 'Generate creative ideas related to the following HTML text. Return your response in proper HTML format with appropriate tags:',
    'brainstorm-empty': 'Brainstorm creative ideas for a document. Generate 5-7 interesting topics that could be developed into full content. Format your response with proper HTML tags for structure.',
    'academic': 'Rewrite the following HTML text in an academic style, with formal language, precise terminology, and a scholarly tone while preserving all HTML formatting:',
    'technical': 'Rewrite the following HTML text in a technical style, suitable for documentation or technical papers, with clear, precise language while maintaining all HTML formatting:',
    'marketing': 'Rewrite the following HTML text in a persuasive marketing style that engages readers and highlights benefits while preserving all HTML formatting:',
    'storytelling': 'Rewrite the following HTML text in a narrative, storytelling style that engages readers while maintaining all HTML formatting:',
    // Format action templates
    'format-shorten': 'Make this HTML text more concise while preserving key points and maintaining all HTML formatting tags:',
    'format-lengthen': 'Expand on this HTML text while maintaining the same style, tone, and HTML formatting:',
    'format-professional': 'Rewrite this HTML text in a more professional tone, preserving all HTML tags and structure:',
    'format-casual': 'Rewrite this HTML text in a more casual, conversational tone while maintaining all HTML formatting:',
};

// Translation language mapping
const LANGUAGE_MAP: Record<string, string> = {
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'zh': 'Chinese',
    'ja': 'Japanese',
    'ru': 'Russian',
    'ar': 'Arabic',
    'pt': 'Portuguese',
    'it': 'Italian',
};

// Formatting instructions to append to every prompt
const FORMATTING_INSTRUCTIONS = "\n\nIMPORTANT: Your response MUST preserve all HTML formatting exactly as it appears in the input. Do not add markdown, code blocks, or any other syntax. Return valid HTML with the same tag structure as the original content. Do NOT add any additional HTML elements or tags that were not in the original content. Maintain exactly the same HTML structure - only modify the text content inside the existing tags. Output only the response, do not include any other text or comments.\n\n";

interface AIRequestBody {
    content: string;
    plainText: string;
    action: string;
    customLanguage?: string;
    preserveFormatting?: boolean;
}

export async function POST(request: Request) {
    try {
        let { 
            content, 
            action, 
            customLanguage,
            preserveFormatting = true 
        }: AIRequestBody = await request.json();
        content = '<html>' +content.trim() +'</html>'
        

        if (!TYPHOON_API_URL || !TYPHOON_API_KEY) {
            return NextResponse.json(
                { error: 'Typhoon API configuration is missing' },
                { status: 500 }
            );
        }

        // Ensure content is available for most actions
        if (!content && action !== 'brainstorm') {
            return NextResponse.json(
                { error: 'Content is required for this action' },
                { status: 400 }
            );
        }

        // Generate the appropriate prompt based on the action
        let prompt = '';

        // Add formatting instructions to all prompts
        if (preserveFormatting) {
            prompt += FORMATTING_INSTRUCTIONS;
        }
        
        // Handle special case for brainstorm with empty content
        if (action === 'brainstorm' && !content) {
            prompt = PROMPT_TEMPLATES['brainstorm-empty'];
        }
        // Handle translation actions
        else if (action.startsWith('translate-')) {
            const languageCode = action.split('-')[1];
            
            if (languageCode === 'other' && customLanguage) {
                prompt = `Translate the following HTML text to ${customLanguage} while preserving all HTML tags and structure:\n\n${content}`;
            } else if (LANGUAGE_MAP[languageCode]) {
                prompt = `Translate the following HTML text to ${LANGUAGE_MAP[languageCode]} while preserving all HTML tags and structure:\n\n${content}`;
            } else {
                return NextResponse.json(
                    { error: 'Invalid language for translation' },
                    { status: 400 }
                );
            }
        }
        // Handle standard actions from the templates
        else if (action in PROMPT_TEMPLATES) {
            prompt = `${PROMPT_TEMPLATES[action as ActionType]}\n\n${content}`;
        }
        // Handle custom/fallback actions
        else {
            prompt = `${action} the following HTML text while preserving all formatting tags:\n\n${content}`;
        }

        // Configure messages array with optional system message for format preservation
        const messages = [];

        // Add system message if we need to preserve HTML formatting
        if (preserveFormatting) {
            messages.push({
                role: "system",
                content: "You are a specialized text processor that preserves HTML formatting. When modifying text, you MUST keep all HTML tags intact and in the same structure as the input. DO NOT add markdown code blocks, backticks, or additional formatting. DO NOT add any HTML elements that were not in the original content. Return ONLY single HTML with the exact same tag structure as the input even it might not be a valid HTML, only modifying the text content within existing tags."
            });
        }

        // Add the user prompt
        messages.push({
            role: "user",
            content: prompt
        });

        console.log(messages)

        const response = await axios.post(
            TYPHOON_API_URL,
            {
                messages: messages,
                model: "typhoon-v2.1-12b-instruct",
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

        const aiResponse = response.data.choices[0].message.content.replace(/^<html>|<\/html>$/g, '');

        return NextResponse.json({
            response: aiResponse
        });
    } catch (error: unknown) {
        const err = error as { message: string; response?: { data?: { error?: string }, status?: number } };
        console.error('Error processing AI request:', err.response?.data || err.message);
        return NextResponse.json(
            { error: err.response?.data?.error || 'Failed to process AI request' },
            { status: err.response?.status || 500 }
        );
    }
} 