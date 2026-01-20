import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function LearningLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Header - Progress & Exit */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center">
                    <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4" /> Exit Training
                    </Link>
                    <div className="ml-auto w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[30%]" /> {/* Mock Progress */}
                    </div>
                </div>
            </header>

            <main className="container max-w-3xl py-10">
                {children}
            </main>
        </div>
    )
}
