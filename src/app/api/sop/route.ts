import { NextRequest, NextResponse } from 'next/server'
import { getAllSops, createSop } from '@/lib/mdx'

export async function GET() {
    try {
        const sops = getAllSops()
        return NextResponse.json({ sops })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch SOPs' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { module, slug, frontmatter, content } = body

        if (!module || !slug || !frontmatter || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        createSop(module, slug, frontmatter, content)
        return NextResponse.json({ success: true, message: 'SOP created successfully' })
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to create SOP' }, { status: 500 })
    }
}
