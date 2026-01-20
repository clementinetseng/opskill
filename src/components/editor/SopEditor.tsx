"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"

interface SopEditorProps {
    initialData?: {
        frontmatter: any
        content: string
    }
    onSave: (frontmatter: any, content: string) => void
    onCancel: () => void
}

export function SopEditor({ initialData, onSave, onCancel }: SopEditorProps) {
    const [frontmatter, setFrontmatter] = useState(initialData?.frontmatter || {
        id: '',
        title: '',
        tags: [],
        difficulty: 'trainee',
        last_updated: new Date().toISOString().split('T')[0],
        ai_actionable: false,
        required_tools: []
    })
    const [content, setContent] = useState(initialData?.content || '')
    const [newTag, setNewTag] = useState('')

    const addTag = () => {
        if (newTag && !frontmatter.tags.includes(newTag)) {
            setFrontmatter({ ...frontmatter, tags: [...frontmatter.tags, newTag] })
            setNewTag('')
        }
    }

    const removeTag = (tag: string) => {
        setFrontmatter({ ...frontmatter, tags: frontmatter.tags.filter((t: string) => t !== tag) })
    }

    const insertComponent = (componentName: string) => {
        const templates: Record<string, string> = {
            calculator: '\n<DepositCalculator currency="PHP" rate={0.10} />\n',
            script: '\n<ScriptCopy \n  intent="example" \n  text="Your script text here" \n/>\n',
            checklist: '\n<CheckItem id="step1">Your checklist item</CheckItem>\n'
        }
        setContent(content + (templates[componentName] || ''))
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>SOP Editor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* ID */}
                <div className="space-y-2">
                    <Label htmlFor="id">SOP ID *</Label>
                    <Input
                        id="id"
                        placeholder="e.g., SOP-BILLING-001"
                        value={frontmatter.id}
                        onChange={(e) => setFrontmatter({ ...frontmatter, id: e.target.value })}
                    />
                </div>

                {/* Title */}
                <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                        id="title"
                        placeholder="e.g., 會員首存異常處理"
                        value={frontmatter.title}
                        onChange={(e) => setFrontmatter({ ...frontmatter, title: e.target.value })}
                    />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Add tag..."
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        />
                        <Button type="button" size="icon" onClick={addTag}>
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {frontmatter.tags.map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="gap-1">
                                {tag}
                                <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Difficulty */}
                <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select value={frontmatter.difficulty} onValueChange={(value) => setFrontmatter({ ...frontmatter, difficulty: value })}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="trainee">Trainee</SelectItem>
                            <SelectItem value="junior">Junior</SelectItem>
                            <SelectItem value="senior">Senior</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Content */}
                <div className="space-y-2">
                    <Label htmlFor="content">Content (MDX) *</Label>
                    <div className="flex gap-2 mb-2">
                        <Button type="button" size="sm" variant="outline" onClick={() => insertComponent('calculator')}>
                            + Calculator
                        </Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => insertComponent('script')}>
                            + Script
                        </Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => insertComponent('checklist')}>
                            + Checklist
                        </Button>
                    </div>
                    <Textarea
                        id="content"
                        placeholder="# Your SOP content here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={15}
                        className="font-mono text-sm"
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                    <Button onClick={() => onSave(frontmatter, content)}>Save SOP</Button>
                    <Button variant="outline" onClick={onCancel}>Cancel</Button>
                </div>
            </CardContent>
        </Card>
    )
}
