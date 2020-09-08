import { newE2EPage } from '@stencil/core/testing';

describe('gux-panel-frame', () => {
  it('render root element', async () => {
    const page = await newE2EPage();

    await page.setContent('<gux-flyout-menu-beta></gux-flyout-menu-beta>');
    const element = await page.find('gux-flyout-menu-beta');
    expect(element).toHaveClass('hydrated');
  });

  it('render and existing options', async () => {
    const page = await newE2EPage();

    await page.setContent(`
      <gux-flyout-option-beta id="opt1" short-cut="Crl+Alt+A">
        <div slot="title">Option One</div>
      </gux-flyout-option-beta>
      <gux-flyout-option-beta short-cut="Crl+Alt+C">
        <div slot="title">Option Two</div>
      </gux-flyout-option-beta>
      <gux-flyout-option-beta short-cut="Shift+A">
        <div slot="title">Option Three</div>
      </gux-flyout-option-beta>
      <gux-flyout-option-beta short-cut="⌘A">
        <div slot="title">Option Four</div>
      </gux-flyout-option-beta>
      <gux-flyout-option-beta short-cut="⌘⇧A">
        <div slot="title">Option Five</div>
      </gux-flyout-option-beta>
    `);
    await page.waitForChanges();

    const element = await page.find('#opt1');
    expect(element).toBeDefined();
  });
});
