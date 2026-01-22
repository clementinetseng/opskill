import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function getClientIp(request: NextRequest): string {
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  const trueClientIp = request.headers.get('true-client-ip')
  const xRealIp = request.headers.get('x-real-ip')
  const xForwardedFor = request.headers.get('x-forwarded-for')

  if (cfConnectingIp) return cfConnectingIp
  if (trueClientIp) return trueClientIp
  if (xRealIp) return xRealIp
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim()
  }

  return 'unknown'
}

function isIpAllowed(ip: string, whitelistVar: string = 'ALLOWED_IPS'): boolean {
  const allowedIps = process.env[whitelistVar]?.split(',').map(i => i.trim()) || []

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

function generateDeniedResponse(ip: string, title: string, message: string) {
  return new NextResponse(
    `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
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
              font-size: 2.5rem;
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
            .footer {
                margin-top: 2rem;
                font-size: 0.8rem;
                color: #999;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">🔒</div>
            <h1>${title}</h1>
            <p>${message}</p>
            <div class="ip">Your IP: ${ip}</div>
            <div class="footer">If you believe this is an error, please contact your system administrator.</div>
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

export function middleware(request: NextRequest) {
  const clientIp = getClientIp(request)
  const path = request.nextUrl.pathname

  // Skip IP check for static files and health checks
  if (
    path.startsWith('/_next') ||
    path.startsWith('/favicon.ico') ||
    path.startsWith('/api/health')
  ) {
    return NextResponse.next()
  }

  // Debug logs (Visible in Render logs)
  console.log(`[Middleware] Path: ${path} | IP: ${clientIp} | Env: ${process.env.NODE_ENV}`)

  // 1. Level 1: Site-wide Protection (ALLOWED_IPS)
  const isSiteAllowed = isIpAllowed(clientIp, 'ALLOWED_IPS')
  console.log(`[Middleware] Site Whitelist Check: ${isSiteAllowed} | Var: ${process.env.ALLOWED_IPS}`)

  if (!isSiteAllowed) {
    return generateDeniedResponse(
      clientIp,
      'Access Denied',
      'Your IP address is not authorized to access this system.'
    )
  }

  // 2. Level 2: Editor Protection (ALLOWED_EDITOR_IPS)
  // Protected paths: /editor, /api/sop
  if (path.startsWith('/editor') || path.startsWith('/api/sop')) {
    const isEditorAllowed = isIpAllowed(clientIp, 'ALLOWED_EDITOR_IPS')
    console.log(`[Middleware] Editor Whitelist Check: ${isEditorAllowed} | Var: ${process.env.ALLOWED_EDITOR_IPS}`)

    if (!isEditorAllowed) {
      return generateDeniedResponse(
        clientIp,
        'Editor Access Denied',
        'Your IP address does not have permission to edit content.'
      )
    }
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
