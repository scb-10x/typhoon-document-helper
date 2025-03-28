"use client"

import Editor from "../components/Editor";
import { Toaster } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

export default function EditorPage() {
  return (
    <div className="min-h-screen bg-gray-50 h-screen flex flex-col">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#ffffff",
            color: "#333333",
            boxShadow: "0 3px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            fontSize: "14px",
          },
          success: {
            iconTheme: {
              primary: "rgb(var(--success))",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "rgb(var(--error))",
              secondary: "#ffffff",
            },
          },
        }}
      />
      <header className="py-3 px-6 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center space-x-2">
              <div className="h-9 w-9 rounded-lg overflow-hidden">
                <Image
                  src="/images/logo.svg"
                  alt="Typhoon Docs Logo"
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                />
              </div>
              <h1 className="text-xl font-semibold text-gradient-subtle">
                Typhoon Docs
              </h1>
            </div>
          </Link>
          <div>
            <a
              href="https://github.com/scb-10x/typhoon-document-helper"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
                  clipRule="evenodd"
                />
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-6 overflow-hidden flex items-stretch">
        <Editor />
      </main>
      <footer className="py-2 px-6 border-t border-gray-200 bg-white text-xs text-gray-500">
        <div className="text-center">
          <a
            href="https://opentyphoon.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600 transition-colors"
          >
            Built with Typhoon
          </a>{" "}
          · © {new Date().getFullYear()} Docs
        </div>
      </footer>

      <style jsx global>{`
        .text-gradient {
          background: linear-gradient(to right, #4f46e5, #a855f7, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .text-gradient-subtle {
          background: linear-gradient(to right, #4f46e5, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </div>
  );
}
