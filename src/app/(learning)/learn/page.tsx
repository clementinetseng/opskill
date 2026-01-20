import Link from 'next/link'
import { getAllModules } from '@/lib/mdx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, CheckCircle2 } from 'lucide-react'

export default function LearnPage() {
    const modules = getAllModules()

    return (
        <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-3xl font-extrabold tracking-tight">Learning Center</h1>
                <p className="text-muted-foreground mt-2">
                    Complete all modules to become a certified operator
                </p>
            </div>

            <div className="grid gap-4 max-w-3xl mx-auto">
                {modules.map((moduleName, index) => {
                    const moduleDisplayName = moduleName.replace(/_/g, ' ')
                    const isCompleted = false // Placeholder - would track real progress

                    return (
                        <Link key={moduleName} href={`/learn/${moduleName}`}>
                            <Card className="group hover:shadow-md transition-all cursor-pointer">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                                                {index}
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg group-hover:underline">{moduleDisplayName}</CardTitle>
                                                <CardDescription>Click to start learning</CardDescription>
                                            </div>
                                        </div>
                                        {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                                    </div>
                                </CardHeader>
                            </Card>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
