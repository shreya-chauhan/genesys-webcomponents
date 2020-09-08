import { newSpecPage } from '@stencil/core/testing';
import { GuxFlyoutSubmenu } from '../gux-flyout-submenu';

describe('GuxFlyoutSubmenu', () => {
  let component: GuxFlyoutSubmenu;

  beforeEach(async () => {
    const page = await newSpecPage({
      components: [GuxFlyoutSubmenu],
      html: `
        <gux-flyout-submenu-beta>
          <gux-flyout-option-beta short-cut="⌘A">
            <div slot="title">Option One</div>
          </gux-flyout-option-beta>
          <gux-flyout-option-beta short-cut="⌘⇧A">
            <div slot="title">Option Two</div>
          </gux-flyout-option-beta>
        </gux-flyout-submenu-beta>
      `,
      language: 'en'
    });

    component = page.rootInstance;
  });

  it('should build', async () => {
    expect(component).toBeInstanceOf(GuxFlyoutSubmenu);
  });
});
