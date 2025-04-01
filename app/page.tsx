'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiArrowRight, FiEdit, FiCpu, FiDownload } from 'react-icons/fi';
import { FaGithub, FaDiscord, FaXTwitter } from 'react-icons/fa6';
import { SiHuggingface } from "react-icons/si";
import { useLanguage } from './contexts/LanguageContext';
import { LanguageSwitcher } from './components/LanguageSwitcher';

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

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
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
              {t('appName')}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <a
              href="https://github.com/scb-10x/typhoon-document-helper"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center text-sm text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clipRule="evenodd" />
              </svg>
              {t('github')}
            </a>
            <Link
              href="/editor"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-md transition-all button-shine"
            >
              {t('openApp')} <FiArrowRight />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
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

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl font-bold mb-6 text-gradient"
            >
              {t('heroTitle')}
            </motion.h1>
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
              >
                {t('tryTyphoonDocs')} <FiArrowRight />
              </Link>
            </div>
            <div className="w-full aspect-video bg-gradient-to-r from-purple-100 to-indigo-100 flex items-center justify-center">
              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 w-4/5 h-3/4 flex flex-col">
                <div className="h-4 w-24 bg-purple-200 rounded mb-4"></div>
                <div className="h-3 w-full bg-gray-100 rounded mb-2"></div>
                <div className="h-3 w-full bg-gray-100 rounded mb-2"></div>
                <div className="h-3 w-4/5 bg-gray-100 rounded mb-4"></div>
                <div className="h-32 w-full bg-purple-50 rounded mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-300" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded mb-2"></div>
                <div className="h-3 w-full bg-gray-100 rounded mb-2"></div>
                <div className="h-3 w-3/5 bg-gray-100 rounded"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="bg-noise"></div>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gradient-subtle">{t('featuresTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('featuresSubtitle')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="animate-float"
            >
              <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start h-full">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mb-4">
                  <FiEdit size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t('richTextTitle')}</h3>
                <p className="text-gray-600">{t('richTextDescription')}</p>
                <div className="mt-auto pt-4">
                  <Link href="/features/rich-text" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
                    {t('learnMore')} <FiArrowRight className="ml-1" />
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="animate-float-reverse"
            >
              <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start h-full">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mb-4">
                  <FiCpu size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t('aiSuggestionsTitle')}</h3>
                <p className="text-gray-600">{t('aiSuggestionsDescription')}</p>
                <div className="mt-auto pt-4">
                  <Link href="/features/ai-suggestions" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
                    {t('learnMore')} <FiArrowRight className="ml-1" />
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="animate-float"
            >
              <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start h-full">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mb-4">
                  <FiDownload size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t('exportOptionsTitle')}</h3>
                <p className="text-gray-600">{t('exportOptionsDescription')}</p>
                <div className="mt-auto pt-4">
                  <Link href="/features/export" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
                    {t('learnMore')} <FiArrowRight className="ml-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
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

