import { getAllPosts } from '@/lib/blog'
import { BlogPostCard } from '@/components/blog/BlogPostCard'

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Blog de Raisket
          </h1>
          <p className="text-xl text-gray-100">
            Insights financieros, tendencias del mercado y consejos para tu negocio
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No hay artículos publicados aún.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}