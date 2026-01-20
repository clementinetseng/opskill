"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "cmdk"
import { FileText, Search } from "lucide-react"

interface SopItem {
    module: string
    slug: string
    title: string
    tags: string[]
    difficulty: string
}

interface CommandMenuProps {
    sops: SopItem[]
}

export function CommandMenu({ sops }: CommandMenuProps) {
    const router = useRouter()
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = React.useCallback((command: () => void) => {
        setOpen(false)
        command()
    }, [])

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 transition-colors w-full md:w-64"
            >
                <Search className="w-4 h-4" />
                <span>Search SOPs...</span>
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type to search SOPs..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="SOPs">
                        {sops.map((sop) => (
                            <CommandItem
                                key={`${sop.module}/${sop.slug}`}
                                value={`${sop.title} ${sop.tags.join(' ')}`}
                                onSelect={() => {
                                    runCommand(() => router.push(`/sop/${sop.module}/${sop.slug}`))
                                }}
                            >
                                <FileText className="mr-2 h-4 w-4" />
                                <div className="flex flex-col">
                                    <span>{sop.title}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {sop.module.replace(/_/g, ' ')} • {sop.difficulty}
                                    </span>
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}
