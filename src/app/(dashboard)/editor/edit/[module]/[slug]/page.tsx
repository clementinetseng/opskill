"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SopEditor } from "@/components/editor/SopEditor"
import { MdxPreview } from "@/components/editor/MdxPreview"
import { toast } from "@/hooks/use-toast"

export default function EditSopPage({ params }: { params: Promise<{ module: string; slug: string }> }) {
    const router = useRouter()
    const [resolvedParams, setResolvedParams] = useState<{ module: string; slug: string } | null>(null)
    const [initialData, setInitialData] = useState<any>(null)
    const [frontmatter, setFrontmatter] = useState<any>({})
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        params.then(p => {
            setResolvedParams(p)
            fetchSop(p.module, p.slug)
        })
    }, [])

    const fetchSop = async (module: string, slug: string) => {
        try {
            const response = await fetch(`/api/sop/${module}/${slug}`)
            if (!response.ok) throw new Error('Failed to fetch SOP')

            const data = await response.json()
            setInitialData(data)
            setFrontmatter(data.frontmatter)
            setContent(data.content)
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (fm: any, cnt: string) => {
        if (!resolvedParams) return

        setFrontmatter(fm)
        setContent(cnt)

        try {
            const response = await fetch(`/api/sop/${resolvedParams.module}/${resolvedParams.slug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ frontmatter: fm, content: cnt })
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to update SOP')
            }

            toast.success("SOP updated successfully")
            router.push('/editor')
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    if (loading) {
        return <div className="p-8 text-center">Loading...</div>
    }

    if (!initialData) {
        return <div className="p-8 text-center">SOP not found</div>
    }

    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-2xl font-bold">Edit SOP</h1>
                <p className="text-sm text-muted-foreground">
                    {resolvedParams?.module} / {resolvedParams?.slug}
                </p>
            </div>

            {/* Editor & Preview */}
            <div className="grid grid-cols-2 gap-6">
                <SopEditor
                    initialData={initialData}
                    onSave={handleSave}
                    onCancel={() => router.push('/editor')}
                />
                <MdxPreview content={content} frontmatter={frontmatter} />
            </div>
        </div>
    )
}
