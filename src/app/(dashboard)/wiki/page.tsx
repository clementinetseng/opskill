import Link from 'next/link'
import { getAllModules, getSopSlugs, getSopContent } from '@/lib/mdx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Folder } from 'lucide-react'
import matter from 'gray-matter'

export default function WikiPage() {
    const modules = getAllModules()

    return (
        <div className="space-y-8">
            <div className="border-b pb-6">
                <h1 className="text-3xl font-extrabold tracking-tight">Knowledge Wiki</h1>
                <p className="text-muted-foreground mt-2">
                    Browse all SOPs and documentation organized by module
                </p>
            </div>

            <div className="grid gap-6">
                {modules.map((moduleName) => {
                    const slugs = getSopSlugs(moduleName)
                    const moduleDisplayName = moduleName.replace(/_/g, ' ')

                    return (
                        <Card key={moduleName} className="overflow-hidden">
                            <CardHeader className="bg-muted/50">
                                <div className="flex items-center gap-2">
                                    <Folder className="w-5 h-5 text-blue-500" />
                                    <CardTitle className="text-lg">{moduleDisplayName}</CardTitle>
                                </div>
                                <CardDescription>{slugs.length} document(s)</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="grid gap-2">
                                    {slugs.map((slug) => {
                                        const content = getSopContent(moduleName, slug)
                                        if (!content) return null

                                        const { data } = matter(content)
                                        const title = data.title || slug
                                        const tags = data.tags || []
                                        const difficulty = data.difficulty || 'unknown'

                                        return (
                                            <Link
                                                key={slug}
                                                href={`/sop/${moduleName}/${slug}`}
                                                className="group flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                                            >
                                                <FileText className="w-4 h-4 mt-1 text-muted-foreground group-hover:text-foreground" />
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium group-hover:underline truncate">
                                                        {title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                                            {difficulty}
                                                        </span>
                                                        {tags.slice(0, 3).map((tag: string) => (
                                                            <span key={tag} className="text-xs text-muted-foreground">
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </Link>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
