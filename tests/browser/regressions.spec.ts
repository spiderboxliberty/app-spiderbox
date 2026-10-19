import { expect, test } from '@playwright/test';

test('partner fields cannot accept edits that an in-flight save would discard', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Tissez des liens locaux' }).click();
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  let received!: () => void;
  const receivedRequest = new Promise<void>((resolve) => {
    received = resolve;
  });
  await page.route('**/api/partners/partner-a', async (route) => {
    received();
    await gate;
    await route.continue();
  });
  const note = page.getByRole('textbox', { name: 'Notes privées' }).first();
  await note.fill('Version à conserver.');
  await page.getByRole('button', { name: 'Enregistrer', exact: true }).first().click();
  await receivedRequest;
  try {
    await expect(note).toBeDisabled();
    await expect(page.getByLabel('Statut', { exact: true }).first()).toBeDisabled();
    await expect(page.getByLabel('Rappel · date locale').first()).toBeDisabled();
  } finally {
    release();
  }
  await expect(page.getByRole('status')).toContainText('enregistrée');
  await expect(note).toBeEnabled();
  await expect(note).toHaveValue('Version à conserver.');
});

test('late preparation response preserves the dossier selected after dismissal', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Explorer mes circuits' }).click();
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  let received!: () => void;
  const receivedRequest = new Promise<void>((resolve) => {
    received = resolve;
  });
  await page.route('**/api/circuits/circuit-rives/prepare', async (route) => {
    received();
    await gate;
    await route.fulfill({
      json: {
        id: 'circuit-rives',
        name: 'Au fil des rives',
        organizationId: 'org-a',
        stationId: 'station-a',
        status: 'prepared',
        version: 2,
        description: 'Exemple',
        distanceKm: 12.4,
        durationMinutes: 75,
      },
    });
  });
  const dossiers = page.getByRole('button', { name: 'Ouvrir le dossier', exact: true });
  await dossiers.first().click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Préparer l’essai', exact: true })
    .click();
  await receivedRequest;
  await page.getByRole('button', { name: 'Fermer le dossier' }).click();
  await dossiers.nth(1).click();
  release();
  await expect(page.getByRole('status')).toContainText('Essai préparé');
  await expect(page.getByRole('dialog').getByRole('heading', { level: 2 })).toHaveText(
    'Le chemin des vignes',
  );
});

test('a late submission response never navigates away from a newly opened dossier', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Explorer mes circuits' }).click();
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  let received!: () => void;
  const receivedRequest = new Promise<void>((resolve) => {
    received = resolve;
  });
  await page.route('**/api/submissions', async (route) => {
    received();
    await gate;
    await route.fulfill({ status: 201, json: { id: 'synthetic', status: 'received' } });
  });
  const dossiers = page.getByRole('button', { name: 'Ouvrir le dossier', exact: true });
  await dossiers.first().click();
  await page.getByRole('button', { name: 'Aperçu de transmission' }).click();
  await page.getByRole('button', { name: 'Confirmer la transmission fictive' }).click();
  await receivedRequest;
  await page.getByRole('button', { name: 'Fermer le dossier' }).click();
  await dossiers.nth(1).click();
  release();
  await expect(page.getByRole('status')).toContainText('Transmission de démonstration reçue');
  await expect(page.getByRole('heading', { name: 'Mes circuits', exact: true })).toBeVisible();
  await expect(page.getByRole('dialog').getByRole('heading', { level: 2 })).toHaveText(
    'Le chemin des vignes',
  );
});
