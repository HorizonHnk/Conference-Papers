# PaperGen AI - Academic Paper Generator

> **AI-Powered Academic Paper Generator with Google Gemini 2.0 Flash**
> Generate professionally formatted thesis and conference papers instantly with intelligent AI assistance.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://paper-generator-ai.netlify.app/)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.21-646CFF)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-11.8.1-FFCA28)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## Live Demo

**Try the application:** [https://paper-generator-ai.netlify.app/](https://paper-generator-ai.netlify.app/)

---

## Features

### Two Academic Formats

| Format | Description |
|--------|-------------|
| **Standard Thesis/Dissertation** | CPUT/Harvard style structure, single column layout with 1.5 line spacing, Times New Roman 12pt font, proper chapter organization, Harvard referencing |
| **Conference Paper (IEEE Style)** | Professional two-column format, Roman numeral section headers, abstract and keywords, author affiliations with superscript notation, IEEE citation format [1], [2], [3] |

### Intelligent Content Generation

- **Google Gemini 2.0 Flash** - Latest AI model for fast, high-quality generation
- **Target Page Length** - Auto, 1-2, 3-5, 6-10, or 10+ pages
- **Tone & Style Options:**
  - Academic (formal, scholarly, rigorous)
  - Professional (business-like, action-oriented)
  - Essay (narrative flow, persuasive)
  - Creative (descriptive, engaging)
- **Reference Style Selection** - Auto, Harvard, or IEEE

### File Upload & Text Extraction

Upload documents to use as input for paper generation:

| Format | Processing Method |
|--------|-------------------|
| **PDF** | Text extraction using PDF.js |
| **Word (.docx)** | Text extraction using Mammoth.js |
| **TXT** | Direct text reading |
| **Images** (PNG, JPG, JPEG, GIF, WebP) | OCR using Gemini Vision AI |

**Upload Features:**
- Drag & drop support
- Click to browse files
- Real-time processing status
- Editable extracted content
- Character count display

### User Authentication (Firebase)

- **Google Sign-In** - One-click authentication
- **Email/Password** - Traditional sign up and sign in
- **Password Reset** - Email-based recovery
- **Profile Management** - User icon display in navbar

### Cloud Document Storage (Firestore)

- **Save Papers** - Store generated papers to cloud
- **My Papers** - Access saved documents anytime
- **Load Documents** - Restore previous work
- **Delete Documents** - Remove unwanted papers
- **Auto-sync** - Documents sync across devices

### Custom Formatting Options

| Option | Values |
|--------|--------|
| **Font Size** | 10pt to 16pt |
| **Line Spacing** | 1.0, 1.15, 1.5, 2.0 |
| **Margins** | 0.5cm to 3cm |
| **Text Alignment** | Left, Center, Right, Justify |
| **Font Family** | Times New Roman, Arial, Georgia, Calibri |
| **Text Color** | Custom color picker |

### Author Management

- **Manual Input** - Add multiple authors with name, affiliation, and email
- **AI-Generated** - Let AI create contextually appropriate author names

### Export Formats

| Format | Description |
|--------|-------------|
| **HTML** | Complete standalone document with embedded styles |
| **Word (.doc)** | Microsoft Word compatible with full formatting |
| **PDF/Print** | Browser print dialog with proper page layout |
| **Plain Text (.txt)** | Structured text with heading decorations |

### Responsive Design

- **Fully responsive** across all screen sizes
- **Mobile-optimized** navigation and modals
- **Touch-friendly** interface elements
- **Adaptive layouts** for tablets and desktops

### Security Features

- **HTML Sanitization** - Removes `<script>` tags and event handlers
- **Iframe Isolation** - Preview content isolated from main application
- **Sandbox Attribute** - Additional iframe security layer
- **XSS Prevention** - Regex-based content filtering
- **Environment Variables** - API keys stored securely in `.env`

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18.2.0 |
| **Build Tool** | Vite 5.4.21 |
| **Styling** | Tailwind CSS 3.4.0 |
| **Icons** | Lucide React |
| **AI Model** | Google Gemini 2.0 Flash |
| **Authentication** | Firebase Auth |
| **Database** | Firebase Firestore |
| **PDF Processing** | PDF.js (pdfjs-dist) |
| **Word Processing** | Mammoth.js |
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
│   ├── ConferencePaperGenerator.jsx  # Main application (2000+ lines)
│   ├── firebase.js              # Firebase configuration & functions
│   ├── index.jsx                # React entry point
│   └── index.css                # Global styles & Tailwind directives
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules (includes .env)
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
- **Firebase Project** - [Create project](https://console.firebase.google.com/)
- **Formspree Account** (optional) - [Create form](https://formspree.io)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HorizonHnk/PaperGen-AI.git
   cd PaperGen-AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy the example file
   cp .env.example .env

   # Edit .env with your keys (NEVER commit this file)
   ```

4. **Set up Firebase**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com/)
   - Enable Authentication (Google + Email/Password)
   - Enable Firestore Database
   - Copy your config values to `.env`

5. **Start development server**
   ```bash
   npm run dev
   ```
   App opens at `http://localhost:5173`

6. **Build for production**
   ```bash
   npm run build
   ```
   Output in `dist/` folder

---

## Environment Variables

Create a `.env` file in the root directory (this file is gitignored for security):

```env
# Google Gemini API Key
# Get your free key at: https://makersuite.google.com/app/apikey
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Formspree Form ID (optional, for contact form)
# Get your form ID at: https://formspree.io
VITE_FORMSPREE_ID=your_formspree_form_id

# Firebase Configuration
# Get these values from Firebase Console > Project Settings > Your apps > Web app
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

> **IMPORTANT:** Never commit your `.env` file to version control. It contains sensitive API keys.

---

## Code Architecture

### Main Component (`ConferencePaperGenerator.jsx`)

```javascript
// Core State Management
const [selectedTemplate, setSelectedTemplate] = useState('THESIS');
const [inputMode, setInputMode] = useState('prompt'); // 'prompt' or 'upload'
const [inputText, setInputText] = useState('');
const [generatedContent, setGeneratedContent] = useState(null);
const [currentUser, setCurrentUser] = useState(null);

// Template Configuration
const TEMPLATES = {
  THESIS: { name, icon, description, features, promptDirective },
  CONFERENCE: { name, icon, description, features, promptDirective }
};

// Core Functions
generatePaper()       // Calls Gemini API with template-specific prompts
sanitizeHTML()        // Removes malicious content from AI output
handleFileUpload()    // Processes PDF, Word, TXT, and images
extractTextFromPDF()  // PDF.js text extraction
extractTextFromWord() // Mammoth.js text extraction
extractTextFromImage()// Gemini Vision OCR
exportToWord()        // Creates .doc file with formatting
exportToText()        // Creates .txt with structure
exportToHtml()        // Creates standalone HTML document
```

### Firebase Integration (`firebase.js`)

```javascript
// Authentication Functions
signInWithGoogle()    // Google OAuth popup
signInWithEmail()     // Email/password sign in
signUpWithEmail()     // New user registration
resetPassword()       // Password reset email
logOut()              // Sign out user
onAuthChange()        // Auth state listener

// Firestore Functions
saveDocument()        // Save paper to cloud
getUserDocuments()    // Fetch user's papers
deleteDocument()      // Remove paper from cloud
```

### AI Integration

```javascript
// Gemini API Call
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

---

## Usage Guide

### Basic Workflow

1. **Select Template** - Choose Thesis or Conference Paper
2. **Input Content** - Type prompt OR upload a file (PDF, Word, TXT, Image)
3. **Configure Options** - Page length, tone, reference style, formatting
4. **Add Authors** (optional) - Manual input or AI-generated
5. **Generate** - Click "Generate Paper" button
6. **Preview** - Review in live preview panel
7. **Export** - Download in your preferred format
8. **Save** (logged in) - Save to cloud for later access

### File Upload

1. Switch to "Upload" tab
2. Drag & drop a file OR click to browse
3. Supported formats: PDF, DOCX, TXT, PNG, JPG, JPEG, GIF, WebP
4. Extracted text appears in editable area
5. Modify if needed, then generate

### Cloud Storage

1. Sign in with Google or Email
2. Generate a paper
3. Click "Save" in the preview section
4. Enter a title and save
5. Access from "My Papers" anytime

---

## Deployment

### Netlify (Recommended)

1. Connect your GitHub repository
2. Configure build settings:
   ```
   Build command: npm run build
   Publish directory: dist
   ```
3. Add environment variables in Site Settings
4. Deploy automatically on push

### Environment Variables on Netlify

Add these in Site Settings > Environment Variables:
- `VITE_GEMINI_API_KEY`
- `VITE_FORMSPREE_ID`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

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

---

## Known Issues

- Old `.doc` format not supported (use `.docx`)
- Very long documents may impact browser performance
- Print/PDF quality depends on browser capabilities

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

- [Google Gemini AI](https://ai.google.dev/) - AI text generation & vision
- [Firebase](https://firebase.google.com/) - Authentication & database
- [React](https://reactjs.org/) - UI framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [PDF.js](https://mozilla.github.io/pdf.js/) - PDF processing
- [Mammoth.js](https://github.com/mwilliamson/mammoth.js) - Word document processing
- [Lucide Icons](https://lucide.dev/) - Icon library
- [Vite](https://vitejs.dev/) - Build tool
- [Netlify](https://netlify.com/) - Hosting platform

---

<div align="center">

**Built with React + Vite + Tailwind CSS + Firebase**

[Live Demo](https://paper-generator-ai.netlify.app/) | [Report Bug](https://github.com/HorizonHnk/PaperGen-AI/issues) | [Request Feature](https://github.com/HorizonHnk/PaperGen-AI/issues)

</div>
