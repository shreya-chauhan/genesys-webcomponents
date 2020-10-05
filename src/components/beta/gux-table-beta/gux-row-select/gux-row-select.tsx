import { Component, h, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'gux-row-select'
})
export class GuxRowSelect {
  @Event()
  selectRow: EventEmitter;

  private handlerCheck(): void {
    this.selectRow.emit();
  }

  render() {
    return <gux-checkbox onCheck={this.handlerCheck.bind(this)}></gux-checkbox>;
  }
}
