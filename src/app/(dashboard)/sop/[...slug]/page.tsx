import { compileMDX } from 'next-mdx-remote/rsc'
import { components } from '@/components/mdx'
import { getSopContent } from '@/lib/mdx'
import { SopSchema } from '@/lib/schema/types'
import { notFound } from 'next/navigation'

export default async function SopPage({ params }: { params: Promise<{ slug: string[] }> }) {
    // slug is [category, name], e.g. ['billing', 'deposit-issue']
    const { slug } = await params
    const [moduleName, name] = slug

    const content = getSopContent(moduleName, name)

    if (!content) {
        return notFound()
    }

    const { content: MdxContent, frontmatter } = await compileMDX({
        source: content,
        components: components,
        options: { parseFrontmatter: true }
    })

    // Validate Schema (Runtime check for AI readiness)
    // In a real app we might handle this gracefully, but for now we log issues
    const validation = SopSchema.safeParse(frontmatter)
    if (!validation.success) {
        console.error("SOP Schema Validation Failed:", validation.error)
    }

    const meta = validation.success ? validation.data : (frontmatter as any)

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="border-b pb-6">
                <div className="flex items-center gap-2 mb-4">
                    {meta.tags?.map((tag: string) => (
                        <span key={tag} className="px-2 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            #{tag}
                        </span>
                    ))}
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl text-slate-900 dark:text-slate-50">
                    {meta.title}
                </h1>
                <div className="mt-2 flex items-center text-sm text-slate-500">
                    <span>ID: {meta.id}</span>
                    <span className="mx-2">•</span>
                    <span>Difficulty: {meta.difficulty}</span>
                </div>
            </div>

            {/* Dynamic Content Area */}
            <article className="prose prose-slate dark:prose-invert max-w-none 
        prose-headings:scroll-m-20 prose-headings:font-semibold prose-headings:tracking-tight
        prose-p:leading-7
        prose-pre:bg-slate-900 prose-pre:text-slate-50">
                {MdxContent}
            </article>
        </div>
    )
}
