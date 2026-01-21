import { NextRequest, NextResponse } from 'next/server'
import { getClientIp, isIpAllowed, checkEditorPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json()

        // Check IP whitelist
        const clientIp = getClientIp(request)

        if (!isIpAllowed(clientIp)) {
            return NextResponse.json(
                { error: `Access denied. Your IP (${clientIp}) is not authorized.` },
                { status: 403 }
            )
        }

        // Check password
        if (!checkEditorPassword(password)) {
            return NextResponse.json(
                { error: 'Invalid password' },
                { status: 401 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        )
    }
}
