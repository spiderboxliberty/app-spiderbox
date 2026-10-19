import { expect, test, type Page } from '@playwright/test';

async function navigate(page: Page, name: string) {
  const menu = page.getByRole('button', { name: 'Ouvrir le menu' });
  if (await menu.isVisible()) await menu.click();
  await page.getByRole('navigation').getByRole('button', { name, exact: true }).click();
}
test('operator prepares a circuit and explicitly transmits the preview', async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Bonjour Camille' })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('overview.png'), fullPage: true });
  await page.getByRole('button', { name: 'Explorer mes circuits' }).click();
  await page
    .getByRole('button', { name: 'Ouvrir le dossier' })
    .nth(testInfo.project.name === 'mobile' ? 1 : 0)
    .click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const circuitTitle = await dialog.getByRole('heading', { level: 2 }).innerText();
  await expect(dialog.getByText('Non réalisée', { exact: true })).toBeVisible();
  await dialog.getByRole('button', { name: 'Préparer l’essai', exact: true }).click();
  await expect(dialog.getByText('Essai préparé, à réaliser')).toBeVisible();
  await dialog.getByRole('button', { name: 'Aperçu de transmission' }).click();
  await expect(
    dialog.getByText('Notes partenaires, données clients, photos et finances exclues.'),
  ).toBeVisible();
  await dialog.getByRole('button', { name: 'Confirmer la transmission fictive' }).click();
  await expect(dialog).not.toBeVisible();
  await expect(
    page
      .locator('.submission')
      .filter({ has: page.getByRole('heading', { name: circuitTitle, exact: true }) })
      .getByText('Reçu en démonstration'),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test('partner notes stay private and survive a browser refresh in the current server', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Bonjour Camille' })).toBeVisible();
  await navigate(page, 'Mes partenaires');
  const note = page.getByRole('textbox', { name: 'Notes privées' }).first();
  await note.fill('Prévoir un échange local.');
  await page.getByRole('button', { name: 'Enregistrer', exact: true }).first().click();
  await expect(page.getByRole('status')).toContainText('enregistrée');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Bonjour Camille' })).toBeVisible();
  await navigate(page, 'Mes partenaires');
  await expect(page.getByRole('textbox', { name: 'Notes privées' }).first()).toHaveValue(
    'Prévoir un échange local.',
  );
});
test('all main pages fit supported widths without global horizontal overflow', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Bonjour Camille' })).toBeVisible();
  for (const width of [320, 360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const name of [
      'Vue d’ensemble',
      'Mes SpiderBox',
      'Mes circuits',
      'Mes partenaires',
      'Lien avec le réseau',
    ]) {
      await navigate(page, name);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
        `${name} at ${width}px`,
      ).toBe(true);
    }
  }
});
