import { Component, Element, h } from '@stencil/core';

@Component({
  styleUrl: 'gux-flyout-submenu.less',
  tag: 'gux-flyout-submenu-beta'
})
export class GuxFlyoutSubmenu {
  @Element()
  root: HTMLElement;

  render() {
    return <slot />;
  }
}
