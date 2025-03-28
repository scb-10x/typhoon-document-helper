import Editor from './components/Editor';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 h-screen flex flex-col">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#333333',
            boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: 'rgb(var(--success))',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: 'rgb(var(--error))',
              secondary: '#ffffff',
            },
          },
        }}
      />
      <header className="py-3 px-6 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-7 w-7 rounded-md bg-purple-600 text-white flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">
              Typhoon Document Helper
            </h1>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-6 overflow-hidden flex items-stretch">
        <Editor />
      </main>
      <footer className="py-2 px-6 border-t border-gray-200 bg-white text-xs text-gray-500">
        <div className="text-center">
          Powered by Typhoon LLM · © {new Date().getFullYear()} Document Helper
        </div>
      </footer>
    </div>
  );
}
