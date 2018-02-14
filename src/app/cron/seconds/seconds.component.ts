import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';

@Component({
  selector: 'app-seconds',
  templateUrl: './seconds.component.html',
  styleUrls: ['./seconds.component.css']
})
export class SecondsComponent implements OnInit {
  @Input() inputValue: string;
  @Output() cronSecond: EventEmitter<string> = new EventEmitter<string>();

  public secondsArr: number[] = [];
  public isEverySecond: boolean;
  public isSecondIncrement: boolean;
  public secondIncrement = '1';
  public secondIncrementStart = '0';
  public isSecondSpecific: boolean;
  public secondSpecific: string[] = [];
  public isSecondRange: boolean;
  public secondRangeStart = '0';
  public secondRangeEnd = '0';
  constructor() {
    for (let i = 0; i <= 59; i++) {
      this.secondsArr.push(i);
    }
  }
  twoCharsString(i: any) {
    let result: string = i.toString();
    if (result.length === 1) { result = '0' + result; }
    return result;
  }
  getCheckBoxId(i: any) {
    return 'cronSecond' + i.toString();
  }
  secDozen(i: number) {
    const result = this.secondsArr.slice(i, i + 10 );
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
      let secFrom = -1;
      const secFromStr = this.inputValue.substring(0, sInd);
      if (secFromStr === '*') {secFrom = 0; } else {secFrom = this.getNumeric(secFromStr, 59); }
      const period = this.getNumeric(this.inputValue.substring(sInd + 1), 59);
      if (( secFrom >= 0) && (period > 0)) {
        this.isSecondIncrement = true;
        this.secondIncrementStart = secFrom.toString(10);
        this.secondIncrement = period.toString(10);
        return;
      }
    }
    sep = ',';
    const fromArr = this.inputValue.split(sep);
    for (let x = 0; x < fromArr.length; x++) {
      const sec = this.getNumeric(fromArr[x], 59);
      if (sec >= 0) {this.secondSpecific.push(sec.toString(10)); } else {break; }
    }
    if (this.secondSpecific.length > 0) {
      this.isSecondSpecific = true;
      return;
    }
    sep = '-';
    sInd = this.inputValue.indexOf(sep);
    if (sInd > 0) {
      const secStart = this.getNumeric(this.inputValue.substring(0, sInd), 59);
      const secEnd = this.getNumeric(this.inputValue.substring(sInd + 1), 59);
      if ((secStart >= 0) && (secEnd > 0)) {
        this.isSecondRange = true;
        this.secondRangeStart = secStart.toString(10);
        this.secondRangeEnd = secEnd.toString(10);
        return;
      }
    }
    this.isEverySecond = true;
    this.sendResult();
  }
  cronString() {
    if (this.isSecondIncrement) { return this.secondIncrementStart + '/' + this.secondIncrement; }
    if (this.isSecondSpecific) {
      const size = this.secondSpecific.length;
      if (size === 0) {return '0'; } else {return this.secondSpecific.join(','); }
    }
    if (this.isSecondRange) { return this.secondRangeStart + '-' + this.secondRangeEnd; }
    return '*';
  }
  sendResult() {
    const result: string = this.cronString();
    this.cronSecond.emit(result);
  }
  resetType() {
    this.isEverySecond = false;
    this.isSecondIncrement = false;
    this.isSecondSpecific = false;
    this.isSecondRange = false;
  }
  changeType(event) {
    let id = 'cronEverySecond';
    if (event != null) {id = event.currentTarget.id; }
    this.resetType();
    switch (id) {
      case 'cronEverySecond': {
        this.isEverySecond = true;
        break;
      }
      case 'cronSecondIncrement': {
        this.isSecondIncrement = true;
        break;
      }
      case 'cronSecondSpecific': {
        this.isSecondSpecific = true;
        break;
      }
      default: {
        this.isSecondRange = true;
        break;
      }
    }
    this.sendResult();
  }
onIncrement(event) {
    this.resetType();
    this.isSecondIncrement = true;
    const opt: any[] = event.target.options;
    for (let i = 0; i < opt.length; i++) {
      if (opt[i].selected) {this.secondIncrement = opt[i].value; break; }
    }
    this.sendResult();
 }
onIncrementStart(event) {
  this.resetType();
  this.isSecondIncrement = true;
  const opt: any[] = event.target.options;
  for (let i = 0; i < opt.length; i++) {
    if (opt[i].selected) {this.secondIncrementStart = opt[i].value; break; }
  }
  this.sendResult();
 }
onSpecific(event) {
    this.resetType();
    this.isSecondSpecific = true;
    const box = event.target;
    const val = box.value;
    if (box.checked) {
      this.secondSpecific.push(val);
      this.secondSpecific.sort((a, b) => this.comparator(a, b));
    } else {
      const newArr: string[] = [];
      const top = this.secondSpecific.length;
      if (top > 0) {
        for (let i = 0; i < top; i++) {
          const elem = this.secondSpecific[i];
          if (elem !== val) {newArr.push(elem); }
        }
      }
      this.secondSpecific = newArr;
    }
    this.sendResult();
  }
onRangeStart(event) {
  this.resetType();
  this.isSecondRange = true;
  const opt: any[] = event.target.options;
  for (let i = 0; i < opt.length; i++) {
    if (opt[i].selected) {this.secondRangeStart = opt[i].value; break; }
  }
  this.sendResult();
 }
onRangeEnd(event) {
    this.resetType();
    this.isSecondRange = true;
    const opt: any[] = event.target.options;
    for (let i = 0; i < opt.length; i++) {
      if (opt[i].selected) {this.secondRangeEnd = opt[i].value; break; }
    }
    this.sendResult();
  }
isEqual(value: any, match: any): boolean {
    const result = value.toString() === match.toString();
    return result;
  }
isSpecific(s: any): boolean {
    const result = this.secondSpecific.indexOf(s.toString());
    return (result >= 0);
  }
comparator(a: string, b: string) {
    return Number(a) - Number(b);
  }
}
