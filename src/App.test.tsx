import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import App from './App'

describe('Komod landing shell', () => {
  it('renders one main landmark, the Komod heading and all six labelled scenes', () => {
    render(<App />)

    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 1, name: /комод/i }),
    ).toBeInTheDocument()

    const scenes = screen.getAllByRole('region')
    expect(scenes).toHaveLength(6)
    scenes.forEach((scene) => expect(scene).toHaveAccessibleName())
  })
})
