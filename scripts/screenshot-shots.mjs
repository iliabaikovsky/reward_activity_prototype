import {
  DATE_RANGES,
  REWARDS_SECTIONS,
  STEP_SLUGS,
  TYPE_LABELS,
  UPCOMING_STEP_INDICES,
} from './screenshot-helpers.mjs'

const DRILL_LISTS = [
  { step: 1, currency: 'exd', file: 'step-02-drill-exd' },
  { step: 6, currency: 'usd', file: 'step-07-drill-usd' },
  { step: 6, currency: 'exd', file: 'step-07-drill-exd' },
  { step: 8, currency: 'usd', file: 'step-09-drill-usd' },
  { step: 8, currency: 'exd', file: 'step-09-drill-exd' },
]

const DRILL_ROWS = [
  { step: 1, currency: 'exd', upcomingId: 'up-loy-1', file: '02-row-loyalty-upcoming' },
  { step: 2, currency: 'exd', upcomingId: 'up-loy-1-more', file: '03-row-loyalty-badge4' },
  { step: 6, currency: 'usd', upcomingId: 'up-cb-pend', file: '07-row-cashback-upcoming' },
  { step: 6, currency: 'exd', upcomingId: 'up-loy-2', file: '07-row-loyalty-upcoming' },
  { step: 8, currency: 'usd', upcomingId: 'up-cb-mature-thb', file: '09-row-cashback-upcoming' },
  { step: 8, currency: 'exd', upcomingId: 'up-loy-mature', file: '09-row-loyalty-upcoming' },
]

const SIMPLE_MODALS = [
  { file: 'loyalty-upcoming', step: 1, run: async (ctx) => {
    await ctx.openUpcomingDrill('exd')
    await ctx.openUpcomingRow('up-loy-1')
  }},
  { file: 'loyalty-activated', step: 3, run: (ctx) => ctx.openModalFromPreview('Loyalty rewards') },
  { file: 'cashback-upcoming', step: 6, run: async (ctx) => {
    await ctx.openUpcomingDrill('usd')
    await ctx.openUpcomingRow('up-cb-pend')
  }},
  { file: 'cashback-activated', step: 7, run: (ctx) => ctx.openModalFromPreview('EXD cashback') },
  { file: 'transfer-exd', step: 5, run: (ctx) => ctx.openModalFromPreview('Transfer') },
  { file: 'promo-gift', step: 4, run: (ctx) => ctx.openModalFromPreview('Birthday gift') },
  { file: 'exd-adjustment', step: 3, run: (ctx) => ctx.openModalFromPreview('EXD adjustment') },
]

const FEED_MODALS = [
  { id: 'feed-adj-1', step: 3, file: 'feed-exd-adjustment' },
  { id: 'feed-loy-act-1', step: 3, file: 'feed-loyalty-activated-mar18' },
  { id: 'feed-gift-1', step: 4, file: 'feed-promo-gift' },
  { id: 'feed-tr-1', step: 5, file: 'feed-transfer-exd' },
  { id: 'feed-cb-apr20-thb', step: 8, file: 'feed-cashback-apr20' },
  { id: 'feed-cb-apr19-jpy', step: 8, file: 'feed-cashback-apr19' },
  { id: 'feed-cb-apr18-inr', step: 8, file: 'feed-cashback-apr18' },
  { id: 'feed-loy-act-2', step: 8, file: 'feed-loyalty-apr1' },
  { id: 'feed-cb-mar25', step: 8, file: 'feed-cashback-mar26' },
  { id: 'feed-loy-act-open', step: 8, file: 'feed-loyalty-mar25' },
  { id: 'feed-cb-mar24', step: 8, file: 'feed-cashback-mar25' },
  { id: 'feed-cb-1', step: 8, file: 'feed-cashback-mar24' },
]

function shot(id, file, subdir, sets, step, run) {
  return { id, file, subdir, sets, step, run }
}

export function buildShots(setName) {
  const shots = []
  const inSet = (sets) => sets.includes(setName) || setName === 'all'

  for (let step = 0; step < STEP_SLUGS.length; step++) {
    const slug = STEP_SLUGS[step]

    shots.push(
      shot(
        `rewards/${slug}-home`,
        slug,
        'rewards',
        ['minimal', 'full'],
        step,
        async (ctx) => {
          await ctx.goToStep(step)
          await ctx.resetUi()
          await ctx.scrollTo('rewards-hero')
          await ctx.screenshot('rewards', slug)
        },
      ),
    )

    for (const section of REWARDS_SECTIONS) {
      if (section.upcomingOnly && !UPCOMING_STEP_INDICES.has(step)) continue
      shots.push(
        shot(
          `rewards/${slug}-${section.suffix}`,
          `${slug}-${section.suffix}`,
          'rewards',
          ['full'],
          step,
          async (ctx) => {
            await ctx.goToStep(step)
            await ctx.resetUi()
            await ctx.scrollTo(section.anchor)
            await ctx.screenshot('rewards', `${slug}-${section.suffix}`)
          },
        ),
      )
    }
  }

  for (const drill of DRILL_LISTS) {
    shots.push(
      shot(
        `drill/${drill.file}`,
        drill.file,
        'rewards-drill',
        ['minimal', 'full'],
        drill.step,
        async (ctx) => {
          await ctx.goToStep(drill.step)
          await ctx.openUpcomingDrill(drill.currency)
          await ctx.screenshot('rewards-drill', drill.file)
        },
      ),
    )
  }

  for (const row of DRILL_ROWS) {
    shots.push(
      shot(
        `drill-row/${row.file}`,
        row.file,
        'rewards-drill-rows',
        ['full'],
        row.step,
        async (ctx) => {
          await ctx.goToStep(row.step)
          await ctx.openUpcomingDrill(row.currency)
          await ctx.openUpcomingRow(row.upcomingId)
          await ctx.screenshot('rewards-drill-rows', row.file)
          await ctx.closeModal()
        },
      ),
    )
  }

  shots.push(
    shot(
      'activity/09-all-types',
      'step-09-all-types',
      'activity',
      ['minimal', 'full'],
      8,
      async (ctx) => {
        await ctx.goToStep(8)
        await ctx.openActivityFeed()
        await ctx.screenshot('activity', 'step-09-all-types')
      },
    ),
    shot(
      'activity/09-type-sheet-open',
      'step-09-type-sheet-open',
      'activity',
      ['minimal', 'full'],
      8,
      async (ctx) => {
        await ctx.goToStep(8)
        await ctx.openActivityFeed()
        await ctx.openTypeSheet()
        await ctx.screenshot('activity', 'step-09-type-sheet-open')
        await ctx.dismissSheets()
      },
    ),
    shot(
      'activity/09-filter-cashback',
      'step-09-filter-cashback',
      'activity',
      ['minimal', 'full'],
      8,
      async (ctx) => {
        await ctx.goToStep(8)
        await ctx.openActivityFeed()
        await ctx.setActivityFilters('cashback', 'all')
        await ctx.screenshot('activity', 'step-09-filter-cashback')
      },
    ),
    shot(
      'activity/01-empty-feed',
      'step-01-empty-feed',
      'activity',
      ['minimal', 'full'],
      0,
      async (ctx) => {
        await ctx.goToStep(0)
        await ctx.openActivityFeed()
        await ctx.screenshot('activity', 'step-01-empty-feed')
      },
    ),
    shot(
      'activity/09-via-lifetime-cashback',
      'step-09-via-lifetime-cashback',
      'activity',
      ['full'],
      8,
      async (ctx) => {
        await ctx.goToStep(8)
        await ctx.openActivityViaLifetimeCashback()
        await ctx.screenshot('activity', 'step-09-via-lifetime-cashback')
      },
    ),
    shot(
      'activity/09-no-matches',
      'step-09-no-matches',
      'activity',
      ['full'],
      8,
      async (ctx) => {
        await ctx.goToStep(8)
        await ctx.openActivityFeed()
        await ctx.setActivityFilters('others', 'all')
        await ctx.screenshot('activity', 'step-09-no-matches')
      },
    ),
    shot(
      'activity/09-date-sheet-open',
      'step-09-date-sheet-open',
      'activity',
      ['full'],
      8,
      async (ctx) => {
        await ctx.goToStep(8)
        await ctx.openActivityFeed()
        await ctx.openDateSheet()
        await ctx.screenshot('activity', 'step-09-date-sheet-open')
        await ctx.dismissSheets()
      },
    ),
  )

  for (const typeKey of Object.keys(TYPE_LABELS)) {
    for (const dateKey of Object.keys(DATE_RANGES)) {
      if (typeKey === 'all' && dateKey === 'all') continue
      shots.push(
        shot(
          `activity/09-filter-${typeKey}-${dateKey}`,
          `step-09-filter-${typeKey}-${dateKey}`,
          'activity',
          ['full'],
          8,
          async (ctx) => {
            await ctx.goToStep(8)
            await ctx.openActivityFeed()
            await ctx.setActivityFilters(typeKey, dateKey)
            await ctx.screenshot('activity', `step-09-filter-${typeKey}-${dateKey}`)
          },
        ),
      )
    }
  }

  for (const modal of SIMPLE_MODALS) {
    shots.push(
      shot(
        `modals/${modal.file}`,
        modal.file,
        'modals',
        ['minimal', 'full'],
        modal.step,
        async (ctx) => {
          await ctx.goToStep(modal.step)
          await ctx.closeModal()
          await modal.run(ctx)
          await ctx.screenshot('modals', modal.file)
          await ctx.closeModal()
        },
      ),
    )
  }

  for (const feed of FEED_MODALS) {
    shots.push(
      shot(
        `modals-feed/${feed.file}`,
        feed.file,
        'modals-feed',
        ['full'],
        feed.step,
        async (ctx) => {
          await ctx.goToStep(feed.step)
          await ctx.openActivityFeed()
          await ctx.openFeedItem(feed.id)
          await ctx.screenshot('modals-feed', feed.file)
          await ctx.closeModal()
        },
      ),
    )
  }

  const packShots = [
    {
      id: 'modals-pack/cashback-upcoming-orders-list',
      file: 'cashback-upcoming-orders-list',
      run: async (ctx) => {
        await ctx.openCashbackUpcomingPack(6)
        await ctx.modalOpenOrdersList()
      },
    },
    {
      id: 'modals-pack/cashback-upcoming-order-detail',
      file: 'cashback-upcoming-order-detail',
      run: async (ctx) => {
        await ctx.openCashbackUpcomingPack(6)
        await ctx.modalOpenFirstOrder('Cashback')
      },
    },
    {
      id: 'modals-pack/cashback-upcoming-sheet-exd-deducted',
      file: 'cashback-upcoming-sheet-exd-deducted',
      run: async (ctx) => {
        await ctx.openCashbackUpcomingPack(6)
        await ctx.modalOpenFirstOrder('Cashback')
        await ctx.modalClickDetailRow('EXD deducted')
      },
    },
    {
      id: 'modals-pack/cashback-upcoming-sheet-cashback-rate',
      file: 'cashback-upcoming-sheet-cashback-rate',
      run: async (ctx) => {
        await ctx.openCashbackUpcomingPack(6)
        await ctx.modalOpenFirstOrder('Cashback')
        await ctx.modalClickDetailRow('Cashback rate')
      },
    },
    {
      id: 'modals-pack/cashback-upcoming-closed-order',
      file: 'cashback-upcoming-closed-order',
      run: async (ctx) => {
        await ctx.openCashbackUpcomingPack(6)
        await ctx.modalOpenFirstOrder('Cashback')
        await ctx.modalClickDetailRow('^Order')
      },
    },
    {
      id: 'modals-pack/loyalty-upcoming-order-detail',
      file: 'loyalty-upcoming-order-detail',
      run: async (ctx) => {
        await ctx.goToStep(6)
        await ctx.openUpcomingDrill('exd')
        await ctx.openUpcomingRow('up-loy-2')
        await ctx.modalOpenFirstOrder('Rewards')
      },
    },
    {
      id: 'chart/order-9100821',
      file: 'order-9100821',
      subdir: 'chart',
      run: async (ctx) => {
        await ctx.openCashbackUpcomingPack(6)
        await ctx.modalOpenFirstOrder('Cashback')
        await ctx.modalClickDetailRow('^Order')
        await ctx.page.locator('.device-frame').getByRole('button', { name: /View chart/i }).click()
        await ctx.page.waitForTimeout(400)
      },
    },
  ]

  for (const pack of packShots) {
    shots.push(
      shot(
        pack.id,
        pack.file,
        pack.subdir ?? 'modals-pack',
        ['full'],
        6,
        async (ctx) => {
          await ctx.goToStep(6)
          await ctx.resetUi()
          await pack.run(ctx)
          await ctx.screenshot(pack.subdir ?? 'modals-pack', pack.file)
          if (pack.subdir === 'chart') {
            await ctx.resetUi()
          } else {
            await ctx.closeModal()
          }
        },
      ),
    )
  }

  return shots.filter((s) => inSet(s.sets))
}

export function countShotsBySet() {
  return {
    minimal: buildShots('minimal').length,
    full: buildShots('full').length,
    all: buildShots('all').length,
  }
}
