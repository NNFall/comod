import { forwardRef, type ComponentPropsWithoutRef } from 'react'

interface SceneProps extends ComponentPropsWithoutRef<'section'> {
  readonly tone?: 'cream' | 'orange' | 'espresso' | 'light'
}

export const Scene = forwardRef<HTMLElement, SceneProps>(function Scene(
  { className = '', tone = 'cream', ...props },
  ref,
) {
  const classes = ['scene', className].filter(Boolean).join(' ')

  return (
    <section
      ref={ref}
      className={classes}
      data-scene=""
      data-tone={tone}
      {...props}
    />
  )
})
