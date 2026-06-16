import { USABILITY_TEST_CHAPTERS, USABILITY_TEST_INTRO } from './usabilityTestChapters'
import { usabilityTestChapterUrl } from './parsePrototypeSearchParams'
import styles from './UsabilityTestPanel.module.css'

type Props = {
  chapterIndex: number
}

/**
 * Temporary UT self-test panel (?ut=1). Remove after UserTesting pilot.
 * @see docs/research/USABILITY_TEST_QUESTIONS.md
 */
export function UsabilityTestPanel({ chapterIndex }: Props) {
  const chapter = USABILITY_TEST_CHAPTERS[chapterIndex]
  if (!chapter) return null

  const isFirst = chapterIndex === 0
  const isLast = chapterIndex >= USABILITY_TEST_CHAPTERS.length - 1
  const prevUrl = chapterIndex > 0 ? usabilityTestChapterUrl(chapterIndex - 1) : null
  const nextUrl = !isLast ? usabilityTestChapterUrl(chapterIndex + 1) : null

  return (
    <aside className={styles.panel} aria-label="Usability test script">
      <div className={styles.card}>
        <span className={styles.badge}>UT preview — remove later</span>
        <h2 className={styles.title}>{chapter.title}</h2>

        {isFirst ? <p className={styles.intro}>{USABILITY_TEST_INTRO}</p> : null}

        <p className={styles.sectionLabel}>Scenario (read to participant)</p>
        <p className={styles.scenario}>{chapter.scenario}</p>

        <p className={styles.sectionLabel}>Tasks &amp; questions</p>
        <ol className={styles.taskList}>
          {chapter.tasks.map((task) => (
            <li key={task}>{task}</li>
          ))}
        </ol>

        {chapter.probes?.length ? (
          <>
            <p className={styles.sectionLabel}>If silent — probe</p>
            <ul className={styles.probes}>
              {chapter.probes.map((probe) => (
                <li key={probe}>{probe}</li>
              ))}
            </ul>
          </>
        ) : null}

        <div className={styles.nav}>
          {prevUrl ? (
            <a className={styles.navLink} href={prevUrl}>
              ← Chapter {chapterIndex}
            </a>
          ) : null}
          {nextUrl ? (
            <a className={styles.navLink} href={nextUrl}>
              Chapter {chapterIndex + 2} →
            </a>
          ) : null}
          <span className={styles.navMuted}>
            {chapterIndex + 1} / {USABILITY_TEST_CHAPTERS.length}
          </span>
        </div>

        <p className={styles.tempNote}>
          Edit copy in <code>docs/research/USABILITY_TEST_QUESTIONS.md</code>. Link:{' '}
          <code>?ut=1&amp;step={chapterIndex + 1}</code>
        </p>
      </div>
    </aside>
  )
}
