import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: false,
    theme: {
        extend: {
            colors: {
                purple: {
                    50: 'rgb(var(--primary-purple-50))',
                    100: 'rgb(var(--primary-purple-100))',
                    200: 'rgb(var(--primary-purple-200))',
                    600: 'rgb(var(--primary-purple-600))',
                    700: 'rgb(var(--primary-purple-700))',
                    800: 'rgb(var(--primary-purple-800))',
                },
                success: 'rgb(var(--success))',
                warning: 'rgb(var(--warning))',
                error: 'rgb(var(--error))',
                info: 'rgb(var(--info))',
            },
            typography: {
                DEFAULT: {
                    css: {
                        maxWidth: 'none',
                        color: 'inherit',
                        a: {
                            color: 'rgb(var(--primary-purple-600))',
                            textDecoration: 'none',
                            '&:hover': {
                                color: 'rgb(var(--primary-purple-700))',
                            },
                        },
                        h1: {
                            color: 'inherit',
                        },
                        h2: {
                            color: 'inherit',
                        },
                        h3: {
                            color: 'inherit',
                        },
                        h4: {
                            color: 'inherit',
                        },
                        strong: {
                            color: 'inherit',
                        },
                        code: {
                            color: 'inherit',
                        },
                        pre: {
                            color: 'inherit',
                        },
                    },
                },
            },
            boxShadow: {
                'stripe': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                'stripe-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                'stripe-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
        },
    },
    plugins: [
        typography,
    ],
};

export default config; 