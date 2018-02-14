import {Component, Input, Output, OnInit} from '@angular/core';
import {EventEmitter} from '@angular/core';

@Component({
  selector: 'app-days',
  templateUrl: './days.component.html',
  styleUrls: ['./days.component.css']
})
export class DaysComponent implements OnInit {
  @Input() inputValue: string; // days of month (dom)
  @Input() extraValue: string; // days of week (dow)
  @Output() cronDom: EventEmitter<string> = new EventEmitter<string>(); // cron result days of month
  @Output() cronDow: EventEmitter<string> = new EventEmitter<string>(); // cron results days of week
  public monthArr: number[] = [];
  public weekArr: number[] = [];
  public weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  public isEveryDay = false;
  public isDowIncrement = false;
  dowIncrement = 1;
  dowIncrementStart = 1;
  public isDomIncrement = false;
  domIncrement = 1;
  domIncrementStart = 1;
  public isDowSpecific = false;
  dowSpecific: string[] = [];
  public isDomSpecific = false;
  domSpecific: string[] = [];
  public isLastDow = false;
  public isLastDom = false;
  public isLastSpecificDom = false;
  lastSpecificDom = 1;
  public isDaysBeforeEom = false;
  daysBeforeEom = 1;
  public isNearestWeekday = false;
  nearestWeekday = 1;
  public isNthDay = false;
  nthWeek = 1;
  nthDay = 1;

  constructor() {
    for (let i = 1; i <= 31; i++) {
      this.monthArr.push(i);
      if (i <= 7) {this.weekArr.push(i); }
    }
  }
  weekDayName(wn: number) {
    let inum = wn - 1;
    if ((inum > 6) || (inum < 0)) {inum = 1; }
    return this.weekDays[inum];
  }
  getShortDay(dnum: number) {
    const result: string = this.weekDayName(dnum);
    return result.substr(0, 3 ).toUpperCase();
  }
  weekPart(i: number) {
    const result = this.weekArr.slice(i, i + 4);
    return result;
  }
  monthPart(i: number) {
    const result = this.monthArr.slice(i, i + 8);
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
  dayNumber(fromName: string) {
    // returns a day number by weekday
    for (let i = 0; i <= 6; i++) {
      const ucDay = this.weekDays[i].toUpperCase();
      if (ucDay.indexOf(fromName) >= 0) {return i + 1; }
    }
    return 0;
  }
  proceedWeek() {
    let sep = '/';
    const param = this.extraValue.toUpperCase().trim();
    let sInd = param.indexOf(sep);
    if (sInd > 0) {
      let wdFrom = -1;
      const wdFromStr = param.substring(0, sInd);
      if (wdFromStr === '*') {wdFrom = 1; } else {wdFrom = this.getNumeric(wdFromStr, 7); }
      const period = this.getNumeric(param.substring(sInd + 1), 7);
      if (( wdFrom >= 0) && (period > 0)) {
        this.isDowIncrement = true;
        this.dowIncrementStart = wdFrom;
        this.dowIncrement = period;
        return;
      }
    }
    sep = ',';
    let needUpdate = false;
    const fromArr = param.split(sep);
    for (let x = 0; x < fromArr.length; x++) {
      let day = this.getNumeric(fromArr[x], 7);
      if (day <= 0) {day = this.dayNumber(fromArr[x]); needUpdate = true; }
      if (day > 0) {this.dowSpecific.push(day.toString(10)); } else {break; }
    }
    if (this.dowSpecific.length > 0) {
      this.isDowSpecific = true;
      if (needUpdate) {this.sendResult(); }
      return;
    }
    sep = '#';
    sInd = param.indexOf(sep);
    if (sInd > 0) {
      const wdayNum = this.getNumeric(param.substring(0, sInd), 7);
      const weekNum = this.getNumeric(param.substring(sInd + 1), 7);
      if ((wdayNum > 0) && (weekNum > 0)) {
        this.isNthDay = true;
        this.nthDay = wdayNum;
        this.nthWeek = weekNum;
        return;
      }
    }
    if (param.substr(-1, 1) === 'L') {
      const ld = param.substr(0, param.length - 1);
      let lastDay = this.getNumeric(ld, 7);
      if (lastDay <= 0) {lastDay = this.dayNumber(ld); }
      if (lastDay > 0) {
        this.isLastSpecificDom = true;
        this.lastSpecificDom = lastDay;
      }
    }
    this.isEveryDay = true;
    this.sendResult();
  }
  ngOnInit() {
    this.resetType();
    const domUcase = this.inputValue.toUpperCase().trim();
    const domSize = domUcase.length;
    switch (domUcase) {
      case '?': this.proceedWeek();
                return;
      case 'L': this.isLastDom = true;
                return;
      case 'LW':
                this.isLastDow = true;
                return;
      default:
        if (domUcase.substr(0, 2) === 'L-') {
          const daysTillEom = this.getNumeric(domUcase.substring(2), 31);
          if (daysTillEom > 1) {
            this.isDaysBeforeEom = true;
            this.daysBeforeEom = daysTillEom;
            return;
          }
        }
        const lastChar = domUcase.substr(-1, 1);
        if (domUcase.substr(-1, 1) === 'W') {
          const daysBefore = this.getNumeric(domUcase.substr(0, domSize - 1), 31);
          if (daysBefore > 0) {
            this.isNearestWeekday = true;
            this.nearestWeekday = daysBefore;
            return;
          }
        }
    }
    let sep = '/';
    const sInd = domUcase.indexOf(sep);
    if (sInd > 0) {
      let dayFrom = -1;
      const dayFromStr = domUcase.substring(0, sInd);
      if (dayFromStr === '*') {dayFrom = 1; } else {dayFrom = this.getNumeric(dayFromStr, 31); }
      const period = this.getNumeric(domUcase.substring(sInd + 1), 31);
      if (( dayFrom > 0) && (period > 0)) {
        this.isDomIncrement = true;
        this.domIncrementStart = dayFrom;
        this.domIncrement = period;
        return;
      }
    }
    sep = ',';
    const fromArr = this.inputValue.split(sep);
    for (let x = 0; x < fromArr.length; x++) {
      const day = this.getNumeric(fromArr[x], 31);
      if (day >= 0) {this.domSpecific.push(day.toString(10)); } else {break; }
    }
    if (this.domSpecific.length > 0) {
      this.isDomSpecific = true;
      return;
    }
    this.isEveryDay = true;
    this.sendResult();
  }
  cronString() {
    // return value of the day of month
    if (this.isDowIncrement) { return this.dowIncrementStart + '/' + this.dowIncrement; }
    if (this.isDomIncrement) { return this.domIncrementStart + '/' + this.domIncrement; }
    if (this.isDowSpecific) { return '?'; }
    if (this.isDomSpecific) {
      const size = this.domSpecific.length;
      if (size === 0) {return '1'; } else {return this.domSpecific.join(','); }
    }
    if (this.isLastDom) {return 'L'; }
    if (this.isLastDow) {return 'LW'; }
    if (this.isLastSpecificDom) {return '?'; }
    if (this.isDaysBeforeEom) {return 'L-' + this.daysBeforeEom.toString(10); }
    if (this.isNearestWeekday) {return this.nearestWeekday.toString(10) + 'W'; }
    if (this.isNthDay) {return '?'; }
    return '*';
  }
  cronWeekString() {
    // return value for the day of week
    if (this.isDowSpecific) {
      const size = this.dowSpecific.length;
      if (size === 0) {return '1'; } else {return this.dowSpecific.join(','); }
    }
    if (this.isLastSpecificDom) {
      return this.lastSpecificDom.toString(10) + 'L';
    }
    if (this.isNthDay) { return this.nthDay.toString(10) + '#' + this.nthWeek.toString(10); }
    return '?';
  }
  sendResult() {
    const r1: string = this.cronString();
    this.cronDom.emit(r1);
    const r2: string = this.cronWeekString();
    this.cronDow.emit(r2);
  }
  resetType() {
    this.isEveryDay = false;
    this.isDowIncrement = false;
    this.isDomIncrement = false;
    this.isDowSpecific = false;
    this.isDomSpecific = false;
    this.isLastDow = false;
    this.isLastDom = false;
    this.isLastSpecificDom = false;
    this.isDaysBeforeEom = false;
    this.isNearestWeekday = false;
    this.isNthDay = false;
  }
  changeType(event) {
    let id = 'cronEveryDay';
    if (event != null) {id = event.currentTarget.id; }
    this.resetType();
    switch (id) {
      case 'cronEveryDay': {
        this.isEveryDay = true;
        break;
      }
      case 'cronDowIncrement': {
        this.isDowIncrement = true;
        break;
      }
      case 'cronDomIncrement': {
        this.isDomIncrement = true;
        break;
      }
      case 'cronLastDow': {
        this.isLastDow = true;
        break;
      }
      case 'cronLastDom': {
        this.isLastDom = true;
        break;
      }
      case 'cronDowSpecific': {
        this.isDowSpecific = true;
        break;
      }
      case 'cronDomSpecific': {
        this.isDomSpecific = true;
        break;
      }
      case 'cronLastSpecificDom': {
        this.isLastSpecificDom = true;
        break;
      }
      case 'cronDaysBeforeEom': {
        this.isDaysBeforeEom = true;
        break;
      }
      case 'cronNearestWeekday': {
        this.isNearestWeekday = true;
        break;
      }
      default: {
        this.isNthDay = true;
        break;
      }
    }
    this.sendResult();
  }
  onDowIncrement(event) {
    this.resetType();
    this.isDowIncrement = true;
    const opt: any[] = event.target.options;
    for (let i = 0; i < opt.length; i++) {
      if (opt[i].selected) {this.dowIncrement = opt[i].value; break; }
    }
    this.sendResult();
  }
  onDowIncrementStart(event) {
    this.resetType();
    this.isDowIncrement = true;
    const opt: any[] = event.target.options;
    for (let i = 0; i < opt.length; i++) {
      if (opt[i].selected) {this.dowIncrementStart = opt[i].value; break; }
    }
    this.sendResult();
  }
  onDomIncrement(event) {
    this.resetType();
    this.isDomIncrement = true;
    const opt: any[] = event.target.options;
    for (let i = 0; i < opt.length; i++) {
      if (opt[i].selected) {this.domIncrement = opt[i].value; break; }
    }
    this.sendResult();
  }
  onDomIncrementStart(event) {
    this.resetType();
    this.isDomIncrement = true;
    const opt: any[] = event.target.options;
    for (let i = 0; i < opt.length; i++) {
      if (opt[i].selected) {this.domIncrementStart = opt[i].value; break; }
    }
    this.sendResult();
  }
  onDowSpecific(event) {
    this.resetType();
    this.isDowSpecific = true;
    const box = event.target;
    const val = box.value;
    if (box.checked) {
      this.dowSpecific.push(val);
      this.dowSpecific.sort();
    } else {
      const newArr: string[] = [];
      const top = this.dowSpecific.length;
      if (top > 0) {
        for (let i = 0; i < top; i++) {
          const elem = this.dowSpecific[i];
          if (elem !== val) {newArr.push(elem); }
        }
      }
      this.dowSpecific = newArr;
    }
    this.sendResult();
  }
  onDomSpecific(event) {
    this.resetType();
    this.isDomSpecific = true;
    const box = event.target;
    const val = box.value;
    if (box.checked) {
      this.domSpecific.push(val);
      this.domSpecific.sort((a, b) => this.comparator(a, b));
    } else {
      const newArr: string[] = [];
      const top = this.domSpecific.length;
      if (top > 0) {
        for (let i = 0; i < top; i++) {
          const elem = this.domSpecific[i];
          if (elem !== val) {newArr.push(elem); }
        }
      }
      this.domSpecific = newArr;
    }
    this.sendResult();
  }
  onLastSpecificDom(event) {
    this.isLastSpecificDom = true;
    this.lastSpecificDom = event.target.value;
    this.sendResult();
  }
  onDaysBeforeEom(event) {
    this.isDaysBeforeEom = true;
    this.daysBeforeEom = event.target.value;
    this.sendResult();
  }
  onNearestWeekday(event) {
    this.isNearestWeekday = true;
    this.nearestWeekday = event.target.value;
    this.sendResult();
  }
  onNthDay(event) {
    this.isNthDay = true;
    this.nthDay = event.target.value;
    this.sendResult();
  }
  onNthWeek(event) {
    this.isNthDay = true;
    this.nthWeek = event.target.value;
    this.sendResult();
  }
  isEqual(value: any, match: any): boolean {
    const result = value.toString() === match.toString();
    return result;
  }
  isWeekSpecific(dd: any): boolean {
    const result = this.dowSpecific.indexOf(dd.toString());
    return (result >= 0);
  }
  isMonthSpecific(dd: any): boolean {
    const result = this.domSpecific.indexOf(dd.toString());
    return (result >= 0);
  }
  comparator(a: string, b: string) {
    return Number(a) - Number(b);
  }
}
