import { test, expect } from '@playwright/test';

test('Kolme käyttäjää - yksi luo pelin ja loput liittyy', async ({ browser }) => {
  const users = ['testikayttaja1', 'testikayttaja2', 'testikayttaja3'];
  const contexts = await Promise.all(users.map(() => browser.newContext()));
  const pages = await Promise.all(contexts.map(ctx => ctx.newPage()));

  // Käyttäjät syöttävät käyttäjänimen
  for (let i = 0; i < users.length; i++) {
    await pages[i].goto('http://localhost:8081/enterusername');
    const input = pages[i].locator('input[placeholder="Username"]');
    await expect(input).toBeVisible();
    await input.fill(users[i]);
    const enterButton = pages[i].getByRole('button', { name: 'Enter' });
    await enterButton.click();
    await pages[i].waitForURL(`**/gameoptionscreen?username=${users[i]}`);
  }

  // testikayttaja1 luo pelin
  const createGameButton = pages[0].getByRole('button', { name: 'Create Game' });
  await expect(createGameButton).toBeVisible();
  await createGameButton.click();

  // Odotetaan siirtymistä CardTraits-sivulle
  await pages[0].waitForURL(`**/CardTraits?username=${users[0]}&gamepin=*`);
  await expect(pages[0]).toHaveURL(
    new RegExp(`\\/CardTraits\\?username=${users[0]}&gamepin=\\w+`)
  );
  console.log('✅ testikayttaja1 siirtyi CardTraits-sivulle');

  // Syötetään kuusi erillistä piirrettä
  const traits = ['hauska', 'älykäs', 'seikkailunhaluinen', 'huomaavainen', 'luova', 'sporttinen'];
  for (let i = 0; i < traits.length; i++) {
    const input = pages[0].locator(`input[placeholder="Trait ${i + 1}"]`);
    await expect(input).toBeVisible();
    await input.fill(traits[i]);
  }

  // Klikataan Submit Traits -painiketta
  const submitButton = pages[0].getByRole('button', { name: 'Submit' });
  await expect(submitButton).toBeVisible();
  await submitButton.click();

  // Muut käyttäjät liittyvät peliin
  for (let i = 1; i < pages.length; i++) {
    const joinButton = pages[i].getByRole('button', { name: 'Join Game' });
    await expect(joinButton).toBeVisible();
    await joinButton.click();

    await pages[i].waitForURL(`**/gameLobby?username=${users[i]}&gamepin=*`);
    await expect(pages[i]).toHaveURL(`**/gameLobby?username=${users[i]}&gamepin=*`);
    console.log(`✅ ${users[i]} siirtyi GameLobby-sivulle`);
  }
});
