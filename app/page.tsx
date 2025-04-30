'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiArrowRight, FiEdit, FiCpu, FiDownload } from 'react-icons/fi';
import { FaGithub, FaDiscord, FaXTwitter } from 'react-icons/fa6';
import { SiHuggingface } from "react-icons/si";
import { useLanguage } from './contexts/LanguageContext';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { useEffect, useState } from 'react';

// Animated background elements
const BackgroundElements = () => (
  <div className="absolute inset-0 overflow-hidden -z-10">
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-600 to-indigo-600 opacity-5"></div>
    <div className="bg-noise"></div>

    {/* Gradient blobs */}
    <motion.div
      initial={{ opacity: 0.6 }}
      animate={{
        opacity: [0.6, 0.8, 0.6],
        scale: [1, 1.05, 1],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute top-1/4 -left-24 w-96 h-96 rounded-full bg-indigo-500/20 blur-[80px]"
    />
    <motion.div
      initial={{ opacity: 0.6 }}
      animate={{
        opacity: [0.6, 0.8, 0.6],
        scale: [1, 1.05, 1],
      }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-purple-500/20 blur-[80px]"
    />
    <motion.div
      initial={{ opacity: 0.3 }}
      animate={{
        opacity: [0.3, 0.5, 0.3],
        scale: [1, 1.03, 1],
      }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full bg-pink-500/20 blur-[64px]"
    />
  </div>
);

export default function Home() {
  const { t } = useLanguage();
  const [showSourceCode, setShowSourceCode] = useState(false);

  useEffect(() => {
    const releaseDate = new Date('2025-05-08T17:00:01Z').getTime();

    const checkDate = () => {
      const now = new Date().getTime();
      setShowSourceCode(now >= releaseDate);
    };

    // Check immediately
    checkDate();

    // Set up interval to check periodically
    const interval = setInterval(checkDate, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
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
            <h1 className="text-xl font-semibold text-gradient-subtle">
              {t('appName')}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            {showSourceCode && (
              <a
                href="https://github.com/scb-10x/typhoon-document-helper"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all"
                aria-label="View source code on GitHub"
                id="github-source-button"
              >
                <FaGithub className="h-5 w-5" />
                Source
              </a>
            )}
            <Link
              href="/editor"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-md transition-all button-shine"
              aria-label="Try the Typhoon AI document editor demo"
              id="header-try-editor-button"
            >
              {t('openApp')} <FiArrowRight />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden" itemScope itemType="https://schema.org/SoftwareApplication">
        <meta itemProp="applicationCategory" content="DocumentEditor" />
        <meta itemProp="operatingSystem" content="Web browser" />
        <meta itemProp="offers" itemScope itemType="https://schema.org/Offer" content="https://opentyphoon.ai" />
        <meta itemProp="name" content="Typhoon AI Document Editor" />
        <BackgroundElements />
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block mb-4 px-4 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium"
            >
              {t('builtWithTyphoon')}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl font-bold mb-6 text-gradient"
              itemProp="description"
            >
              {t('heroTitle')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8"
            >
              {t('heroSubtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/editor"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:shadow-md transition-all button-shine"
                aria-label="Try the Typhoon AI document editor"
                itemProp="url"
                id="hero-try-editor-button"
              >
                {t('tryEditor')} <FiArrowRight />
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="relative max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-xl border border-gray-100"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-[2px] z-10 flex items-center justify-center">
              <Link
                href="/editor"
                className="px-8 py-3 rounded-lg bg-white text-indigo-600 text-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 button-shine"
                aria-label="Try Typhoon AI document editing capabilities"
                id="screenshot-overlay-button"
              >
                {t('tryTyphoonDocs')} <FiArrowRight />
              </Link>
            </div>
            <div className="w-full aspect-video bg-gradient-to-r from-purple-100 to-indigo-100 flex items-center justify-center" aria-hidden="true">
              <Image
                src="/static/screenshot.png"
                alt="Typhoon Document Editor screenshot"
                width={1200}
                height={675}
                className="rounded-lg shadow-sm w-full h-auto object-cover"
                priority
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 relative overflow-hidden" aria-labelledby="features-heading">
        <div className="bg-noise"></div>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 id="features-heading" className="text-3xl font-bold mb-4 text-gradient-subtle">{t('featuresTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('featuresSubtitle')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="animate-float"
            >
              <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start h-full" itemScope itemType="https://schema.org/Thing">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mb-4" aria-hidden="true">
                  <FiEdit size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2" itemProp="name">{t('richTextTitle')}</h3>
                <p className="text-gray-600" itemProp="description">{t('richTextDescription')}</p>
                <div className="mt-auto pt-4">
                  <Link href="/features/rich-text" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center" id="feature-rich-text-learn-more">
                    {t('learnMore')} <FiArrowRight className="ml-1" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="animate-float-reverse"
            >
              <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start h-full" itemScope itemType="https://schema.org/Thing">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mb-4" aria-hidden="true">
                  <FiCpu size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2" itemProp="name">{t('aiSuggestionsTitle')}</h3>
                <p className="text-gray-600" itemProp="description">{t('aiSuggestionsDescription')}</p>
                <div className="mt-auto pt-4">
                  <Link href="/features/ai-suggestions" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center" id="feature-ai-suggestions-learn-more">
                    {t('learnMore')} <FiArrowRight className="ml-1" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="animate-float"
            >
              <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start h-full" itemScope itemType="https://schema.org/Thing">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mb-4" aria-hidden="true">
                  <FiDownload size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2" itemProp="name">{t('exportOptionsTitle')}</h3>
                <p className="text-gray-600" itemProp="description">{t('exportOptionsDescription')}</p>
                <div className="mt-auto pt-4">
                  <Link href="/features/export" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center" id="feature-export-learn-more">
                    {t('learnMore')} <FiArrowRight className="ml-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Add a new section about integration with Typhoon */}
      <section className="py-16 bg-white" aria-labelledby="typhoon-integration-heading">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 id="typhoon-integration-heading" className="text-3xl font-bold mb-4 text-gradient-subtle">Integrate Typhoon AI in Your Own Applications</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              This demo showcases just one example of what you can build with Typhoon AI. Visit <a href="https://opentyphoon.ai" className="text-indigo-600 hover:text-indigo-800 font-medium">opentyphoon.ai</a> to learn how to add these capabilities to your own products.
            </p>
          </div>
          <div className="flex justify-center mt-6">
            <a
              href="https://opentyphoon.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:shadow-md transition-all button-shine"
            >
              Visit Typhoon AI <FiArrowRight />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-sm text-gray-500">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
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

        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          background-position: center;
          background-size: cover;
          opacity: 0.05;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes float-reverse {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(15px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-reverse {
          animation: float-reverse 7s ease-in-out infinite;
        }

        .button-shine {
          position: relative;
          overflow: hidden;
        }

        .button-shine::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent);
          transform: skewX(-25deg);
          transition: all 0.75s;
        }

        .button-shine:hover::after {
          left: 150%;
        }
      `}</style>
    </div>
  );
}

