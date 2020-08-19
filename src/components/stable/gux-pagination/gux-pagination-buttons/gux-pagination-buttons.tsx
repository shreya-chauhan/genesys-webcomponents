import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  JSX,
  Prop
} from '@stencil/core';

import { buildI18nForComponent, GetI18nValue } from '../../../../i18n';
import paginationResources from './i18n/en.json';
import { GuxPaginationLayout } from '../gux-pagination';

@Component({
  styleUrl: 'gux-pagination-buttons.less',
  tag: 'gux-pagination-buttons'
})
export class GuxPaginationButtons {
  @Element()
  private element: HTMLGuxPaginationItemCountsElement;

  private textFieldRef: HTMLGuxTextFieldElement;

  private i18n: GetI18nValue;

  @Prop()
  currentPage: number;

  @Prop()
  totalPages: number;

  @Prop()
  layout: GuxPaginationLayout = 'full';

  @Event({ bubbles: false })
  private internalcurrentpagechange: EventEmitter<number>;

  private get onFirstPage(): boolean {
    return this.currentPage <= 1;
  }

  private get onLastPage(): boolean {
    return this.currentPage >= this.totalPages;
  }

  private handleClickFirst(): void {
    this.internalcurrentpagechange.emit(1);
  }

  private handleClickPrevious(): void {
    this.internalcurrentpagechange.emit(this.currentPage - 1);
  }

  private handleClickNext(): void {
    this.internalcurrentpagechange.emit(this.currentPage + 1);
  }

  private handleClickLast(): void {
    this.internalcurrentpagechange.emit(this.totalPages);
  }

  private setPageFromInput(value: string): void {
    const page = parseInt(value, 10);

    if (!page || isNaN(page)) {
      this.textFieldRef.value = String(this.currentPage);
    } else {
      this.internalcurrentpagechange.emit(page);
    }
  }

  async componentWillLoad(): Promise<void> {
    this.i18n = await buildI18nForComponent(this.element, paginationResources);
  }

  render(): JSX.Element {
    return (
      <div class="gux-pagination-buttons-container">
        <div class={`gux-pagination-buttons-group ${this.layout}`}>
          <gux-button
            title={this.i18n('first')}
            disabled={this.onFirstPage}
            onClick={this.handleClickFirst.bind(this)}
          >
            <gux-icon decorative iconName="ic-arrow-left-dbl"></gux-icon>
          </gux-button>
          <gux-button
            title={this.i18n('previous')}
            disabled={this.onFirstPage}
            onClick={this.handleClickPrevious.bind(this)}
          >
            <gux-icon decorative iconName="ic-chevron-small-left"></gux-icon>
          </gux-button>
        </div>

        <div class={`gux-pagination-buttons-input-container ${this.layout}`}>
          <div>{this.i18n('page')}</div>
          <div class="gux-pagination-buttons-input">
            <gux-text-field
              value={String(this.currentPage)}
              ref={ref => (this.textFieldRef = ref)}
              use-clear-button="false"
              onChange={() => this.setPageFromInput(this.textFieldRef.value)}
            />
          </div>
          <div>{this.i18n('totalPages', { totalPages: this.totalPages })}</div>
        </div>

        <div class={`gux-pagination-buttons-small-spacer ${this.layout}`}></div>

        <div class={`gux-pagination-buttons-group ${this.layout}`}>
          <gux-button
            title={this.i18n('next')}
            disabled={this.onLastPage}
            onClick={this.handleClickNext.bind(this)}
          >
            <gux-icon decorative iconName="ic-chevron-small-right"></gux-icon>
          </gux-button>
          <gux-button
            title={this.i18n('last')}
            disabled={this.onLastPage}
            onClick={this.handleClickLast.bind(this)}
          >
            <gux-icon decorative iconName="ic-arrow-right-dbl"></gux-icon>
          </gux-button>
        </div>
      </div>
    );
  }
}