import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-months',
  templateUrl: './months.component.html',
  styleUrls: ['./months.component.css']
})
export class MonthsComponent implements OnInit {
  @Input() inputValue: string;
  @Output() cronMonth: EventEmitter<string> = new EventEmitter<string>();
  public monthsArr: number[] = [];
  public monthNames = ['January', 'February', 'March',
  'April', 'May', 'June', 'July', 'August', 'September',
  'October', 'November', 'December'];
  public isEveryMonth: boolean;
  public isMonthIncrement: boolean;
  public monthIncrement = '1';
  public monthIncrementStart = '1';
  public isMonthSpecific: boolean;
  public monthSpecific: string[] = [];
  public isMonthRange: boolean;
  public monthRangeStart = '1';
  public monthRangeEnd = '1';
  constructor() {
    for (let i = 1; i <= 12; i++) {
      this.monthsArr.push(i);
    }
  }
  getMonthName(mnum: number) {
    let inum = mnum - 1;
    if ((inum > 11) || (inum < 0)) {inum = 1; }
    return this.monthNames[inum];
  }
  getShortMonth(mnum: number) {
    const result: string = this.getMonthName(mnum);
    return result.substr(0, 3).toUpperCase();
  }
  getCheckBoxId(i: any) {
    return 'cronMonth' + i.toString();
  }
  monthThird(i: number) {
    const result = this.monthsArr.slice(i, i + 4);
    return result;
  }
  getNumeric(from: string, limit: number) {
    let result = Number(from);
    if (Number.isNaN(result)) {console.log(' this is NaN'); return 0; }
    if ( result <= 0 ) {result = 1; }  else {
      if (result > limit) {result = limit; }
    }
    return result;
  }
  monthNumber(fromName: string) {
    const lcName = fromName.toLowerCase();
    for (let i = 0; i <= 11; i++) {
      const lcMonth = this.monthNames[i].toLowerCase();
      if (lcMonth.indexOf(lcName) >= 0) {return i + 1; }
    }
    return 0;
  }
  ngOnInit() {
    this.resetType();
    let sep = '/';
    let sInd = this.inputValue.indexOf(sep);
    if (sInd > 0) {
      let monthFrom = -1;
      const monthFromStr = this.inputValue.substring(0, sInd);
      if (monthFromStr === '*') {monthFrom = 1; } else {monthFrom = this.getNumeric(monthFromStr, 12); }
      const period = this.getNumeric(this.inputValue.substring(sInd + 1), 12);
      if ((monthFrom > 0) && (period > 0)) {
        this.isMonthIncrement = true;
        this.monthIncrementStart = monthFrom.toString(10);
        this.monthIncrement = period.toString(10);
        return;
      }
    }
    sep = ',';
    const fromArr = this.inputValue.split(sep);
    for (let x = 0; x < fromArr.length; x++) {
      let mn = this.getNumeric(fromArr[x], 12);
      if (mn === 0) { mn = this.monthNumber(fromArr[x]); }
      if (mn > 0) {this.monthSpecific.push(mn.toString(10)); } else {break; }
    }
    if (this.monthSpecific.length > 0) {
      this.isMonthSpecific = true;
       return;
    }
    sep = '-';
    sInd = this.inputValue.indexOf(sep);
    if (sInd > 0) {
      const monthStart = this.getNumeric(this.inputValue.substring(0, sInd), 12);
      const monthEnd = this.getNumeric(this.inputValue.substring(sInd + 1), 12);
      if ((monthStart > 0) && (monthEnd > 0)) {
        this.isMonthRange = true;
        this.monthRangeStart = monthStart.toString(10);
        this.monthRangeEnd = monthEnd.toString(10);
        return;
      }
    }
    this.isEveryMonth = true;
    this.sendResult();
  }
  cronString() {
    if (this.isMonthIncrement) { return this.monthIncrementStart + '/' + this.monthIncrement; }
    if (this.isMonthSpecific) {
      const size = this.monthSpecific.length;
      if (size === 0) {return '1'; } else {return this.monthSpecific.join(','); }
    }
    if (this.isMonthRange) { return this.monthRangeStart + '-' + this.monthRangeEnd; }
    return '*';
  }
  sendResult() {
    const result: string = this.cronString();
    this.cronMonth.emit(result);
  }
  resetType() {
    this.isEveryMonth = false;
    this.isMonthIncrement = false;
    this.isMonthSpecific = false;
    this.isMonthRange = false;
  }
  changeType(event) {
    let id = 'cronEveryMonth';
    if (event != null) {id = event.currentTarget.id; }
    this.resetType();
    switch (id) {
      case 'cronEveryMonth': {
        this.isEveryMonth = true;
        break;
      }
      case 'cronMonthIncrement': {
        this.isMonthIncrement = true;
        break;
      }
      case 'cronMonthSpecific': {
        this.isMonthSpecific = true;
        break;
      }
      default: {
        this.isMonthRange = true;
        break;
      }
    }
    this.sendResult();
  }
  onIncrement(event) {
    this.resetType();
    this.isMonthIncrement = true;
    const opt: any[] = event.target.options;
    for (let i = 0; i < opt.length; i++) {
      if (opt[i].selected) {this.monthIncrement = opt[i].value; break; }
    }
    this.sendResult();
  }
  onIncrementStart(event) {
    this.resetType();
    this.isMonthIncrement = true;
    const opt: any[] = event.target.options;
    for (let i = 0; i < opt.length; i++) {
      if (opt[i].selected) {this.monthIncrementStart = opt[i].value; break; }
    }
    this.sendResult();
  }
  onSpecific(event) {
    this.resetType();
    this.isMonthSpecific = true;
    const box = event.target;
    const val = box.value;
    if (box.checked) {
      this.monthSpecific.push(val);
      this.monthSpecific.sort((a, b) => this.comparator(a, b));
    } else {
      const newArr: string[] = [];
      const top = this.monthSpecific.length;
      if (top > 0) {
        for (let i = 0; i < top; i++) {
          const elem = this.monthSpecific[i];
          if (elem !== val) {newArr.push(elem); }
        }
      }
      this.monthSpecific = newArr;
    }
    this.sendResult();
  }
  onRangeStart(event) {
    this.resetType();
    this.isMonthRange = true;
    const opt: any[] = event.target.options;
    for (let i = 0; i < opt.length; i++) {
      if (opt[i].selected) {this.monthRangeStart = opt[i].value; break; }
    }
    this.sendResult();
  }
  onRangeEnd(event) {
    this.resetType();
    this.isMonthRange = true;
    const opt: any[] = event.target.options;
    for (let i = 0; i < opt.length; i++) {
      if (opt[i].selected) {this.monthRangeEnd = opt[i].value; break; }
    }
    this.sendResult();
  }
  isEqual(value: any, match: any): boolean {
    const result = value.toString() === match.toString();
    return result;
  }
  isSpecific(m: any): boolean {
    const result = this.monthSpecific.indexOf(m.toString());
    return (result >= 0);
  }
  comparator(a: string, b: string) {
    return Number(a) - Number(b);
  }
}
