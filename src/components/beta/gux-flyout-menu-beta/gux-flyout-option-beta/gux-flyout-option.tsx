import {
  Component,
  Element,
  h,
  Listen,
  Event,
  Prop,
  EventEmitter
} from '@stencil/core';

@Component({
  styleUrl: 'gux-flyout-option.less',
  tag: 'gux-flyout-option-beta'
})
export class GuxFlyoutOption {
  @Element()
  root: HTMLElement;

  @Prop() withIcon: boolean;
  @Prop() shortCut: string;
  @Prop() keyCode?: string;
  @Prop() secondKeyCode?: string;
  @Prop() thirdKeyCode?: string;

  private keycodes: string[] = [];

  @Event()
  optionSelected: EventEmitter;

  @Listen('keydown', { target: 'window' })
  keyDownHandler(ev: KeyboardEvent) {
    if (this.keycodes.length === 3) {
      this.keycodes.shift();
    }

    this.keycodes.push(ev.keyCode.toString());

    if (this.shortCut) {
      this.checkForShortcut();
    }
  }

  @Listen('keyup', { target: 'window' })
  keyUpHandler() {
    this.keycodes = [];
  }

  private checkForShortcut(): void {
    const optionShortcut = [
      this.keyCode,
      this.secondKeyCode,
      this.thirdKeyCode
    ].filter((keyCode: string) => !!keyCode);

    if (optionShortcut.length === 0) {
      return;
    }

    const isShortCutPressed = optionShortcut.every(
      (keycode: string, index: number) => {
        return keycode === this.keycodes[index];
      }
    );

    if (isShortCutPressed) {
      this.handleOptionSelected();
    }
  }

  private isIcon(): HTMLElement {
    return this.withIcon ? (
      <gux-icon screenreaderText="angle-right" icon-name="angle-right" />
    ) : (
      <span> {this.shortCut} </span>
    );
  }

  private handleOptionSelected(): void {
    const isSubmenu = !!this.root.querySelector('[slot="submenu"]');

    if (!isSubmenu) {
      this.optionSelected.emit(
        this.root.querySelector('[slot="title"]').innerHTML
      );
    }
  }

  render() {
    return (
      <div class="gux-flyout-option-container">
        <div
          class="gux-flyout-option-container-item"
          onClick={this.handleOptionSelected.bind(this)}
        >
          <div>
            <slot name="title" />
          </div>
          {this.isIcon()}
        </div>
        <slot name="submenu" />
      </div>
    );
  }
}
