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
- 📊 Table support with cell merging and header rows
- ✅ Task lists with checkboxes
- 🎯 Code blocks with syntax highlighting
- 🎨 Text styling (color, highlight, underline)
- 📝 Subscript and superscript support
- 🔗 Link management with modal interface
- 📏 Comfort settings (font size, line height)
- 📄 Multiple document management
- 💾 Local storage persistence

## Tech Stack

- Next.js 15.2.4
- React 19.1.0
- TipTap Editor 2.11.7
- TailwindCSS 4.0.17
- TypeScript 5.8.2
- Framer Motion 12.6.2
- React Hot Toast 2.5.2
- HTML2PDF.js 0.10.3
- Axios 1.8.4
- Radix UI Components
- Lucide React Icons

## Getting Started

### Prerequisites

- Node.js 18 or later
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/scb-10x/typhoon-document-helper.git
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

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking

## Project Structure

```
app/
├── api/           # API routes
├── components/    # Reusable components
├── contexts/      # React contexts
├── editor/        # Editor page and components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and configurations
├── styles/        # Global styles
└── types/         # TypeScript type definitions
```

## Features in Detail

### Document Management
- Create, rename, and delete multiple documents
- Automatic saving to local storage
- Document switching with state preservation
- Welcome screen for first-time users

### Editor Features
- Rich text formatting
- Table creation and manipulation
- Code blocks with syntax highlighting
- Task lists with checkboxes
- Link management with modal interface
- Text styling options (color, highlight, underline)
- Subscript and superscript support

### AI Integration
- Text enhancement and improvement
- Translation support
- Professional tone adjustment
- Clarity improvement
- Wordiness reduction
- Content extension and summarization
- ELI5 (Explain Like I'm 5) mode
- Persuasive writing assistance

### Export Options
- PDF export with customizable settings
- HTML export
- Markdown export
- Plain text export

### User Experience
- Responsive design for all screen sizes
- Comfort settings for font size and line height
- Keyboard shortcuts for common actions
- Toast notifications for user feedback
- Loading states and error handling

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
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Lucide](https://lucide.dev/) for beautiful icons
