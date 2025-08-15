import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), '_posts')

export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  author: string
  tags: string[]
  content: string
}

export interface BlogPostMeta {
  slug: string
  title: string
  date: string
  excerpt: string
  author: string
  tags: string[]
}

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      return {
        slug,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        author: data.author,
        tags: data.tags || [],
      }
    })

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    const processedContent = await remark()
      .use(html)
      .process(content)
    const contentHtml = processedContent.toString()

    return {
      slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      author: data.author,
      tags: data.tags || [],
      content: contentHtml,
    }
  } catch (error) {
    return null
  }
}

export async function getAllSlugs(): Promise<string[]> {
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''))
}