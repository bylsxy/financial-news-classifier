import { test, expect } from '@playwright/test';

test.describe('Financial News Classifier UI', () => {
  test('should display empty state correctly on desktop', async ({ page }) => {
    await page.goto('/');
    
    // 检查标题
    await expect(page.getByRole('heading', { name: /Financial News Classifier/i })).toBeVisible();
    
    // 检查输入框
    const textarea = page.getByPlaceholder(/输入财经新闻内容进行分类分析/i);
    await expect(textarea).toBeVisible();
    await expect(textarea).toBeEmpty();
    
    // 检查按钮
    const submitButton = page.getByRole('button', { name: /开始分类/i });
    await expect(submitButton).toBeVisible();
    
    // 截图 - Desktop 空状态
    await page.screenshot({ path: 'tests/screenshots/desktop-empty-state.png', fullPage: true });
  });

  test('should display empty state correctly on mobile', async ({ page }) => {
    await page.goto('/');
    
    // 检查响应式布局
    await expect(page.getByRole('heading', { name: /Financial News Classifier/i })).toBeVisible();
    
    // 截图 - Mobile 空状态
    await page.screenshot({ path: 'tests/screenshots/mobile-empty-state.png', fullPage: true });
  });

  test('should show error when submitting empty text', async ({ page }) => {
    await page.goto('/');
    
    // 输入文本然后清空
    const textarea = page.getByPlaceholder(/输入财经新闻内容进行分类分析/i);
    await textarea.fill('test');
    await textarea.fill('');
    
    // 按钮应该被禁用
    const submitButton = page.getByRole('button', { name: /开始分类/i });
    await expect(submitButton).toBeDisabled();
  });

  test('should adjust temperature and top-k sliders', async ({ page }) => {
    await page.goto('/');
    
    // 调整 temperature
    const tempSlider = page.locator('input[id="temperature"]');
    await expect(tempSlider).toBeVisible();
    await tempSlider.fill('1.5');
    // 验证滑块值已更新（标签显示为 "Temperature: 1.5"）
    await expect(page.getByText(/Temperature:\s*1\.5/)).toBeVisible();
    
    // 调整 top-k
    const topkSlider = page.locator('input[id="topk"]');
    await expect(topkSlider).toBeVisible();
    await topkSlider.fill('4');
    await expect(page.getByText(/Top-K:\s*4/)).toBeVisible();
  });

  test('should display prediction results when API returns data', async ({ page }) => {
    // Mock API 响应
    await page.route('*/**/api/classify*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          input: 'Apple Inc. reported strong quarterly earnings exceeding market expectations.',
          result: {
            market_direction: 'bullish',
            event_type: 'financial_report',
            impact_strength: 'high',
            risk_signal: 'none',
          },
          top_k: [
            { label: 'financial_report', score: 0.45 },
            { label: 'company_action', score: 0.28 },
            { label: 'industry_trend', score: 0.15 },
            { label: 'market_volatility', score: 0.08 },
            { label: 'macro_policy', score: 0.04 },
          ],
        }),
      });
    });

    await page.goto('/');
    
    // 确保页面加载完成
    await expect(page.getByRole('heading', { name: /Financial News Classifier/i })).toBeVisible();

    // 输入文本
    await page.getByLabel('财经新闻文本').fill(
      'Apple Inc. reported strong quarterly earnings exceeding market expectations.'
    );
    
    // 提交
    await page.getByRole('button', { name: /开始分类/i }).click();
    
    // 等待结果显示
    await expect(page.locator('text=利好')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=财报相关')).toBeVisible();
    await expect(page.locator('text=高')).toBeVisible();
    await expect(page.locator('text=无风险')).toBeVisible();
    
    // 检查图表是否显示
    await expect(page.locator('text=事件类型置信度分布')).toBeVisible();
    
    // 截图 - Desktop 预测结果
    await page.screenshot({ path: 'tests/screenshots/desktop-prediction-result.png', fullPage: true });
  });

  test('should display prediction results on mobile', async ({ page }) => {
    // Mock API
    await page.route('*/**/api/classify*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          input: 'Apple Inc. reported strong quarterly earnings.',
          result: {
            market_direction: 'bullish',
            event_type: 'financial_report',
            impact_strength: 'high',
            risk_signal: 'none',
          },
          top_k: [
            { label: 'financial_report', score: 0.45 },
            { label: 'company_action', score: 0.28 },
            { label: 'industry_trend', score: 0.15 },
          ],
        }),
      });
    });

    await page.goto('/');
    
    // 确保页面加载完成
    await expect(page.getByRole('heading', { name: /Financial News Classifier/i })).toBeVisible();

    await page.getByLabel('财经新闻文本').fill('Apple Inc. reported strong quarterly earnings.');
    await page.getByRole('button', { name: /开始分类/i }).click();
    
    await expect(page.locator('text=利好')).toBeVisible({ timeout: 10000 });
    
    // 截图 - Mobile 预测结果
    await page.screenshot({ path: 'tests/screenshots/mobile-prediction-result.png', fullPage: true });
  });
});
