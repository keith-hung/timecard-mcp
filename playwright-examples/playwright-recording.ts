import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://TIMECARD_SERVER_BASE_URL');
  await page.locator('input[name="name"]').click();
  await page.locator('input[name="name"]').fill('TIMECARD_USERNAME');
  await page.locator('input[name="pw"]').fill('TIMECARD_PASSWORD');
  await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  await page.getByRole('button', { name: 'Submit' }).click();

  await page.goto('http://TIMECARD_SERVER_BASE_URL/Timecard/timecard_week/daychoose.jsp?cho_date=2025-07-07');  
  
  // 選擇專案
  await page.locator('select[name="project0"]').selectOption('17647');

  // 選擇 activity
  await page.locator('select[name="activity0"]').selectOption('true$6$17647$0');

  // 逐日填寫該 activity 的工時
  await page.locator('select[name="record0_0"]').selectOption('4.5');
  await page.locator('select[name="record0_1"]').selectOption('6.0');
  await page.locator('select[name="record0_2"]').selectOption('2.0');
  await page.locator('select[name="record0_3"]').selectOption('4.0');
  await page.locator('select[name="record0_4"]').selectOption('1.5');

  // 逐項逐日填寫 note: weekrcord0 => activity0
  {
    // td:nth-child(4) => 週一
    await page.locator('#weekrecord0 > td:nth-child(4) > div:nth-child(2) > a').click();
    const page1 = await page.waitForEvent('popup');
    await page1.getByRole('textbox').click();
    await page1.getByRole('textbox').fill('OK');
    await page1.getByRole('button', { name: 'update' }).click();
    
    // td:nth-child(5) => 週二
    await page.locator('#weekrecord0 > td:nth-child(5) > div:nth-child(2) > a').click();
    const page2 = await page.waitForEvent('popup');
    await page2.getByRole('textbox').click();
    await page2.getByRole('textbox').fill('OK');
    await page2.getByRole('button', { name: 'update' }).click();

    // td:nth-child(6) => 週三
    await page.locator('#weekrecord0 > td:nth-child(6) > div:nth-child(2) > a').click();
    const page3 = await page.waitForEvent('popup');
    await page3.getByRole('textbox').click();
    await page3.getByRole('textbox').fill('OK');
    await page3.getByRole('button', { name: 'update' }).click();
    
    // td:nth-child(7) => 週四
    await page.locator('#weekrecord0 > td:nth-child(7) > div:nth-child(2) > a').click();
    const page4 = await page.waitForEvent('popup');
    await page4.getByRole('textbox').click();
    await page4.getByRole('textbox').fill('OK');
    await page4.getByRole('button', { name: 'update' }).click();
    
    // td:nth-child(8) => 週五
    await page.locator('#weekrecord0 > td:nth-child(8) > div:nth-child(2) > a').click();
    const page5 = await page.waitForEvent('popup');
    await page5.getByRole('textbox').click();
    await page5.getByRole('textbox').fill('OK');
    await page5.getByRole('button', { name: 'update' }).click();
  }

  // 選擇專案
  await page.locator('select[name="project1"]').selectOption('17647');
  
  // 選擇 activity
  await page.locator('select[name="activity1"]').selectOption('true$5$17647$0');
  
  // 逐日填寫該 activity 的工時
  await page.locator('select[name="record1_0"]').selectOption('3.5');
  await page.locator('select[name="record1_1"]').selectOption('2.0');
  await page.locator('select[name="record1_2"]').selectOption('5.0');
  await page.locator('select[name="record1_3"]').selectOption('4.0');
  await page.locator('select[name="record1_4"]').selectOption('6.5');
  
  // 逐項逐日填寫 note: weekrcord1 => activity1
  {
    // td:nth-child(4) => 週一
    await page.locator('#weekrecord1 > td:nth-child(4) > div:nth-child(2) > a').click();
    const page11 = await page.waitForEvent('popup');
    await page11.getByRole('textbox').click();
    await page11.getByRole('textbox').fill('OK');
    await page11.getByRole('button', { name: 'update' }).click();
    
    // td:nth-child(5) => 週二
    await page.locator('#weekrecord1 > td:nth-child(5) > div:nth-child(2) > a').click();
    const page12 = await page.waitForEvent('popup');
    await page12.getByRole('textbox').click();
    await page12.getByRole('textbox').fill('OK');
    await page12.getByRole('button', { name: 'update' }).click();

    // td:nth-child(6) => 週三
    await page.locator('#weekrecord1 > td:nth-child(6) > div:nth-child(2) > a').click();
    const page13 = await page.waitForEvent('popup');
    await page13.getByRole('textbox').click();
    await page13.getByRole('textbox').fill('OK');
    await page13.getByRole('button', { name: 'update' }).click();
    
    // td:nth-child(7) => 週四
    await page.locator('#weekrecord1 > td:nth-child(7) > div:nth-child(2) > a').click();
    const page14 = await page.waitForEvent('popup');
    await page14.getByRole('textbox').click();
    await page14.getByRole('textbox').fill('OK');
    await page14.getByRole('button', { name: 'update' }).click();
    
    // td:nth-child(8) => 週五
    await page.locator('#weekrecord1 > td:nth-child(8) > div:nth-child(2) > a').click();
    const page15 = await page.waitForEvent('popup');
    await page15.getByRole('textbox').click();
    await page15.getByRole('textbox').fill('OK');
    await page15.getByRole('button', { name: 'update' }).click();
  }

  // 儲存本週工時
  await page.locator('input[name="save2"]').click();
});