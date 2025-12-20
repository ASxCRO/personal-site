project:
name: "antoniosupan.from.hr"
description: "Personal blog and portfolio with blog, newsletter, optimized for performance and SEO"
repository: "https://github.com/ASxCRO/personal-site"
domain: "antoniosupan.from.hr"
deploy: "Netlify"

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
