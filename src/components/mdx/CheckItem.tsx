"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function CheckItem({ id, children }: { id: string, children: React.ReactNode }) {
    return (
        <div className="flex items-center space-x-2 my-2">
            <Checkbox id={id} />
            <Label htmlFor={id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {children}
            </Label>
        </div>
    )
}
