import {
  Component,
  Element,
  Event,
  EventEmitter,
  Listen,
  Prop,
  State
} from '@stencil/core';
import { CalendarModes, KeyCode } from '../../../common-enums';
import { buildI18nForComponent } from '../../i18n';
import i18nStrings from './gux-datepicker.i18n.json';

@Component({
  styleUrl: 'gux-datepicker.less',
  tag: 'gux-datepicker'
})
export class GuxDatepicker {
  @Element()
  root: HTMLStencilElement;
  /**
   * The datepicker current value
   */
  @Prop({ mutable: true })
  value: Date = new Date();
  /**
   * The calendar current to range value
   */
  @Prop({ mutable: true })
  toValue: Date = new Date();
  /**
   * The datepicker label (can be a single label, or an array of two if it's a range datepicker)
   */
  @Prop()
  label: string | string[] = '';
  /**
   * The datepicker number of months displayed
   */
  @Prop({ mutable: true })
  numberOfMonths: number = 1;
  /**
   * The datepicker current value
   */
  @State()
  formatedValue: string = '';
  /**
   * The datepicker current value
   */
  @State()
  toFormatedValue: string = '';
  /**
   * The calendar mode (can be single or range)
   */
  @Prop()
  mode: string = CalendarModes.Single;
  /**
   * The datepicker date format (default to mm/dd/yyyy, or specified)
   */
  @Prop()
  format: string = 'mm/dd/yyyy';
  /**
   * The datepicker first week day (default to 0 (sunday))
   */
  @Prop()
  firstDayOfWeek: number = 0;
  /**
   * The calendar locale (default to browser locale)
   */
  @Prop()
  locale: string = navigator.languages
    ? navigator.languages[0]
    : navigator.language;

  @State()
  active: boolean = false;

  yearFormat: string = 'yyyy';
  sepArr: string[];

  textFieldElement: HTMLGuxTextFieldElement;
  toTextFieldElement: HTMLGuxTextFieldElement;
  inputElement: HTMLInputElement;
  toInputElement: HTMLInputElement;
  calendarElement: HTMLGuxCalendarElement;
  fieldDatepickerElement: HTMLDivElement;
  selectionRange: number[];
  focusingRange: boolean = false;
  focusedField: HTMLInputElement;

  isSelectingRange: boolean = false;
  lastSelection: number = 0;
  lastYear: number = new Date().getFullYear();

  i18n: (resourceKey: string, context?: any) => string;

  /**
   * Triggered user selects a date
   */
  @Event()
  change: EventEmitter;
  onChange(value: Date | Date[]) {
    this.change.emit(value);
  }

  get calendarLabels() {
    const labels: string[] = [].concat(this.label || []);
    if (this.mode === CalendarModes.Range) {
      return [labels[0] || this.i18n('start'), labels[1] || this.i18n('end')];
    } else {
      return [labels[0]];
    }
  }

  replaceUndefinedChars() {
    this.inputElement.value = this.inputElement.value.replace(/ /g, '0');
    this.inputElement.value = this.inputElement.value.replace(/00/g, '01');
    if (this.toInputElement) {
      this.toInputElement.value = this.toInputElement.value.replace(/ /g, '0');
      this.toInputElement.value = this.toInputElement.value.replace(
        /00/g,
        '01'
      );
    }
  }

  stringToDate(stringDate) {
    const formatItems = this.format.toLowerCase().split('/');
    const dateItems = stringDate.split('/');
    const year = dateItems[formatItems.indexOf(this.yearFormat)];
    const month = parseInt(dateItems[formatItems.indexOf('mm')], 10) - 1;
    const date = new Date(year, month, dateItems[formatItems.indexOf('dd')]);
    if (
      this.yearFormat === 'yy' &&
      date.getFullYear() < 1970 &&
      this.lastYear > 1970
    ) {
      date.setFullYear(date.getFullYear() + 100);
    }
    return date;
  }

  onDaySelect(day: Date | Date[]) {
    if (this.mode === CalendarModes.Range) {
      this.value = day[0];
      this.toValue = day[1];
      this.updateDate();
      this.inputElement.value = this.formatedValue;
      this.toInputElement.value = this.toFormatedValue;
      if (
        document.activeElement !== this.inputElement ||
        document.activeElement !== this.toInputElement
      ) {
        this.active = false;
      }
    } else {
      this.value = day as Date;
      this.updateDate();
      this.inputElement.value = this.formatedValue;
      if (document.activeElement !== this.inputElement) {
        this.active = false;
      }
    }
  }

  setValue() {
    this.value = this.stringToDate(this.inputElement.value);
    if (this.mode === CalendarModes.Range) {
      this.toValue = this.stringToDate(this.toInputElement.value);
      this.updateDate();
      this.calendarElement.setValue([this.value, this.toValue]);
    } else {
      this.updateDate();
      this.calendarElement.setValue(this.value);
    }
  }

  getPreviousSep(sep: string) {
    if (this.sepArr[this.sepArr.indexOf(sep) - 1]) {
      return this.sepArr[this.sepArr.indexOf(sep) - 1];
    } else {
      return this.sepArr[2];
    }
  }
  getNextSep(sep: string) {
    if (this.sepArr[this.sepArr.indexOf(sep) + 1]) {
      return this.sepArr[this.sepArr.indexOf(sep) + 1];
    } else {
      return this.sepArr[0];
    }
  }

  @Listen('keydown', { passive: false })
  onKeyDown(e: KeyboardEvent) {
    if (e.target === this.inputElement || e.target === this.toInputElement) {
      this.focusedField = e.target as HTMLInputElement;
      switch (e.keyCode) {
        case KeyCode.Enter:
          this.focusedField.blur();
          this.active = false;
          break;
        case KeyCode.Tab:
          e.preventDefault();
          this.calendarElement.focusPreviewDate();
          break;
        case KeyCode.Down:
          e.preventDefault();
          this.increment(-1);
          if (this.mode === CalendarModes.Range) {
            this.calendarElement.setValue([this.value, this.toValue]);
          } else {
            this.calendarElement.setValue(this.value);
          }
          this.setRange();
          break;
        case KeyCode.Up:
          e.preventDefault();
          this.increment(1);
          if (this.mode === CalendarModes.Range) {
            this.calendarElement.setValue([this.value, this.toValue]);
          } else {
            this.calendarElement.setValue(this.value);
          }
          this.setRange();
          break;
        case KeyCode.Left:
          e.preventDefault();
          this.setSelectionRange(
            this.format.indexOf(
              this.getPreviousSep(this.format[this.selectionRange[0]])
            )
          );
          this.setRange();
          this.replaceUndefinedChars();
          this.setValue();
          break;
        case KeyCode.Right:
          e.preventDefault();
          this.setSelectionRange(
            this.format.indexOf(
              this.getNextSep(this.format[this.selectionRange[0]])
            )
          );
          this.setRange();
          this.replaceUndefinedChars();
          this.setValue();
          break;
        default:
          const currentNumber = parseInt(e.key, 10);
          const selectionStart = this.focusedField.selectionStart;
          if (!isNaN(currentNumber)) {
            const currentSelection = document.getSelection().toString();
            if (
              this.format[this.selectionRange[0]] === 'y' &&
              this.yearFormat === 'yyyy'
            ) {
              this.typeYearValue(currentSelection, e.key);
            } else {
              if (
                currentSelection[0] !== ' ' ||
                !this.canSetDate(currentNumber)
              ) {
                this.focusedField.value =
                  this.focusedField.value.substr(0, this.selectionRange[0]) +
                  ' ' +
                  e.key +
                  this.focusedField.value.substr(this.selectionRange[1]);
              } else {
                this.focusedField.value =
                  this.focusedField.value.substr(0, this.selectionRange[0]) +
                  currentSelection[1] +
                  e.key +
                  this.focusedField.value.substr(this.selectionRange[1]);
                this.setValue();
              }
            }
          }
          this.setSelectionRange(selectionStart);
          this.setRange();
          e.preventDefault();
          break;
      }
    }
  }

  @Listen('focusin')
  onFocusIn(e: FocusEvent) {
    if (e.target === this.inputElement || e.target === this.toInputElement) {
      if (!this.isSelectingRange) {
        this.focusedField = e.target as HTMLInputElement;
        this.setRangeTmp();
      }
    }
  }

  @Listen('focusout')
  onFocusOut(e: FocusEvent) {
    if (!this.calendarElement.contains(e.relatedTarget as Node)) {
      this.replaceUndefinedChars();
      this.setValue();
    }
    if (!this.root.contains(e.relatedTarget as Node)) {
      this.active = false;
    }
  }

  @Listen('mousedown')
  onMouseDown(e: MouseEvent) {
    if (e.target === this.inputElement || e.target === this.toInputElement) {
      this.isSelectingRange = true;
    }
  }

  @Listen('mouseup', { passive: false })
  onMouseUp(e: MouseEvent) {
    e.preventDefault();
    if (
      this.isSelectingRange &&
      (e.target === this.inputElement || e.target === this.toInputElement)
    ) {
      this.focusedField = e.target as HTMLInputElement;
      this.lastSelection = this.focusedField.selectionStart;
      this.setRangeTmp();
    }
  }

  setRangeTmp() {
    this.active = true;
    this.isSelectingRange = false;
    this.setSelectionRange(this.lastSelection);
    this.setRange();
  }

  typeYearValue(selection: string, key: string) {
    if (selection[0] !== ' ') {
      this.focusedField.value =
        this.focusedField.value.substr(0, this.selectionRange[0]) +
        '   ' +
        key +
        this.focusedField.value.substr(this.selectionRange[1]);
    } else {
      this.focusedField.value =
        this.focusedField.value.substr(0, this.selectionRange[0]) +
        selection.substr(1) +
        key +
        this.focusedField.value.substr(this.selectionRange[1]);
      if (!(selection.substr(1) + key).includes(' ')) {
        this.setValue();
      }
    }
  }

  canSetDate(key: number) {
    const newValue = parseInt(
      [
        this.focusedField.value[this.selectionRange[1] - 1].toString(),
        key
      ].join(''),
      10
    );
    if (newValue) {
      switch (this.format[this.selectionRange[0]]) {
        case 'd':
          if (
            newValue <=
            new Date(
              this.value.getFullYear(),
              this.value.getMonth() + 1,
              0
            ).getDate()
          ) {
            return true;
          }
          return false;
        case 'm':
          if (newValue <= 12) {
            return true;
          }
          return false;
        case 'y':
          return true;
      }
    }
    return false;
  }

  updateDate() {
    let map: any;
    let regexp: RegExp;
    if (this.mode === CalendarModes.Range) {
      map = {
        dd: `0${this.toValue.getDate()}`.slice(-2),
        mm: `0${this.toValue.getMonth() + 1}`.slice(-2)
      };
      if (this.yearFormat === 'yyyy') {
        map.yyyy = this.toValue.getFullYear().toString();
      } else {
        map.yy = this.toValue
          .getFullYear()
          .toString()
          .slice(-2);
      }
      regexp = new RegExp(Object.keys(map).join('|'), 'gi');
      this.toFormatedValue = this.format.replace(regexp, match => {
        return map[match];
      });
    }
    map = {
      dd: `0${this.value.getDate()}`.slice(-2),
      mm: `0${this.value.getMonth() + 1}`.slice(-2)
    };
    if (this.yearFormat === 'yyyy') {
      map.yyyy = this.value.getFullYear().toString();
    } else {
      map.yy = this.value
        .getFullYear()
        .toString()
        .slice(-2);
    }
    regexp = new RegExp(Object.keys(map).join('|'), 'gi');
    this.formatedValue = this.format.replace(regexp, match => {
      return map[match];
    });
  }

  setRange() {
    if (this.selectionRange) {
      this.focusedField.setSelectionRange(
        this.selectionRange[0],
        this.selectionRange[1]
      );
    }
  }

  toggleCalendar() {
    this.active = !this.active;
    if (this.active) {
      setTimeout(() => {
        this.calendarElement.focusPreviewDate();
      });
    }
  }

  setSelectionRange(index: number) {
    let sep = this.format[index];
    if (!sep || sep === '/') {
      sep = this.format[index - 1];
    }
    const first = this.format.indexOf(sep);
    const last = this.format.lastIndexOf(sep) + 1;
    this.selectionRange = [first, last];
    return sep;
  }

  increment(value: number) {
    let selectionText = document.getSelection().toString();
    const type = this.setSelectionRange(this.focusedField.selectionStart);
    const refValue =
      this.focusedField === this.inputElement ? this.value : this.toValue;
    switch (type) {
      case 'd':
        selectionText = this.incrementDay(value, refValue);
        break;
      case 'm':
        selectionText = this.incrementMonth(value, refValue);
        break;
      case 'y':
        selectionText = this.incrementYear(value, refValue);
        break;
    }
    this.focusedField.value =
      this.focusedField.value.substr(0, this.selectionRange[0]) +
      selectionText +
      this.focusedField.value.substr(this.selectionRange[1]);
    this.setValue();
  }

  incrementDay(value: number, ref: Date): string {
    const newDay = new Date(ref.valueOf());
    newDay.setDate(newDay.getDate() + value);
    if (value < 0) {
      if (newDay.getDate() > ref.getDate()) {
        newDay.setMonth(newDay.getMonth() + 1);
      }
    } else {
      if (newDay.getDate() < ref.getDate()) {
        newDay.setMonth(newDay.getMonth() - 1);
      }
    }
    return `0${newDay.getDate().toString()}`.slice(-2);
  }
  incrementMonth(value: number, ref: Date): string {
    const newMonth = new Date(ref.valueOf());
    newMonth.setMonth(newMonth.getMonth() + value);
    if (value < 0) {
      if (newMonth.getMonth() > ref.getMonth()) {
        newMonth.setFullYear(newMonth.getFullYear() + 1);
      }
    } else {
      if (newMonth.getMonth() < ref.getMonth()) {
        newMonth.setFullYear(newMonth.getFullYear() - 1);
      }
    }
    return `0${(newMonth.getMonth() + 1).toString()}`.slice(-2);
  }
  incrementYear(value: number, ref: Date): string {
    const newYear = new Date(ref.valueOf());
    newYear.setFullYear(ref.getFullYear() + value);
    this.lastYear = newYear.getFullYear();
    if (this.yearFormat === 'yyyy') {
      return newYear.getFullYear().toString();
    } else {
      return newYear
        .getFullYear()
        .toString()
        .slice(-2);
    }
  }

  async componentWillLoad() {
    this.i18n = await buildI18nForComponent(this.root, i18nStrings);
  }
  componentDidLoad() {
    this.inputElement = this.textFieldElement.querySelector('input');
    if (this.mode === CalendarModes.Range) {
      this.toInputElement = this.toTextFieldElement.querySelector('input');
    }
    if (this.mode === CalendarModes.Range && this.numberOfMonths < 2) {
      this.numberOfMonths = 2;
    }
    if (!this.format.includes('yyyy')) {
      this.yearFormat = 'yy';
    }
    this.sepArr = [];
    this.format.split('/').map(sep => {
      this.sepArr.push(sep[0]);
    });
    this.updateDate();
  }

  render() {
    return (
      <div class={`gux-datepicker ${this.active ? 'active' : ''}`}>
        <div
          class="gux-datepicker-field"
          ref={(el: HTMLDivElement) => (this.fieldDatepickerElement = el)}
        >
          <gux-text-field
            type="text"
            ref={(el: HTMLGuxTextFieldElement) => (this.textFieldElement = el)}
            value={this.formatedValue}
            label={this.calendarLabels[0]}
          >
            <button
              aria-hidden="true"
              type="button"
              class="genesys-icon-calendar-generic"
              onClick={() => {
                this.toggleCalendar();
              }}
              tabindex="-1"
            />
          </gux-text-field>
        </div>
        {this.mode === CalendarModes.Range && (
          <div
            class="gux-datepicker-field"
            ref={(el: HTMLDivElement) => (this.fieldDatepickerElement = el)}
          >
            <gux-text-field
              type="text"
              class="gux-to-date"
              ref={(el: HTMLGuxTextFieldElement) =>
                (this.toTextFieldElement = el)
              }
              value={this.toFormatedValue}
              label={this.calendarLabels[1]}
            >
              <button
                aria-hidden="true"
                type="button"
                class="genesys-icon-calendar-generic"
                onClick={() => {
                  this.toggleCalendar();
                }}
                tabindex="-1"
              />
            </gux-text-field>
          </div>
        )}
        <gux-calendar
          ref={(el: HTMLGuxCalendarElement) => (this.calendarElement = el)}
          value={this.value}
          mode={this.mode}
          onChange={e => this.onDaySelect(e.detail)}
          firstDayOfWeek={this.firstDayOfWeek}
          locale={this.locale}
          numberOfMonths={this.numberOfMonths}
        />
      </div>
    );
  }
}
