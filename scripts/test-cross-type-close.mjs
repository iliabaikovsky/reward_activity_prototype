import { chromium } from 'playwright'

const BASE = 'http://localhost:5173'

async function gotoStep(page, targetIndex) {
  for (let i = 0; i < targetIndex; i++) {
    await page.getByRole('button', { name: 'Следующий шаг' }).click()
    await page.waitForTimeout(80)
  }
}

async function isOnRewardsHome(page) {
  const hero = await page.getByText('Current status').isVisible()
  const drill = await page.getByRole('heading', { name: 'Upcoming cashback' }).isVisible().catch(() => false)
  return hero && !drill
}

async function isOnActivity(page) {
  return page.getByRole('heading', { name: 'Activity feed' }).isVisible()
}

async function openCashbackUpcomingFromRewards(page) {
  await page.getByRole('button', { name: /EXD cashback/i }).click()
  await page.waitForTimeout(300)
}

async function drillCrossTypeAndClose(page) {
  await page.getByRole('button', { name: 'For trading with EXD' }).click()
  await page.waitForTimeout(400)

  await page.getByRole('button', { name: '9100821' }).first().click()
  await page.waitForTimeout(300)

  await page.getByRole('button', { name: '9100821' }).last().click()
  await page.waitForTimeout(300)

  await page.getByRole('button', { name: 'Open EXD earned' }).click()
  await page.waitForTimeout(400)

  await page.getByRole('dialog').getByLabel('Back').click()
  await page.waitForTimeout(300)

  await page.getByRole('dialog').getByLabel('Close').click()
  await page.waitForTimeout(400)
}

async function testFromActivity(page) {
  await page.goto(BASE)
  await gotoStep(page, 6)

  await page.getByRole('button', { name: /Activity feed/i }).click()
  await page.waitForTimeout(200)
  console.log('Start on activity:', await isOnActivity(page))

  await page.getByRole('button', { name: 'Back' }).click()
  await page.waitForTimeout(200)

  await openCashbackUpcomingFromRewards(page)
  await drillCrossTypeAndClose(page)

  const rewards = await isOnRewardsHome(page)
  const activity = await isOnActivity(page)
  console.log('From activity flow — rewards home:', rewards, 'activity:', activity)
  return rewards && !activity
}

async function testFromRewards(page) {
  await page.goto(BASE)
  await gotoStep(page, 6)

  console.log('Start on rewards home:', await isOnRewardsHome(page))
  await openCashbackUpcomingFromRewards(page)
  await drillCrossTypeAndClose(page)

  const rewards = await isOnRewardsHome(page)
  const activity = await isOnActivity(page)
  console.log('From rewards flow — rewards home:', rewards, 'activity:', activity)
  return rewards && !activity
}

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
try {
  const a = await testFromActivity(page)
  const b = await testFromRewards(page)
  if (!a) console.error('FAIL: activity → close should land on rewards')
  if (!b) console.error('FAIL: rewards → close should stay on rewards')
  if (a && b) console.log('PASS both flows')
  else process.exitCode = 1
} catch (e) {
  console.error(e)
  process.exitCode = 1
} finally {
  await browser.close()
}
