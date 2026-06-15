#!/usr/bin/env node
/** @deprecated Use `npm run screenshots:minimal` */
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const script = path.join(path.dirname(fileURLToPath(import.meta.url)), 'capture-screenshots.mjs')
const result = spawnSync(process.execPath, [script, '--set', 'minimal'], { stdio: 'inherit' })
process.exit(result.status ?? 1)
