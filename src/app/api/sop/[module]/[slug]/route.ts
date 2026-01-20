import { NextRequest, NextResponse } from 'next/server'
import { getSopContent, updateSop, deleteSop } from '@/lib/mdx'
import matter from 'gray-matter'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ module: string; slug: string }> }
) {
    try {
        const { module, slug } = await params
        const content = getSopContent(module, slug)

        if (!content) {
            return NextResponse.json({ error: 'SOP not found' }, { status: 404 })
        }

        const { data: frontmatter, content: mdxContent } = matter(content)
        return NextResponse.json({ frontmatter, content: mdxContent })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch SOP' }, { status: 500 })
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ module: string; slug: string }> }
) {
    try {
        const { module, slug } = await params
        const body = await request.json()
        const { frontmatter, content } = body

        if (!frontmatter || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        updateSop(module, slug, frontmatter, content)
        return NextResponse.json({ success: true, message: 'SOP updated successfully' })
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to update SOP' }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ module: string; slug: string }> }
) {
    try {
        const { module, slug } = await params
        deleteSop(module, slug)
        return NextResponse.json({ success: true, message: 'SOP deleted successfully' })
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to delete SOP' }, { status: 500 })
    }
}
