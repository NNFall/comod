import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StrictMode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { BookingHelper } from './BookingHelper'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

async function reachContactStep(copyText?: (text: string) => Promise<void>) {
  const user = userEvent.setup()
  render(<BookingHelper copyText={copyText} />)

  await user.type(screen.getByLabelText('Дата'), '2099-09-15')
  await user.type(screen.getByLabelText('Время'), '18:30')
  await user.type(screen.getByRole('spinbutton', { name: 'Гостей' }), '4')
  await user.click(screen.getByRole('button', { name: 'Далее' }))

  return user
}

async function reachSummary(copyText?: (text: string) => Promise<void>) {
  const user = await reachContactStep(copyText)

  await user.type(screen.getByRole('textbox', { name: 'Имя' }), 'Ирина')
  await user.type(screen.getByRole('textbox', { name: 'Телефон' }), '8 927 265 56 56')
  await user.click(screen.getByRole('button', { name: 'Подготовить заявку' }))

  return user
}

describe('BookingHelper', () => {
  it('does not steal focus on the initial StrictMode mount', () => {
    render(
      <StrictMode>
        <BookingHelper />
      </StrictMode>,
    )

    expect(document.body).toHaveFocus()
  })

  it('shows labelled step one fields, linked inline errors and a persistent call action', async () => {
    const user = userEvent.setup()
    render(<BookingHelper />)

    expect(screen.getByText('Шаг 1 из 2 · Детали визита')).toHaveAttribute(
      'aria-live',
      'polite',
    )
    expect(screen.getByRole('link', { name: /позвонить в комод/i })).toHaveAttribute(
      'href',
      'tel:+79272655656',
    )

    await user.click(screen.getByRole('button', { name: 'Далее' }))

    const date = screen.getByLabelText('Дата')
    const time = screen.getByLabelText('Время')
    const guests = screen.getByRole('spinbutton', { name: 'Гостей' })

    for (const field of [date, time, guests]) {
      expect(field).toBeRequired()
      expect(field).toHaveAttribute('aria-required', 'true')
    }
    expect(date).toHaveAccessibleDescription('Укажите дату визита.')
    expect(time).toHaveAccessibleDescription('Укажите время визита.')
    expect(guests).toHaveAccessibleDescription('Укажите число гостей.')
    expect(date).toHaveAttribute('aria-invalid', 'true')
    expect(time).toHaveAttribute('aria-invalid', 'true')
    expect(guests).toHaveAttribute('aria-invalid', 'true')
    expect(date).toHaveFocus()
    expect(screen.getByText('Укажите дату визита.')).toHaveAttribute(
      'aria-live',
      'polite',
    )
  })

  it('rejects a past date and guest counts below one', async () => {
    const user = userEvent.setup()
    render(<BookingHelper />)

    await user.type(screen.getByLabelText('Дата'), '2000-01-01')
    await user.type(screen.getByLabelText('Время'), '12:00')
    await user.type(screen.getByRole('spinbutton', { name: 'Гостей' }), '0')
    await user.click(screen.getByRole('button', { name: 'Далее' }))

    expect(
      screen.getByText('Выберите сегодняшнюю или будущую дату.'),
    ).toBeInTheDocument()
    expect(screen.getByText('Укажите хотя бы одного гостя.')).toBeInTheDocument()
  })

  it('does not impose an unverified upper guest limit', async () => {
    const user = userEvent.setup()
    render(<BookingHelper />)

    const guests = screen.getByRole('spinbutton', { name: 'Гостей' })
    expect(guests).not.toHaveAttribute('max')
    await user.type(screen.getByLabelText('Дата'), '2099-09-15')
    await user.type(screen.getByLabelText('Время'), '18:30')
    await user.type(guests, '24')
    await user.click(screen.getByRole('button', { name: 'Далее' }))

    await waitFor(() =>
      expect(screen.getByRole('textbox', { name: 'Имя' })).toHaveFocus(),
    )
  })

  it('moves forward and back between the two named steps while preserving details', async () => {
    const user = await reachContactStep()

    expect(screen.getByText('Шаг 2 из 2 · Контакты')).toHaveAttribute(
      'aria-live',
      'polite',
    )
    expect(screen.getByRole('textbox', { name: 'Имя' })).toHaveAttribute(
      'autocomplete',
      'name',
    )
    expect(screen.getByRole('textbox', { name: 'Телефон' })).toHaveAttribute(
      'inputmode',
      'tel',
    )
    expect(screen.getByRole('textbox', { name: 'Имя' })).toBeRequired()
    expect(screen.getByRole('textbox', { name: 'Имя' })).toHaveAttribute(
      'aria-required',
      'true',
    )
    expect(screen.getByRole('textbox', { name: 'Имя' })).toHaveFocus()

    await user.click(screen.getByRole('button', { name: 'Назад' }))

    expect(screen.getByText('Шаг 1 из 2 · Детали визита')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByLabelText('Дата')).toHaveFocus())
    expect(screen.getByLabelText('Дата')).toHaveValue('2099-09-15')
    expect(screen.getByLabelText('Время')).toHaveValue('18:30')
    expect(screen.getByRole('spinbutton', { name: 'Гостей' })).toHaveValue(4)
  })

  it('validates name and phone before preparing the local summary', async () => {
    const user = await reachContactStep()

    await user.click(screen.getByRole('button', { name: 'Подготовить заявку' }))

    expect(screen.getByRole('textbox', { name: 'Имя' })).toHaveAccessibleDescription(
      'Укажите имя.',
    )
    expect(
      screen.getByRole('textbox', { name: 'Телефон' }),
    ).toHaveAccessibleDescription('Введите российский номер из 10 цифр.')
    expect(screen.getByRole('textbox', { name: 'Имя' })).toHaveFocus()
  })

  it('prepares a live local summary and copies it without sending data', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    const user = await reachSummary(writeText)

    const status = screen.getByRole('status', { name: 'Подготовленная заявка' })
    await waitFor(() => expect(status).toHaveFocus())
    expect(
      within(status).getByText((_, element) => element?.tagName === 'PRE')
        .textContent,
    ).toBe(
      [
        'Здравствуйте! Хочу уточнить возможность бронирования столика в «Комоде».',
        'Дата: 15.09.2099',
        'Время: 18:30',
        'Гостей: 4',
        'Имя: Ирина',
        'Телефон: +7 (927) 265-56-56',
        'Пожалуйста, подтвердите возможность по телефону.',
      ].join('\n'),
    )
    expect(status).toHaveTextContent('Заявка ещё не отправлена')
    expect(screen.queryByRole('button', { name: /отправить/iu })).not.toBeInTheDocument()

    await user.click(
      within(status).getByRole('button', { name: 'Скопировать текст заявки' }),
    )

    expect(writeText).toHaveBeenCalledTimes(1)
    expect(screen.getByText('Текст скопирован. Теперь позвоните в кофейню.')).toBeInTheDocument()
  })

  it('returns from the summary to the first field of the contact step', async () => {
    const user = await reachSummary()
    const status = screen.getByRole('status', { name: 'Подготовленная заявка' })

    await user.click(within(status).getByRole('button', { name: 'Назад' }))

    await waitFor(() =>
      expect(screen.getByRole('textbox', { name: 'Имя' })).toHaveFocus(),
    )
  })

  it('reports clipboard failure and keeps the telephone fallback visible', async () => {
    const user = await reachSummary(
      vi.fn().mockRejectedValue(new Error('blocked')),
    )

    await user.click(screen.getByRole('button', { name: 'Скопировать текст заявки' }))

    expect(
      screen.getByText('Не удалось скопировать. Выделите текст вручную или позвоните.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /позвонить в комод/i })).toHaveAttribute(
      'href',
      'tel:+79272655656',
    )
  })

  it('never exposes WhatsApp or claims that a reservation was sent or confirmed', () => {
    const { container } = render(<BookingHelper />)

    expect(container).not.toHaveTextContent(/whatsapp/iu)
    expect(container.querySelector('a[href*="whatsapp"]')).toBeNull()
    expect(container).not.toHaveTextContent(/бронь подтверждена|заявка отправлена/iu)
  })
})
