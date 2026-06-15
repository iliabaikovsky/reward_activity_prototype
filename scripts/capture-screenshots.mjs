/**
 * Playwright screenshot runner for Exness Rewards prototype.
 *
 * Usage:
 *   npm run dev
 *   npm run screenshots              # full catalog (~110 PNG)
 *   npm run screenshots:minimal      # smoke set (25 PNG)
 *
 * Options:
 *   --set minimal|full|all
 *   --only rewards/step-07-trade-rebate-home  (substring match on shot id)
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { BASE_URL } from './screenshot-helpers.mjs'
import { buildShots, countShotsBySet } from './screenshot-shots.mjs'
import { createContext } from './screenshot-helpers.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'docs', 'screenshots')

function parseArgs(argv) {
  let set = 'full'
  let only = null
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--set' && argv[i + 1]) {
      set = argv[++i]
    } else if (argv[i] === '--only' && argv[i + 1]) {
      only = argv[++i]
    }
  }
  return { set, only }
}

async function main() {
  const { set, only } = parseArgs(process.argv)
  let shots = buildShots(set)
  if (only) {
    shots = shots.filter((s) => s.id.includes(only))
  }

  if (shots.length === 0) {
    console.error(`No shots matched set="${set}" only="${only ?? ''}"`)
    process.exit(1)
  }

  const counts = countShotsBySet()
  console.log(`Screenshot set: ${set} (${shots.length} shots; catalog: minimal=${counts.minimal}, full=${counts.full})`)

  await mkdir(OUT_DIR, { recursive: true })

  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2,
  })
  const page = await context.newPage()

  try {
    await page.goto(BASE_URL, { waitUntil: 'load', timeout: 30_000 })
    await page.locator('.device-frame').waitFor({ timeout: 15_000 })

    const ctx = createContext(page, OUT_DIR)
    let failed = 0

    for (const shot of shots) {
      try {
        await shot.run(ctx)
      } catch (err) {
        failed++
        console.error(`✗ ${shot.id}: ${err.message}`)
      }
    }

    console.log(`\nDone — ${shots.length - failed}/${shots.length} saved under ${OUT_DIR}`)
    if (failed > 0) process.exit(1)
  } finally {
    await browser.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
