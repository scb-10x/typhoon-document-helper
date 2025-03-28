export type Language = 'en' | 'th';

export type Translations = {
  [key in Language]: {
    // Header
    appName: string;
    github: string;
    openApp: string;
    
    // Hero Section
    builtWithTyphoon: string;
    heroTitle: string;
    heroSubtitle: string;
    tryEditor: string;
    tryTyphoonDocs: string;
    
    // Features Section
    featuresTitle: string;
    featuresSubtitle: string;
    
    // Feature 1
    richTextTitle: string;
    richTextDescription: string;
    learnMore: string;
    
    // Feature 2
    aiSuggestionsTitle: string;
    aiSuggestionsDescription: string;
    
    // Feature 3
    exportOptionsTitle: string;
    exportOptionsDescription: string;
    
    // Footer
    copyright: string;
    privacyPolicy: string;
    termsOfService: string;
  };
};

export const translations: Translations = {
  en: {
    // Header
    appName: 'Typhoon Docs',
    github: 'GitHub',
    openApp: 'Open App',
    
    // Hero Section
    builtWithTyphoon: '✨ Built with Typhoon',
    heroTitle: 'Create beautiful documents with AI',
    heroSubtitle: 'Transform your writing workflow with intelligent suggestions and powerful editing tools. Create, edit, and collaborate with ease.',
    tryEditor: 'Try the Editor',
    tryTyphoonDocs: 'Try Typhoon Docs',
    
    // Features Section
    featuresTitle: 'Feature-Rich Document Editor',
    featuresSubtitle: 'Everything you need to create professional documents with AI assistance',
    
    // Feature 1
    richTextTitle: 'Rich Text Editing',
    richTextDescription: 'Create beautiful documents with our advanced rich text editor that supports formatting, tables, images, and more.',
    learnMore: 'Learn more',
    
    // Feature 2
    aiSuggestionsTitle: 'AI-Powered Suggestions',
    aiSuggestionsDescription: 'Get intelligent writing suggestions and assistance powered by Typhoon. Automatically improve your text quality and grammar.',
    
    // Feature 3
    exportOptionsTitle: 'Export Options',
    exportOptionsDescription: 'Export your documents in multiple formats including PDF, Word, and HTML. Share your work with others easily.',
    
    // Footer
    copyright: 'All rights reserved',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
  },
  th: {
    // Header
    appName: 'Typhoon Docs',
    github: 'GitHub',
    openApp: 'เปิดแอป',
    
    // Hero Section
    builtWithTyphoon: '✨ สร้างด้วย Typhoon',
    heroTitle: 'สร้างเอกสารอย่างง่ายดายด้วย AI',
    heroSubtitle: 'เปลี่ยนโฟลว์งานเขียนของคุณด้วยคำแนะนำที่ชาญฉลาดและเครื่องมือการแก้ไขที่ทรงพลัง สร้าง แก้ไข และทำงานร่วมกันได้อย่างง่ายดาย',
    tryEditor: 'ลองใช้โปรแกรม',
    tryTyphoonDocs: 'ลองใช้ Typhoon Docs',
    
    // Features Section
    featuresTitle: 'ตัวแก้ไขเอกสารที่มีคุณสมบัติครบถ้วน',
    featuresSubtitle: 'ทุกสิ่งที่คุณต้องการเพื่อสร้างเอกสารมืออาชีพด้วยความช่วยเหลือจาก AI',
    
    // Feature 1
    richTextTitle: 'การแก้ไขข้อความแบบ Rich Text',
    richTextDescription: 'สร้างเอกสารที่สวยงามด้วยตัวแก้ไข rich text ขั้นสูงที่รองรับการจัดรูปแบบ ตาราง รูปภาพ และอื่นๆ',
    learnMore: 'เรียนรู้เพิ่มเติม',
    
    // Feature 2
    aiSuggestionsTitle: 'ง่ายๆ ด้วย AI',
    aiSuggestionsDescription: 'รับคำแนะนำการเขียนที่ชาญฉลาดและความช่วยเหลือจาก Typhoon ปรับปรุงคุณภาพข้อความและไวยากรณ์ของคุณโดยอัตโนมัติ',
    
    // Feature 3
    exportOptionsTitle: 'ตัวเลือกการส่งออก',
    exportOptionsDescription: 'ส่งออกเอกสารของคุณในหลายรูปแบบ รวมถึง PDF, Word และ HTML แชร์งานของคุณกับผู้อื่นได้อย่างง่ายดาย',
    
    // Footer
    copyright: 'สงวนลิขสิทธิ์',
    privacyPolicy: 'นโยบายความเป็นส่วนตัว',
    termsOfService: 'เงื่อนไขการให้บริการ',
  }
}; 