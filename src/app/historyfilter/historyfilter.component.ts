import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { IMultiSelectOption, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { TasksService } from '../tasks.service';
import { Response } from '@angular/http';
import * as $ from 'jquery';
import { SearchPipe } from '../search.pipe';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { SorttasksService } from '../sorttasks.service';
@Component({
  selector: 'app-historyfilter',
  templateUrl: './historyfilter.component.html',
  styleUrls: ['./historyfilter.component.css'],
  providers: [SearchPipe]
})
export class HistoryfilterComponent implements OnInit, OnDestroy {
  mySearch: any;
  optionsModel: string[];
  myOptions: IMultiSelectOption[] = [];
  myHistory = [];
  id;
  pageToken;
  checkAll;
  tname; sdate; edate; body; status; dur;
  mySettings: IMultiSelectSettings = {
    itemClasses: "dropdown-item.active",
    enableSearch: true,
    checkedStyle: 'fontawesome',
    //  buttonClasses: 'btn btn-default btn-block',
    buttonClasses: 'btn btn-light',
    dynamicTitleMaxItems: 3,
    displayAllSelectedText: true,
    selectionLimit: 1,
    autoUnselect: true,
    closeOnSelect: true
  };
  currPage;

  private eventOptions: boolean | { capture?: boolean, passive?: boolean };
  passiveSupported() { };
  private reqSubscription: Subscription;
  constructor(private tasksService: TasksService, private sort: SorttasksService, private pipe: SearchPipe, private ngZone: NgZone, private router: Router) { }

  ngOnInit() {
    // this.body = document.getElementById("container");
    this.tasksService.header = "History";
    if (this.passiveSupported()) { //use the implementation on mozilla
      this.eventOptions = {
        capture: true,
        passive: true
      };
    } else {
      this.eventOptions = true;
    }
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.scroll, <any>this.eventOptions);
    });


    let tarr = this.tasksService.getTasksArray();
    tarr["models"].map((v) => { if (v['ActiveStatus'] != false) this.myOptions.push({ id: v["_id"], name: v["TaskName"] }) });
  }
  onShow(task) {
    if (this.checkAll) {
      this.onShowAll();
      return;
    }
    this.id = this.optionsModel[0];
    this.tasksService.getTaskHistorybyID(this.id).subscribe(
      (response: Response) => {
        this.myHistory = response.json();
        this.pageToken = this.myHistory['pageToken'];
      },
      error => console.log(error)
    )

  }
  onChange(event) {
    this.mySearch = undefined;
    if (this.id == event) return;
    this.id = event;
    // this.id = this.optionsModel[0];
    this.reqSubscription = this.tasksService.getTaskHistorybyID(this.id).subscribe(
      (response: Response) => {
        this.myHistory = response.json();
        this.pageToken = this.myHistory['pageToken'];
      },
      error => console.log(error)
    )
  }
  onShowAll() {
    this.reqSubscription = this.tasksService.getTaskAllHistory().subscribe(
      (response: Response) => {
        this.myHistory = response.json();
        this.pageToken = this.myHistory['pageToken'];
      },
      error => console.log(error)
    )

  }
  onSorted(event) {
    this.sort.sortEvent = event;
    this.myHistory['models'] = this.sort.getResult(this.myHistory, event);
    this.mySearch = undefined;
    this.myHistory['models'] = this.pipe.transform(this.myHistory['models'], this.mySearch);
  }
  onNext() {
    let scroll_top = $(document).scrollTop();//высота прокрученной области
    let page_height = $(document).height();//высота всей страницы
    let wind_height = $(window).height();//высота окна браузера
    //    alert ("высота всей страницы"+page_height+ ";Выс прокруч обл "+scroll_top + "Высота браузера" + wind_height);
    this.pageToken = this.myHistory['pageToken'];
    if (this.pageToken == "end") { this.ngOnDestroy(); return; }
    if (this.pageToken == null) { this.ngOnDestroy(); return; }
    this.tname = undefined; this.sdate = undefined; this.edate = undefined; this.body = undefined; this.status = undefined; this.dur = undefined;
    this.reqSubscription = this.tasksService.getTaskHistorybyToken(this.id, this.pageToken).subscribe(
      (response: Response) => {
        let pageArray = response.json();
        //  this.tasksArray['models'].concat(pageArray['models']);
        pageArray['models'].map(entry => this.myHistory['models'].push(entry));
        this.myHistory['models'] =this.sort.getResult(this.myHistory,this.sort.sortEvent);
        this.myHistory['pageToken'] = pageArray['pageToken'];
        this.pageToken = pageArray['pageToken'];
        if (this.pageToken == null) this.pageToken = "end";
        this.mySearch = undefined;
        this.myHistory['models'] = this.pipe.transform(this.myHistory['models'], this.mySearch);
      },
      (error) => {
        console.log(error)
      }
    )
  }
  scroll = (): void => {
    let scroll_top = $(document).scrollTop();//высота прокрученной области
    let page_height = $(document).height();//высота всей страницы
    let wind_height = $(window).height();//высота окна браузера
    if (this.pageToken == "end") { this.ngOnDestroy(); return; }
  
    if (this.pageToken != "end") {
      if ((scroll_top + wind_height) >= page_height - 1) {      
        $(document).scrollTop() >= page_height;

        //    alert( 'Текущая прокрутка сверху: ' + window.pageYOffset );
        //alert ("высота всей страницы"+page_height+ ";Выс прокруч обл "+scroll_top + "Высота браузера" + wind_height);

        // window.removeEventListener('scroll', this.scroll, <any>this.eventOptions);
        let but = document.getElementById("next");

        //this.onNext(); 
        but.click();
      }
    }
  };
  onCheck() {
    if (this.checkAll) this.optionsModel[0] = "select";
  }
  onTransform(criteria) {
    return this.mySearch = criteria;
  }
  onBack() {
    this.router.navigate(['/tasks']);
  }
  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, <any>this.eventOptions);
    if (this.reqSubscription != null) this.reqSubscription.unsubscribe();
  }
}

