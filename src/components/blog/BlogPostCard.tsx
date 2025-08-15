import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, User } from 'lucide-react'
import { BlogPostMeta } from '@/lib/blog'

interface BlogPostCardProps {
  post: BlogPostMeta
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{post.author}</span>
          </div>
        </div>
        <h2 className="text-xl font-semibold hover:text-blue-600 transition-colors">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h2>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          {post.excerpt}
        </p>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}