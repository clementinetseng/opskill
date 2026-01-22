import { NextRequest, NextResponse } from 'next/server'

export function getClientIp(request: NextRequest): string {
    // Try various headers in order of reliability
    const cfConnectingIp = request.headers.get('cf-connecting-ip') // Cloudflare
    const trueClientIp = request.headers.get('true-client-ip') // Akamai / Cloudflare
    const xRealIp = request.headers.get('x-real-ip') // Nginx proxy
    const xForwardedFor = request.headers.get('x-forwarded-for') // Standard proxy

    if (cfConnectingIp) return cfConnectingIp
    if (trueClientIp) return trueClientIp
    if (xRealIp) return xRealIp
    if (xForwardedFor) {
        // x-forwarded-for can be a list: "client, proxy1, proxy2"
        return xForwardedFor.split(',')[0].trim()
    }

    return 'unknown'
}

export function isIpAllowed(ip: string): boolean {
    const allowedIps = process.env.ALLOWED_IPS?.split(',').map(i => i.trim()) || []

    // If no IPs configured, allow all (development mode)
    if (allowedIps.length === 0 && process.env.NODE_ENV === 'development') {
        return true
    }

    return allowedIps.includes(ip)
}

export function isEditorIpAllowed(ip: string): boolean {
    const allowedIps = process.env.ALLOWED_EDITOR_IPS?.split(',').map(i => i.trim()) || []

    // If no IPs configured, allow all (development mode)
    if (allowedIps.length === 0 && process.env.NODE_ENV === 'development') {
        return true
    }

    return allowedIps.includes(ip)
}
