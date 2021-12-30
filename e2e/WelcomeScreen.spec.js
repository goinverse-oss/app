describe('Welcome Screen', () => {
  beforeEach(async () => {
    // reinstall to ensure we always see the welcome screen
    await device.launchApp({ delete: true, permissions: { notifications: 'YES' } });
  });

  it('should appear on first launch', async () => {
    await expect(element(by.id('navSkip'))).toBeVisible();
    await expect(element(by.id('navNext'))).toBeVisible();
    await expect(element(by.id('welcomeText1'))).toBeVisible();
  });

  it('should advance to next screen on tap', async () => {
    await expect(element(by.id('navSkip'))).toBeVisible();
    await expect(element(by.id('navNext'))).toBeVisible();
    await expect(element(by.id('welcomeText1'))).toBeVisible();

    await element(by.id('navNext')).tap();

    await expect(element(by.id('navSkip'))).not.toBeVisible();
    await expect(element(by.id('navBack'))).toBeVisible();
    await expect(element(by.id('navNext'))).toBeVisible();
    await expect(element(by.id('welcomeText1'))).not.toBeVisible();
    await expect(element(by.id('welcomeText2'))).toBeVisible();

    await element(by.id('navNext')).tap();

    await expect(element(by.id('navSkip'))).not.toBeVisible();
    await expect(element(by.id('navBack'))).toBeVisible();
    await expect(element(by.id('navNext'))).toBeVisible();
    await expect(element(by.id('welcomeText2'))).not.toBeVisible();
    await expect(element(by.id('welcomeText3'))).toBeVisible();

    await element(by.id('navNext')).tap();

    await expect(element(by.id('navSkip'))).not.toBeVisible();
    await expect(element(by.id('navBack'))).toBeVisible();
    await expect(element(by.id('navNext'))).not.toBeVisible();
    await expect(element(by.id('welcomeText3'))).not.toBeVisible();
    await expect(element(by.id('welcomeText4'))).toBeVisible();
    await expect(element(by.id('continueButton'))).toBeVisible();

    await element(by.id('continueButton')).tap();
    await expect(element(by.id('homeScreenScrollView'))).toBeVisible();
  });

  it('should show home screen after skip', async () => {
    await element(by.id('navSkip')).tap();
    await expect(element(by.id('homeScreenScrollView'))).toBeVisible();
  });
});
