import { expect, test } from '@playwright/test'

test('loads the Komod shell without runtime or request errors', async ({ page }) => {
  const runtimeErrors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') {
      runtimeErrors.push(`console: ${message.text()}`)
    }
  })
  page.on('pageerror', (error) => runtimeErrors.push(`page: ${error.message}`))
  page.on('requestfailed', (request) => {
    runtimeErrors.push(
      `request: ${request.method()} ${request.url()} ${request.failure()?.errorText ?? ''}`,
    )
  })

  const response = await page.goto('/', { waitUntil: 'networkidle' })

  expect(response?.ok()).toBe(true)
  await expect(page.locator('[data-site-shell]')).toBeVisible()
  await page.evaluate(
    () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())),
  )
  expect(runtimeErrors).toEqual([])
})
