declare module 'html-to-markdown' {
    export function convert(html: string): string;
}

declare module 'html2pdf.js' {
    interface Options {
        margin?: number | [number, number, number, number];
        filename?: string;
        image?: { type?: string; quality?: number };
        enableLinks?: boolean;
        html2canvas?: Record<string, unknown>;
        jsPDF?: Record<string, unknown>;
        pagebreak?: Record<string, unknown>;
        format?: string;
        orientation?: 'portrait' | 'landscape';
    }

    function html2pdf(): {
        from(element: HTMLElement | string): {
            set(options: Options): {
                save(): Promise<void>;
                output(type: string, options?: unknown): Promise<unknown>;
                then(callback: (...args: unknown[]) => unknown): unknown;
            };
        };
    };

    export = html2pdf;
} 