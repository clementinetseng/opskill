import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, Calculator, Shield, Clock, FileText, ChevronRight } from 'lucide-react'
import { getAllSops } from '@/lib/mdx'

export default function DashboardPage() {
    const allSops = getAllSops()

    // Specifically curated high-frequency SOPs (as requested)
    const quickTools = [
        {
            title: '首存未到帳處理',
            description: 'Campaign Ops - High Priority',
            href: '/sop/03_Campaign_Ops/First_Deposit_Issue',
            icon: Calculator,
            color: 'text-green-500'
        },
        {
            title: 'VIP 提款審核流程',
            description: 'Risk & CS - Urgent',
            href: '/sop/04_Risk_CS/VIP_Withdrawal_Approval',
            icon: Shield,
            color: 'text-red-500'
        },
        {
            title: 'KYC 會員驗證流程',
            description: 'Onboarding - Essential',
            href: '/sop/00_Onboarding/KYC_Verification',
            icon: FileText,
            color: 'text-blue-500'
        },
        {
            title: 'Manual Bonus Injection',
            description: 'Campaign Ops - Manual Tool',
            href: '/sop/03_Campaign_Ops/Manual_Bonus_Injection',
            icon: Zap,
            color: 'text-yellow-500'
        },
        {
            title: 'Shift Handover',
            description: 'Daily Routine - Common',
            href: '/sop/05_Daily_Routine/Shift_Handover',
            icon: Clock,
            color: 'text-indigo-500'
        }
    ]

    // Get 5 most recently updated SOPs
    const recentlyUpdated = [...allSops]
        .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
        .slice(0, 5)

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
                    <h3 className="text-lg font-semibold">Quick Tools / 熱門工具</h3>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {quickTools.map((tool) => {
                        const Icon = tool.icon
                        return (
                            <Link key={tool.href} href={tool.href}>
                                <Card className="group hover:shadow-md transition-all cursor-pointer h-full border-l-4 border-l-slate-200 hover:border-l-primary/50">
                                    <CardHeader>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                                                <Icon className={`w-5 h-5 ${tool.color}`} />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base group-hover:text-primary transition-colors">{tool.title}</CardTitle>
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

            <div className="grid gap-6 md:grid-cols-2">
                {/* Recently Updated */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-500" /> 最近更新
                    </h3>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                {recentlyUpdated.map((sop) => (
                                    <Link
                                        key={`${sop.module}/${sop.slug}`}
                                        href={`/sop/${sop.module}/${sop.slug}`}
                                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-4 h-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium group-hover:text-primary transition-colors">
                                                    {sop.frontmatter.title || sop.slug}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground">
                                                    {sop.module.replace(/_/g, ' ')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-[10px] text-muted-foreground text-right">
                                            {new Date(sop.lastModified).toLocaleDateString('zh-TW')}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <Link href="/wiki" className="block mt-4 text-center text-xs text-primary hover:underline">
                                查看全部 Wiki 檔案
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* System Shortcut Info */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-orange-500" /> 系統捷徑
                    </h3>
                    <div className="grid gap-4">
                        <Card className="bg-slate-900 text-slate-50">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-400 font-medium">快速搜尋檔案</p>
                                        <div className="flex items-center gap-2">
                                            <kbd className="px-2 py-1 text-sm bg-slate-800 rounded border border-slate-700 shadow-sm">⌘</kbd>
                                            <span className="text-slate-500">+</span>
                                            <kbd className="px-2 py-1 text-sm bg-slate-800 rounded border border-slate-700 shadow-sm">K</kbd>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-slate-800 rounded-full border border-slate-700">
                                        <FileText className="w-6 h-6 text-slate-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-primary/5 border-primary/20">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-xs text-primary/80 font-medium">目前的 IP 授權</p>
                                        <p className="text-lg font-bold font-mono">38.54.37.172</p>
                                    </div>
                                    <div className="p-3 bg-primary/10 rounded-full">
                                        <Shield className="w-6 h-6 text-primary" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
