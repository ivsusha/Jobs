import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-cron',
  templateUrl: './cron.component.html',
  styleUrls: ['./cron.component.css']
})
export class CronComponent implements OnInit {
  @Input() cron: string;
  @Input() isVisible: boolean;
  @Output() cronUpdate: EventEmitter<string> = new EventEmitter<string>();
  activeTab = 0;
  cronArr: string[] = ['*', '*', '*', '*', '*', '*'];
  public cronMonth: string = null;
  public cronDom: string = null;
  public cronDow: string = null;
  public cronHour: string = null;
  public cronMinute: string = null;
  public cronSecond: string = null;
  constructor() { }

  selectTab(tabNum: number) {
    this.activeTab = tabNum;
  }
  isContentHidden(tabNum: number) {
    return (tabNum !== this.activeTab);
  }
  getUpdatedCron() {
    // updates full cron created by user input
    if (this.cronArr.length !== 6) {this.initCron(this.cron); }
    let mm: string = this.cronMonth;
    if (mm == null) {mm = this.cronArr[5]; }
    let dm: string = this.cronDom;
    if (dm == null) {dm = this.cronArr[4]; }
    let dw: string = this.cronDow;
    if (dw == null) {dw = this.cronArr[3]; }
    let hh: string = this.cronHour;
    if (hh == null) {hh = this.cronArr[2]; }
    let nn: string = this.cronMinute;
    if (nn == null) {nn = this.cronArr[1]; }
    let ss: string = this.cronSecond;
    if (ss == null) {ss = this.cronArr[0]; }
    return ss + ' ' + nn + ' ' + hh + ' ' + dw + ' ' + dm + ' ' + mm;
  }
  getCronPart(pn: number) {
    if ((pn <= 5) && (pn >= 0)) { return this.cronArr[pn]; } else {return ''; }
  }
  initCron(storedCron: string) {
    // storedCron = '5,7,9 3,6,8 */5 MON-FRI ? */3';
    if ( storedCron === undefined ) { return; }
    let arr: string[] = [];
    arr = storedCron.split(' ');
    const size = arr.length;
    let i = 0;
    for (i = 0; i <= 5; i++) {
      if (i < size) {this.cronArr[i] = arr[i]; } else {this.cronArr[i] = '*'; }
    }
  }
  sendResult() {
    const result: string = this.getUpdatedCron();
    this.cronUpdate.emit(result);
  }
  ngOnInit() {
    this.initCron(this.cron);
  }
  onCronDom(dmResult: string) {
    this.cronDom = dmResult;
  }
  onCronDow(dwResult: string) {
    this.cronDow = dwResult;
  }
  onCronSecond(result: string) {this.cronSecond = result; }
  onCronMonth(result: string) {this.cronMonth = result; }
  onCronMinute(result: string) {this.cronMinute = result; }
  onCronHour(result: string) {this.cronHour = result; }
}
