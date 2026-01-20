"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DepositCalculatorProps {
    currency: string
    rate: number
}

export function DepositCalculator({ currency, rate }: DepositCalculatorProps) {
    const [amount, setAmount] = useState<number | "">("")
    const fee = typeof amount === "number" ? amount * rate : 0
    const actual = typeof amount === "number" ? amount - fee : 0

    return (
        <Card className="my-4 w-full max-w-md bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                    Deposit Calculator ({currency}) - Rate: {rate * 100}%
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="amount">Deposit Amount</Label>
                    <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount..."
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/20">
                        <p className="text-xs text-red-600 dark:text-red-400">Fee</p>
                        <p className="text-lg font-bold text-red-700 dark:text-red-300">
                            {fee.toFixed(2)}
                        </p>
                    </div>
                    <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/20">
                        <p className="text-xs text-green-600 dark:text-green-400">Actual Amount</p>
                        <p className="text-lg font-bold text-green-700 dark:text-green-300">
                            {actual.toFixed(2)}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
