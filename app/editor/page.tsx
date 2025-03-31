"use client"

import { useState, useEffect } from "react";
import Editor, { Document } from "../components/editor/Editor";
import { Toaster, toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
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
    <div className="min-h-screen bg-gray-50 h-screen flex flex-col">
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
