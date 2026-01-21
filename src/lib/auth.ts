import { NextRequest, NextResponse } from 'next/server'

export function getClientIp(request: NextRequest): string {
    // Try various headers that might contain the real IP
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const cfConnectingIp = request.headers.get('cf-connecting-ip')

    if (forwarded) {
        return forwarded.split(',')[0].trim()
    }

    if (realIp) {
        return realIp
    }

    if (cfConnectingIp) {
        return cfConnectingIp
    }

    return 'unknown'
}

export function isIpAllowed(ip: string): boolean {
    const allowedIps = process.env.ALLOWED_EDITOR_IPS?.split(',').map(i => i.trim()) || []

    // If no IPs configured, allow all (development mode)
    if (allowedIps.length === 0) {
        return true
    }

    return allowedIps.includes(ip)
}

export function checkEditorPassword(password: string): boolean {
    const correctPassword = process.env.EDITOR_PASSWORD || 'admin123'
    return password === correctPassword
}
