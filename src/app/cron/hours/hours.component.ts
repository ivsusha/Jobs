import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-hours',
  templateUrl: './hours.component.html',
  styleUrls: ['./hours.component.css']
})
export class HoursComponent implements OnInit {
  @Input() inputValue: string;
  @Output() cronHour: EventEmitter<string> = new EventEmitter<string>();
  public hoursArr: number[] = [];
  public isEveryHour: boolean;
  public isHourIncrement: boolean;
  public hourIncrement = '1';
  public hourIncrementStart = '0';
  public isHourSpecific: boolean;
  public hourSpecific: string[] = [];
  public isHourRange: boolean;
  public hourRangeStart = '0';
  public hourRangeEnd = '0';
  constructor() {
    for (let i = 0; i <= 23; i++) {
      this.hoursArr.push(i);
    }
  }
  twoCharsString(i: any) {
    let result: string = i.toString();
    if (result.length === 1) { result = '0' + result; }
    return result;
  }
  getCheckBoxId(i: any) {
    return 'cronHour' + i.toString();
  }
  hourDozen(i: number) {
    return this.hoursArr.slice(i, i + 10 );
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
      let hrFrom = -1;
      const hrFromStr = this.inputValue.substring(0, sInd);
      if (hrFromStr === '*') {hrFrom = 0; } else {hrFrom = this.getNumeric(hrFromStr, 23); }
      const period = this.getNumeric(this.inputValue.substring(sInd + 1), 23);
      if (( hrFrom >= 0) && (period > 0)) {
        this.isHourIncrement = true;
        this.hourIncrementStart = hrFrom.toString(10);
        this.hourIncrement = period.toString(10);
        return;
      }
    }
    sep = ',';
    const fromArr = this.inputValue.split(sep);
    for (let x = 0; x < fromArr.length; x++) {
      const hr = this.getNumeric(fromArr[x], 23);
      if (hr >= 0) {this.hourSpecific.push(hr.toString(10)); } else {break; }
    }
    if (this.hourSpecific.length > 0) {
      this.isHourSpecific = true;
      return;
    }
    sep = '-';
    sInd = this.inputValue.indexOf(sep);
    if (sInd > 0) {
      const hrStart = this.getNumeric(this.inputValue.substring(0, sInd), 23);
      const hrEnd = this.getNumeric(this.inputValue.substring(sInd + 1), 23);
      if ((hrStart >= 0) && (hrEnd > 0)) {
        this.isHourRange = true;
        this.hourRangeStart = hrStart.toString(10);
        this.hourRangeEnd = hrEnd.toString(10);
        return;
      }
    }
    this.isEveryHour = true;
    this.sendResult();
  }
  cronString() {
    if (this.isHourIncrement) { return this.hourIncrementStart + '/' + this.hourIncrement; }
    if (this.isHourSpecific) {
      const size = this.hourSpecific.length;
      if (size === 0) {return '0'; } else {return this.hourSpecific.join(','); }
    }
    if (this.isHourRange) { return this.hourRangeStart + '-' + this.hourRangeEnd; }
    return '*';
  }
  sendResult() {
    const result: string = this.cronString();
    this.cronHour.emit(result);
  }
  resetType() {
    this.isEveryHour = false;
    this.isHourIncrement = false;
    this.isHourSpecific = false;
    this.isHourRange = false;
  }
  changeType(event) {
    let id = 'cronEveryHour';
    if (event != null) {id = event.currentTarget.id; }
    this.resetType();
    switch (id) {
      case 'cronEveryHour': {
        this.isEveryHour = true;
        break;
      }
      case 'cronHourIncrement': {
        this.isHourIncrement = true;
        break;
      }
      case 'cronHourSpecific': {
        this.isHourSpecific = true;
        break;
      }
      default: {
        this.isHourRange = true;
        break;
      }
    }
    this.sendResult();
  }
  onIncrement(event) {
    this.resetType();
    this.isHourIncrement = true;
    const opt: any[] = event.target.options;
    for (let i = 0; i < opt.length; i++) {
      if (opt[i].selected) {this.hourIncrement = opt[i].value; break; }
    }
    this.sendResult();
  }
  onIncrementStart(event) {
    this.resetType();
    this.isHourIncrement = true;
    const opt: any[] = event.target.options;
    for (let i = 0; i < opt.length; i++) {
      if (opt[i].selected) {this.hourIncrementStart = opt[i].value; break; }
    }
    this.sendResult();
  }
  onSpecific(event) {
    this.resetType();
    this.isHourSpecific = true;
    const box = event.target;
    const val = box.value;
    if (box.checked) {
      this.hourSpecific.push(val);
      this.hourSpecific.sort((a, b) => this.comparator(a, b));
    } else {
      const newArr: string[] = [];
      const top = this.hourSpecific.length;
      if (top > 0) {
        for (let i = 0; i < top; i++) {
          const elem = this.hourSpecific[i];
          if (elem !== val) {newArr.push(elem); }
        }
      }
      this.hourSpecific = newArr;
    }
    this.sendResult();
  }
  onRangeStart(event) {
    this.resetType();
    this.isHourRange = true;
    const opt: any[] = event.target.options;
    for (let i = 0; i < opt.length; i++) {
      if (opt[i].selected) {this.hourRangeStart = opt[i].value; break; }
    }
    this.sendResult();
  }
  onRangeEnd(event) {
    this.resetType();
    this.isHourRange = true;
    const opt: any[] = event.target.options;
    for (let i = 0; i < opt.length; i++) {
      if (opt[i].selected) {this.hourRangeEnd = opt[i].value; break; }
    }
    this.sendResult();
  }
  isEqual(value: any, match: any): boolean {
    const result = value.toString() === match.toString();
    return result;
  }
  isSpecific(h: any): boolean {
    const result = this.hourSpecific.indexOf(h.toString());
    return (result >= 0);
  }
  comparator(a: string, b: string) {
    return Number(a) - Number(b);
  }
}
