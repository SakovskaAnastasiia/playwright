import { test, expect } from '@playwright/test';

test('IncorrectLogin', async ({ page }) => {
  await page.goto('https://petstore.octoperf.com/');
  await page.getByRole('link', { name: 'Enter the Store' }).click();
  await page.getByRole('link', { name: 'Sign In' }).click();
  await page.locator('input[name="username"]').fill('qwerty');
  await page.locator('input[name="password"]').fill('password');
  await page.locator('input[name="password"]').press('Enter');
  const failLogin = page.getByText('Invalid username or password. Signon failed.');
  await expect(failLogin).toBeEnabled();
});

test('AddToCart', async ({ page }) => {
  await page.goto('https://petstore.octoperf.com/');
  await page.getByRole('link', { name: 'Enter the Store' }).click();
  await page.locator('#QuickLinks').getByRole('link').first().click();
  await page.getByRole('link', { name: 'FI-SW-01' }).click();
  await page.getByRole('link', { name: 'Add to Cart' }).first().click();
  const cartCheck = page.getByText('Large Angelfish');
  const checkout = page.getByText('Sub Total: $16.50');
  await expect(cartCheck).toBeEnabled();
  await expect(checkout).toBeEnabled();
});

test('CheckoutCheckNoLogin', async ({ page }) => {
  await page.goto('https://petstore.octoperf.com/');
  await page.getByRole('link', { name: 'Enter the Store' }).click();
  await page.locator('#QuickLinks').getByRole('link').first().click();
  await page.getByRole('link', { name: 'FI-SW-01' }).click();
  await page.getByRole('link', { name: 'Add to Cart' }).first().click();
  await page.getByRole('link', { name: 'Proceed to Checkout' }).click();
  const message = page.getByText('You must sign on before attempting to check out. Please sign on and try checking out again.');
  await expect(message).toBeEnabled();
});

test('SearchByName', async ({ page }) => {
  await page.goto('https://petstore.octoperf.com/');
  await page.getByRole('link', { name: 'Enter the Store' }).click();
  await page.locator('input[name="keyword"]').fill('angelfish');
  await page.locator('input[name="keyword"]').press('Enter');
  await page.getByRole('link', { name: 'Salt Water fish from Australia' }).click();
  
  const description1 = await page.getByText('Large Angelfish');
  const description2 = await page.getByText('Small Angelfish');
  const combinedDescription = `${(await description1.innerText()).trim()} ${(await description2.innerText()).trim()}`;
  
  await Promise.all([
    expect(description1).toBeEnabled(),
    expect(description2).toBeEnabled(),
    expect(combinedDescription).toContain('Large Angelfish'),
    expect(combinedDescription).toContain('Small Angelfish')
  ]);
});

test('CartClear', async ({ page }) => {
  await page.goto('https://petstore.octoperf.com/');
  await page.getByRole('link', { name: 'Enter the Store' }).click();
  await page.locator('#QuickLinks').getByRole('link').first().click();
  await page.getByRole('link', { name: 'FI-SW-01' }).click();
  await page.getByRole('link', { name: 'Add to Cart' }).first().click();
  await page.locator('#MenuContent').getByRole('link').first().click();
  await page.getByRole('link', { name: 'Remove' }).click();
  const message = page.getByText('Your cart is empty.');
  await expect(message).toBeEnabled();
});

test('CartUpdate', async ({ page }) => {
  await page.goto('https://petstore.octoperf.com/');
  await page.getByRole('link', { name: 'Enter the Store' }).click();
  await page.locator('#MenuContent').getByRole('link').first().click();
  const updateCartButton = await page.getByRole('button', { name: 'Update Cart' });
  await expect(updateCartButton).toBeVisible();
});

test('CheckLinksClickable', async ({ page }) => {
  await page.goto('https://petstore.octoperf.com/');
  await page.getByRole('link', { name: 'Enter the Store' }).click();
  await page.locator('#MenuContent').getByRole('link').first().click();
  await page.getByRole('link', { name: '?' }).click();
  const linksToCheck = ['Signing Up', 'Signing In', 'Working with the Product', 'Browsing the Catalog', 'Searching the Catalog', 'Working with the Shopping Cart', 'Adding and Removing Items', 'Updating the Quantity of an', 'Ordering Items', 'Reviewing an Order', 'Known Issues'];
  await Promise.all(linksToCheck.map(async linkName => {
    const link = await page.getByRole('link', { name: linkName });
    const isVisible = await link.isVisible();
    await expect(isVisible).toBeTruthy();
  }));
});

test('CheckLinks', async ({ page }) => {
  await page.goto('https://petstore.octoperf.com/');
  await page.getByRole('link', { name: 'Enter the Store' }).click();
  await page.locator('#MenuContent').getByRole('link').first().click();
  await page.getByRole('link', { name: '?' }).click();
  const linksToCheck = ['Signing Up', 'Signing In', 'Working with the Product', 'Browsing the Catalog', 'Searching the Catalog', 'Working with the Shopping Cart', 'Adding and Removing Items', 'Updating the Quantity of an', 'Ordering Items', 'Reviewing an Order', 'Known Issues'];
  await Promise.all(linksToCheck.map(async linkName => {
    const link = await page.getByRole('link', { name: linkName });
    const href = await link.getAttribute('href');
    // Проверяем, что ссылка является якорной
    if (href.startsWith('#')) {
        console.log(`Skipping anchor link: ${href}`);
        return;
    }
    // Не используем page.goto() для якорных ссылок
    const response = await page.goto(href, { waitUntil: 'domcontentloaded' });
    expect(response.status()).toBe(200);
}));
});

test('Checkhref', async ({ page }) => {
  await page.goto('https://petstore.octoperf.com/');
  await page.getByRole('link', { name: 'Enter the Store' }).click();
  const link = await page.getByRole('link', { name: 'www.mybatis.org' });
  const href = await link.getAttribute('href');
  const response = await page.goto(href, { waitUntil: 'domcontentloaded' });
  expect(response.status()).toBe(200); // Проверка на статус 200 OK
});

test('CheckLinkTitleAttribute', async ({ page }) => {
  await page.goto('https://petstore.octoperf.com/');
  await page.getByRole('link', { name: 'Enter the Store' }).click();
  const link = await page.getByRole('link', { name: 'www.mybatis.org' });
  const titleAttribute = await link.getAttribute('title');
  expect(titleAttribute).toBeDefined(); // Проверка наличия атрибута title у ссылки
});


