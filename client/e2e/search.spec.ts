import { fileURLToPath } from 'node:url'
import { test, expect } from '@playwright/test'

test('搜索完整术语优先，按科目筛选后能够定位正文', async ({ page }) => {
  await page.goto('/#/search')
  const input = page.getByRole('textbox', { name: '搜索', exact: true })
  await input.fill('快')
  await input.fill('快表')

  const first = page.locator('.result-item').first()
  await expect(first).toContainText('虚拟存储器')
  await expect(first.locator('mark').first()).toBeVisible()
  await expect(page.locator('.result-item').filter({ hasText: '线性表的概念' })).toHaveCount(0)

  await page.getByLabel('科目', { exact: true }).selectOption('os')
  await expect(first).toContainText('操作系统')
  await expect(page.locator('.result-item').filter({ hasText: '计算机组成原理' })).toHaveCount(0)
  await first.click()
  await expect(page).toHaveURL(/knowledge\/operating-systems\/os-section-virtual-memory.*#co-vm-tlb/)
  await page.goBack()
  await expect(input).toHaveValue('快表')
  await expect(page.getByLabel('科目', { exact: true })).toHaveValue('os')
})

test('搜索只显示知识点，旧版真题筛选链接也保持知识点结果', async ({ page }) => {
  await page.goto('/#/search?q=TCP&type=exam&subject=cn')
  const first = page.locator('.result-item').first()
  await expect(first).toHaveAttribute('href', /#\/knowledge\/computer-network/)
  await expect(page.getByRole('button', { name: '真题', exact: true })).toHaveCount(0)
  await expect(page.getByRole('link', { name: '历年真题', exact: true })).toHaveCount(0)
  await expect(page.getByRole('link', { name: '返回首页' }).locator('svg')).toHaveCount(0)
  await expect(page.locator('.result-item[href*="/exams"]')).toHaveCount(0)

  await page.getByRole('button', { name: '清空搜索' }).click()
  await expect(page.getByRole('textbox', { name: '搜索', exact: true })).toBeFocused()
  await expect(page.locator('.result-item')).toHaveCount(0)
  await expect(page).not.toHaveURL(/[?&]q=/)
})

test('提问式搜索能定位 Cache 组号算法', async ({ page }) => {
  const personalContent = fileURLToPath(new URL('../public/editor/content.json', import.meta.url))
  await page.route('**/editor/content.json?*', (route) => route.fulfill({ path: personalContent }))
  await page.goto('/#/search?' + new URLSearchParams({ q: '求cache组号' }).toString())
  const results = page.locator('.result-item')
  await expect(results.first()).toHaveAttribute('href', /#kb-co-cache-mapping-4$/, { timeout: 15_000 })
  await expect(results.first()).toContainText('Cache 组号怎么算')
  await expect(results.filter({ hasText: '2026年第18题' })).toHaveCount(0)

  await results.first().click()
  await expect(page.locator('#kb-co-cache-mapping-4')).toContainText('主存块号对组数取余')
  await expect(page.getByText('分步动画', { exact: true })).toHaveCount(0)
})
