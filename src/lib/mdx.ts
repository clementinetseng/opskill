import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const CONTENT_PATH = path.join(process.cwd(), 'content')

export function getSopSlugs(moduleName: string) {
    const dirPath = path.join(CONTENT_PATH, moduleName)
    if (!fs.existsSync(dirPath)) return []
    const files = fs.readdirSync(dirPath)
    return files.filter(file => file.endsWith('.mdx')).map(file => file.replace('.mdx', ''))
}

export function getSopContent(moduleName: string, slug: string) {
    const filePath = path.join(CONTENT_PATH, moduleName, `${slug}.mdx`)
    if (!fs.existsSync(filePath)) return null
    return fs.readFileSync(filePath, 'utf8')
}

// New: Get all modules
export function getAllModules() {
    if (!fs.existsSync(CONTENT_PATH)) return []
    const items = fs.readdirSync(CONTENT_PATH, { withFileTypes: true })
    return items
        .filter(item => item.isDirectory())
        .map(item => item.name)
        .sort()
}

// New: Get all SOPs with metadata
export function getAllSops() {
    const modules = getAllModules()
    const allSops: Array<{
        module: string
        slug: string
        frontmatter: any
        lastModified: string
    }> = []

    modules.forEach(moduleName => {
        const slugs = getSopSlugs(moduleName)
        slugs.forEach(slug => {
            const filePath = path.join(CONTENT_PATH, moduleName, `${slug}.mdx`)
            const content = getSopContent(moduleName, slug)
            if (content) {
                const { data } = matter(content)
                const stats = fs.statSync(filePath)
                allSops.push({
                    module: moduleName,
                    slug,
                    frontmatter: data,
                    lastModified: stats.mtime.toISOString()
                })
            }
        })
    })

    return allSops
}

// CMS Functions
export function createSop(moduleName: string, slug: string, frontmatter: any, content: string) {
    const dirPath = path.join(CONTENT_PATH, moduleName)
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
    }

    const filePath = path.join(dirPath, `${slug}.mdx`)
    if (fs.existsSync(filePath)) {
        throw new Error('SOP already exists')
    }

    const fileContent = matter.stringify(content, frontmatter)
    fs.writeFileSync(filePath, fileContent, 'utf8')
    return true
}

export function updateSop(moduleName: string, slug: string, frontmatter: any, content: string) {
    const filePath = path.join(CONTENT_PATH, moduleName, `${slug}.mdx`)
    if (!fs.existsSync(filePath)) {
        throw new Error('SOP not found')
    }

    const fileContent = matter.stringify(content, frontmatter)
    fs.writeFileSync(filePath, fileContent, 'utf8')
    return true
}

export function deleteSop(moduleName: string, slug: string) {
    const filePath = path.join(CONTENT_PATH, moduleName, `${slug}.mdx`)
    if (!fs.existsSync(filePath)) {
        throw new Error('SOP not found')
    }

    fs.unlinkSync(filePath)
    return true
}
