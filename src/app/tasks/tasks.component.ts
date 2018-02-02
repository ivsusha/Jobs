import { TasksService } from './../tasks.service';
import { Component, OnInit, NgZone, OnDestroy,OnChanges} from '@angular/core';
import { Response } from '@angular/http';
import { Router } from '@angular/router';
import { SearchPipe } from '../search.pipe';
import * as $ from 'jquery';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  providers: [SearchPipe]
})
export class TasksComponent implements OnInit,OnDestroy {
 
  tasksArray;
   numPage = 1;
// tasksArray;
  header: string = "Tasks";
  searchValue :string="";
  currPage; 
  pageToken = null;
  body;
  private eventOptions: boolean|{capture?: boolean, passive?: boolean};
  passiveSupported(){};
 
  constructor(private tasksService: TasksService,   private pipe: SearchPipe,private ngZone: NgZone) { }
 
  ngOnInit() { 

    this.body = document.getElementById("container");
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
     
    


 this.tasksArray =this.tasksService.getTasksArray();
 this.pageToken = this.tasksArray['pageToken'];
if(this.pageToken=="end" ) return true;
 let tarr;
    
 
    this.tasksService.getTasks(this.pageToken).subscribe(
      (response: Response) => {
        tarr = response.json();
        
      this.tasksService.setTasksArray(tarr);
 this.tasksArray = this.tasksService.getTasksArray();
    this.pageToken = tarr['pageToken'];
 
    if(this.pageToken == null) this.pageToken ="end";    
 
     },
     (error) => {
       console.log(error)
     }
    )  
  }

  onDelete(id){

  }
 // onSearch(val){
 //  this.searchValue = val;
//  }

  onNext(){   
  
 //   if(this.pageToken == null) {window.removeEventListener('scroll', this.scroll, <any>this.eventOptions);return;}
  this.pageToken = this.tasksArray['pageToken'];
  if(this.pageToken=="end" ) {this.ngOnDestroy();return;}
  this.tasksService.getTasks(this.pageToken ).subscribe(   
           (response:Response)=>{
            let pageArray = response.json();
                
         pageArray['models'].map(entry =>this.tasksArray['models'].push(entry));
         this.pageToken = pageArray['pageToken'];
         if(this.pageToken == null) this.pageToken ="end";    
          this.tasksArray['pageToken'] = this.pageToken;        
         this.tasksService.setTasksArray(this.tasksArray);
         this.searchValue= undefined;
         this.tasksArray['models'] = this.pipe.transform(this.tasksArray['models'],this.searchValue);       
           },
          (error) =>{
             console.log(error)
        }
        );
       // if(next==1) this.router.navigate(["tasks,1"]);
        if(this.pageToken=="end" ) this.ngOnDestroy();
}

onSearch(event){
  this.searchValue = event;
}
scroll = (): void => {
 let scroll_top = $(document).scrollTop();//высота прокрученной области
 let page_height = $(document).height();//высота всей страницы
  let   wind_height = $(window).height();//высота окна браузера
  if(this.pageToken =="end"){window.removeEventListener('scroll', this.scroll, <any>this.eventOptions);return;}

// if(pageYOffset >= (winheight) && this.pageToken!="end" ){
  if(this.pageToken !="end"){
 // if((page_height - scroll_top) < wind_height*2 ){
  if( scroll_top>= (wind_height)*this.numPage-450 ){  
   $(document).scrollTop() >= page_height;
//    alert( 'Текущая прокрутка сверху: ' + window.pageYOffset );
//    alert ("scroll h "+document.body.scrollHeight+ ";Выс прокруч обл "+scroll_top + "Высота браузера" + wind_height);
    if(this.pageToken =="end") {window.removeEventListener('scroll', this.scroll, <any>this.eventOptions);return;}
 
  let but = document.getElementById("next");
  this.numPage = this.numPage +1;
//  this.onNext(); 
  but.click();
  }
 } 

  //handle your scroll here
  //notice the 'odd' function assignment to a class field
  //this is used to be able to remove the event listener
};
ngOnDestroy() {
  window.removeEventListener('scroll', this.scroll, <any>this.eventOptions);
  //unfortunately the compiler doesn't know yet about this object, so cast to any
}
}