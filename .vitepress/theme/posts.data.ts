import { createContentLoader } from 'vitepress'

export interface Post {
  url: string
  frontmatter: {
    title: string
    date: string
    description: string
    tags: string[]
    author?: string
    featured?: boolean
  }
}

declare const data: Post[]
export { data }

export default createContentLoader('blog/*.md', {
  transform(rawData): Post[] {
    return rawData
      .filter(page => page.frontmatter.title)
      .sort((a, b) => {
        if (Boolean(a.frontmatter.featured) !== Boolean(b.frontmatter.featured)) {
          return a.frontmatter.featured ? -1 : 1
        }
        return +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date)
      })
      .map(page => ({
        url: page.url,
        frontmatter: page.frontmatter as Post['frontmatter']
      }))
  }
})
