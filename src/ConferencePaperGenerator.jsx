import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Upload,
  Wand2,
  Download,
  Github,
  Twitter,
  Youtube,
  Instagram,
  Mail,
  MessageSquare,
  Menu,
  X,
  Printer,
  Check,
  AlertCircle,
  Settings,
  BookOpen,
  ScrollText,
  Layers,
  Mic,
  ChevronDown,
  FileType, // Generic file icon
  Users,
  UserPlus,
  Trash2
} from 'lucide-react';

/**
 * Conference & Thesis Paper Generator
 * * A React application that uses Google Gemini to generate formatted academic papers.
 * * Supports "Standard Thesis" (CPUT/Harvard style) and "Standard Conference" (2-column).
 * * Integrates strict Project Guidelines (Figure/Table placement) into all templates.
 * * Fully responsive design for all screen sizes.
 * * Feature: Target Page Length Selection.
 * * Feature: Tone/Style Selection.
 * * Feature: Multiple Export Formats (Word, TXT, HTML).
 */

const ConferencePaperGenerator = () => {
  // --- State Management ---
  const [inputMode, setInputMode] = useState('prompt'); // 'prompt' or 'upload'
  const [inputText, setInputText] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('THESIS'); // Default to Thesis
  const [targetPages, setTargetPages] = useState('Auto');
  const [selectedTone, setSelectedTone] = useState('Academic'); // New State for Tone
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [error, setError] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [userApiKey, setUserApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || '');
  const [showSettings, setShowSettings] = useState(false);
  const [previewScale, setPreviewScale] = useState(1);
  const [showExportMenu, setShowExportMenu] = useState(false); // State for export dropdown
  const [useManualAuthors, setUseManualAuthors] = useState(false);
  const [authors, setAuthors] = useState([{ name: '', affiliation: '', email: '' }]);
  const [useCustomFormatting, setUseCustomFormatting] = useState(false);
  const [customFormat, setCustomFormat] = useState({
    fontSize: '12',
    lineSpacing: '1.5',
    padding: '1.5',
    textAlign: 'justify',
    textColor: '#000000',
    fontFamily: 'Times New Roman'
  });
  const previewContainerRef = useRef(null);

  // Sanitize HTML to remove scripts and potentially harmful content
  const sanitizeHTML = (html) => {
    // Remove script tags and their content
    let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    // Remove event handlers (onclick, onerror, etc.)
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');
    // Remove javascript: protocols
    sanitized = sanitized.replace(/javascript:/gi, '');
    return sanitized;
  };

  // --- Configuration ---
  const SOCIALS = [
    { name: 'Discord', handle: 'hnk0422_76455', icon: MessageSquare, link: '#' },
    { name: 'Twitter', handle: '@HnkHorizon', icon: Twitter, link: 'https://twitter.com/HnkHorizon' },
    { name: 'TikTok', handle: '@codingfever', icon: FileText, link: 'https://tiktok.com/@codingfever' },
    { name: 'YouTube', handle: '@HNK2005', icon: Youtube, link: 'https://youtube.com/@HNK2005' },
    { name: 'Instagram', handle: 'hhnk.3693', icon: Instagram, link: 'https://instagram.com/hhnk.3693' },
    { name: 'Email', handle: 'hhnk3693@gmail.com', icon: Mail, link: 'mailto:hhnk3693@gmail.com' },
    { name: 'GitHub', handle: 'HorizonHnk', icon: Github, link: 'https://github.com/HorizonHnk/Conference-Papers.git' },
  ];

  // Definition of Tones for Prompt Engineering
  const TONES = {
    'Academic': 'Formal, objective, and scholarly. Use passive voice where appropriate. Avoid colloquialisms. Focus on rigor, evidence, and precise terminology.',
    'Professional': 'Business-like, concise, and action-oriented. Clear, direct language suitable for industry reports and executive summaries.',
    'Essay': 'Narrative flow with persuasive arguments. Personal voice is allowed where appropriate. Focus on logical structure and readability.',
    'Creative': 'Descriptive, engaging, and varied sentence structure. Allows for metaphors and storytelling elements while maintaining the subject matter.'
  };

  // Handle responsive preview scaling
  useEffect(() => {
    const handleResize = () => {
      if (previewContainerRef.current) {
        const containerWidth = previewContainerRef.current.clientWidth;
        const padding = 32; 
        const availableWidth = containerWidth - padding;
        const a4WidthPx = 794; 
        
        let newScale = 1;
        if (availableWidth < a4WidthPx) {
          newScale = availableWidth / a4WidthPx;
        }
        setPreviewScale(newScale);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); 
    const timeoutId = setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [generatedContent]);

  const TEMPLATES = {
    THESIS: {
      name: 'Standard Thesis/Dissertation',
      icon: BookOpen,
      description: 'Academic Thesis/Dissertation following standard university guidelines.',
      features: ['1.5 Line Spacing', 'Harvard Referencing', 'Complete Structure', '2.5cm Margins'],
      promptDirective: `
        Format the output as a professional HTML Thesis/Dissertation Paper.

        STRICT FORMATTING RULES (THESIS STRUCTURE):
        1. **Layout**: Single Column.
        2. **Font**: Times New Roman, Size 12.
        3. **Spacing**: Line spacing 1.5.
        4. **Margins**: 2.5cm on all sides (simulate with CSS padding).
        5. **Referencing**: Harvard Style (e.g., (Jones, 2022)).

        REQUIRED STRUCTURE (in this exact order):
        1. **Title Page**: Title, Author name(s), Institution, Date - centered and formatted.
        2. **Preface/Acknowledgements**: Brief acknowledgements section.
        3. **Abstract**: A comprehensive summary of the research aims, methodology, findings, and conclusion (approx. 200-300 words).
        4. **Table of Contents**: List of all sections with page indicators.
        5. **List of Figures**: If figures are included.
        6. **List of Tables**: If tables are included.
        7. **Introduction**: Background, context, problem statement, objectives.
        8. **Literature Review**: Critical analysis of existing research - "Previous studies by..."
        9. **Methodology**: Research design, data collection methods, analysis approach.
        10. **Results**: Presentation of data and findings.
        11. **Discussion**: Analysis and interpretation of results.
        12. **Conclusion**: Summary of findings, recommendations, future research.
        13. **References**: Complete list of all cited sources in Harvard format.
        14. **Appendices** (if needed): Supplementary materials.

        BET PROJECT REPORT GUIDELINES (MANDATORY - APPLIES TO ALL):

        1. **INTRODUCTION OF FIGURES & TABLES**:
           - Figures and Tables MUST be introduced with comprehensive information in the text BEFORE they are presented
           - Merely referring to "Figure 2" or "Table 3" is INSUFFICIENT
           - Inserting a figure or table without first introducing it is NOT acceptable
           - You must provide context for the reader

        2. **REFERENCING AND LABELING**:
           - **Direct References**: Use "Table 1 illustrates the project budget..." or "As shown in Figure 4, the output signal..."
           - NEVER use phrases like "the table below" or "the figure above"
           - **Figure Labels**: Each figure must have a number and descriptive title placed UNDERNEATH (e.g., "Figure 5: Voltage Regulator Output Waveform")
           - **Table Labels**: Each table must have a number and name placed ABOVE (e.g., "Table 2: Component Cost Breakdown")

        3. **APPENDICES**:
           - Use appendices for supplementary materials like detailed datasheets, extensive code, or additional schematics
           - Each appendix must be clearly titled (e.g., "Appendix A: PCB Schematic")
           - Reference appendices in the main text

        4. **REFERENCE INTEGRITY**:
           - Every source in the reference list MUST be cited in the main text
           - Every in-text citation MUST appear in the reference list
           - ZERO TOLERANCE for AI-generated or fake references - this is academic misconduct
           - All references must be real, verifiable sources

        5. **REFERENCES SECTION** (CRITICAL - MUST BE INCLUDED):
           - Include a complete "References" section at the end
           - Use Harvard referencing format: (Author, Year)
           - List all sources alphabetically by author surname
           - Include: Author(s), Year, Title, Publication, Volume, Pages, DOI/URL where applicable
      `
    },
    CONF_PAPER: {
      name: 'Conference Paper (IEEE Style)',
      icon: ScrollText,
      description: 'Professional two-column IEEE conference paper format.',
      features: ['Two-Column Layout', 'Strict Caption Rules', 'Roman Numeral Headers', 'Abstract & Keywords'],
      promptDirective: `
        Format the output as a professional HTML IEEE Conference Paper following the exact IEEE template format.

        PAGE LAYOUT:
        1. **Paper Size**: A4 (210mm x 297mm)
        2. **Columns**: Two-column layout for body text (CSS column-count: 2; column-gap: 0.8cm)
        3. **Margins**: Top 2.7cm, Bottom 7.2cm, Left/Right 4.465cm
        4. **Font**: Times New Roman throughout

        TITLE AREA (Single column, centered):
        1. **Title**: 24pt, centered, NO sub-titles allowed (sub-titles are not captured in IEEE Xplore)
        2. **Authors**: Arranged in up to 3 columns below title
           - Each author block contains (in order):
             * Author Name (e.g., "1st Given Name Surname")
             * Department name of organization (italic)
             * Name of organization/Affiliation (italic)
             * City, Country
             * Email address or ORCID

        ABSTRACT AND KEYWORDS (Single column):
        1. **Abstract**: Bold "Abstract—" followed by 150-250 word summary
           - *CRITICAL*: Do NOT use symbols, special characters, footnotes, or math in Abstract
        2. **Keywords**: Bold "Keywords—" followed by comma-separated terms (4-6 keywords)

        SECTION HEADINGS (Roman numerals, SMALL CAPS, centered):
        - **I. INTRODUCTION** (Heading 1 - Roman numeral, all caps, centered)
        - **A. Subsection Title** (Heading 2 - Letter, italic title)
        - **1) Sub-subsection** (Heading 3 - Number with parenthesis)
        - **a) Sub-sub-subsection** (Heading 4 - Letter with parenthesis, italic)

        REQUIRED CONTENT STRUCTURE:
        - **Abstract**: Brief summary (NO math/symbols)
        - **Keywords**: 4-6 relevant terms, comma-separated
        - **I. INTRODUCTION**: Background, context, objectives
        - **II. RELATED WORK/LITERATURE REVIEW**: Previous research
        - **III. METHODOLOGY**: Approach and methods
        - **IV. RESULTS**: Data and findings
        - **V. DISCUSSION**: Analysis of results
        - **VI. CONCLUSION**: Summary and future work
        - **ACKNOWLEDGMENT**: (No Roman numeral, no "e" after "g")
        - **REFERENCES**: (No Roman numeral)

        FIGURES AND TABLES:
        1. **Figure Captions**: BELOW the figure, format: "Fig. 1. Description here."
           - Use "Fig. 1" abbreviation even at beginning of sentence
           - Use 8pt Times New Roman for figure labels
        2. **Table Titles**: ABOVE the table, format: "TABLE I. TITLE IN CAPS"
           - Tables use Roman numerals (TABLE I, TABLE II, etc.)
           - Table footnotes use superscript letters (a, b, c)
        3. **Placement**: Place figures/tables at top or bottom of columns, avoid middle
        4. **Large elements**: May span across both columns

        EQUATIONS:
        - Number consecutively with right-aligned numbers in parentheses: (1)
        - Center equations using center alignment
        - Use "(1)" not "Eq. (1)" except at sentence beginning
        - Italicize variables but NOT Greek symbols

        REFERENCES FORMAT:
        - Numbered consecutively [1], [2], [3] in brackets
        - Use "[3]" not "Ref. [3]" except at sentence beginning
        - List all authors unless 6+ (then use "et al.")
        - Capitalize only first word in paper titles
        - MUST include a complete REFERENCES section at the end

        BET PROJECT REPORT GUIDELINES (MANDATORY - APPLIES TO ALL):

        1. **INTRODUCTION OF FIGURES & TABLES**:
           - Figures and Tables MUST be introduced with comprehensive information in the text BEFORE they are presented
           - Merely referring to "Fig. 2" or "Table III" is INSUFFICIENT
           - Inserting a figure or table without first introducing it is NOT acceptable
           - Provide context for the reader before showing any visual element

        2. **REFERENCING AND LABELING**:
           - **Direct References**: Use "Table I illustrates the project budget..." or "As shown in Fig. 4, the output signal..."
           - NEVER use phrases like "the table below" or "the figure above"
           - **Figure Labels**: Each figure must have a number and descriptive title placed UNDERNEATH (e.g., "Fig. 5. Voltage Regulator Output Waveform")
           - **Table Labels**: Each table must have Roman numeral and name placed ABOVE (e.g., "TABLE II. COMPONENT COST BREAKDOWN")

        3. **APPENDICES**:
           - Use appendices for supplementary materials like detailed datasheets, extensive code, or additional schematics
           - Each appendix must be clearly titled (e.g., "Appendix A: PCB Schematic")
           - Reference appendices in the main text

        4. **REFERENCE INTEGRITY**:
           - Every source in the reference list MUST be cited in the main text
           - Every in-text citation [1], [2] MUST appear in the reference list
           - ZERO TOLERANCE for AI-generated or fake references - this is academic misconduct
           - All references must be real, verifiable sources

        5. **REFERENCES SECTION** (CRITICAL - MUST BE INCLUDED):
           - Include a complete "REFERENCES" section at the end (no Roman numeral)
           - Number references consecutively [1], [2], [3]
           - Include: Author(s), "Title," Publication, vol., pp., Month Year.

        6. **ADDITIONAL IEEE REQUIREMENTS**:
           - **Abbreviations**: Define on first use (except IEEE, SI, MKS, CGS, etc.)
           - **Units**: Use SI units, zero before decimals ("0.25" not ".25")
           - **Equations**: Use "(1)" not "Eq. (1)" except at sentence beginning
      `
    }
  };

  // --- API Interaction ---
  const generatePaper = async () => {
    if (!inputText.trim()) {
      setError("Please enter some content or a prompt first.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedContent(null);

    const apiKey = userApiKey || ""; 
    const templateConfig = TEMPLATES[selectedTemplate];
    const toneInstruction = TONES[selectedTone]; 
    
    const lengthInstruction = targetPages === 'Auto'
      ? "Content Length: Generate comprehensive content appropriate for the topic, ensuring all sections are well-covered."
      : `Content Length: Generate a SUBSTANTIAL amount of detailed text, data, figures, and tables. The output HTML must contain enough content to fill approximately ${targetPages} when printed. Expand deeply on Methodology, Literature Review, and Discussion to meet this length requirement.`;

    // Custom formatting instruction
    const customFormatInstruction = useCustomFormatting
      ? `
      CUSTOM FORMATTING (USER SPECIFIED - USE THESE VALUES):
      - Font Family: '${customFormat.fontFamily}', serif
      - Font Size: ${customFormat.fontSize}pt
      - Line Spacing: ${customFormat.lineSpacing}
      - Margins/Padding: ${customFormat.padding}cm
      - Text Alignment: ${customFormat.textAlign}
      - Text Color: ${customFormat.textColor}

      Apply these custom styles to the body: body { font-family: '${customFormat.fontFamily}', serif; font-size: ${customFormat.fontSize}pt; line-height: ${customFormat.lineSpacing}; padding: ${customFormat.padding}cm; color: ${customFormat.textColor}; text-align: ${customFormat.textAlign}; max-width: 210mm; margin: auto; }
      `
      : '';

    const defaultCssInstruction = useCustomFormatting
      ? ''
      : `
      - For Thesis: body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; padding: 1.5cm; max-width: 210mm; margin: auto; text-align: justify; }
      - For Conference: body { font-family: 'Times New Roman', serif; font-size: 10pt; padding: 1cm; max-width: 210mm; margin: auto; } .columns { column-count: 2; column-gap: 0.6cm; text-align: justify; } .title-area { column-span: all; text-align: center; margin-bottom: 0.8cm; }`;

    const systemPrompt = `
      You are an expert academic paper formatter.
      Generate a COMPLETE, styled HTML document.

      ${templateConfig.promptDirective}

      TONE AND STYLE INSTRUCTION:
      ${toneInstruction}

      ${lengthInstruction}
      ${customFormatInstruction}

      TECHNICAL CSS REQUIREMENTS:
      - Use <style> blocks.${defaultCssInstruction}
      - Figures/Tables: Ensure captions are correctly placed (Table ABOVE, Figure BELOW).
      - Do not use Markdown backticks. Return raw HTML.
      - DO NOT include any <script> tags or JavaScript code.
      - DO NOT use event handlers (onclick, onload, etc.).
      - Output must be pure HTML with inline CSS only.
      - Make it look exactly like a printed PDF.

      MATHEMATICAL EQUATIONS:
      - Use proper HTML mathematical notation with <i> for italics (variables)
      - For inline equations: <i>x</i> = <i>y</i> + 2
      - For displayed equations: Use centered div with proper spacing
      - Example: <div style="text-align: center; margin: 1em 0;"><i>E</i> = <i>mc</i><sup>2</sup></div>
      - Use <sup> for superscripts, <sub> for subscripts
      - Use proper symbols: × (multiplication), ÷ (division), ≈ (approximately), ≠ (not equal), ≤ (less than or equal), ≥ (greater than or equal)
      - Greek letters: α β γ δ ε θ λ μ π σ φ ω Δ Σ Ω
      - Fractions: Use division line like <div style="text-align: center;"><div style="border-bottom: 1px solid black; display: inline-block; padding: 0 0.5em;"><i>a</i></div><div style="display: inline-block; padding: 0 0.5em;"><i>b</i></div></div>
      - Make equations readable and properly formatted for printing and Word export
    `;

    const authorInfo = useManualAuthors && authors.some(a => a.name.trim())
      ? `\n\nAUTHOR INFORMATION (Use these exact details in the paper):\n${authors.map((author, idx) =>
          `Author ${idx + 1}: ${author.name}${author.affiliation ? `\nAffiliation: ${author.affiliation}` : ''}${author.email ? `\nEmail: ${author.email}` : ''}`
        ).join('\n\n')}`
      : '';

    const userPrompt = `
      Topic/Content to Process:
      ${inputText}
      ${authorInfo}

      Please generate the full document now, strictly adhering to the guidelines.
    `;

    try {
      const fetchWithRetry = async (retries = 3, delay = 1000) => {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: userPrompt }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] },
              }),
            }
          );
          
          if (!response.ok) throw new Error(`API Error: ${response.status}`);
          return await response.json();
        } catch (err) {
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchWithRetry(retries - 1, delay * 2);
          }
          throw err;
        }
      };

      const data = await fetchWithRetry();
      let text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text) {
        text = text.replace(/```html/g, '').replace(/```/g, '');
        // Sanitize HTML to remove scripts and event handlers
        text = sanitizeHTML(text);
        setGeneratedContent(text);
      } else {
        throw new Error("No content generated.");
      }

    } catch (err) {
      console.error(err);
      if (err.message.includes("403")) {
        setError("❌ Invalid or Missing API Key: Please verify your Google Gemini API key in Settings. Get a key at: https://makersuite.google.com/app/apikey");
      } else if (err.message.includes("429")) {
        setError("⚠️ Rate Limit Exceeded: Too many requests. Please wait a moment and try again.");
      } else {
        setError(`Failed to generate paper: ${err.message}. Please check your API key or try again later.`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // --- Download Handlers ---

  // 1. Download as HTML (Original)
  const handleDownloadHTML = () => {
    const completeHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Academic Paper</title>
</head>
<body>
${generatedContent}
</body>
</html>`;
    const blob = new Blob([completeHTML], { type: 'text/html; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  // 2. Download as Word (.doc)
  // This wraps the content in a compatible MSO XML header so Word opens it correctly with styles
  const handleDownloadWord = () => {
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>Document</title>
<!--[if gte mso 9]>
<xml>
<w:WordDocument>
<w:View>Print</w:View>
<w:Zoom>100</w:Zoom>
</w:WordDocument>
</xml>
<![endif]-->
<style>
@page {
  size: A4;
  margin: 2.5cm;
}
body {
  font-family: 'Times New Roman', Times, serif;
  font-size: 12pt;
  line-height: 1.5;
}
</style>
</head>
<body>`;
    const footer = "</body></html>";
    const sourceHTML = header + generatedContent + footer;

    const blob = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.doc'; // .doc opens in Word with HTML formatting preserved
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  // 3. Download as Text (.txt)
  // Removes all HTML tags but preserves structure
  const handleDownloadTxt = () => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = generatedContent;

    // Preserve headings, paragraphs, and lists
    const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(h => {
      const level = h.tagName;
      const decoration = level === 'H1' ? '=' : level === 'H2' ? '-' : '#';
      h.textContent = '\n' + h.textContent + '\n' + decoration.repeat(h.textContent.length) + '\n';
    });

    const text = tempDiv.innerText;
    const blob = new Blob([text], { type: 'text/plain; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.txt';
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Print Document</title>
  <style>
    @page {
      size: A4;
      margin: 2.5cm;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      line-height: 1.5;
      margin: 0;
      padding: 0;
    }
    @media print {
      body {
        margin: 0;
        padding: 0;
      }
    }
  </style>
</head>
<body>
${generatedContent}
</body>
</html>`;
    printWindow.document.write(printContent);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  // --- Handlers ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = (e) => setInputText(e.target.result);
        reader.readAsText(file);
      } else {
        setInputText(`[File Uploaded: ${file.name}]\n\nPlease generate a paper based on the content of this file. (Note: For this demo, please copy-paste text if not .txt)`);
      }
    }
  };

  // --- Components ---

  const Nav = () => (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <FileText className="h-8 w-8 text-blue-400" />
            <span className="font-bold text-xl tracking-tight hidden sm:block">PaperGen AI</span>
            <span className="font-bold text-xl tracking-tight sm:hidden">PaperGen</span>
          </button>
          
          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#generator" className="hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium">Generator</a>
              <a href="#templates" className="hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium">Templates</a>
              <a href="#contact" className="hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium">Contact</a>
              <button onClick={() => setShowSettings(true)} className="hover:bg-slate-700 p-2 rounded-full transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-2 text-gray-400 hover:text-white focus:outline-none">
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700 absolute w-full z-50">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#generator" onClick={() => setShowMobileMenu(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700">Generator</a>
            <a href="#templates" onClick={() => setShowMobileMenu(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700">Templates</a>
            <a href="#contact" onClick={() => setShowMobileMenu(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700">Contact</a>
            <button onClick={() => { setShowSettings(true); setShowMobileMenu(false); }} className="flex w-full items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700">
              <Settings className="h-4 w-4" /> Settings
            </button>
          </div>
        </div>
      )}
    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      <Nav />
      
      {/* Hero Section - Fully Responsive */}
      <div className="relative bg-slate-900 text-white py-16 md:py-24 overflow-hidden px-4">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight mb-4 sm:mb-6 leading-tight">
            Academic Papers <br className="hidden sm:block" /> <span className="text-blue-400">Made Intelligent</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-slate-300 px-2">
            Generate perfectly formatted Thesis and Conference papers. 
            <br className="hidden md:block" />
            Strict adherence to Harvard referencing and project guidelines.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-4 px-4">
            <a href="#generator" className="bg-blue-600 hover:bg-blue-700 px-6 sm:px-8 py-3 rounded-lg font-bold text-base sm:text-lg flex items-center justify-center gap-2 transition-all w-full sm:w-auto">
              <Wand2 className="h-5 w-5" /> Create Paper
            </a>
            <a href="https://github.com/HorizonHnk/Conference-Papers.git" target="_blank" rel="noreferrer" className="bg-slate-700 hover:bg-slate-600 px-6 sm:px-8 py-3 rounded-lg font-bold text-base sm:text-lg flex items-center justify-center gap-2 transition-all w-full sm:w-auto">
              <Github className="h-5 w-5" /> View Repo
            </a>
          </div>
        </div>
      </div>

      {/* Template Selector - Responsive Grid */}
      <div id="templates" className="py-12 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Available Templates</h2>
            <p className="mt-2 text-gray-600">Select your required format</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {Object.entries(TEMPLATES).map(([key, template]) => (
              <div 
                key={key}
                onClick={() => setSelectedTemplate(key)}
                className={`cursor-pointer rounded-xl border-2 p-6 transition-all hover:shadow-lg relative flex flex-col ${selectedTemplate === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${selectedTemplate === key ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                      <template.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-lg md:text-xl text-gray-900">{template.name}</h3>
                  </div>
                  {selectedTemplate === key && <Check className="h-6 w-6 text-blue-500" />}
                </div>
                <p className="text-gray-600 mb-6 text-sm">{template.description}</p>
                <ul className="space-y-3 mt-auto">
                  {template.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 flex-shrink-0 bg-blue-400 rounded-full"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Generator Section - Responsive Layout */}
      <div id="generator" className="py-12 md:py-16 bg-white border-t border-gray-200 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            
            {/* Left Column: Inputs */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2">
                  <Settings className="h-6 w-6 text-slate-700" />
                  Paper Details
                </h2>

                <div className="flex p-1 bg-gray-100 rounded-lg mb-6">
                  <button 
                    onClick={() => setInputMode('prompt')}
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${inputMode === 'prompt' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Prompt
                  </button>
                  <button 
                    onClick={() => setInputMode('upload')}
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${inputMode === 'upload' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Upload
                  </button>
                </div>

                {inputMode === 'prompt' ? (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Topic or Abstract</label>
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Describe your research topic, methodology, and findings here. The AI will structure it into the selected format."
                      className="w-full h-48 sm:h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base"
                    ></textarea>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center hover:bg-gray-50 transition-colors">
                      <Upload className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 mb-2">Drag and drop or click to upload</p>
                      <p className="text-xs text-gray-400 mb-4">Simulates scanning of text files</p>
                      <input 
                        type="file" 
                        onChange={handleFileUpload}
                        className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mx-auto"
                      />
                    </div>
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Extracted content will appear here..."
                      className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    ></textarea>
                  </div>
                )}

                {/* Target Length Selector */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                    <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <Layers className="h-4 w-4 text-blue-500" /> Target Length
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {['Auto', '1-2 Pages', '3-5 Pages', '6-10 Pages', '10+ Pages'].map((opt) => (
                        <button
                            key={opt}
                            onClick={() => setTargetPages(opt)}
                            className={`px-3 py-2 text-sm rounded-lg border transition-colors ${targetPages === opt ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                        >
                            {opt}
                        </button>
                        ))}
                    </div>
                </div>

                {/* Tone Selector */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <Mic className="h-4 w-4 text-blue-500" /> Tone & Style
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.keys(TONES).map((t) => (
                        <button
                            key={t}
                            onClick={() => setSelectedTone(t)}
                            className={`px-3 py-2 text-sm rounded-lg border transition-colors ${selectedTone === t ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                        >
                            {t}
                        </button>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Adjusts the voice, vocabulary, and structure of the response.
                    </p>
                </div>

                {/* Author Details Section */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                      <Users className="h-4 w-4 text-blue-500" /> Author Details
                    </label>
                    <button
                      onClick={() => setUseManualAuthors(!useManualAuthors)}
                      className={`px-3 py-1 text-xs rounded-md transition-colors ${useManualAuthors ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {useManualAuthors ? 'Manual' : 'AI Generated'}
                    </button>
                  </div>

                  {useManualAuthors && (
                    <div className="space-y-3">
                      {authors.map((author, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-600">Author {index + 1}</span>
                            {authors.length > 1 && (
                              <button
                                onClick={() => setAuthors(authors.filter((_, i) => i !== index))}
                                className="text-red-500 hover:text-red-700"
                                title="Remove author"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            placeholder="Full Name"
                            value={author.name}
                            onChange={(e) => {
                              const newAuthors = [...authors];
                              newAuthors[index].name = e.target.value;
                              setAuthors(newAuthors);
                            }}
                            className="w-full mb-2 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <input
                            type="text"
                            placeholder="Affiliation (Optional)"
                            value={author.affiliation}
                            onChange={(e) => {
                              const newAuthors = [...authors];
                              newAuthors[index].affiliation = e.target.value;
                              setAuthors(newAuthors);
                            }}
                            className="w-full mb-2 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <input
                            type="email"
                            placeholder="Email (Optional)"
                            value={author.email}
                            onChange={(e) => {
                              const newAuthors = [...authors];
                              newAuthors[index].email = e.target.value;
                              setAuthors(newAuthors);
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      ))}

                      <button
                        onClick={() => setAuthors([...authors, { name: '', affiliation: '', email: '' }])}
                        className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 border border-blue-300 hover:border-blue-400 rounded-md flex items-center justify-center gap-2 transition-colors"
                      >
                        <UserPlus className="h-4 w-4" />
                        Add Another Author
                      </button>
                    </div>
                  )}

                  {!useManualAuthors && (
                    <p className="text-xs text-gray-500">
                      AI will generate appropriate author names based on your content.
                    </p>
                  )}
                </div>

                {/* Custom Formatting Section */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                      <Settings className="h-4 w-4 text-blue-500" /> Custom Formatting
                    </label>
                    <button
                      onClick={() => setUseCustomFormatting(!useCustomFormatting)}
                      className={`px-3 py-1 text-xs rounded-md transition-colors ${useCustomFormatting ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {useCustomFormatting ? 'Custom' : 'Default'}
                    </button>
                  </div>

                  {useCustomFormatting && (
                    <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Font Size (pt)</label>
                          <select
                            value={customFormat.fontSize}
                            onChange={(e) => setCustomFormat({...customFormat, fontSize: e.target.value})}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="10">10pt</option>
                            <option value="11">11pt</option>
                            <option value="12">12pt</option>
                            <option value="14">14pt</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Line Spacing</label>
                          <select
                            value={customFormat.lineSpacing}
                            onChange={(e) => setCustomFormat({...customFormat, lineSpacing: e.target.value})}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="1">Single (1.0)</option>
                            <option value="1.15">1.15</option>
                            <option value="1.5">1.5</option>
                            <option value="2">Double (2.0)</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Margins (cm)</label>
                          <select
                            value={customFormat.padding}
                            onChange={(e) => setCustomFormat({...customFormat, padding: e.target.value})}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="0.5">0.5cm (Narrow)</option>
                            <option value="1">1cm (Small)</option>
                            <option value="1.5">1.5cm (Normal)</option>
                            <option value="2">2cm (Wide)</option>
                            <option value="2.5">2.5cm (Extra Wide)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Text Align</label>
                          <select
                            value={customFormat.textAlign}
                            onChange={(e) => setCustomFormat({...customFormat, textAlign: e.target.value})}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="justify">Justify</option>
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Font Family</label>
                          <select
                            value={customFormat.fontFamily}
                            onChange={(e) => setCustomFormat({...customFormat, fontFamily: e.target.value})}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Arial">Arial</option>
                            <option value="Calibri">Calibri</option>
                            <option value="Georgia">Georgia</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Text Color</label>
                          <input
                            type="color"
                            value={customFormat.textColor}
                            onChange={(e) => setCustomFormat({...customFormat, textColor: e.target.value})}
                            className="w-full h-8 px-1 py-0.5 border border-gray-300 rounded-md cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {!useCustomFormatting && (
                    <p className="text-xs text-gray-500">
                      Using default formatting based on selected template.
                    </p>
                  )}
                </div>

                <button
                  onClick={generatePaper}
                  disabled={isGenerating}
                  className={`mt-6 w-full py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg text-white flex items-center justify-center gap-2 transition-all shadow-lg ${isGenerating ? 'bg-blue-400 cursor-wait' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5'}`}
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-5 w-5" /> Generate Paper
                    </>
                  )}
                </button>
                
                {error && (
                  <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Preview - Smart Scaling */}
            <div className="bg-gray-100 rounded-xl border border-gray-200 overflow-hidden flex flex-col h-full lg:min-h-[1180px] shadow-inner relative preview-isolation">
              <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between shrink-0 z-10 relative">
                <h3 className="font-bold text-gray-700">Preview</h3>
                {generatedContent && (
                  <div className="flex gap-2 items-center">
                    <button onClick={handlePrint} className="p-2 hover:bg-gray-100 rounded-md text-gray-600" title="Print / Save as PDF">
                      <Printer className="h-5 w-5" />
                    </button>
                    
                    {/* Export Dropdown */}
                    <div className="relative">
                      <button 
                        onClick={() => setShowExportMenu(!showExportMenu)}
                        className="flex items-center gap-1 p-2 hover:bg-gray-100 rounded-md text-gray-600 text-sm font-medium"
                        title="Export Options"
                      >
                        <Download className="h-5 w-5" />
                        Export
                        <ChevronDown className="h-3 w-3" />
                      </button>
                      
                      {showExportMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-100 py-1 animate-in fade-in zoom-in duration-200">
                          <button 
                            onClick={handleDownloadWord}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2"
                          >
                            <FileType className="h-4 w-4" />
                            Word Document (.doc)
                          </button>
                          <button 
                            onClick={handleDownloadTxt}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2"
                          >
                            <FileText className="h-4 w-4" />
                            Plain Text (.txt)
                          </button>
                          <button 
                            onClick={handleDownloadHTML}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2"
                          >
                            <Download className="h-4 w-4" />
                            HTML File (.html)
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Preview Content with Auto-Scale */}
              <div
                className="flex-1 overflow-y-auto overflow-x-auto bg-slate-200 custom-scrollbar p-4"
                ref={previewContainerRef}
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}
              >
                {generatedContent ? (
                  <div
                    id="preview-wrapper"
                    style={{
                      width: `${794 * previewScale}px`,
                      margin: '0 auto'
                    }}
                  >
                    <iframe
                      srcDoc={generatedContent}
                      style={{
                        width: '794px',
                        minHeight: '1123px',
                        height: 'auto',
                        border: 'none',
                        display: 'block',
                        backgroundColor: 'white',
                        boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
                        transform: `scale(${previewScale})`,
                        transformOrigin: 'top left'
                      }}
                      sandbox="allow-same-origin"
                      title="Document Preview"
                      onLoad={(e) => {
                        const iframe = e.target;
                        if (iframe.contentDocument) {
                          const height = iframe.contentDocument.documentElement.scrollHeight;
                          iframe.style.height = height + 'px';
                          // Update wrapper height to match scaled iframe
                          const wrapper = document.getElementById('preview-wrapper');
                          if (wrapper) {
                            wrapper.style.height = (height * previewScale) + 'px';
                          }
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 px-4 text-center">
                    <FileText className="h-16 w-16 sm:h-20 sm:w-20 mb-4 opacity-20" />
                    <p className="text-base sm:text-lg font-medium">Generated document will appear here</p>
                    <p className="text-xs sm:text-sm mt-2 max-w-xs opacity-60">Select a template to get started.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Contact Section */}
      <section id="contact" className="bg-slate-900 text-white py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold">Connect With The Team</h2>
            <p className="mt-2 text-slate-400">Follow us for updates and more tools</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Social Links */}
            <div className="bg-slate-800 p-6 md:p-8 rounded-xl">
              <h3 className="text-xl font-bold mb-6">Social Media</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SOCIALS.map((social, idx) => (
                  <a 
                    key={idx}
                    href={social.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors group"
                  >
                    <social.icon className="h-5 w-5 text-blue-400 group-hover:text-blue-300 shrink-0" />
                    <div className="overflow-hidden">
                      <p className="font-bold text-sm truncate">{social.name}</p>
                      <p className="text-xs text-slate-400 font-mono truncate">{social.handle}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-slate-800 p-6 md:p-8 rounded-xl">
              <h3 className="text-xl font-bold mb-6">Get In Touch</h3>
              <form action={`https://formspree.io/f/${import.meta.env.VITE_FORMSPREE_ID}`} method="POST" className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Your Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    required 
                    className="w-full bg-slate-700 border-none rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="hnk@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Message</label>
                  <textarea 
                    name="message" 
                    required 
                    className="w-full bg-slate-700 border-none rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                    placeholder="I need help with..."
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Settings</h3>
              <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gemini API Key</label>
                <p className="text-xs text-gray-500 mb-2">Leave empty to use the default preview key. Enter your own key for private use.</p>
                <input 
                  type="password"
                  value={userApiKey}
                  onChange={(e) => setUserApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button 
                onClick={() => setShowSettings(false)}
                className="w-full bg-gray-900 text-white font-medium py-2 rounded-lg hover:bg-gray-800"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 py-8 text-center text-sm px-4">
        <p>&copy; 2025 HnkHorizon. All rights reserved.</p>
        <div className="mt-2 flex flex-wrap justify-center gap-4">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Templates</a>
        </div>
      </footer>
    </div>
  );
};

export default ConferencePaperGenerator;