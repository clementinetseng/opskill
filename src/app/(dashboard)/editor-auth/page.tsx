"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Lock } from "lucide-react"

const STORAGE_KEY = 'editor_auth_token'
const TOKEN_EXPIRY_DAYS = 7

export default function EditorAuthPage() {
    const router = useRouter()
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        // Check if already authenticated
        const token = localStorage.getItem(STORAGE_KEY)
        if (token) {
            const { password: savedPassword, expiry } = JSON.parse(token)
            if (new Date().getTime() < expiry) {
                // Token still valid, verify with server
                verifyAccess(savedPassword)
                return
            } else {
                localStorage.removeItem(STORAGE_KEY)
            }
        }
        setChecking(false)
    }, [])

    const verifyAccess = async (pwd: string) => {
        try {
            const response = await fetch('/api/editor/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: pwd })
            })

            if (response.ok) {
                router.push('/editor')
            } else {
                const error = await response.json()
                toast.error(error.error || 'Access denied')
                setChecking(false)
                localStorage.removeItem(STORAGE_KEY)
            }
        } catch (error) {
            toast.error('Failed to verify access')
            setChecking(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch('/api/editor/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            })

            if (response.ok) {
                // Save token to localStorage
                const expiry = new Date().getTime() + (TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000)
                localStorage.setItem(STORAGE_KEY, JSON.stringify({ password, expiry }))

                toast.success('Access granted')
                router.push('/editor')
            } else {
                const error = await response.json()
                toast.error(error.error || 'Invalid password or IP not allowed')
            }
        } catch (error) {
            toast.error('Failed to authenticate')
        } finally {
            setLoading(false)
        }
    }

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Verifying access...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        <CardTitle className="text-2xl">Editor Access</CardTitle>
                    </div>
                    <CardDescription>
                        Enter the editor password to continue
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Verifying...' : 'Access Editor'}
                        </Button>
                    </form>
                    <p className="text-xs text-muted-foreground mt-4 text-center">
                        Access is restricted to authorized IPs only
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
