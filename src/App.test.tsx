import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import App from './App'

describe('Komod landing shell', () => {
  it('renders one main landmark, the Komod heading and all six labelled scenes', () => {
    render(<App />)

    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 1, name: /комод/i }),
    ).toBeInTheDocument()

    const scenes = Array.from(
      main.querySelectorAll<HTMLElement>(':scope > [data-scene]'),
    )
    expect(scenes).toHaveLength(6)
    expect(scenes.map((scene) => scene.id)).toEqual([
      'home',
      'breakfasts',
      'work',
      'about',
      'events',
      'contacts',
    ])
    scenes.forEach((scene) => expect(scene).toHaveAccessibleName())
    expect(document.getElementById('menu')).toBeInTheDocument()
  })
})
