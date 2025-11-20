# 📄 PaperGen AI - Academic Paper Generator

> **AI-Powered Academic Paper Generator with Google Gemini**
> Generate professionally formatted thesis and conference papers instantly with intelligent AI assistance.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://paper-generator-ai.netlify.app/)
[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://paper-generator-ai.netlify.app/)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 🌐 Live Demo

**Visit the live application:** [https://paper-generator-ai.netlify.app/](https://paper-generator-ai.netlify.app/)

---

## ✨ Features

### 📝 **Two Academic Formats**
- **Standard Thesis Paper** - CPUT/Harvard style with Chapters 1-6
  - Single column layout
  - 1.5 line spacing
  - Times New Roman 12pt
  - 2.5cm margins
  - Harvard referencing

- **Conference Paper** - Professional two-column format
  - IEEE/ACM style layout
  - Roman numeral section headers
  - Abstract and keywords
  - Strict caption placement rules

### 🎯 **Intelligent Content Generation**
- **AI-Powered Writing** using Google Gemini 2.0 Flash
- **Target Page Length Selection** - Auto, 1-2, 3-5, 6-10, or 10+ pages
- **Tone & Style Customization**:
  - Academic (formal, scholarly, rigorous)
  - Professional (business-like, action-oriented)
  - Essay (narrative flow, persuasive)
  - Creative (descriptive, engaging)

### 👥 **Author Management**
- **Manual Author Input** - Add your own details
  - Full Name
  - Affiliation (optional)
  - Email (optional)
  - Support for multiple authors
- **AI-Generated Authors** - Let AI create appropriate author names

### 📐 **Mathematical Formatting**
- Proper HTML mathematical notation
- Support for Greek letters (α, β, γ, δ, θ, λ, π, σ, ω)
- Mathematical symbols (×, ÷, ≈, ≠, ≤, ≥)
- Superscripts and subscripts
- Centered equations with proper spacing

### 💾 **Multiple Export Formats**
- **HTML** - Complete standalone document
- **Word (.doc)** - Microsoft Word compatible with full formatting
- **PDF/Print** - Browser print with proper page layout
- **Plain Text (.txt)** - Structured text with heading decorations

### 🎨 **Advanced Features**
- **Responsive Design** - Works on all screen sizes
- **Live Preview** - Real-time document preview with iframe isolation
- **Auto-Scaling** - Preview adjusts to container width
- **Secure Rendering** - HTML sanitization to prevent XSS attacks
- **Customizable Templates** - Easy to extend with new formats

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16.x or higher
- **npm** or **yarn**
- **Google Gemini API Key** (get free at [Google AI Studio](https://makersuite.google.com/app/apikey))

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

3. **Configure API Key** (Optional)
   - Default API key is pre-configured
   - To use your own: Click Settings (⚙️) → Enter your Gemini API key

4. **Start development server**
   ```bash
   npm run dev
   ```

   The app will open at `http://localhost:3000`

5. **Build for production**
   ```bash
   npm run build
   ```

   Production files will be in the `dist/` folder

---

## 📦 Tech Stack

### Frontend
- **React 18.2.0** - UI library
- **Vite 5.0.8** - Build tool and dev server
- **Tailwind CSS 3.4.0** - Utility-first CSS framework
- **Lucide React** - Icon library

### AI Integration
- **Google Gemini 2.0 Flash** - Latest and fastest Gemini model
- **Gemini API** - Text generation with system instructions

### Build & Development
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing
- **ESLint** - Code linting

---

## 🏗️ Project Structure

```
Report/
├── dist/                    # Production build output
├── public/                  # Static assets
│   └── favicon.svg         # Application icon
├── src/
│   ├── App.jsx             # Main app component
│   ├── ConferencePaperGenerator.jsx  # Core component
│   ├── index.jsx           # React entry point
│   └── index.css           # Global styles with Tailwind
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── README.md              # This file
```

---

## 🔧 Configuration

### API Configuration

The application uses Google Gemini API. You can configure it in two ways:

1. **Default (Pre-configured)**
   - API key is already set in the application
   - Ready to use immediately

2. **Custom API Key**
   - Click the Settings icon (⚙️) in the navigation
   - Enter your own Gemini API key
   - Key is stored locally in browser state

### Template Customization

Edit `TEMPLATES` object in `ConferencePaperGenerator.jsx`:

```javascript
TEMPLATES: {
  YOUR_TEMPLATE: {
    name: 'Your Template Name',
    icon: YourIcon,
    description: 'Template description',
    features: ['Feature 1', 'Feature 2'],
    promptDirective: `Your AI instructions here...`
  }
}
```

---

## 💡 Usage Guide

### Basic Workflow

1. **Select Template** - Choose between Thesis or Conference Paper
2. **Enter Content** - Type or upload your research topic
3. **Configure Options**:
   - Set target page length
   - Choose tone and style
   - Add author details (optional)
4. **Generate** - Click "Generate Paper"
5. **Preview & Export** - Review in live preview, then export

### Author Details

**Manual Mode:**
- Toggle to "Manual"
- Enter author name(s), affiliation, and email
- Click "Add Another Author" for co-authors
- Remove authors with trash icon

**AI-Generated Mode:**
- Toggle to "AI Generated"
- AI creates appropriate author names based on content

### Mathematical Equations

The AI automatically formats equations using HTML:
- Inline: `<i>x</i> = <i>y</i> + 2`
- Display: Centered with proper spacing
- Symbols: Full Unicode math symbol support

### Export Options

- **HTML Export** - Complete standalone webpage
- **Word Export** - Opens in Microsoft Word with formatting
- **Print/PDF** - Use browser's print to PDF feature
- **Text Export** - Plain text with structural formatting

---

## 🎨 Customization

### Styling

The application uses Tailwind CSS for styling. Customize in:
- `tailwind.config.js` - Tailwind configuration
- `src/index.css` - Global styles and custom CSS

### AI Prompts

Modify AI behavior in `ConferencePaperGenerator.jsx`:

```javascript
const systemPrompt = `
  // Your custom instructions
  // Template-specific guidelines
  // Formatting requirements
`;
```

---

## 🔒 Security Features

- **HTML Sanitization** - Removes `<script>` tags and event handlers
- **Iframe Isolation** - Preview content isolated from main app
- **Sandbox Attribute** - Additional iframe security layer
- **XSS Prevention** - Regular expression-based content filtering

---

## 🚢 Deployment

### Netlify (Recommended)

1. **Connect Repository**
   - Log in to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Select your repository

2. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Deploy**
   - Netlify automatically deploys on push to main branch

### Other Platforms

**Vercel:**
```bash
npm install -g vercel
vercel
```

**GitHub Pages:**
```bash
npm run build
# Deploy dist/ folder to gh-pages branch
```

**AWS S3:**
```bash
npm run build
aws s3 sync dist/ s3://your-bucket-name
```

---

## 📝 API Reference

### Google Gemini API

**Endpoint:**
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
```

**Request Structure:**
```javascript
{
  contents: [{ parts: [{ text: userPrompt }] }],
  systemInstruction: { parts: [{ text: systemPrompt }] }
}
```

**Response:**
```javascript
{
  candidates: [{
    content: {
      parts: [{ text: "Generated HTML content..." }]
    }
  }]
}
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow React best practices
- Use functional components with hooks
- Maintain Tailwind CSS utility classes
- Add comments for complex logic
- Test all export formats before submitting

---

## 🐛 Known Issues

- Mathematical equations may not render perfectly in all Word versions
- Very long documents (100+ pages) may cause browser memory issues
- Print/PDF feature depends on browser's print capabilities

---

## 🛣️ Roadmap

- [ ] Support for more citation styles (APA, MLA, Chicago)
- [ ] LaTeX export option
- [ ] Real-time collaborative editing
- [ ] Template marketplace
- [ ] Advanced equation editor with LaTeX input
- [ ] Reference manager integration
- [ ] Custom CSS theme editor

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**HnkHorizon**

- GitHub: [@HorizonHnk](https://github.com/HorizonHnk)
- Twitter: [@HnkHorizon](https://twitter.com/HnkHorizon)
- YouTube: [@HNK2005](https://youtube.com/@HNK2005)
- Instagram: [@hhnk.3693](https://instagram.com/hhnk.3693)
- Email: hhnk3693@gmail.com

---

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) - AI text generation
- [React](https://reactjs.org/) - UI framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide Icons](https://lucide.dev/) - Icon library
- [Vite](https://vitejs.dev/) - Build tool
- [Netlify](https://netlify.com/) - Hosting platform

---

## 📞 Support

For support, email hhnk3693@gmail.com or open an issue on [GitHub](https://github.com/HorizonHnk/Conference-Papers/issues).

---

## ⭐ Star History

If you find this project useful, please consider giving it a star! It helps others discover the project.

---

<div align="center">

**Built with ❤️ by HnkHorizon**

[Live Demo](https://paper-generator-ai.netlify.app/) • [Report Bug](https://github.com/HorizonHnk/Conference-Papers/issues) • [Request Feature](https://github.com/HorizonHnk/Conference-Papers/issues)

</div>
