"use client"

import { useState, useEffect } from "react"
import { compileMDX } from 'next-mdx-remote/rsc'
import { components } from '@/components/mdx'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

interface MdxPreviewProps {
    content: string
    frontmatter: any
}

export function MdxPreview({ content, frontmatter }: MdxPreviewProps) {
    const [rendered, setRendered] = useState<React.ReactElement | null>(null)
    const [error, setError] = useState<string | null>(null)

    // Render MDX using useEffect
    useEffect(() => {
        const renderMdx = async () => {
            try {
                const { content: MdxContent } = await compileMDX({
                    source: content,
                    components: components,
                    options: { parseFrontmatter: false }
                })
                setRendered(MdxContent as React.ReactElement)
                setError(null)
            } catch (err: any) {
                setError(err.message || 'Failed to render MDX')
                setRendered(null)
            }
        }

        if (content) {
            renderMdx()
        }
    }, [content])

    return (
        <Card className="h-full overflow-auto">
            <CardHeader className="border-b">
                <CardTitle className="text-lg">Preview</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                {error ? (
                    <div className="flex items-start gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                        <div>
                            <p className="font-medium text-red-700 dark:text-red-400">MDX Syntax Error</p>
                            <p className="text-sm text-red-600 dark:text-red-300 mt-1">{error}</p>
                        </div>
                    </div>
                ) : (
                    <div>
                        {/* Frontmatter Preview */}
                        <div className="mb-6 p-4 bg-muted rounded-lg">
                            <h3 className="font-semibold mb-2">{frontmatter.title || 'Untitled'}</h3>
                            <div className="flex gap-2 flex-wrap">
                                {frontmatter.tags?.map((tag: string) => (
                                    <span key={tag} className="px-2 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-800">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* MDX Content */}
                        <article className="prose prose-slate dark:prose-invert max-w-none">
                            {rendered}
                        </article>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
