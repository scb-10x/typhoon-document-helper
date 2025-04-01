"use client"

import { useState, useEffect } from "react";
import Editor, { Document } from "../components/editor/Editor";
import { Toaster, toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaDiscord, FaXTwitter } from 'react-icons/fa6';
import { SiHuggingface } from "react-icons/si";
import { useLanguage } from '../contexts/LanguageContext';

// Default empty document
const emptyDocument: Document = {
  id: "0",
  name: "New Document",
  content: ""
};

export default function EditorPage() {
  // Document state management
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Language context
  const { t } = useLanguage();

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load documents from localStorage on client-side
  useEffect(() => {
    if (!isClient) return;

    const savedDocs = localStorage.getItem('typhoon-docs');
    if (savedDocs) {
      try {
        const parsedDocs = JSON.parse(savedDocs);
        setDocuments(parsedDocs);

        // Set the first document as active if there is one
        if (parsedDocs.length > 0) {
          setActiveDocumentId(parsedDocs[0].id);
        }
      } catch (e) {
        console.error("Failed to parse saved documents:", e);
        // Create a default document if parsing fails
        const defaultDoc = { id: "1", name: 'Untitled Document', content: '' };
        setDocuments([defaultDoc]);
        setActiveDocumentId(defaultDoc.id);
      }
    } else {
      // Create a default document if none exists
      const defaultDoc = { id: "1", name: 'Untitled Document', content: '' };
      setDocuments([defaultDoc]);
      setActiveDocumentId(defaultDoc.id);
    }
    setIsInitialized(true);
  }, [isClient]);

  // Get the active document
  const activeDocument = documents.find(doc => doc.id === activeDocumentId) || emptyDocument;

  // Handler for updating document content
  const handleUpdateDocument = (id: string, content: string) => {
    const updatedDocs = documents.map(doc => {
      if (doc.id === id) {
        return { ...doc, content };
      }
      return doc;
    });

    setDocuments(updatedDocs);
    localStorage.setItem('typhoon-docs', JSON.stringify(updatedDocs));
  };

  // Handler for switching active document
  const handleSwitchDocument = (id: string) => {
    setActiveDocumentId(id);
  };

  // Handler for renaming a document
  const handleRenameDocument = (id: string, name: string) => {
    const updatedDocs = documents.map(doc =>
      doc.id === id ? { ...doc, name } : doc
    );

    setDocuments(updatedDocs);
    localStorage.setItem('typhoon-docs', JSON.stringify(updatedDocs));

    // Show success notification
    toast.success(t('documentRenamed'));
  };

  // Handler for deleting a document
  const handleDeleteDocument = (id: string) => {
    // Don't delete if it's the last document
    if (documents.length <= 1) {
      // Create a new empty document first
      handleAddDocument();
    }

    // If deleting the active document, switch to another one first
    if (id === activeDocumentId) {
      const nextDoc = documents.find(doc => doc.id !== id);
      if (nextDoc) {
        setActiveDocumentId(nextDoc.id);
      }
    }

    // Remove the document
    const updatedDocs = documents.filter(doc => doc.id !== id);
    setDocuments(updatedDocs);
    localStorage.setItem('typhoon-docs', JSON.stringify(updatedDocs));
  };

  // Handler for adding a new document
  const handleAddDocument = (sampleContent?: string) => {
    // Generate a new ID (as string)
    const maxId = documents.reduce((max, doc) => {
      const idNum = parseInt(doc.id);
      return isNaN(idNum) ? max : Math.max(max, idNum);
    }, 0);

    const newDocId = (maxId + 1).toString();
    const newDoc = {
      id: newDocId,
      name: sampleContent ? 'Sample Document' : 'Untitled Document',
      content: sampleContent || ''
    };

    const updatedDocs = [...documents, newDoc];
    setDocuments(updatedDocs);
    setActiveDocumentId(newDocId);
    localStorage.setItem('typhoon-docs', JSON.stringify(updatedDocs));

    return newDocId; // Return the new document ID
  };

  // Render loading state
  const renderLoadingState = () => (
    <div className="min-h-screen bg-gray-50 h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">Loading documents...</p>
      </div>
    </div>
  );

  // Don't render the editor until we've initialized documents and confirmed we're on the client
  if (!isClient || !isInitialized) {
    return renderLoadingState();
  }

  return (
    <div className="min-h-screen bg-gray-50 h-screen flex flex-col" itemScope itemType="https://schema.org/WebApplication">
      <meta itemProp="name" content="Typhoon AI Document Editor" />
      <meta itemProp="description" content="Experience AI-powered document editing with Typhoon. Create, edit, and enhance your documents with intelligent assistance." />
      <meta itemProp="applicationCategory" content="DocumentEditor" />
      <meta itemProp="operatingSystem" content="Web browser" />

      {/* Only render Toaster on the client side */}
      {isClient && (
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
      )}
      <header className="py-3 px-6 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center space-x-2">
              <div className="h-9 w-9 rounded-lg overflow-hidden">
                <Image
                  src="/images/logo.svg"
                  alt="Typhoon AI Logo"
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
              <h1 className="text-xl font-semibold text-gradient-subtle" itemProp="name">
                {t('appName')}
              </h1>
            </div>
          </Link>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-2 py-6 overflow-hidden flex items-stretch max-w-[95%]" itemProp="mainEntityOfPage">
        <div className="w-full h-full relative">
          <Editor
            document={activeDocument}
            documents={documents}
            onUpdateDocument={handleUpdateDocument}
            onSwitchDocument={handleSwitchDocument}
            onDeleteDocument={handleDeleteDocument}
            onAddDocument={handleAddDocument}
            onRenameDocument={handleRenameDocument}
          />
        </div>
      </main>
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-sm text-gray-500">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
              <span>© 2025 Typhoon. All rights reserved</span>
              <a
                href="https://opentyphoon.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-800 transition-colors font-medium"
              >
                #BuiltWithTyphoon
              </a>
            </div>

            <div className="flex items-center space-x-6">
              <a
                href="https://opentyphoon.ai/tac"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900 transition-colors"
              >
                Terms and Conditions
              </a>
              <div className="flex items-center space-x-4">
                <a href="https://github.com/scb-10x" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-gray-400 hover:text-gray-900 transition-colors">
                  <span className="sr-only">GitHub</span>
                  <FaGithub className="h-5 w-5" />
                </a>
                <a href="https://discord.gg/9F6nrFXyNt" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="text-gray-400 hover:text-gray-900 transition-colors">
                  <span className="sr-only">Discord</span>
                  <FaDiscord className="h-5 w-5" />
                </a>
                <a href="https://huggingface.co/scb10x" target="_blank" rel="noopener noreferrer" aria-label="Hugging Face" className="text-gray-400 hover:text-gray-900 transition-colors">
                  <span className="sr-only">Hugging Face</span>
                  <SiHuggingface className="h-5 w-5" />
                </a>
                <a href="https://x.com/opentyphoon" target="_blank" rel="noopener noreferrer" aria-label="X (formerly Twitter)" className="text-gray-400 hover:text-gray-900 transition-colors">
                  <span className="sr-only">X</span>
                  <FaXTwitter className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Only include static styles that won't cause hydration issues */}
      <style jsx global>{`
        .text-gradient {
          background: linear-gradient(to right, #4f46e5, #8b5cf6);
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
