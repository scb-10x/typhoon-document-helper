import { LANGUAGE_MAP } from './editorConstants';

/**
 * Unified AI service function for all text transformations (including translation)
 * @param text The text content to transform
 * @param action The action to perform (e.g., 'proofread', 'translate-es')
 * @param options Additional options for the transformation
 * @returns Transformed text
 */
export const aiTextService = async (
    text: string,
    action: string,
    options: {
        selectionText?: string,
        customLanguage?: string,
        preserveFormatting?: boolean
    } = {}
): Promise<string> => {
    // Extract options with defaults
    const {
        selectionText = text,
        customLanguage = '',
        preserveFormatting = true
    } = options;

    // For translation actions, we need to handle differently
    const isTranslation = action === 'translate';

    // If it's a translation request, modify the action to include language code
    if (isTranslation) {
        const lowerLang = customLanguage.toLowerCase();
        action = LANGUAGE_MAP[lowerLang]
            ? `translate-${LANGUAGE_MAP[lowerLang]}`
            : 'translate-other';
    }

    // Prepare request payload for the API
    const requestPayload = {
        // When there's selection, use selectionText as primary content for processing
        // Otherwise use the full HTML
        content: isTranslation || selectionText !== text ? selectionText : text,
        action,
        customLanguage,
        selectionText,
        preserveFormatting
    };

    // Ensure content is a string to prevent API errors
    if (typeof requestPayload.content !== 'string') {
        requestPayload.content = String(requestPayload.content || '');
    }

    // For debugging
    console.log('AI Service Request:', JSON.stringify(requestPayload, null, 2));

    try {
        // Make the API call
        const response = await fetch('/api/ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestPayload),
        });

        // Get response text for better error handling
        const responseText = await response.text();

        if (!response.ok) {
            console.error('API Error Response:', responseText);
            throw new Error(`API request failed with status ${response.status}: ${responseText}`);
        }

        // Parse the response as JSON
        const data = JSON.parse(responseText);
        return data.response;
    } catch (error) {
        console.error('Error in aiTextService:', error);
        throw error;
    }
}; 