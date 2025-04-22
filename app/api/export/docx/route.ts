import { NextRequest, NextResponse } from 'next/server';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx';
import { JSDOM } from 'jsdom';

export async function POST(request: NextRequest) {
    try {
        const { content, fileName, title } = await request.json();

        if (!content) {
            return NextResponse.json({ error: 'No content provided' }, { status: 400 });
        }

        // Parse HTML content
        const dom = new JSDOM(content);
        const elements = dom.window.document.body.children;
        const docElements: (Paragraph | Table)[] = [];

        // Add title if provided
        if (title) {
            docElements.push(
                new Paragraph({
                    text: title,
                    heading: HeadingLevel.HEADING_1,
                    spacing: {
                        after: 200,
                    },
                })
            );
        }

        // Process each HTML element
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            processElement(element, docElements);
        }

        // Create a new DOCX document with our processed elements
        const doc = new Document({
            sections: [{
                children: docElements,
            }],
            title: title || 'Document',
            description: 'Exported from Typhoon Document Helper',
        });

        // Generate the document buffer
        const buffer = await Packer.toBuffer(doc);

        // Return the document as a downloadable file
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': `attachment; filename="${fileName || 'document'}.docx"`
            }
        });
    } catch (error) {
        console.error('Error generating DOCX:', error);
        return NextResponse.json({ error: 'Failed to generate DOCX' }, { status: 500 });
    }
}

function processElement(element: Element, docElements: (Paragraph | Table)[]) {
    const tagName = element.tagName.toLowerCase();

    switch (tagName) {
        case 'h1':
            docElements.push(createHeading(element.textContent || '', HeadingLevel.HEADING_1));
            break;
        case 'h2':
            docElements.push(createHeading(element.textContent || '', HeadingLevel.HEADING_2));
            break;
        case 'h3':
            docElements.push(createHeading(element.textContent || '', HeadingLevel.HEADING_3));
            break;
        case 'h4':
            docElements.push(createHeading(element.textContent || '', HeadingLevel.HEADING_4));
            break;
        case 'h5':
        case 'h6':
            docElements.push(createHeading(element.textContent || '', HeadingLevel.HEADING_5));
            break;
        case 'p':
            docElements.push(createParagraph(element));
            break;
        case 'ul':
            processListItems(element, docElements, '•');
            break;
        case 'ol':
            processListItems(element, docElements);
            break;
        case 'blockquote':
            processBlockquote(element, docElements);
            break;
        case 'table':
            processTable(element, docElements);
            break;
        default:
            // For div or other container elements, process their children
            if (element.children.length > 0) {
                for (let i = 0; i < element.children.length; i++) {
                    processElement(element.children[i], docElements);
                }
            } else if (element.textContent?.trim()) {
                // If it has text content but no recognized tag, treat as paragraph
                docElements.push(new Paragraph({ text: element.textContent }));
            }
            break;
    }
}

function createHeading(text: string, level: typeof HeadingLevel[keyof typeof HeadingLevel]): Paragraph {
    return new Paragraph({
        text,
        heading: level,
        spacing: {
            before: 240,
            after: 120,
        },
    });
}

function createParagraph(element: Element): Paragraph {
    const children = element.childNodes;
    const runs: TextRun[] = [];

    for (let i = 0; i < children.length; i++) {
        const child = children[i];

        if (child.nodeType === 3) { // Text node
            runs.push(new TextRun({ text: child.textContent || '' }));
        } else if (child.nodeType === 1) { // Element node
            const childElement = child as Element;
            const tagName = childElement.tagName.toLowerCase();

            switch (tagName) {
                case 'strong':
                case 'b':
                    runs.push(new TextRun({ text: childElement.textContent || '', bold: true }));
                    break;
                case 'em':
                case 'i':
                    runs.push(new TextRun({ text: childElement.textContent || '', italics: true }));
                    break;
                case 'u':
                    runs.push(new TextRun({ text: childElement.textContent || '', underline: {} }));
                    break;
                case 'code':
                    runs.push(new TextRun({
                        text: childElement.textContent || '',
                        font: 'Courier New'
                    }));
                    break;
                default:
                    runs.push(new TextRun({ text: childElement.textContent || '' }));
                    break;
            }
        }
    }

    return new Paragraph({ children: runs });
}

function processListItems(element: Element, docElements: (Paragraph | Table)[], bulletChar?: string) {
    const items = element.querySelectorAll('li');
    let counter = 1;

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const prefix = bulletChar || `${counter++}.`;

        docElements.push(
            new Paragraph({
                text: `${prefix} ${item.textContent}`,
                indent: { left: 720 }, // ~0.5 inch indent
                spacing: { before: 100, after: 100 },
            })
        );
    }
}

function processBlockquote(element: Element, docElements: (Paragraph | Table)[]) {
    const content = element.textContent || '';
    docElements.push(
        new Paragraph({
            text: content,
            indent: { left: 720 },
            border: {
                left: { color: '#CCCCCC', size: 4, style: BorderStyle.SINGLE }
            },
            spacing: { before: 200, after: 200 },
        })
    );
}

function processTable(element: Element, docElements: (Paragraph | Table)[]) {
    const rows = element.querySelectorAll('tr');
    const tableRows: TableRow[] = [];

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.querySelectorAll('td, th');
        const tableCells: TableCell[] = [];

        for (let j = 0; j < cells.length; j++) {
            const cell = cells[j];
            const isHeader = cell.tagName.toLowerCase() === 'th';

            tableCells.push(
                new TableCell({
                    children: [new Paragraph({ text: cell.textContent || '' })],
                    shading: isHeader ? { color: 'EEEEEE' } : undefined,
                })
            );
        }

        tableRows.push(new TableRow({ children: tableCells }));
    }

    if (tableRows.length > 0) {
        docElements.push(
            new Table({
                rows: tableRows,
                width: { size: 100, type: WidthType.PERCENTAGE },
            })
        );
    }
} 