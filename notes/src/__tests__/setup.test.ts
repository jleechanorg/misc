import { describe, it, expect } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'

describe('Project Setup', () => {
  const rootDir = path.resolve(__dirname, '../..')

  it('should have package.json', () => {
    const packageJsonPath = path.join(rootDir, 'package.json')
    expect(fs.existsSync(packageJsonPath)).toBe(true)
    const content = fs.readFileSync(packageJsonPath, 'utf-8')
    const pkg = JSON.parse(content)
    expect(pkg.name).toBe('todo-app')
    expect(pkg.dependencies.react).toBeDefined()
    expect(pkg.dependencies['react-router-dom']).toBeDefined()
    expect(pkg.dependencies.zustand).toBeDefined()
  })

  it('should have tsconfig.json', () => {
    const tsconfigPath = path.join(rootDir, 'tsconfig.json')
    expect(fs.existsSync(tsconfigPath)).toBe(true)
  })

  it('should have vite.config.ts', () => {
    const viteConfigPath = path.join(rootDir, 'vite.config.ts')
    expect(fs.existsSync(viteConfigPath)).toBe(true)
  })

  it('should have tailwind.config.js', () => {
    const tailwindConfigPath = path.join(rootDir, 'tailwind.config.js')
    expect(fs.existsSync(tailwindConfigPath)).toBe(true)
  })

  it('should have required npm scripts', () => {
    const packageJsonPath = path.join(rootDir, 'package.json')
    const content = fs.readFileSync(packageJsonPath, 'utf-8')
    const pkg = JSON.parse(content)
    expect(pkg.scripts.dev).toBeDefined()
    expect(pkg.scripts.build).toBeDefined()
    expect(pkg.scripts.test).toBeDefined()
    expect(pkg.scripts.lint).toBeDefined()
    expect(pkg.scripts.format).toBeDefined()
  })
})
