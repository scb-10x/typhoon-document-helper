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

    // Editor UI
    newDocument: string;
    untitledDocument: string;
    loadSample: string;
    export: string;
    exportPDF: string;
    exportDOCX: string;
    exportHTML: string;
    exportMarkdown: string;
    exportTXT: string;
    comfort: string;
    fontSize: string;
    lineHeight: string;
    documentStats: string;
    words: string;
    characters: string;
    charactersNoSpaces: string;

    // Editor Toolbar
    paragraph: string;
    heading1: string;
    heading2: string;
    heading3: string;
    bold: string;
    italic: string;
    underline: string;
    strikethrough: string;
    bulletList: string;
    numberedList: string;
    taskList: string;
    blockquote: string;
    codeBlock: string;
    alignLeft: string;
    alignCenter: string;
    alignRight: string;
    horizontalRule: string;
    insertImage: string;
    insertTable: string;
    undo: string;
    redo: string;
    shortcuts: string;

    // Table Operations
    table: string;
    insertRowAbove: string;
    insertRowBelow: string;
    insertColLeft: string;
    insertColRight: string;
    deleteRow: string;
    deleteCol: string;
    deleteTable: string;
    mergeCells: string;
    splitCell: string;

    // Welcome Screen
    welcome: string;
    welcomeSubtitle: string;
    createNew: string;

    // AI Footer
    improve: string;
    transform: string;
    searchAIActions: string;

    // AI Improve options
    proofread: string;
    proofreadDesc: string;
    makeProfessional: string;
    makeProfessionalDesc: string;
    makeCasual: string;
    makeCasualDesc: string;
    improveClarity: string;
    improveClarityDesc: string;
    fixWordiness: string;
    fixWordinessDesc: string;

    // AI Transform options
    extend: string;
    extendDesc: string;
    summarize: string;
    summarizeDesc: string;
    translate: string;
    translateDesc: string;
    explainLikeIm5: string;
    explainLikeIm5Desc: string;
    makePersuasive: string;
    makePersuasiveDesc: string;

    // Keyboard Shortcuts
    keyboardShortcuts: string;
    textFormatting: string;
    headings: string;
    lists: string;
    other: string;
    tables: string;
    close: string;

    // Additional keyboard shortcuts items
    link: string;
    selectAll: string;
    copy: string;
    paste: string;
    cut: string;
    find: string;
    nextCell: string;
    previousCell: string;
    cellAbove: string;
    cellBelow: string;
    insertNewRow: string;
    selectTable: string;

    // Modal Common
    cancel: string;

    // PDF Export Modal
    pdfExportSettings: string;
    fileName: string;
    paperSize: string;
    orientation: string;
    portrait: string;
    landscape: string;
    margin: string;
    pageColor: string;
    includeBackgroundColors: string;
    contentArea: string;
    exportPDFButton: string;
    generatingPDF: string;

    // Link Modal
    insertLink: string;
    updateLink: string;
    linkURL: string;
    linkText: string;
    insertLinkButton: string;

    // Image Modal
    imageURL: string;
    altText: string;
    altTextDescription: string;
    titleOptional: string;
    titleDescription: string;
    insertImageButton: string;

    // Translate Modal
    translateText: string;
    selectTargetLanguage: string;
    otherLanguage: string;
    specifyLanguage: string;
    translateTip: string;
    translateButton: string;

    // Common languages
    thai: string;
    english: string;
    spanish: string;
    french: string;
    german: string;
    chinese: string;
    japanese: string;
    russian: string;
    arabic: string;
    portuguese: string;
    italian: string;
    hindi: string;
    korean: string;
    dutch: string;
    otherLanguageOption: string;

    // Input Placeholders
    urlPlaceholder: string;
    linkTextPlaceholder: string;
    imageUrlPlaceholder: string;
    altTextPlaceholder: string;
    titlePlaceholder: string;
    fileNamePlaceholder: string;
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

    // Editor UI
    newDocument: 'New',
    untitledDocument: 'Untitled Document',
    loadSample: 'Load Sample',
    export: 'Export',
    exportPDF: 'PDF',
    exportDOCX: 'Word (.docx)',
    exportHTML: 'HTML',
    exportMarkdown: 'Markdown',
    exportTXT: 'Plain Text',
    comfort: 'Comfort',
    fontSize: 'Font Size',
    lineHeight: 'Line Height',
    documentStats: 'Document Stats',
    words: 'words',
    characters: 'characters',
    charactersNoSpaces: 'characters (no spaces)',

    // Editor Toolbar
    paragraph: 'Paragraph',
    heading1: 'Heading 1',
    heading2: 'Heading 2',
    heading3: 'Heading 3',
    bold: 'Bold (Ctrl+B)',
    italic: 'Italic (Ctrl+I)',
    underline: 'Underline (Ctrl+U)',
    strikethrough: 'Strikethrough',
    bulletList: 'Bullet List (Ctrl+Shift+8)',
    numberedList: 'Numbered List (Ctrl+Shift+7)',
    taskList: 'Task List',
    blockquote: 'Blockquote (Ctrl+Shift+B)',
    codeBlock: 'Code Block (Ctrl+Alt+C)',
    alignLeft: 'Align Left',
    alignCenter: 'Align Center',
    alignRight: 'Align Right',
    horizontalRule: 'Horizontal Rule',
    insertImage: 'Insert Image',
    insertTable: 'Insert Table',
    undo: 'Undo (Ctrl+Z)',
    redo: 'Redo (Ctrl+Y)',
    shortcuts: 'Shortcuts',

    // Table Operations
    table: 'Table',
    insertRowAbove: 'Insert row above',
    insertRowBelow: 'Insert row below',
    insertColLeft: 'Insert column left',
    insertColRight: 'Insert column right',
    deleteRow: 'Delete row',
    deleteCol: 'Delete column',
    deleteTable: 'Delete table',
    mergeCells: 'Merge cells',
    splitCell: 'Split cell',

    // Welcome Screen
    welcome: 'Welcome to Typhoon Document Editor',
    welcomeSubtitle: 'Get started by creating a new document or loading a sample.',
    createNew: 'New Document',

    // AI Footer
    improve: 'Improve',
    transform: 'Transform',
    searchAIActions: 'Search AI actions...',

    // AI Improve options
    proofread: 'Proofread',
    proofreadDesc: 'Fix spelling, grammar, and punctuation',
    makeProfessional: 'Make professional',
    makeProfessionalDesc: 'Formal tone for business documents',
    makeCasual: 'Make casual',
    makeCasualDesc: 'Conversational, friendly tone',
    improveClarity: 'Improve clarity',
    improveClarityDesc: 'Make text clearer and easier to understand',
    fixWordiness: 'Fix wordiness',
    fixWordinessDesc: 'Make text more concise without losing meaning',

    // AI Transform options
    extend: 'Extend',
    extendDesc: 'Elaborate and expand on selected text',
    summarize: 'Summarize',
    summarizeDesc: 'Create a shorter version of the text',
    translate: 'Translate',
    translateDesc: 'Translate text to another language',
    explainLikeIm5: "Explain like I'm 5",
    explainLikeIm5Desc: 'Explain complex concepts in simple terms',
    makePersuasive: 'Make persuasive',
    makePersuasiveDesc: 'Make text more convincing',

    // Keyboard Shortcuts
    keyboardShortcuts: 'Keyboard Shortcuts',
    textFormatting: 'Text Formatting',
    headings: 'Headings',
    lists: 'Lists',
    other: 'Other',
    tables: 'Tables',
    close: 'Close',

    // Additional keyboard shortcuts items
    link: 'Link',
    selectAll: 'Select All',
    copy: 'Copy',
    paste: 'Paste',
    cut: 'Cut',
    find: 'Find',
    nextCell: 'Next Cell',
    previousCell: 'Previous Cell',
    cellAbove: 'Move to Cell Above',
    cellBelow: 'Move to Cell Below',
    insertNewRow: 'Insert New Row',
    selectTable: 'Select Table',

    // Modal Common
    cancel: 'Cancel',

    // PDF Export Modal
    pdfExportSettings: 'PDF Export Settings',
    fileName: 'File Name',
    paperSize: 'Paper Size',
    orientation: 'Orientation',
    portrait: 'Portrait',
    landscape: 'Landscape',
    margin: 'Margin (mm)',
    pageColor: 'Page Color',
    includeBackgroundColors: 'Include Background Colors',
    contentArea: 'Content Area',
    exportPDFButton: 'Export PDF',
    generatingPDF: 'Generating PDF...',

    // Link Modal
    insertLink: 'Insert Link',
    updateLink: 'Update Link',
    linkURL: 'URL',
    linkText: 'Link Text (optional)',
    insertLinkButton: 'Insert Link',

    // Image Modal
    imageURL: 'Image URL',
    altText: 'Alt Text',
    altTextDescription: 'Describes the image for screen readers and SEO',
    titleOptional: 'Title (optional)',
    titleDescription: 'Tooltip when hovering over the image',
    insertImageButton: 'Insert Image',

    // Translate Modal
    translateText: 'Translate Text',
    selectTargetLanguage: 'Select Target Language',
    otherLanguage: 'Other:',
    specifyLanguage: 'Specify language',
    translateTip: 'The text will be translated into the selected language. For best results, ensure your text is clear and grammatically correct in the source language.',
    translateButton: 'Translate',

    // Common languages
    thai: 'Thai',
    english: 'English',
    spanish: 'Spanish',
    french: 'French',
    german: 'German',
    chinese: 'Chinese',
    japanese: 'Japanese',
    russian: 'Russian',
    arabic: 'Arabic',
    portuguese: 'Portuguese',
    italian: 'Italian',
    hindi: 'Hindi',
    korean: 'Korean',
    dutch: 'Dutch',
    otherLanguageOption: 'Other Language',

    // Input Placeholders
    urlPlaceholder: 'https://example.com',
    linkTextPlaceholder: 'Link display text',
    imageUrlPlaceholder: 'https://example.com/image.jpg',
    altTextPlaceholder: 'Image description for accessibility',
    titlePlaceholder: 'Tooltip when hovering over the image',
    fileNamePlaceholder: 'Enter file name...',
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

    // Editor UI
    newDocument: 'สร้างใหม่',
    untitledDocument: 'เอกสารไม่มีชื่อ',
    loadSample: 'โหลดตัวอย่าง',
    export: 'ส่งออก',
    exportPDF: 'PDF',
    exportDOCX: 'Word (.docx)',
    exportHTML: 'HTML',
    exportMarkdown: 'Markdown',
    exportTXT: 'ข้อความเปล่า',
    comfort: 'การแสดงผล',
    fontSize: 'ขนาดตัวอักษร',
    lineHeight: 'ระยะห่างบรรทัด',
    documentStats: 'สถิติเอกสาร',
    words: 'คำ',
    characters: 'ตัวอักษร',
    charactersNoSpaces: 'ตัวอักษร (ไม่มีช่องว่าง)',

    // Editor Toolbar
    paragraph: 'ย่อหน้า',
    heading1: 'หัวข้อ 1',
    heading2: 'หัวข้อ 2',
    heading3: 'หัวข้อ 3',
    bold: 'ตัวหนา (Ctrl+B)',
    italic: 'ตัวเอียง (Ctrl+I)',
    underline: 'ขีดเส้นใต้ (Ctrl+U)',
    strikethrough: 'ขีดฆ่า',
    bulletList: 'รายการหัวข้อย่อย (Ctrl+Shift+8)',
    numberedList: 'รายการตัวเลข (Ctrl+Shift+7)',
    taskList: 'รายการงาน',
    blockquote: 'บล็อกคำพูด (Ctrl+Shift+B)',
    codeBlock: 'บล็อกโค้ด (Ctrl+Alt+C)',
    alignLeft: 'ชิดซ้าย',
    alignCenter: 'กึ่งกลาง',
    alignRight: 'ชิดขวา',
    horizontalRule: 'เส้นแนวนอน',
    insertImage: 'แทรกรูปภาพ',
    insertTable: 'แทรกตาราง',
    undo: 'เลิกทำ (Ctrl+Z)',
    redo: 'ทำซ้ำ (Ctrl+Y)',
    shortcuts: 'คีย์ลัด',

    // Table Operations
    table: 'ตาราง',
    insertRowAbove: 'เพิ่มแถวด้านบน',
    insertRowBelow: 'เพิ่มแถวด้านล่าง',
    insertColLeft: 'เพิ่มคอลัมน์ด้านซ้าย',
    insertColRight: 'เพิ่มคอลัมน์ด้านขวา',
    deleteRow: 'ลบแถว',
    deleteCol: 'ลบคอลัมน์',
    deleteTable: 'ลบตาราง',
    mergeCells: 'รวมเซลล์',
    splitCell: 'แยกเซลล์',

    // Welcome Screen
    welcome: 'ยินดีต้อนรับสู่ Typhoon Document Editor',
    welcomeSubtitle: 'เริ่มต้นด้วยการสร้างเอกสารใหม่หรือโหลดตัวอย่าง',
    createNew: 'สร้างเอกสารใหม่',

    // AI Footer
    improve: 'ปรับปรุง',
    transform: 'แปลง',
    searchAIActions: 'ค้นหาคำสั่ง AI...',

    // AI Improve options
    proofread: 'ตรวจทาน',
    proofreadDesc: 'แก้ไขการสะกดคำ ไวยากรณ์ และเครื่องหมายวรรคตอน',
    makeProfessional: 'ทำให้เป็นทางการ',
    makeProfessionalDesc: 'โทนเป็นทางการสำหรับเอกสารธุรกิจ',
    makeCasual: 'ทำให้เป็นกันเอง',
    makeCasualDesc: 'โทนการสนทนาที่เป็นมิตร',
    improveClarity: 'ปรับปรุงความชัดเจน',
    improveClarityDesc: 'ทำให้ข้อความชัดเจนและเข้าใจง่ายขึ้น',
    fixWordiness: 'แก้ไขความเยิ่นเย้อ',
    fixWordinessDesc: 'ทำให้ข้อความกระชับโดยไม่สูญเสียความหมาย',

    // AI Transform options
    extend: 'ขยาย',
    extendDesc: 'อธิบายและขยายข้อความที่เลือก',
    summarize: 'สรุป',
    summarizeDesc: 'สร้างเวอร์ชันสั้นลงของข้อความ',
    translate: 'แปล',
    translateDesc: 'แปลข้อความเป็นภาษาอื่น',
    explainLikeIm5: "อธิบายแบบเด็ก 5 ขวบเข้าใจ",
    explainLikeIm5Desc: 'อธิบายแนวคิดที่ซับซ้อนในรูปแบบที่เข้าใจง่าย',
    makePersuasive: 'ทำให้น่าเชื่อถือ',
    makePersuasiveDesc: 'ทำให้ข้อความน่าเชื่อถือมากขึ้น',

    // Keyboard Shortcuts
    keyboardShortcuts: 'ปุ่มลัดแป้นพิมพ์',
    textFormatting: 'การจัดรูปแบบข้อความ',
    headings: 'หัวข้อ',
    lists: 'รายการ',
    other: 'อื่นๆ',
    tables: 'ตาราง',
    close: 'ปิด',

    // Additional keyboard shortcuts items
    link: 'ลิงก์',
    selectAll: 'เลือกทั้งหมด',
    copy: 'คัดลอก',
    paste: 'วาง',
    cut: 'ตัด',
    find: 'ค้นหา',
    nextCell: 'เซลล์ถัดไป',
    previousCell: 'เซลล์ก่อนหน้า',
    cellAbove: 'ย้ายไปเซลล์ด้านบน',
    cellBelow: 'ย้ายไปเซลล์ด้านล่าง',
    insertNewRow: 'แทรกแถวใหม่',
    selectTable: 'เลือกตาราง',

    // Modal Common
    cancel: 'ยกเลิก',

    // PDF Export Modal
    pdfExportSettings: 'การตั้งค่าการส่งออก PDF',
    fileName: 'ชื่อไฟล์',
    paperSize: 'ขนาดกระดาษ',
    orientation: 'แนวกระดาษ',
    portrait: 'แนวตั้ง',
    landscape: 'แนวนอน',
    margin: 'ระยะขอบ (มม.)',
    pageColor: 'สีหน้า',
    includeBackgroundColors: 'รวมสีพื้นหลัง',
    contentArea: 'พื้นที่เนื้อหา',
    exportPDFButton: 'ส่งออก PDF',
    generatingPDF: 'กำลังสร้าง PDF...',

    // Link Modal
    insertLink: 'แทรกลิงก์',
    updateLink: 'อัปเดตลิงก์',
    linkURL: 'URL',
    linkText: 'ข้อความลิงก์ (ไม่บังคับ)',
    insertLinkButton: 'แทรกลิงก์',

    // Image Modal
    imageURL: 'URL รูปภาพ',
    altText: 'ข้อความทดแทน',
    altTextDescription: 'อธิบายรูปภาพสำหรับโปรแกรมอ่านหน้าจอและ SEO',
    titleOptional: 'ชื่อเรื่อง (ไม่บังคับ)',
    titleDescription: 'ข้อความที่แสดงเมื่อเลื่อนเมาส์ไปที่รูปภาพ',
    insertImageButton: 'แทรกรูปภาพ',

    // Translate Modal
    translateText: 'แปลข้อความ',
    selectTargetLanguage: 'เลือกภาษาเป้าหมาย',
    otherLanguage: 'อื่นๆ:',
    specifyLanguage: 'ระบุภาษา',
    translateTip: 'ข้อความจะถูกแปลเป็นภาษาที่เลือก สำหรับผลลัพธ์ที่ดีที่สุด ตรวจสอบให้แน่ใจว่าข้อความของคุณชัดเจนและถูกต้องตามหลักไวยากรณ์ในภาษาต้นฉบับ',
    translateButton: 'แปล',

    // Common languages
    thai: 'ไทย',
    english: 'อังกฤษ',
    spanish: 'สเปน',
    french: 'ฝรั่งเศส',
    german: 'เยอรมัน',
    chinese: 'จีน',
    japanese: 'ญี่ปุ่น',
    russian: 'รัสเซีย',
    arabic: 'อาหรับ',
    portuguese: 'โปรตุเกส',
    italian: 'อิตาลี',
    hindi: 'ฮินดี',
    korean: 'เกาหลี',
    dutch: 'ดัตช์',
    otherLanguageOption: 'ภาษาอื่นๆ',

    // Input Placeholders
    urlPlaceholder: 'https://example.com',
    linkTextPlaceholder: 'ข้อความที่แสดงของลิงก์',
    imageUrlPlaceholder: 'https://example.com/image.jpg',
    altTextPlaceholder: 'คำอธิบายรูปภาพสำหรับการเข้าถึง',
    titlePlaceholder: 'ข้อความที่แสดงเมื่อวางเมาส์เหนือรูปภาพ',
    fileNamePlaceholder: 'ใส่ชื่อไฟล์...',
  }
}; 