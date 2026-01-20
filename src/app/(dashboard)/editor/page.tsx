import Link from 'next/link'
import { getAllSops } from '@/lib/mdx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, FileText, Edit } from 'lucide-react'

export default function EditorPage() {
    const sops = getAllSops()

    // Group by module
    const sopsByModule = sops.reduce((acc, sop) => {
        if (!acc[sop.module]) acc[sop.module] = []
        acc[sop.module].push(sop)
        return acc
    }, {} as Record<string, typeof sops>)

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between border-b pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Content Editor</h1>
                    <p className="text-muted-foreground mt-2">Manage all SOPs and documentation</p>
                </div>
                <Link href="/editor/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create New SOP
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6">
                {Object.entries(sopsByModule).map(([moduleName, moduleSops]) => (
                    <Card key={moduleName}>
                        <CardHeader className="bg-muted/50">
                            <CardTitle className="text-lg">{moduleName.replace(/_/g, ' ')}</CardTitle>
                            <CardDescription>{moduleSops.length} document(s)</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="grid gap-2">
                                {moduleSops.map((sop) => (
                                    <div
                                        key={`${sop.module}/${sop.slug}`}
                                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex items-start gap-3">
                                            <FileText className="w-4 h-4 mt-1 text-muted-foreground" />
                                            <div>
                                                <h3 className="font-medium">{sop.frontmatter.title || sop.slug}</h3>
                                                <p className="text-xs text-muted-foreground">
                                                    {sop.frontmatter.id} • {sop.frontmatter.difficulty}
                                                </p>
                                            </div>
                                        </div>
                                        <Link href={`/editor/edit/${sop.module}/${sop.slug}`}>
                                            <Button size="sm" variant="outline">
                                                <Edit className="w-4 h-4 mr-2" />
                                                Edit
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
