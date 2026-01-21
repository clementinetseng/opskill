import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function getClientIp(request: NextRequest): string {
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

function isIpAllowed(ip: string): boolean {
    const allowedIps = process.env.ALLOWED_IPS?.split(',').map(i => i.trim()) || []

    // If no IPs configured, allow all (development mode)
    if (allowedIps.length === 0 && process.env.NODE_ENV === 'development') {
        return true
    }

    // In production, if no IPs configured, block all
    if (allowedIps.length === 0) {
        return false
    }

    return allowedIps.includes(ip)
}

export function middleware(request: NextRequest) {
    const clientIp = getClientIp(request)

    // Skip IP check for static files and API routes that don't need protection
    const path = request.nextUrl.pathname
    if (
        path.startsWith('/_next') ||
        path.startsWith('/favicon.ico') ||
        path.startsWith('/api/health')
    ) {
        return NextResponse.next()
    }

    // Check IP whitelist
    if (!isIpAllowed(clientIp)) {
        // Return 403 Forbidden with custom page
        return new NextResponse(
            `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Access Denied</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              text-align: center;
              background: white;
              padding: 3rem;
              border-radius: 1rem;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              max-width: 500px;
            }
            h1 {
              font-size: 3rem;
              margin: 0 0 1rem 0;
              color: #667eea;
            }
            p {
              color: #666;
              line-height: 1.6;
              margin: 1rem 0;
            }
            .ip {
              background: #f3f4f6;
              padding: 0.5rem 1rem;
              border-radius: 0.5rem;
              font-family: monospace;
              color: #333;
              display: inline-block;
              margin: 1rem 0;
            }
            .icon {
              font-size: 4rem;
              margin-bottom: 1rem;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">🔒</div>
            <h1>Access Denied</h1>
            <p>Your IP address is not authorized to access this system.</p>
            <div class="ip">Your IP: ${clientIp}</div>
            <p>If you believe this is an error, please contact your system administrator.</p>
          </div>
        </body>
      </html>
      `,
            {
                status: 403,
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                },
            }
        )
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}
