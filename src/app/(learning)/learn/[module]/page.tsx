import { getAllModules, getSopSlugs, getSopContent } from '@/lib/mdx'
import { compileMDX } from 'next-mdx-remote/rsc'
import { components } from '@/components/mdx'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function LearnModulePage({ params }: { params: Promise<{ module: string }> }) {
    const { module } = await params
    const slugs = getSopSlugs(module)

    if (slugs.length === 0) {
        return notFound()
    }

    // For simplicity, show the first SOP in the module
    const firstSlug = slugs[0]
    const content = getSopContent(module, firstSlug)

    if (!content) {
        return notFound()
    }

    const { content: MdxContent, frontmatter } = await compileMDX({
        source: content,
        components: components,
        options: { parseFrontmatter: true }
    })

    const meta = frontmatter as any

    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-2xl font-bold">{meta.title || firstSlug}</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Module: {module.replace(/_/g, ' ')}
                </p>
            </div>

            <article className="prose prose-slate dark:prose-invert max-w-none">
                {MdxContent}
            </article>

            <div className="flex justify-between items-center pt-6 border-t">
                <Link href="/learn">
                    <Button variant="outline">← Back to Modules</Button>
                </Link>
                <Button>
                    Next Lesson <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}
