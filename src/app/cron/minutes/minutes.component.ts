import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-minutes',
  templateUrl: './minutes.component.html',
  styleUrls: ['./minutes.component.css']
})
export class MinutesComponent implements OnInit {
  @Input() inputValue: string;
  @Output() cronMinute: EventEmitter<string> = new EventEmitter<string>();
  public minutesArr: number[] = [];
  public isEveryMinute: boolean;
  public isMinuteIncrement: boolean;
  public minuteIncrement = '1';
  public minuteIncrementStart = '0';
  public isMinuteSpecific: boolean;
  public minuteSpecific: string[] = [];
  public isMinuteRange: boolean;
  public minuteRangeStart = '0';
  public minuteRangeEnd = '0';
  constructor() {
    for (let i = 0; i <= 59; i++) {
      this.minutesArr.push(i);
    }
  }
  twoCharsString(i: any) {
    let result: string = i.toString();
    if (result.length === 1) { result = '0' + result; }
    return result;
  }
  getCheckBoxId(i: any) {
    return 'cronminute' + i.toString();
  }
  minDozen(i: number) {
    const result = this.minutesArr.slice(i, i + 10 );
    return result;
  }
  getNumeric(from: string, limit: number) {
    let result = Number(from);
    if (Number.isNaN(result)) {return -1; }
    if ( result < 0 ) {result = -1; }  else {
      if (result > limit) {result = limit; }
    }
    return result;
  }
  ngOnInit() {
    this.resetType();
    let sep = '/';
    let sInd = this.inputValue.indexOf(sep);
    if (sInd > 0) {
      let minFrom = -1;
      const minFromStr = this.inputValue.substring(0, sInd);
      if (minFromStr === '*') {minFrom = 0; } else {minFrom = this.getNumeric(minFromStr, 59); }
      const period = this.getNumeric(this.inputValue.substring(sInd + 1), 59);
      if (( minFrom >= 0) && (period > 0)) {
        this.isMinuteIncrement = true;
        this.minuteIncrementStart = minFrom.toString(10);
        this.minuteIncrement = period.toString(10);
        return;
      }
    }
    sep = ',';
    const fromArr = this.inputValue.split(sep);
    for (let x = 0; x < fromArr.length; x++) {
      const min = this.getNumeric(fromArr[x], 59);
      if (min >= 0) {this.minuteSpecific.push(min.toString(10)); } else {break; }
    }
    if (this.minuteSpecific.length > 0) {
      this.isMinuteSpecific = true;
      return;
    }
    sep = '-';
    sInd = this.inputValue.indexOf(sep);
    if (sInd > 0) {
      const minStart = this.getNumeric(this.inputValue.substring(0, sInd), 59);
      const minEnd = this.getNumeric(this.inputValue.substring(sInd + 1), 59);
      if ((minStart >= 0) && (minEnd > 0)) {
        this.isMinuteRange = true;
        this.minuteRangeStart = minStart.toString(10);
        this.minuteRangeEnd = minEnd.toString(10);
        return;
      }
    }
    this.isEveryMinute = true;
    this.sendResult();
  }
  cronString() {
    if (this.isMinuteIncrement) { return this.minuteIncrementStart + '/' + this.minuteIncrement; }
    if (this.isMinuteSpecific) {
      const size = this.minuteSpecific.length;
      if (size === 0) {return '0'; } else {return this.minuteSpecific.join(','); }
    }
    if (this.isMinuteRange) { return this.minuteRangeStart + '-' + this.minuteRangeEnd; }
    return '*';
  }
  sendResult() {
    const result: string = this.cronString();
    this.cronMinute.emit(result);
  }
  resetType() {
    this.isEveryMinute = false;
    this.isMinuteIncrement = false;
    this.isMinuteSpecific = false;
    this.isMinuteRange = false;
  }
  changeType(event) {
    let id = 'cronEveryMinute';
    if (event != null) {id = event.currentTarget.id; }
    this.resetType();
    switch (id) {
      case 'cronEveryMinute': {
        this.isEveryMinute = true;
        break;
      }
      case 'cronMinuteIncrement': {
        this.isMinuteIncrement = true;
        break;
      }
      case 'cronMinuteSpecific': {
        this.isMinuteSpecific = true;
        break;
      }
      default: {
        this.isMinuteRange = true;
        break;
      }
    }
    this.sendResult();
  }
  onIncrement(event) {
    this.resetType();
    this.isMinuteIncrement = true;
    const opt: any[] = event.target.options;
    for (let i = 0; i < opt.length; i++) {
      if (opt[i].selected) {this.minuteIncrement = opt[i].value; break; }
    }
    this.sendResult();
  }
  onIncrementStart(event) {
    this.resetType();
    this.isMinuteIncrement = true;
    const opt: any[] = event.target.options;
    for (let i = 0; i < opt.length; i++) {
      if (opt[i].selected) {this.minuteIncrementStart = opt[i].value; break; }
    }
    this.sendResult();
  }
  onSpecific(event) {
    this.resetType();
    this.isMinuteSpecific = true;
    const box = event.target;
    const val = box.value;
    if (box.checked) {
      this.minuteSpecific.push(val);
      this.minuteSpecific.sort((a, b) => this.comparator(a, b));
    } else {
      const newArr: string[] = [];
      const top = this.minuteSpecific.length;
      if (top > 0) {
        for (let i = 0; i < top; i++) {
          const elem = this.minuteSpecific[i];
          if (elem !== val) {newArr.push(elem); }
        }
      }
      this.minuteSpecific = newArr;
    }
    this.sendResult();
  }
  onRangeStart(event) {
    this.resetType();
    this.isMinuteRange = true;
    const opt: any[] = event.target.options;
    for (let i = 0; i < opt.length; i++) {
      if (opt[i].selected) {this.minuteRangeStart = opt[i].value; break; }
    }
    this.sendResult();
  }
  onRangeEnd(event) {
    this.resetType();
    this.isMinuteRange = true;
    const opt: any[] = event.target.options;
    for (let i = 0; i < opt.length; i++) {
      if (opt[i].selected) {this.minuteRangeEnd = opt[i].value; break; }
    }
    this.sendResult();
  }
  isEqual(value: any, match: any): boolean {
    const result = value.toString() === match.toString();
    return result;
  }
  isSpecific(m: any): boolean {
    const result = this.minuteSpecific.indexOf(m.toString());
    return (result >= 0);
  }
  comparator(a: string, b: string) {
    return Number(a) - Number(b);
  }
}
