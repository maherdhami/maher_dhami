# Maher Dhami — Personal Portfolio

Official personal portfolio website of **Maher Dhami** — Computer Engineering Student, AI & Machine Learning Practitioner, Software Developer, and Host of *The Young Founder Show*.

Built with a modern, high-precision editorial minimalist design system prioritizing typography, performance, responsive layouts, and zero bloat.

---

## 🌟 Overview & Identity

- **Name:** Maher Dhami
- **Role:** Computer Engineering Student &bull; AI Practitioner &bull; Software Developer &bull; Podcast Host
- **Institution:** Shah & Anchor Kutchhi Engineering College (SAKEC), Mumbai (Class of 2028)
- **Primary Focus:** Artificial Intelligence, Machine Learning, Generative AI, LLM Systems & Full-Stack Engineering
- **Initiatives:** Host & Creator of [The Young Founder Show](https://tyf-opal.vercel.app/), Founder of CODIEPAG

---

## 🚀 Key Sections

1. **Navigation:** Sticky, glassmorphism-enhanced navigation with live availability indicator and mobile drawer.
2. **Hero:** High-contrast editorial hero featuring Maher's official portrait, quick bio, and direct CTAs.
3. **About Me:** Professional narrative detailing technical curiosity, hands-on experimentation, and academic background at SAKEC Mumbai.
4. **Areas of Expertise:** Categorized cards covering AI, Machine Learning, Software Development, and Dev Tools/Databases.
5. **Featured Projects:** Interactive, filterable project gallery featuring verified public GitHub repositories:
   - [Autonomous AI Data Analysts](https://autonomous-ai-data-analysts.vercel.app/)
   - [AI Knowledge Assistant](https://github.com/maherdhami/AI-Knowledge-Assistant)
   - [Social Media Virality Prediction](https://github.com/maherdhami/social-media-virality-prediction)
   - [Student Dropout Risk Prediction](https://github.com/maherdhami/student-dropout-risk-prediction)
   - [Student Success Intelligence Platform](https://github.com/maherdhami/student-success-intelligence-platform)
6. **Experience & Initiatives:** Concise, authentic timeline featuring CODIEPAG, The Young Founder Show, and self-directed AI research.
7. **The Young Founder Show — Feature:** Distinctive showcase section featuring official studio artwork, core curriculum pillars, and direct links.
8. **Education:** Shah & Anchor Kutchhi Engineering College (SAKEC), Mumbai &bull; B.E. Computer Engineering (2028).
9. **Connect / Contact:** Direct verified contact channels (LinkedIn, GitHub, Email: `maherdhamicet@gmail.com`) with a functional, validated contact form.
10. **Footer:** Minimalist closing with dynamic year and back-to-top handler.

---

## 🛠️ Technical Stack & Architecture

- **Structure:** Semantic HTML5 with Schema.org JSON-LD structured data and OpenGraph / Twitter metadata.
- **Styling:** Modern Vanilla CSS using CSS Custom Properties (Design Tokens), Flexbox, CSS Grid, and responsive media queries.
- **Typography:** Google Fonts (`Plus Jakarta Sans`, `Newsreader`, `JetBrains Mono`).
- **Interactions:** Native Client Script (`js/main.js`) featuring:
  - Sticky navbar elevation on scroll
  - Scrollspy active link detection
  - Responsive mobile drawer navigation with ESC and trap-focus support
  - Dynamic project category filtering with smooth opacity transitions
  - Interactive contact form with validation and mailto dispatch
  - Copy-to-clipboard email button with toast feedback
  - IntersectionObserver staggered scroll reveals
  - Dynamic copyright year
- **Deployment:** Zero-config static deployment ready for [Vercel](https://vercel.com), GitHub Pages, or Netlify.

---

## 📦 Local Development

To run locally:

```bash
# Using Python
python -m http.server 3000

# Or using Node (npx)
npx serve .
```

Open `http://localhost:3000` in your browser.

---

## 🌐 Deployment to Vercel

This repository includes a `vercel.json` configuration file with clean URLs and immutable asset caching headers. To deploy:

```bash
# Using Vercel CLI
npx vercel --prod
```

Or connect the GitHub repository directly in the [Vercel Dashboard](https://vercel.com/new).
