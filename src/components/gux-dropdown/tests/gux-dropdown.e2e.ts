import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';

describe('gux-dropdown', () => {
  let page: E2EPage;
  let element: E2EElement;
  beforeEach(async () => {
    page = await newE2EPage();
  });
  it('renders', async () => {
    await page.setContent(`<gux-dropdown lang="en"></gux-dropdown>`);
    element = await page.find('gux-dropdown');
    expect(element).toHaveClass('hydrated');
  });

  it('opens drop down on click', async () => {
    await page.setContent(`
    <gux-dropdown placeholder="Select..." filterable=true>
      <gux-option value="en-US" text="American English"></gux-option>
      <gux-option value="es" text="Latin American Spanish"></gux-option>
      <gux-option value="es-ES" text="European Spanish"></gux-option>
      <gux-option value="en-UK" text="UK English"></gux-option>
      <gux-option value="fr-CA" text="Canadian French"></gux-option>
      <gux-option value="fr" text="European French"></gux-option>
      <gux-option value="nl" text="Dutch"></gux-option>
    </gux-dropdown> 
    `);
    await page.waitForChanges();
    element = await page.find('gux-dropdown');
    const inputElm = await element.find('gux-text-field');
    inputElm.click();
    await page.waitForChanges();

    const dropMenu = await element.find('.gux-dropdown');
    expect(dropMenu.className.split(' ')).toContain('active');
  });

  it('selects an item when an option is clicked', async () => {
    page = await newE2EPage();
    await page.setContent(`
    <gux-dropdown placeholder="Select..." filterable=true>
      <gux-option value="en-US" text="American English"></gux-option>
      <gux-option value="es" text="Latin American Spanish"></gux-option>
      <gux-option value="es-ES" text="European Spanish"></gux-option>
      <gux-option value="en-UK" text="UK English"></gux-option>
      <gux-option value="fr-CA" text="Canadian French"></gux-option>
      <gux-option value="fr" text="European French"></gux-option>
      <gux-option value="nl" text="Dutch"></gux-option>
    </gux-dropdown> 
    `);
    await page.waitForChanges();
    element = await page.find('gux-dropdown');
    const changeSpy = await element.spyOnEvent('change');

    const inputElm = await element.find('gux-text-field');
    inputElm.click();
    await page.waitForChanges();

    let dropMenu = await element.find('.gux-dropdown');
    const enElm = await dropMenu.find('gux-option');
    enElm.click();
    await page.waitForChanges();
    dropMenu = await element.find('.gux-dropdown');

    expect(changeSpy).toHaveReceivedEventDetail('en-US');
    expect(dropMenu.className.split(' ')).not.toContain('active');
  });
});
