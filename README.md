# PaperGen AI - Academic Paper Generator

> **AI-Powered Academic Paper Generator with Google Gemini**
> Generate professionally formatted thesis and conference papers instantly with intelligent AI assistance.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://paper-generator-ai.netlify.app/)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.21-646CFF)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## Live Demo

**Try the application:** [https://paper-generator-ai.netlify.app/](https://paper-generator-ai.netlify.app/)

---

## Features

### Two Academic Formats

**Standard Thesis/Dissertation**
- CPUT/Harvard style structure
- Single column layout with 1.5 line spacing
- Times New Roman 12pt font
- Proper chapter organization (Introduction, Literature Review, Methodology, Results, Discussion, Conclusion)
- Harvard referencing style
- BET Project Report Guidelines compliance

**Conference Paper (IEEE Style)**
- Professional two-column format
- Roman numeral section headers (I, II, III...)
- Abstract and keywords section
- Author affiliations with superscript notation
- Figure captions below, table captions above
- Proper citation format [1], [2], [3]

### Intelligent Content Generation

- **Google Gemini 2.0 Flash** - Latest AI model for fast, high-quality generation
- **Target Page Length** - Auto, 1-2, 3-5, 6-10, or 10+ pages
- **Tone & Style Options:**
  - Academic (formal, scholarly, rigorous)
  - Professional (business-like, action-oriented)
  - Essay (narrative flow, persuasive)
  - Creative (descriptive, engaging)

### Custom Formatting Options

Users can customize document appearance:
- **Font Size** - 10pt to 16pt
- **Line Spacing** - 1.0, 1.15, 1.5, 2.0
- **Margins** - 0.5cm to 3cm
- **Text Alignment** - Left, Center, Right, Justify
- **Font Family** - Times New Roman, Arial, Georgia, Calibri
- **Text Color** - Color picker for custom colors

### Author Management

- **Manual Input** - Add multiple authors with:
  - Full Name
  - Affiliation (Institution)
  - Email Address
- **AI-Generated** - Let AI create contextually appropriate author names

### Export Formats

| Format | Description |
|--------|-------------|
| **HTML** | Complete standalone document with embedded styles |
| **Word (.doc)** | Microsoft Word compatible with full formatting |
| **PDF/Print** | Browser print dialog with proper page layout |
| **Plain Text (.txt)** | Structured text with heading decorations |

### Security Features

- **HTML Sanitization** - Removes `<script>` tags and event handlers
- **Iframe Isolation** - Preview content isolated from main application
- **Sandbox Attribute** - Additional iframe security layer
- **XSS Prevention** - Regex-based content filtering

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18.2.0 |
| **Build Tool** | Vite 5.4.21 |
| **Styling** | Tailwind CSS 3.4.0 |
| **Icons** | Lucide React |
| **AI Model** | Google Gemini 2.0 Flash |
| **Form Handling** | Formspree |
| **Hosting** | Netlify |

---

## Project Structure

```
PaperGen-AI/
├── public/
│   └── favicon.svg              # Application icon
├── src/
│   ├── App.jsx                  # Root component
│   ├── ConferencePaperGenerator.jsx  # Main application logic (1200+ lines)
│   ├── index.jsx                # React entry point
│   └── index.css                # Global styles & Tailwind directives
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── index.html                   # HTML entry point
├── package.json                 # Dependencies & scripts
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
└── README.md                    # Documentation
```

---

## Getting Started

### Prerequisites

- **Node.js** 16.x or higher
- **npm** or **yarn**
- **Google Gemini API Key** - [Get free key](https://makersuite.google.com/app/apikey)
- **Formspree Account** (optional) - [Create form](https://formspree.io)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HorizonHnk/Conference-Papers.git
   cd Conference-Papers
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy the example file
   cp .env.example .env

   # Edit .env with your keys
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_FORMSPREE_ID=your_formspree_form_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   App opens at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```

   Output in `dist/` folder

---

## Environment Variables

Create a `.env` file in the root directory:

```env
# Required: Google Gemini API Key
# Get your free key at: https://makersuite.google.com/app/apikey
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Formspree Form ID for contact form
# Get your form ID at: https://formspree.io
VITE_FORMSPREE_ID=your_formspree_form_id
```

> **Important:** Never commit your `.env` file to version control. It's already included in `.gitignore`.

---

## Code Architecture

### Main Component (`ConferencePaperGenerator.jsx`)

The application is built as a single-page React application with the following key sections:

```javascript
// State Management
const [selectedTemplate, setSelectedTemplate] = useState(null);  // THESIS or CONFERENCE
const [userInput, setUserInput] = useState('');                  // Research topic
const [generatedContent, setGeneratedContent] = useState(null);  // AI output
const [customFormat, setCustomFormat] = useState({...});         // User formatting

// Template Configuration
const TEMPLATES = {
  THESIS: { name, icon, description, features, promptDirective },
  CONFERENCE: { name, icon, description, features, promptDirective }
};

// Core Functions
generatePaper()      // Calls Gemini API with template-specific prompts
sanitizeHtml()       // Removes malicious content from AI output
exportToWord()       // Creates .doc file with proper formatting
exportToText()       // Creates .txt with structural formatting
exportToHtml()       // Creates standalone HTML document
```

### AI Integration

The application uses Google Gemini 2.0 Flash with structured prompts:

```javascript
// API Call Structure
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] }
    })
  }
);
```

### Styling System

Uses Tailwind CSS with custom utilities:

```css
/* Layout Isolation */
.preview-isolation {
  isolation: isolate;
  contain: layout style paint;
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 8px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #888; }
```

---

## Usage Guide

### Basic Workflow

1. **Select Template** - Click on Thesis or Conference Paper card
2. **Enter Topic** - Describe your research topic in detail
3. **Configure Options:**
   - Choose target page length
   - Select writing tone
   - Toggle custom formatting (optional)
   - Add author details (optional)
4. **Generate** - Click "Generate Paper" button
5. **Preview** - Review in live preview panel
6. **Export** - Download in preferred format

### Custom Formatting

Toggle "Custom" mode to access:
- Font size slider (10-16pt)
- Line spacing dropdown
- Margin adjustment
- Text alignment options
- Font family selection
- Color picker for text

### Mathematical Content

The AI automatically formats equations:
```html
<!-- Inline equation -->
<i>E</i> = <i>mc</i><sup>2</sup>

<!-- Greek letters -->
α, β, γ, δ, θ, λ, π, σ, ω

<!-- Mathematical symbols -->
×, ÷, ≈, ≠, ≤, ≥, ∑, ∫
```

---

## Deployment

### Netlify (Recommended)

1. **Connect Repository**
   - Log in to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Select your repository

2. **Configure Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Set Environment Variables**
   - Go to Site settings > Environment variables
   - Add `VITE_GEMINI_API_KEY` and `VITE_FORMSPREE_ID`

4. **Deploy**
   - Automatic deploys on push to main branch

### Vercel

```bash
npm install -g vercel
vercel
# Follow prompts to deploy
```

### Manual Deployment

```bash
npm run build
# Upload dist/ folder to any static hosting
```

---

## API Reference

### Gemini API Request

```javascript
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent

{
  "contents": [{
    "parts": [{ "text": "User's research topic and requirements" }]
  }],
  "systemInstruction": {
    "parts": [{ "text": "Template-specific formatting instructions" }]
  }
}
```

### Gemini API Response

```javascript
{
  "candidates": [{
    "content": {
      "parts": [{ "text": "<html>Generated document...</html>" }]
    }
  }]
}
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/NewFeature`)
3. Commit changes (`git commit -m 'Add NewFeature'`)
4. Push to branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

### Guidelines

- Use functional components with React hooks
- Follow Tailwind CSS conventions
- Add comments for complex logic
- Test all export formats
- Ensure mobile responsiveness

---

## Known Issues

- Mathematical equations may render differently in older Word versions
- Very long documents (100+ pages) may impact browser performance
- Print/PDF quality depends on browser capabilities

---

## Roadmap

- [ ] Additional citation styles (APA, MLA, Chicago)
- [ ] LaTeX export option
- [ ] Real-time collaborative editing
- [ ] Template marketplace
- [ ] Advanced equation editor
- [ ] Reference manager integration
- [ ] Dark mode toggle

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Author

**HnkHorizon**

- GitHub: [@HorizonHnk](https://github.com/HorizonHnk)
- YouTube: [@HNK2005](https://youtube.com/@HNK2005)
- Email: hhnk3693@gmail.com

---

## Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) - AI text generation
- [React](https://reactjs.org/) - UI framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide Icons](https://lucide.dev/) - Icon library
- [Vite](https://vitejs.dev/) - Build tool
- [Netlify](https://netlify.com/) - Hosting platform
- [Formspree](https://formspree.io/) - Form handling

---

## Support

For support, email hhnk3693@gmail.com or [open an issue](https://github.com/HorizonHnk/Conference-Papers/issues).

---

<div align="center">

**Built with React + Vite + Tailwind CSS**

[Live Demo](https://paper-generator-ai.netlify.app/) | [Report Bug](https://github.com/HorizonHnk/Conference-Papers/issues) | [Request Feature](https://github.com/HorizonHnk/Conference-Papers/issues)

</div>
