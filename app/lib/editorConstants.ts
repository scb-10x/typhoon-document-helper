// Language mapping for translations
export const LANGUAGE_MAP: Record<string, string> = {
    'thai': 'th',
    'english': 'en',
    'spanish': 'es',
    'french': 'fr',
    'german': 'de',
    'chinese': 'zh',
    'japanese': 'ja',
    'italian': 'it',
    'russian': 'ru',
    'arabic': 'ar',
    'portuguese': 'pt'
};

// Function to create a sample document
export const createSampleDocument = (): string => {
    return `<h1 style="text-align: center;">Welcome to the Typhoon Document Editor</h1>
    <p>This powerful editor gives you the tools to create beautiful documents with ease. Below you'll find examples of all available formatting options.</p>
    
    <h2>Basic Formatting</h2>
    <p>You can make text <strong>bold</strong>, <em>italic</em>, or <u>underlined</u>. You can also combine these for <strong><em><u>rich formatting</u></em></strong>.</p>
    
    <h2>Text Alignment</h2>
    <p style="text-align: left;">This text is aligned to the left (default).</p>
    <p style="text-align: center;">This text is centered.</p>
    <p style="text-align: right;">This text is aligned to the right.</p>
    
    <h2>Lists</h2>
    <p>Organize information with ordered and unordered lists:</p>
    <h3>Unordered List</h3>
    <ul>
        <li>Rich text formatting</li>
        <li>Multiple document management</li>
        <li>Export options</li>
        <li>AI-powered writing assistance</li>
    </ul>
    
    <h3>Ordered List</h3>
    <ol>
        <li>Write your content</li>
        <li>Format it beautifully</li>
        <li>Use AI to enhance it</li>
        <li>Export and share!</li>
    </ol>
    
    <h3>Task List</h3>
    <ul data-type="taskList">
        <li data-type="taskItem" data-checked="true"><label><input type="checkbox" checked="checked"></label><div><p>Create your document</p></div></li>
        <li data-type="taskItem" data-checked="true"><label><input type="checkbox" checked="checked"></label><div><p>Format your content</p></div></li>
        <li data-type="taskItem" data-checked="false"><label><input type="checkbox"></label><div><p>Add task lists with checkboxes</p></div></li>
        <li data-type="taskItem" data-checked="false"><label><input type="checkbox"></label><div><p>Share your work with others</p></div></li>
    </ul>
    
    <h2>Text Styling</h2>
    <p><span style="color: #e62739;">You can change text colors</span> and <span style="background-color: #ffcc00;">highlight important information</span>.</p>
    <p>Scientific notation: H<sub>2</sub>O and E=mc<sup>2</sup> using subscript and superscript.</p>
    
    <h2>Links and Images</h2>
    <p>Add <a href="https://opentyphoon.ai" target="_blank">links to external resources</a> or insert images:</p>
    <img src="https://picsum.photos/800/400" alt="Sample image" />
    
    <h2>Block Quotes</h2>
    <blockquote>
        <p>Typhoon Document Editor makes document editing a breeze! Use blockquotes to highlight quotes or important passages.</p>
    </blockquote>
    
    <h2>AI Assistance</h2>
    <p>Try out our AI features in the footer below:</p>
    <ul>
        <li><strong>Improve:</strong> Proofread, make text professional or casual, improve clarity, fix wordiness</li>
        <li><strong>Transform:</strong> Extend, summarize, translate, explain (ELI5), or make text more persuasive</li>
    </ul>
    
    <h2>Getting Started</h2>
    <p>Use the toolbar above to format your text or try selecting some text to see formatting options.</p>
    <p>Create multiple documents using the controls in the header or try the export feature to share your work.</p>
    
    <p style="text-align: center;"><strong>Happy writing with Typhoon Document Editor!</strong></p>`;
}; 