import { mkdir } from 'node:fs/promises'
import path from 'node:path'

export const BASE_URL = process.env.SCREENSHOT_BASE_URL ?? 'http://localhost:5173'

export const STEP_SLUGS = [
  'step-01-empty',
  'step-02-upcoming-loyalty',
  'step-03-activation',
  'step-04-transfer',
  'step-05-trade-rebate',
  'step-06-cashback-settled',
  'step-07-mature-trader',
]

/** 0-based indices with Upcoming block visible. */
export const UPCOMING_STEP_INDICES = new Set([1, 4, 5, 6])

export const TYPE_LABELS = {
  all: 'All types',
  rewards: 'Rewards',
  cashback: 'Cashback',
  transfers: 'Transfers',
  others: 'Others',
}

/** Step 7 demo today: 2026-07-18 — ranges for screenshot matrix. */
export const DATE_RANGES = {
  all: null,
  last7: { start: '2026-07-12', end: '2026-07-18' },
  last30: { start: '2026-06-19', end: '2026-07-18' },
  thisMonth: { start: '2026-07-01', end: '2026-07-31' },
}

export const REWARDS_SECTIONS = [
  { anchor: 'rewards-hero', suffix: 'hero' },
  { anchor: 'rewards-wallets', suffix: 'wallets' },
  { anchor: 'rewards-earn-banner', suffix: 'earn-banner' },
  { anchor: 'rewards-upcoming', suffix: 'upcoming', upcomingOnly: true },
  { anchor: 'rewards-lifetime', suffix: 'lifetime' },
  { anchor: 'rewards-activity-preview', suffix: 'activity-preview' },
]

export function createContext(page, outDir) {
  const frame = () => page.locator('.device-frame')

  return {
    page,
    outDir,

    async goToStep(targetIndex) {
      await page.goto(`${BASE_URL}/?step=${targetIndex + 1}`)
      await page.waitForTimeout(300)
    },

    async resetUi() {
      await resetToRewardsHome(page)
    },

    async scrollTo(anchor) {
      const el = frame().locator(`[data-screenshot="${anchor}"]`)
      if (await el.count()) {
        await el.first().scrollIntoViewIfNeeded()
        await page.waitForTimeout(200)
      } else {
        await page.locator('.device-frame-scroll').evaluate((node) => node.scrollTo(0, 0))
      }
    },

    async screenshot(subdir, name) {
      const dir = path.join(outDir, subdir)
      await mkdir(dir, { recursive: true })
      const filePath = path.join(dir, `${name}.png`)
      await frame().waitFor({ state: 'visible', timeout: 15_000 })
      await page.waitForTimeout(300)
      await frame().screenshot({ path: filePath, animations: 'disabled' })
      console.log(`✓ ${subdir}/${name}.png`)
      return filePath
    },

    async waitForModal() {
      await frame().locator('#reward-detail-modal-title').waitFor({ timeout: 10_000 })
    },

    async closeModal() {
      for (let i = 0; i < 12; i++) {
        if (!(await frame().locator('#reward-detail-modal-title').isVisible().catch(() => false))) {
          break
        }

        if ((await frame().locator('[role="dialog"]').count()) > 1) {
          await page.keyboard.press('Escape')
          await page.waitForTimeout(400)
          continue
        }

        const modalBack = modalHeader(page).getByRole('button', { name: 'Back' })
        if (await modalBack.isVisible().catch(() => false)) {
          await modalBack.click()
          await page.waitForTimeout(300)
          continue
        }

        await closeModalIfOpen(page)
        break
      }
    },

    async closeStackedSheet() {
      const stackedClose = frame()
        .locator('[role="dialog"]')
        .getByRole('button', { name: 'Close' })
      if ((await stackedClose.count()) > 0) {
        await stackedClose.last().click()
        await page.waitForTimeout(350)
      }
    },

    async openActivityFeed() {
      await resetToRewardsHome(page)
      await frame().getByRole('button', { name: 'Activity feed' }).click()
      await page.getByRole('heading', { name: 'Activity feed' }).waitFor({ timeout: 10_000 })
    },

    async openActivityViaLifetimeCashback() {
      await resetToRewardsHome(page)
      await frame().locator('[data-screenshot="rewards-lifetime"]').getByRole('button').click()
      await page.getByRole('heading', { name: 'Activity feed' }).waitFor({ timeout: 10_000 })
    },

    async setActivityDateFilter(dateKey) {
      const range = DATE_RANGES[dateKey]
      const filters = frame().locator('[data-screenshot="activity-filters"]')
      await filters.getByRole('button').nth(1).click()
      await page.waitForTimeout(200)
      if (!range) {
        await frame().getByRole('button', { name: 'Clear' }).click()
      } else {
        await ensureCalendarMonth(frame(), range.start)
        await pickCalendarDay(frame(), range.start)
        if (range.end !== range.start) {
          await ensureCalendarMonth(frame(), range.end)
          await pickCalendarDay(frame(), range.end)
        }
        await frame().getByRole('button', { name: 'OK' }).click()
      }
      await page.waitForTimeout(250)
    },

    async setActivityFilters(typeKey, dateKey) {
      const typeLabel = TYPE_LABELS[typeKey]
      const filters = frame().locator('[data-screenshot="activity-filters"]')
      await filters.getByRole('button').nth(0).click()
      await page.getByRole('option', { name: typeLabel }).click()
      await page.waitForTimeout(200)
      await this.setActivityDateFilter(dateKey)
    },

    async dismissSheets() {
      for (let i = 0; i < 3; i++) {
        const backdrop = frame().locator('button[aria-label="Close"][tabindex="0"]').first()
        if (await backdrop.isVisible().catch(() => false)) {
          await backdrop.click({ force: true })
          await page.waitForTimeout(250)
          continue
        }
        await page.keyboard.press('Escape')
        await page.waitForTimeout(200)
        break
      }
    },

    async openTypeSheet() {
      await frame().locator('[data-screenshot="activity-filters"]').getByRole('button').nth(0).click()
      await page.waitForTimeout(250)
    },

    async openDateSheet() {
      await frame().locator('[data-screenshot="activity-filters"]').getByRole('button').nth(1).click()
      await page.waitForTimeout(250)
    },

    async openUpcomingDrill(currency) {
      await resetToRewardsHome(page)
      const pattern =
        currency === 'usd' ? /EXD cashback\s+[\d.]+\s*USD/i : /Rewards\s+[\d.]+\s*EXD/i
      const btn = frame().getByRole('button', { name: pattern })
      await btn.scrollIntoViewIfNeeded()
      await btn.click()
      await frame().getByText('Total upcoming').waitFor({ timeout: 10_000 })
    },

    async openUpcomingRow(upcomingId) {
      await frame().locator(`[data-upcoming-id="${upcomingId}"]`).click()
      await this.waitForModal()
    },

    async openFeedItem(feedItemId) {
      await frame().locator(`[data-feed-item-id="${feedItemId}"]`).click()
      await this.waitForModal()
    },

    async openModalFromPreview(rowTitle) {
      await resetToRewardsHome(page)
      await closeModalIfOpen(page)
      await frame()
        .getByRole('button', { name: new RegExp(`^${rowTitle}\\s+[+-]?[\\d.]`, 'i') })
        .first()
        .click()
      await this.waitForModal()
    },

    async modalOpenOrdersList() {
      await frame().getByRole('button', { name: /see all/i }).click()
      await page.waitForTimeout(300)
    },

    async modalOpenFirstOrder(regionName = 'Orders') {
      const region = frame().getByRole('region', { name: regionName })
      const onOrdersList = await frame().getByRole('heading', { name: 'Orders' }).isVisible().catch(() => false)
      const index = onOrdersList ? 0 : 1
      await region.getByRole('button').nth(index).click()
      await page.waitForTimeout(300)
    },

    async modalClickDetailRow(label) {
      await frame().getByRole('button', { name: new RegExp(label, 'i') }).click()
      await page.waitForTimeout(300)
    },

    async openCashbackUpcomingPack(stepIndex) {
      await this.goToStep(stepIndex)
      await this.openUpcomingDrill('usd')
      await this.openUpcomingRow('up-cb-pend')
    },
  }
}

async function getStepIndex(page) {
  const url = page.url()
  const fromUrl = url.match(/[?&]step=(\d+)/)
  if (fromUrl) return parseInt(fromUrl[1], 10) - 1
  const text = await page.getByRole('complementary', { name: 'Lifecycle simulator' }).innerText()
  const match = text.match(/^\s*(\d+)\./m)
  const n = match ? parseInt(match[1], 10) : 1
  return n - 1
}

export async function resetToRewardsHome(page) {
  const frame = page.locator('.device-frame')
  for (let i = 0; i < 3; i++) {
    const backdrop = frame.locator('button[aria-label="Close"][tabindex="0"]').first()
    if (await backdrop.isVisible().catch(() => false)) {
      await backdrop.click({ force: true })
      await page.waitForTimeout(250)
    } else {
      break
    }
  }
  for (let i = 0; i < 8; i++) {
    if (await page.getByRole('button', { name: 'Back to Exness Rewards' }).isVisible().catch(() => false)) {
      await page.getByRole('button', { name: 'Back to Exness Rewards' }).click()
      await page.waitForTimeout(350)
      continue
    }
    if (await frame.locator('#reward-detail-modal-title').isVisible().catch(() => false)) {
      await closeModalIfOpen(page)
      continue
    }
    if (await frame.getByText('Total upcoming').isVisible().catch(() => false)) {
      await frame.getByRole('button', { name: 'Back' }).first().click()
      await page.waitForTimeout(350)
      continue
    }
    if (await page.getByRole('heading', { name: 'Activity feed' }).isVisible().catch(() => false)) {
      await frame.getByRole('button', { name: 'Back' }).first().click()
      await page.waitForTimeout(350)
      continue
    }
    break
  }
  await page.locator('.device-frame-scroll').evaluate((el) => el.scrollTo(0, 0))
  await page.waitForTimeout(150)
}

export async function closeModalIfOpen(page) {
  const frame = page.locator('.device-frame')
  const title = frame.locator('#reward-detail-modal-title')
  if (!(await title.isVisible().catch(() => false))) return
  await frame
    .locator('[data-screenshot="reward-modal-header"]')
    .getByRole('button', { name: 'Close' })
    .click()
  await title.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {})
  await page.waitForTimeout(350)
}

function modalHeader(page) {
  return page.locator('.device-frame').locator('[data-screenshot="reward-modal-header"]')
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function monthYearFromIso(iso) {
  const [y, m] = iso.split('-').map(Number)
  return `${MONTH_NAMES[m - 1]} ${y}`
}

function dayFromIso(iso) {
  return String(Number(iso.split('-')[2]))
}

async function ensureCalendarMonth(frame, iso) {
  const target = monthYearFromIso(iso)
  for (let i = 0; i < 24; i++) {
    const label = await frame.locator('[data-node-id="42228:18233"] p').first().textContent()
    if (label?.trim() === target) return
    const [ty, tm] = target.split(' ')
    const [cy, cm] = (label?.trim() ?? '').split(' ')
    const targetIdx = MONTH_NAMES.indexOf(tm) + Number(ty) * 12
    const currentIdx = MONTH_NAMES.indexOf(cm) + Number(cy) * 12
    if (Number.isNaN(targetIdx) || Number.isNaN(currentIdx)) break
    const btn =
      targetIdx < currentIdx
        ? frame.getByRole('button', { name: 'Previous month' })
        : frame.getByRole('button', { name: 'Next month' })
    await btn.click()
    await frame.page().waitForTimeout(120)
  }
}

async function pickCalendarDay(frame, iso) {
  const day = dayFromIso(iso)
  await frame
    .locator('[data-node-id="42228:18233"]')
    .getByRole('button', { name: day, exact: true })
    .click()
}
