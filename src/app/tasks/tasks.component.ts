import { TasksService } from './../tasks.service';
import { Component, OnInit, NgZone, OnDestroy, OnChanges } from '@angular/core';
import { Response } from '@angular/http';
import { Router } from '@angular/router';
import { SearchPipe } from '../search.pipe';
import * as $ from 'jquery';
import { SorttasksService } from '../sorttasks.service';
import {TaskSearchCriteria} from '../sorttasks.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  providers: [SearchPipe]
})
export class TasksComponent implements OnInit, OnDestroy {

  tasksArray: any = [];
  header= 'Tasks';
  searchValue = '';
  pageToken = null;
  body;
  showactive = 'All';
  private reqSubscription: Subscription;
  private eventOptions: boolean|{capture?: boolean, passive?: boolean};
  passiveSupported() {}

  constructor(private tasksService: TasksService,   private pipe: SearchPipe, private sort: SorttasksService, private ngZone: NgZone) {
    this.tasksArray['models'] = '';
   }

 ngOnInit() {
    this.tasksService.header = 'Tasks';
    this.body = document.getElementById('container');
    if (this.passiveSupported()) { // use the implementation on mozilla
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

if (this.pageToken === 'end' ) { return true; }
    this.reqSubscription = this.tasksService.getTasks(this.pageToken).subscribe(
      (response: Response) => {
        this.tasksArray = response.json();
    this.tasksService.setTasksArray(this.tasksArray);
    this.pageToken = this.tasksArray['pageToken'];
    this.tasksArray['models'] = this.sort.getResult(this.tasksArray, this.sort.sortEvent);

    if (this.pageToken == null) { this.pageToken = 'end'; }

     },
     (error) => {
       console.log(error);
     }
    );
  }

  onDelete(id) {

  }
 // onSearch(val){
 //  this.searchValue = val;
//  }

  onNext() {

 //   if(this.pageToken == null) {window.removeEventListener('scroll', this.scroll, <any>this.eventOptions);return;}
  this.pageToken = this.tasksArray['pageToken'];
  if (this.pageToken === 'end' ) {this.ngOnDestroy(); return; }
  this.reqSubscription = this.tasksService.getTasks(this.pageToken ).subscribe(
           (response: Response) => {
            const pageArray = response.json();
         pageArray['models'].map(entry => this.tasksArray['models'].push(entry));
         this.tasksArray['models'] = this.sort.getResult(this.tasksArray, this.sort.sortEvent);
         this.pageToken = pageArray['pageToken'];
         if ( this.pageToken == null) { this.pageToken = 'end'; }
          this.tasksArray['pageToken'] = this.pageToken;
        this.tasksService.setTasksArray(this.tasksArray);
         this.searchValue = undefined;
         this.tasksArray['models'] = this.pipe.transform(this.tasksArray['models'], this.searchValue);
           },
          (error) => {
             console.log(error);
        }
        );
       // if(next==1) this.router.navigate(["tasks,1"]);
        if (this.pageToken === 'end' ) { this.ngOnDestroy(); }
}

onSearch(event) {
  this.searchValue = event;
}
scroll = (): void => {
 const scroll_top = $(document).scrollTop(); // высота прокрученной области
 const page_height = $(document).height(); // высота всей страницы
  const   wind_height = $(window).height(); // высота окна браузера
  if (this.pageToken === 'end') { window.removeEventListener('scroll', this.scroll, <any>this.eventOptions); return; }


  if (this.pageToken !== 'end') {
    if ((scroll_top + wind_height ) >= page_height - 1) {
   // tslint:disable-next-line:no-unused-expression
   $(document).scrollTop() >= page_height;

 //   alert ("высота всей страницы"+page_height+ ";Выс прокруч обл "+scroll_top + "Высота браузера" + wind_height);
    if (this.pageToken === 'end') {window.removeEventListener('scroll', this.scroll, <any>this.eventOptions); return; }

  const but = document.getElementById( 'next');
//  this.onNext();
  but.click();
  }
 }

  // handle your scroll here
  // notice the 'odd' function assignment to a class field
  // this is used to be able to remove the event listener
}
onSorted(event) {
  this.sort.sortEvent = event;
  this.tasksArray['models'] = this.sort.getResult(this.tasksArray, event);
  this.searchValue = undefined;
  this.tasksArray['models'] = this.pipe.transform(this.tasksArray['models'], this.searchValue);
}
ngOnDestroy() {
  window.removeEventListener('scroll', this.scroll, <any>this.eventOptions);
  if (this.reqSubscription != null && this.reqSubscription !== undefined) { this.reqSubscription.unsubscribe(); }
}
}
