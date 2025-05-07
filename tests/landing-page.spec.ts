import { test, expect } from '@playwright/test';

test.describe('Test multiple users', () => {
  const testUsers = Array.from({ length: 3 }, (_, index) => `testikayttaja${index + 1}`);

  testUsers.forEach((username) => {
    test(`Siirrytään GameOptionScreeniin käyttäjänimen ${username} jälkeen`, async ({ page }) => {
      // 1. Siirry etusivulle
      await page.goto('https://treffipeli.fi/enterusername');

      // 2. Varmista, että syötekenttä näkyy
      await expect(page.locator('input[placeholder="Username"]')).toBeVisible();

      // 3. Syötä käyttäjänimi
      await page.fill('input[placeholder="Username"]', username);

      // 4. Klikkaa "Enter"-nappia, mutta käytetään tarkempaa valitsinta
      const enterButton = page.locator('button:has-text("Enter")'); // Tässä valitaan painike tarkemmin
      await enterButton.click();

      // 5. Odota, että siirrytään GameOptionScreeniin
      await page.waitForURL(`**/gameoptionscreen?username=${username}`);

      // 6. Varmista, että ollaan oikealla sivulla
      await expect(page).toHaveURL(new RegExp(`.*gameoptionscreen\\?username=${username}`));

      console.log(`✅ Testi valmis käyttäjälle ${username}!`);
    });
  });
});
