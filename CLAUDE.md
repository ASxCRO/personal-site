plugins:
  - claude-code-plugin:frontend-design

project:
name: "antoniosupan.from.hr"
description: "Personal blog and portfolio with blog, newsletter, optimized for performance and SEO"
repository: "https://github.com/ASxCRO/personal-site"
domain: "antoniosupan.from.hr"
deploy: "Netlify"

owner:
  name: "Antonio Supan"
  title: "Fullstack Engineer / .NET Developer"
  linkedin: "https://www.linkedin.com/in/antonio-supan/"
  github: "https://github.com/asxcro"
  current_company: "Combis"
  location: "Zagreb, Croatia"

  education:
    - institution: "Virovitica University of Applied Sciences"
      years: "2018-2021"

  certifications:
    - name: "Essentials with Azure Fundamentals"
      issuer: "Microsoft"
      date: "June 2025"
    - name: "Managing Azure Infrastructure: Storage, Monitoring & Backup"
      issuer: "Microsoft"
      date: "June 2025"
    - name: "Secure & Scalable Cloud Infrastructure with Microsoft Azure"
      issuer: "Microsoft"
      date: "June 2025"
    - name: "Agile Fundamentals"
      issuer: "Pluralsight"
      date: "September 2022"
    - name: "Getting started with the Linux Command Line"
      issuer: "Pluralsight"
      date: "September 2022"
    - name: "Microservices Architecture"
      issuer: "Udemy"
      date: "2021"

  skills:
    primary: [".NET", "C#", "ASP.NET Core", "Vue.js", "Azure"]
    secondary: ["Microservices", "Docker", "SQL Server", "REST APIs", "Clean Architecture"]
    cloud: ["Azure", "Azure Functions", "Azure Storage", "Azure DevOps"]

  languages:
    - language: "English"
      level: "Full professional proficiency"
    - language: "German"
      level: "Elementary proficiency"

  summary: "Passionate .NET Developer focused on building scalable, secure, and high-performance solutions. Engaged in technical content related to C#, cloud infrastructure, and modern development practices."

stack:
frontend:
framework: "Vue 3"
ui: "Composition API"
bundler: "Vite"
ssr: "VitePress (Static Site Generator)"
styling: "Tailwind CSS 4.x"
markdown: "VitePress default Markdown + frontmatter"
components: "Auto-import Vue components in Markdown"
design:
match_current: true
source: "React site's styles"
color_scheme: "Same look as current site"
patterns:
clean: true
semantic: true
accessibility: true

features:
blog:
by: "Markdown files under /content/blog"
frontmatter: - title - date - tags - description
auto_toc: true
syntax_highlighting: "Shiki or Prism"
pages: - home - about - projects - blog - contact
newsletter:
enabled: true
provider: "Choose/Integrate: Mailchimp / Buttondown / ConvertKit / Supabase + SMTP"
UI: - inline email capture - CTA in footer + blog sidebar - success message
performance:
lazy_load_images: true
prefetch_links: true
seo: - title - description - canonical - og:image - twitter:card

router:
mode: "Static"
base: "/"

cms:
none: true
markdown_source: "/content"

auth:
none: true

code_quality:
lint: - ESLint - TailwindLint/StyleLint
format: - Prettier
testing:
unit: "Vitest/Testing Library for Vue"

integration:
netlify:
build_cmd: "vitepress build"
publish_dir: ".vitepress/dist"
domain: "antoniosupan.from.hr"
env: - name: "NETLIFY_SITE_ID" - name: "NETLIFY_AUTH_TOKEN"
analytics:
optional: "Plausible / Google Analytics 4"

migration:
from_react: - convert header / footer / sections to Vue components - rewrite React JSX to Vue SFCs Composition API - port styles to Tailwind utility classes - replicate layouts in VitePress theme folder
preserve: - content - images/assets

deliverables:

- full working VitePress + Vue project
- Markdown-based blog
- working newsletter form
- Netlify deploy settings
- README with dev and deploy instructions
- optional SEO improvements

versions:
vite: "latest"
vue: "3.3+"
vitepress: "1.6+"
tailwind: "4.x"
