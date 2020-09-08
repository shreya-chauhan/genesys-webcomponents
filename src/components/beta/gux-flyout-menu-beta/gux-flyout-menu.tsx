import { Component, Element, Event, EventEmitter, h } from '@stencil/core';

@Component({
  styleUrl: 'gux-flyout-menu.less',
  tag: 'gux-flyout-menu-beta'
})
export class GuxFlyoutMenu {
  @Element()
  root: HTMLElement;

  @Event()
  menuOptionSelected: EventEmitter;

  private optionSelectedHandler(ev: MouseEvent): void {
    this.menuOptionSelected.emit(ev.detail);
  }

  componentDidLoad(): void {
    this.root.addEventListener(
      'optionSelected',
      this.optionSelectedHandler.bind(this)
    );
  }

  componentDidUnload(): void {
    this.root.removeEventListener(
      'optionSelected',
      this.optionSelectedHandler.bind(this)
    );
  }

  render() {
    return <slot />;
  }
}
