import { newSpecPage } from '@stencil/core/testing';
import { GuxFlyoutMenu } from '../gux-flyout-menu';
import { GuxFlyoutOption } from '../gux-flyout-option-beta/gux-flyout-option';

describe('GuxFlyoutMenu', () => {
  let component: GuxFlyoutMenu;

  beforeEach(async () => {
    const page = await newSpecPage({
      components: [GuxFlyoutMenu, GuxFlyoutOption],
      html: `
        <gux-flyout-menu-beta>
          <gux-flyout-option-beta
            short-cut="Crl+Alt+A"
            key-code="19"
            second-key-code="34"
            third-key-code="11"
          >
            <div slot="title">Option One</div>
          </gux-flyout-option-beta>
          <gux-flyout-option-beta short-cut="Crl+Alt+C">
            <div slot="title">Option Two</div>
          </gux-flyout-option-beta>
          <gux-flyout-option-beta short-cut="Shift+A">
            <div slot="title">Option Three</div>
          </gux-flyout-option-beta>
        </gux-flyout-menu-beta>
      `,
      language: 'en'
    });

    component = page.rootInstance;
  });

  it('should build', async () => {
    expect(component).toBeInstanceOf(GuxFlyoutMenu);
  });
});
