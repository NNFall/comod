interface BrandMarkProps {
  readonly current?: boolean
}

export function BrandMark({ current = false }: BrandMarkProps) {
  return (
    <a
      className="brand-mark"
      href="#home"
      aria-label="Комод, на главную"
      aria-current={current ? 'page' : undefined}
    >
      <span className="brand-mark__word" aria-hidden="true">
        <span>КО</span>
        <span>МОД</span>
      </span>
      <span className="brand-mark__descriptor">городская кофейня</span>
    </a>
  )
}
