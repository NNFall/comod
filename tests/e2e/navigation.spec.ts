import { expect, test, type Page } from '@playwright/test'

async function pointerClick(page: Page, selector: string) {
  const box = await page.locator(selector).boundingBox()
  if (!box) throw new Error(`Cannot click missing target: ${selector}`)
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
}

test('anchors land one header below the viewport and update current navigation', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 1672, height: 941 })
  await page.goto('/', { waitUntil: 'networkidle' })

  const navigation = page.getByRole('navigation', {
    name: 'Основная навигация',
  })
  const header = page.locator('.site-header')
  const headerHeight = await header.evaluate((element) =>
    Math.round(element.getBoundingClientRect().height),
  )

  await navigation.getByRole('link', { name: 'Меню', exact: true }).click()
  await expect.poll(async () =>
    page.locator('#menu').evaluate((element) =>
      Math.round(element.getBoundingClientRect().top),
    ),
  ).toBe(headerHeight)

  const workLink = navigation.getByRole('link', {
    name: 'Для работы',
    exact: true,
  })
  await workLink.click()
  await expect.poll(async () =>
    page.locator('#work').evaluate((element) =>
      Math.round(element.getBoundingClientRect().top),
    ),
  ).toBe(headerHeight)
  await expect(workLink).toHaveAttribute('aria-current', 'location')
})

test('mobile focus does not move the page and widening closes the disclosure', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(() => window.scrollTo(0, 1200))
  const initialScroll = await page.evaluate(() => window.scrollY)

  await pointerClick(page, '.mobile-menu-toggle')
  await expect(page.getByRole('link', { name: 'Меню', exact: true }).last()).toBeFocused()
  expect(
    Math.abs((await page.evaluate(() => window.scrollY)) - initialScroll),
  ).toBeLessThanOrEqual(2)
  await expect.poll(async () =>
    page.locator('.mobile-navigation').evaluate((element) =>
      Math.round(element.getBoundingClientRect().top),
    ),
  ).toBe(
    await page.locator('.site-header').evaluate((element) =>
      Math.round(element.getBoundingClientRect().height),
    ),
  )

  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: 'Открыть меню' })).toBeFocused()
  expect(
    Math.abs((await page.evaluate(() => window.scrollY)) - initialScroll),
  ).toBeLessThanOrEqual(2)

  await pointerClick(page, '.mobile-menu-toggle')
  await expect(page.locator('.mobile-navigation')).toHaveCount(1)
  await page.setViewportSize({ width: 1280, height: 844 })

  await expect(page.locator('.mobile-navigation')).toHaveCount(0)
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe('hidden')
})

test('reduced motion removes hover and active transforms from navigation controls', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 1672, height: 941 })
  await page.goto('/', { waitUntil: 'networkidle' })

  const desktopAction = page.locator('.header-action')
  await desktopAction.hover()
  expect(
    await desktopAction.evaluate((element) => getComputedStyle(element).transform),
  ).toBe('none')
  await page.mouse.down()
  expect(
    await desktopAction.evaluate((element) => getComputedStyle(element).transform),
  ).toBe('none')
  await page.mouse.up()

  await page.setViewportSize({ width: 390, height: 844 })
  const menuButton = page.getByRole('button', { name: 'Открыть меню' })
  await menuButton.hover()
  await page.mouse.down()
  expect(
    await menuButton.evaluate((element) => getComputedStyle(element).transform),
  ).toBe('none')
  await page.mouse.up()
})
