import { test, expect } from '@playwright/test';

test('Fluxo completo de compra (E2E)', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.getByRole('button', { name: '[ ADD ] +' }).first().click();
  await page.getByRole('button', { name: '[ ADD ] +' }).nth(1).click();

  await page.getByRole('button', { name: 'Abrir carrinho' }).click();

  await expect(page.getByRole('heading', { name: 'SEU SETUP' })).toBeVisible();

  const inputCupom = page.getByPlaceholder('Cupom de desconto');
  await inputCupom.fill('PRIMEIRA10');
  await page.getByRole('button', { name: 'Aplicar' }).click();

  await expect(page.getByText('Desconto (PRIMEIRA10)')).toBeVisible();

  await expect(
    page.getByRole('button', { name: '[ Finalizar Compra ]' }),
  ).toBeVisible();
});
