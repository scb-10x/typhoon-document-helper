import { NextRequest, NextResponse } from 'next/server';
import { convert } from 'html-to-markdown';

export async function POST(request: NextRequest) {
    try {
        const { content, fileName, title } = await request.json();

        if (!content) {
            return NextResponse.json({ error: 'No content provided' }, { status: 400 });
        }

        // Convert HTML content to Markdown
        let markdownContent = '';

        // Add title if provided
        if (title) {
            markdownContent += `# ${title}\n\n`;
        }

        // Convert HTML to Markdown
        try {
            const convertedContent = convert(content);
            markdownContent += convertedContent;
        } catch (err) {
            console.warn('Error converting HTML to Markdown, falling back to plain text', err);
            // Fallback to simple HTML tag removal
            markdownContent += content.replace(/<[^>]*>/g, '');
        }

        return new NextResponse(markdownContent, {
            headers: {
                'Content-Type': 'text/markdown',
                'Content-Disposition': `attachment; filename="${fileName || 'document'}.md"`
            }
        });
    } catch (error) {
        console.error('Error generating Markdown:', error);
        return NextResponse.json({ error: 'Failed to generate Markdown' }, { status: 500 });
    }
} 