"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ScriptCopyProps {
    intent: string
    text: string
    className?: string
}

export function ScriptCopy({ intent, text, className }: ScriptCopyProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className={cn("group relative my-4 rounded-lg border bg-muted/50 p-4", className)}>
            <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Script: {intent.replace('_', ' ')}
            </div>
            <p className="pr-10 text-sm leading-relaxed text-foreground font-mono">
                {text}
            </p>
            <Button
                size="icon"
                variant="ghost"
                className="absolute right-2 top-2 opacity-100 transition-opacity hover:bg-background group-hover:opacity-100"
                onClick={handleCopy}
            >
                {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                ) : (
                    <Copy className="h-4 w-4 text-muted-foreground" />
                )}
            </Button>
        </div>
    )
}
