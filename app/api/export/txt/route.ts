import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { content, fileName, title } = await request.json();

        if (!content) {
            return NextResponse.json({ error: 'No content provided' }, { status: 400 });
        }

        // Process the HTML content to create plain text
        let plainText = '';

        // Add title if provided
        if (title) {
            plainText += `${title}\n${'='.repeat(title.length)}\n\n`;
        }

        // Convert HTML to plain text
        // This is a simple approach - a more advanced solution would parse the DOM
        const strippedText = content
            // Replace common block elements with newlines
            .replace(/<\/p>/gi, '\n\n')
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/h[1-6]>/gi, '\n\n')
            .replace(/<\/div>/gi, '\n')
            .replace(/<\/li>/gi, '\n')
            // Replace list items with bullets or numbers
            .replace(/<li>/gi, '• ')
            // Strip remaining HTML tags
            .replace(/<[^>]*>/g, '')
            // Decode HTML entities
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            // Normalize whitespace
            .replace(/\n{3,}/g, '\n\n')
            .trim();

        plainText += strippedText;

        return new NextResponse(plainText, {
            headers: {
                'Content-Type': 'text/plain',
                'Content-Disposition': `attachment; filename="${fileName || 'document'}.txt"`
            }
        });
    } catch (error) {
        console.error('Error generating TXT:', error);
        return NextResponse.json({ error: 'Failed to generate TXT' }, { status: 500 });
    }
} 