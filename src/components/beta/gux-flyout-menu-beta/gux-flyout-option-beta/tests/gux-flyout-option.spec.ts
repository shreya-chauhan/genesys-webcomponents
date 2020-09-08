import { newSpecPage } from '@stencil/core/testing';
import { GuxFlyoutOption } from '../gux-flyout-option';

describe('GuxFlyoutOption', () => {
  let component: GuxFlyoutOption;

  beforeEach(async () => {
    const page = await newSpecPage({
      components: [GuxFlyoutOption],
      html: `
        <gux-flyout-option-beta
          short-cut="Crl+Alt+A"
          key-code="19"
          second-key-code="34"
          third-key-code="11"
        >
          <div slot="title">Option One</div>
        </gux-flyout-option-beta>
      `,
      language: 'en'
    });

    component = page.rootInstance;
  });

  it('should build', async () => {
    expect(component).toBeInstanceOf(GuxFlyoutOption);
  });
});
