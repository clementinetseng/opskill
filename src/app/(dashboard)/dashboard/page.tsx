import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, Calculator, Shield, Clock } from 'lucide-react'

export default function DashboardPage() {
    const quickTools = [
        {
            title: 'Manual Bonus Injection',
            description: 'Campaign Ops - Senior Level',
            href: '/sop/03_Campaign_Ops/Manual_Bonus_Injection',
            icon: Calculator,
            color: 'text-green-500'
        },
        {
            title: 'Fraud Detection',
            description: 'Risk & CS - Senior Level',
            href: '/sop/04_Risk_CS/Fraud_Detection',
            icon: Shield,
            color: 'text-red-500'
        },
        {
            title: 'Shift Handover',
            description: 'Daily Routine - All Levels',
            href: '/sop/05_Daily_Routine/Shift_Handover',
            icon: Clock,
            color: 'text-blue-500'
        }
    ]

    return (
        <div className="space-y-8">
            <div className="border-b pb-6">
                <h2 className="text-3xl font-extrabold tracking-tight">Operations Dashboard</h2>
                <p className="text-muted-foreground mt-2">Quick access to frequently used SOPs and tools</p>
            </div>

            {/* Quick Tools Section */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <h3 className="text-lg font-semibold">Quick Tools</h3>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {quickTools.map((tool) => {
                        const Icon = tool.icon
                        return (
                            <Link key={tool.href} href={tool.href}>
                                <Card className="group hover:shadow-md transition-all cursor-pointer h-full">
                                    <CardHeader>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-muted">
                                                <Icon className={`w-5 h-5 ${tool.color}`} />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base group-hover:underline">{tool.title}</CardTitle>
                                                <CardDescription className="text-xs">{tool.description}</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* Recent Activity Placeholder */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground text-center py-8">
                            No recent activity. Start by accessing a SOP from Quick Tools or use <kbd className="px-2 py-1 text-xs font-semibold bg-muted rounded">⌘K</kbd> to search.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
