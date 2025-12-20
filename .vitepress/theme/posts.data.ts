import { createContentLoader } from 'vitepress'

export interface Post {
  url: string
  frontmatter: {
    title: string
    date: string
    description: string
    tags: string[]
    author?: string
  }
}

declare const data: Post[]
export { data }

export default createContentLoader('blog/*.md', {
  transform(rawData): Post[] {
    return rawData
      .filter(page => page.frontmatter.title)
      .sort((a, b) => {
        return +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date)
      })
      .map(page => ({
        url: page.url,
        frontmatter: page.frontmatter as Post['frontmatter']
      }))
  }
})
