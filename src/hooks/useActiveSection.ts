import { useEffect, useState } from 'react'

const observerThresholds = [0, 0.2, 0.45, 0.7, 1]

export function useActiveSection(sectionIds: readonly string[]) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? '')

  useEffect(() => {
    if (sectionIds.length === 0 || typeof IntersectionObserver === 'undefined') {
      return undefined
    }

    const visibleRatios = new Map<string, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibleRatios.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          )
        }

        const nextSection = sectionIds.reduce((bestId, sectionId) => {
          const bestRatio = visibleRatios.get(bestId) ?? 0
          const sectionRatio = visibleRatios.get(sectionId) ?? 0
          return sectionRatio > bestRatio ? sectionId : bestId
        }, sectionIds[0])

        if ((visibleRatios.get(nextSection) ?? 0) > 0) {
          setActiveSection(nextSection)
        }
      },
      {
        rootMargin: '-20% 0px -62% 0px',
        threshold: observerThresholds,
      },
    )

    for (const sectionId of sectionIds) {
      const section = document.getElementById(sectionId)
      if (section) observer.observe(section)
    }

    return () => observer.disconnect()
  }, [sectionIds])

  return activeSection
}
