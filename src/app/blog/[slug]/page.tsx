import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPostBySlug, getAllSlugs } from '@/lib/blog'
import { ArrowLeft } from 'lucide-react'
import { MDXRemote } from 'next-mdx-remote/rsc'

// Components available in MDX
import { ProductComparisonTable } from '@/components/mdx/ProductComparisonTable'
import { ProductCard } from '@/components/mdx/ProductCard'
import { MethodologyBox } from '@/components/mdx/MethodologyBox'

const components = {
  ProductComparisonTable,
  ProductCard,
  MethodologyBox,
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center text-[#00D9A5] hover:text-[#00C294] mb-8 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al blog
        </Link>

        <article>
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-200 mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span>{post.date}</span>
              <span>•</span>
              <span>Por {post.author}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none 
            prose-headings:text-[#1A365D] prose-headings:font-bold 
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-justify
            prose-strong:text-[#1A365D] prose-strong:font-semibold
            prose-ul:text-gray-700 prose-li:marker:text-[#00D9A5]
            prose-a:text-[#00D9A5] prose-a:no-underline hover:prose-a:underline
            bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
            <MDXRemote source={post.content} components={components} />
          </div>
        </article>
      </div>
    </div>
  )
}
