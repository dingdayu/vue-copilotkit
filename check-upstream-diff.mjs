import { readFileSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'

const DEFAULT_IGNORES = new Set(['AGENTS.md', 'README.md', 'README.zh.md', 'pnpm-lock.yaml', 'popup.png'])

function parseAllowlist(content) {
  return content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
}

function isAllowedByRule(filePath, rule) {
  if (rule.endsWith('/**')) {
    return filePath.startsWith(rule.slice(0, -3))
  }

  return filePath === rule
}

function isIgnored(filePath) {
  if (DEFAULT_IGNORES.has(filePath)) {
    return true
  }

  return filePath.endsWith('/package.json')
}

function getDiffFiles(baseRef) {
  const output = execSync(`git diff --name-only ${baseRef}..HEAD`, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  })

  return output
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
}

const baseRef = process.argv[2] || 'upstream/main'
const allowlistPath = '.upstream-diff-allowlist'
const allowlist = existsSync(allowlistPath) ? parseAllowlist(readFileSync(allowlistPath, 'utf8')) : []

const files = getDiffFiles(baseRef)
const meaningfulFiles = files.filter(filePath => !isIgnored(filePath))
const unexpectedFiles = meaningfulFiles.filter(filePath => !allowlist.some(rule => isAllowedByRule(filePath, rule)))

if (unexpectedFiles.length > 0) {
  console.error(`Unexpected upstream diffs vs ${baseRef}:`)
  unexpectedFiles.forEach(filePath => console.error(`- ${filePath}`))
  process.exit(1)
}

console.log(`Upstream diff check passed against ${baseRef}.`)
console.log(`Meaningful diffs tracked by allowlist: ${meaningfulFiles.length}`)
