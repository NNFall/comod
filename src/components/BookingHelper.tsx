import { useEffect, useId, useRef, useState, type FormEvent } from 'react'

import { siteContent } from '../content/site'

const MIN_GUESTS = 1

type BookingStep = 1 | 2 | 'summary'

interface BookingDraft {
  readonly date: string
  readonly time: string
  readonly guests: string
  readonly name: string
  readonly phone: string
}

type BookingField = keyof BookingDraft
type BookingErrors = Partial<Record<BookingField, string>>

const initialDraft: BookingDraft = {
  date: '',
  time: '',
  guests: '',
  name: '',
  phone: '',
}

function todayAsLocalIsoDate() {
  const now = new Date()
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 10)
}

function displayIsoDate(value: string) {
  const [year, month, day] = value.split('-')
  return [day, month, year].join('.')
}

function normalizeRussianPhone(value: string) {
  let digits = value.replace(/\D/g, '')

  if (digits.length === 10) digits = `7${digits}`
  if (digits.length === 11 && digits.startsWith('8')) {
    digits = `7${digits.slice(1)}`
  }

  if (digits.length !== 11 || !digits.startsWith('7')) return null

  return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`
}

function buildBookingSummary(draft: BookingDraft) {
  return [
    'Здравствуйте! Хочу уточнить возможность бронирования столика в «Комоде».',
    `Дата: ${displayIsoDate(draft.date)}`,
    `Время: ${draft.time}`,
    `Гостей: ${draft.guests}`,
    `Имя: ${draft.name.trim()}`,
    `Телефон: ${draft.phone}`,
    'Пожалуйста, подтвердите возможность по телефону.',
  ].join('\n')
}

function validateVisit(draft: BookingDraft): BookingErrors {
  const errors: BookingErrors = {}
  const guests = Number(draft.guests)

  if (!draft.date) errors.date = 'Укажите дату визита.'
  else if (draft.date < todayAsLocalIsoDate()) {
    errors.date = 'Выберите сегодняшнюю или будущую дату.'
  }

  if (!draft.time) errors.time = 'Укажите время визита.'

  if (!draft.guests) errors.guests = 'Укажите число гостей.'
  else if (!Number.isInteger(guests) || guests < MIN_GUESTS) {
    errors.guests = 'Укажите хотя бы одного гостя.'
  }

  return errors
}

function validateContact(draft: BookingDraft): {
  errors: BookingErrors
  phone: string | null
} {
  const errors: BookingErrors = {}
  const phone = normalizeRussianPhone(draft.phone)

  if (draft.name.trim().length < 2) errors.name = 'Укажите имя.'
  if (!phone) errors.phone = 'Введите российский номер из 10 цифр.'

  return { errors, phone }
}

interface FieldShellProps {
  readonly id: string
  readonly label: string
  readonly error?: string
  readonly children: React.ReactNode
}

function FieldShell({ id, label, error, children }: FieldShellProps) {
  return (
    <div className="booking-helper__field">
      <label htmlFor={id}>{label}</label>
      {children}
      {error ? (
        <span
          className="booking-helper__error"
          id={`${id}-error`}
          aria-live="polite"
        >
          {error}
        </span>
      ) : null}
    </div>
  )
}

interface BookingHelperProps {
  readonly copyText?: (text: string) => Promise<void>
}

async function copyWithBrowserClipboard(text: string) {
  if (!window.navigator.clipboard) throw new Error('Clipboard unavailable')
  await window.navigator.clipboard.writeText(text)
}

export function BookingHelper({
  copyText = copyWithBrowserClipboard,
}: BookingHelperProps) {
  const formId = useId()
  const [step, setStep] = useState<BookingStep>(1)
  const [draft, setDraft] = useState<BookingDraft>(initialDraft)
  const [errors, setErrors] = useState<BookingErrors>({})
  const [summary, setSummary] = useState('')
  const [copyMessage, setCopyMessage] = useState('')
  const previousStep = useRef<BookingStep>(1)
  const summaryRef = useRef<HTMLElement>(null)
  const fieldRefs = useRef<Record<BookingField, HTMLInputElement | null>>({
    date: null,
    time: null,
    guests: null,
    name: null,
    phone: null,
  })

  useEffect(() => {
    if (previousStep.current === step) return
    previousStep.current = step

    if (step === 'summary') {
      summaryRef.current?.focus()
      return
    }

    fieldRefs.current[step === 1 ? 'date' : 'name']?.focus()
  }, [step])

  const fieldId = (field: BookingField) => `${formId}-${field}`
  const describedBy = (field: BookingField) =>
    errors[field] ? `${fieldId(field)}-error` : undefined
  const updateField = (field: BookingField, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }
  const focusFirstInvalid = (
    nextErrors: BookingErrors,
    fields: readonly BookingField[],
  ) => {
    const firstInvalid = fields.find((field) => Boolean(nextErrors[field]))
    if (firstInvalid) fieldRefs.current[firstInvalid]?.focus()
  }

  const goBack = () => {
    setErrors({})
    setCopyMessage('')
    setStep((current) => (current === 'summary' ? 2 : 1))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (step === 1) {
      const nextErrors = validateVisit(draft)
      setErrors(nextErrors)
      if (Object.keys(nextErrors).length === 0) setStep(2)
      else focusFirstInvalid(nextErrors, ['date', 'time', 'guests'])
      return
    }

    if (step === 2) {
      const result = validateContact(draft)
      setErrors(result.errors)
      if (Object.keys(result.errors).length > 0 || !result.phone) {
        focusFirstInvalid(result.errors, ['name', 'phone'])
        return
      }

      const completeDraft = { ...draft, phone: result.phone }
      setDraft(completeDraft)
      setSummary(buildBookingSummary(completeDraft))
      setStep('summary')
    }
  }

  const copySummary = async () => {
    try {
      await copyText(summary)
      setCopyMessage('Текст скопирован. Теперь позвоните в кофейню.')
    } catch {
      setCopyMessage(
        'Не удалось скопировать. Выделите текст вручную или позвоните.',
      )
    }
  }

  return (
    <div className="booking-helper" data-booking-step={step}>
      <div className="booking-helper__heading-row">
        <h3 id={`${formId}-title`}>Подготовить заявку</h3>
        <a
          className="booking-helper__call"
          href={siteContent.identity.phone.href}
          aria-label={`Позвонить в Комод: ${siteContent.identity.phone.display}`}
        >
          Позвонить
        </a>
      </div>

      {step === 'summary' ? (
        <section
          ref={summaryRef}
          className="booking-helper__summary"
          role="status"
          aria-live="polite"
          aria-label="Подготовленная заявка"
          tabIndex={-1}
        >
          <p className="booking-helper__notice">
            Заявка ещё не отправлена. Скопируйте текст и подтвердите возможность
            по телефону.
          </p>
          <pre>{summary}</pre>
          <div className="booking-helper__actions">
            <button type="button" className="booking-helper__secondary" onClick={goBack}>
              Назад
            </button>
            <button type="button" onClick={copySummary}>
              Скопировать текст заявки
            </button>
          </div>
          <p className="booking-helper__copy-status" aria-live="polite">
            {copyMessage}
          </p>
        </section>
      ) : (
        <form
          aria-labelledby={`${formId}-title`}
          className="booking-helper__form"
          noValidate
          onSubmit={handleSubmit}
        >
          <p
            className="booking-helper__step"
            aria-live="polite"
            aria-atomic="true"
          >
            {step === 1
              ? 'Шаг 1 из 2 · Детали визита'
              : 'Шаг 2 из 2 · Контакты'}
          </p>

          {step === 1 ? (
            <div className="booking-helper__fields booking-helper__fields--visit">
              <FieldShell id={fieldId('date')} label="Дата" error={errors.date}>
                <input
                  id={fieldId('date')}
                  ref={(node) => {
                    fieldRefs.current.date = node
                  }}
                  type="date"
                  min={todayAsLocalIsoDate()}
                  required
                  aria-required="true"
                  value={draft.date}
                  aria-describedby={describedBy('date')}
                  aria-invalid={Boolean(errors.date)}
                  onChange={(event) => updateField('date', event.target.value)}
                />
              </FieldShell>
              <FieldShell id={fieldId('time')} label="Время" error={errors.time}>
                <input
                  id={fieldId('time')}
                  ref={(node) => {
                    fieldRefs.current.time = node
                  }}
                  type="time"
                  required
                  aria-required="true"
                  value={draft.time}
                  aria-describedby={describedBy('time')}
                  aria-invalid={Boolean(errors.time)}
                  onChange={(event) => updateField('time', event.target.value)}
                />
              </FieldShell>
              <FieldShell id={fieldId('guests')} label="Гостей" error={errors.guests}>
                <input
                  id={fieldId('guests')}
                  ref={(node) => {
                    fieldRefs.current.guests = node
                  }}
                  type="number"
                  min={MIN_GUESTS}
                  required
                  aria-required="true"
                  inputMode="numeric"
                  value={draft.guests}
                  aria-describedby={describedBy('guests')}
                  aria-invalid={Boolean(errors.guests)}
                  onChange={(event) => updateField('guests', event.target.value)}
                />
              </FieldShell>
            </div>
          ) : (
            <div className="booking-helper__fields booking-helper__fields--contact">
              <FieldShell id={fieldId('name')} label="Имя" error={errors.name}>
                <input
                  id={fieldId('name')}
                  ref={(node) => {
                    fieldRefs.current.name = node
                  }}
                  type="text"
                  autoComplete="name"
                  required
                  aria-required="true"
                  value={draft.name}
                  aria-describedby={describedBy('name')}
                  aria-invalid={Boolean(errors.name)}
                  onChange={(event) => updateField('name', event.target.value)}
                />
              </FieldShell>
              <FieldShell id={fieldId('phone')} label="Телефон" error={errors.phone}>
                <input
                  id={fieldId('phone')}
                  ref={(node) => {
                    fieldRefs.current.phone = node
                  }}
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  required
                  aria-required="true"
                  placeholder="+7 900 000-00-00"
                  value={draft.phone}
                  aria-describedby={describedBy('phone')}
                  aria-invalid={Boolean(errors.phone)}
                  onChange={(event) => updateField('phone', event.target.value)}
                />
              </FieldShell>
            </div>
          )}

          <div className="booking-helper__actions">
            {step === 2 ? (
              <button type="button" className="booking-helper__secondary" onClick={goBack}>
                Назад
              </button>
            ) : null}
            <button type="submit">
              {step === 1 ? 'Далее' : 'Подготовить заявку'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
