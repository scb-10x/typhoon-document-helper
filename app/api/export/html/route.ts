import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { content, fileName, title } = await request.json();

    if (!content) {
      return NextResponse.json({ error: 'No content provided' }, { status: 400 });
    }

    // Create a complete HTML document with proper styling
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || 'Exported Document'}</title>
  <style>
    :root {
      --background: #ffffff;
      --foreground: #0f172a;
      --muted: #f1f5f9;
      --muted-foreground: #64748b;
      --border: #e2e8f0;
      --accent: #f8fafc;
    }
    
    @media (prefers-color-scheme: dark) {
      :root {
        --background: #0f172a;
        --foreground: #e2e8f0;
        --muted: #1e293b;
        --muted-foreground: #94a3b8;
        --border: #1e293b;
        --accent: #1e293b;
      }
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: var(--foreground);
      background-color: var(--background);
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    h1, h2, h3, h4, h5, h6 {
      margin-top: 2rem;
      margin-bottom: 1rem;
      font-weight: 600;
      line-height: 1.25;
      color: var(--foreground);
    }
    
    h1 {
      font-size: 2rem;
      border-bottom: 1px solid var(--border);
      padding-bottom: 0.5rem;
    }
    
    h2 {
      font-size: 1.5rem;
    }
    
    h3 {
      font-size: 1.25rem;
    }
    
    p {
      margin-bottom: 1rem;
    }
    
    a {
      color: #3b82f6;
      text-decoration: none;
    }
    
    a:hover {
      text-decoration: underline;
    }
    
    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 
        'Liberation Mono', 'Courier New', monospace;
      font-size: 0.9em;
      background-color: var(--muted);
      padding: 0.2em 0.4em;
      border-radius: 3px;
    }
    
    pre {
      background-color: var(--muted);
      border-radius: 6px;
      padding: 1rem;
      overflow: auto;
      margin-bottom: 1rem;
    }
    
    pre code {
      background-color: transparent;
      padding: 0;
      border-radius: 0;
    }
    
    ul, ol {
      margin-bottom: 1rem;
      padding-left: 2rem;
    }
    
    blockquote {
      margin: 0 0 1rem 0;
      padding: 0.5rem 1rem;
      border-left: 3px solid var(--border);
      color: var(--muted-foreground);
    }
    
    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 1rem;
    }
    
    table, th, td {
      border: 1px solid var(--border);
    }
    
    th, td {
      padding: 0.5rem;
      text-align: left;
    }
  </style>
</head>
<body>
  ${title ? `<h1>${title}</h1>` : ''}
  ${content}
</body>
</html>`;

    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${fileName || 'document'}.html"`
      }
    });
  } catch (error) {
    console.error('Error generating HTML:', error);
    return NextResponse.json({ error: 'Failed to generate HTML' }, { status: 500 });
  }
} 