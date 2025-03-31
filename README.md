# Typhoon Document Helper

A modern, feature-rich document editor built with Next.js and TipTap. This application provides a powerful WYSIWYG editor with AI-powered features, multilingual support, and various export options.

## Features

- 📝 Rich text editing with TipTap
- 🤖 AI-powered text enhancement and translation
- 🌐 Multilingual support (English and Thai)
- 📤 Multiple export formats (PDF, HTML, Markdown, TXT)
- 🎨 Customizable PDF export settings
- 📱 Responsive design
- ⌨️ Keyboard shortcuts
- 🖼️ Image support with Unsplash integration
- 📊 Table support
- ✅ Task lists
- 🎯 Code blocks with syntax highlighting

## Tech Stack

- Next.js 15
- React 19
- TipTap Editor
- TailwindCSS
- TypeScript
- Framer Motion
- React Hot Toast
- HTML2PDF.js
- Axios

## Getting Started

### Prerequisites

- Node.js 18 or later
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/typhoon-document-helper.git
cd typhoon-document-helper
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env.local` file in the root directory and add your environment variables:
```env
NEXT_PUBLIC_AI_API_URL=your_ai_api_url
```

4. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Deployment

The application is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import your repository on Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [TipTap](https://tiptap.dev/) for the amazing editor
- [Next.js](https://nextjs.org/) for the framework
- [TailwindCSS](https://tailwindcss.com/) for the styling
- [Unsplash](https://unsplash.com/) for the image API
