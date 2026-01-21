"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function EditorRedirect() {
    const router = useRouter()

    useEffect(() => {
        router.push('/editor-auth')
    }, [router])

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-muted-foreground">Redirecting to authentication...</p>
        </div>
    )
}
