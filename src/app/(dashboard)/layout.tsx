import { Zap, BookOpen, Settings } from "lucide-react"
import Link from "next/link"
import { getAllSops } from "@/lib/mdx"
import { CommandMenu } from "@/components/CommandMenu"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Prepare SOP data for Command Menu
    const allSops = getAllSops()
    const sopItems = allSops.map(sop => ({
        module: sop.module,
        slug: sop.slug,
        title: sop.frontmatter.title || sop.slug,
        tags: sop.frontmatter.tags || [],
        difficulty: sop.frontmatter.difficulty || 'unknown'
    }))

    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 border-r bg-muted/40 p-6 flex flex-col gap-6">
                <div className="font-bold text-xl tracking-tight">Project NEXUS</div>

                {/* Command K Search */}
                <CommandMenu sops={sopItems} />

                <nav className="flex flex-col gap-2">
                    <Link href="/dashboard" className="flex items-center gap-2 p-2 hover:bg-muted rounded text-sm font-medium">
                        <Zap className="w-4 h-4" /> Operations
                    </Link>
                    <Link href="/wiki" className="flex items-center gap-2 p-2 hover:bg-muted rounded text-sm font-medium">
                        <BookOpen className="w-4 h-4" /> Wiki
                    </Link>
                    <Link href="/editor" className="flex items-center gap-2 p-2 hover:bg-muted rounded text-sm font-medium">
                        <Settings className="w-4 h-4" /> Editor
                    </Link>
                    <Link href="/settings" className="flex items-center gap-2 p-2 hover:bg-muted rounded text-sm font-medium">
                        <Settings className="w-4 h-4" /> Settings
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8 overflow-auto">
                {children}
            </main>
        </div>
    )
}
