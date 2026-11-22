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

  await page.getByRole('button', { name: '知识点', exact: true }).click()
  await page.getByLabel('科目', { exact: true }).selectOption('os')
  await expect(first).toContainText('操作系统')
  await expect(page.locator('.result-item').filter({ hasText: '计算机组成原理' })).toHaveCount(0)
  await first.click()
  await expect(page).toHaveURL(/knowledge\/operating-systems\/os-section-virtual-memory.*#co-vm-tlb/)
  await page.goBack()
  await expect(input).toHaveValue('快表')
  await expect(page.getByLabel('科目', { exact: true })).toHaveValue('os')
})

test('真题支持题干关键词、完整题号和清空搜索', async ({ page }) => {
  await page.goto('/#/search?q=TCP&type=exam&subject=cn')
  const first = page.locator('.result-item').first()
  await expect(first).toContainText('真题 · 计算机网络')
  await expect(first).toHaveAttribute('href', /\/exams\?.*exam=/)

  await page.getByLabel('科目', { exact: true }).selectOption('')
  await page.getByRole('textbox', { name: '搜索', exact: true }).fill('２０１９年第１题')
  await expect(page.locator('.result-item')).toHaveCount(1)
  await expect(first.getByRole('heading')).toHaveText('2019年第1题')

  await page.getByRole('button', { name: '清空搜索' }).click()
  await expect(page.getByRole('textbox', { name: '搜索', exact: true })).toBeFocused()
  await expect(page.locator('.result-item')).toHaveCount(0)
  await expect(page).not.toHaveURL(/[?&]q=/)
})
