import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        version: '1.0.0',
        features: {
            aiAssistant: true,
            smartCompose: true,
            exportFormats: ['html', 'markdown', 'txt'],
            contextMenu: true
        },
        theme: {
            primaryColor: '#7C3AED',
            fontFamily: 'Inter, system-ui, sans-serif',
            dark: false
        }
    });
} 