"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SopEditor } from "@/components/editor/SopEditor"
import { MdxPreview } from "@/components/editor/MdxPreview"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"

const MODULES = [
    '00_Onboarding',
    '01_Knowledge_Base',
    '02_Tools_Tech',
    '03_Campaign_Ops',
    '04_Risk_CS',
    '05_Daily_Routine'
]

export default function NewSopPage() {
    const router = useRouter()
    const [module, setModule] = useState(MODULES[0])
    const [slug, setSlug] = useState('')
    const [frontmatter, setFrontmatter] = useState<any>({})
    const [content, setContent] = useState('')

    const handleSave = async (fm: any, cnt: string) => {
        if (!slug) {
            toast.error("Please enter a filename (slug)")
            return
        }

        setFrontmatter(fm)
        setContent(cnt)

        try {
            const response = await fetch('/api/sop', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ module, slug, frontmatter: fm, content: cnt })
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to create SOP')
            }

            toast.success("SOP created successfully")

            router.push('/editor')
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-2xl font-bold">Create New SOP</h1>
            </div>

            {/* Module & Slug Selection */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="space-y-2">
                    <Label>Module</Label>
                    <Select value={module} onValueChange={setModule}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {MODULES.map(m => (
                                <SelectItem key={m} value={m}>{m.replace(/_/g, ' ')}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Filename (slug)</Label>
                    <Input
                        placeholder="e.g., Deposit_Issue"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.replace(/\s+/g, '_'))}
                    />
                    <p className="text-xs text-muted-foreground">
                        Will be saved as: {module}/{slug}.mdx
                    </p>
                </div>
            </div>

            {/* Editor & Preview */}
            <div className="grid grid-cols-2 gap-6">
                <SopEditor
                    onSave={handleSave}
                    onCancel={() => router.push('/editor')}
                />
                <MdxPreview content={content} frontmatter={frontmatter} />
            </div>
        </div>
    )
}
