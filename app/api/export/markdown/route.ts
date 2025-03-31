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

        // Convert HTML to Markdown with enhanced options
        try {
            const convertOptions = {
                preserveEmptyLines: true,
                headingStyle: 'atx', // Use # style headings
                bulletListMarker: '-', // Use - for bullet lists
                // Ensure specific HTML elements get converted correctly
                selectors: [
                    { selector: 'b, strong', replacement: (content: string) => `**${content}**` },
                    { selector: 'i, em', replacement: (content: string) => `*${content}*` },
                    { selector: 'h1', replacement: (content: string) => `\n# ${content}\n\n` },
                    { selector: 'h2', replacement: (content: string) => `\n## ${content}\n\n` },
                    { selector: 'h3', replacement: (content: string) => `\n### ${content}\n\n` },
                    { selector: 'h4', replacement: (content: string) => `\n#### ${content}\n\n` },
                    { selector: 'h5', replacement: (content: string) => `\n##### ${content}\n\n` },
                    { selector: 'h6', replacement: (content: string) => `\n###### ${content}\n\n` },
                    /* eslint-disable  @typescript-eslint/no-explicit-any */
                    { selector: 'a', replacement: (content: string, node: any) => `[${content}](${node.attrs.href})` },
                    /* eslint-disable  @typescript-eslint/no-explicit-any */
                    { selector: 'img', replacement: (content: string, node: any) => `![${node.attrs.alt || ''}](${node.attrs.src})` },
                    { selector: 'blockquote', replacement: (content: string) => `\n> ${content.trim().replace(/\n/g, '\n> ')}\n\n` },
                    { selector: 'ul', replacement: (content: string) => `\n${content}\n` },
                    { selector: 'ol', replacement: (content: string) => `\n${content}\n` },
                    {
                        selector: 'li', replacement: (content: string, node: any) => {
                            const parent = node.parent;
                            const isOrdered = parent && parent.tagName === 'ol';
                            const prefix = isOrdered ? '1. ' : '- ';
                            return `${prefix}${content.trim()}\n`;
                        }
                    }
                ]
            };

            // Try to use the enhanced conversion first
            try {
                // @ts-expect-error - Ignore type issues with the options
                const convertedContent = convert(content, convertOptions);
                markdownContent += convertedContent;
            } catch (convErr) {
                // If the enhanced conversion fails, fall back to basic conversion
                console.warn('Enhanced conversion failed, falling back to basic conversion', convErr);
                markdownContent += convert(content);
            }
        } catch (err) {
            console.warn('Error converting HTML to Markdown, falling back to manual conversion', err);

            // Manual conversion of common HTML elements
            let htmlContent = content;

            // Replace headings
            htmlContent = htmlContent
                .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
                .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
                .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
                .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
                .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n')
                .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n');

            // Replace emphasis
            htmlContent = htmlContent
                .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
                .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
                .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
                .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
                .replace(/<u[^>]*>(.*?)<\/u>/gi, '__$1__');

            // Replace links
            htmlContent = htmlContent.replace(/<a[^>]*href=["'](.*?)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)');

            // Replace images
            htmlContent = htmlContent.replace(/<img[^>]*src=["'](.*?)["'][^>]*alt=["'](.*?)["'][^>]*\/?>/gi, '![$2]($1)');
            htmlContent = htmlContent.replace(/<img[^>]*alt=["'](.*?)["'][^>]*src=["'](.*?)["'][^>]*\/?>/gi, '![$1]($2)');
            htmlContent = htmlContent.replace(/<img[^>]*src=["'](.*?)["'][^>]*\/?>/gi, '![]($1)');

            // Replace blockquotes - using regular expressions without 's' flag
            htmlContent = htmlContent.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, function (match: string, content: string) {
                const lines = content.split('\n');
                return '\n' + lines.map((line: string) => `> ${line.trim()}`).join('\n') + '\n\n';
            });

            // Replace lists - using regular expressions without 's' flag
            htmlContent = htmlContent.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, function (match: string, content: string) {
                // Replace each list item
                return '\n' + content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n') + '\n';
            });

            htmlContent = htmlContent.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, function (match: string, content: string) {
                // Replace each list item with numbers
                let index = 1;
                return '\n' + content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, function () {
                    return `${index++}. $1\n`;
                }) + '\n';
            });

            // Replace paragraphs
            htmlContent = htmlContent.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n');

            // Replace breaks
            htmlContent = htmlContent.replace(/<br\s*\/?>/gi, '\n');

            // Remove remaining HTML tags
            htmlContent = htmlContent.replace(/<[^>]*>/g, '');

            // Clean up excess whitespace
            htmlContent = htmlContent
                .replace(/\n{3,}/g, '\n\n')  // Replace multiple newlines with just two
                .trim();

            markdownContent += htmlContent;
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