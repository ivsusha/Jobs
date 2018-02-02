import { Component, OnInit, NgZone, OnDestroy} from '@angular/core';
import { IMultiSelectOption, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { TasksService } from '../tasks.service';
import { Response } from '@angular/http';
import * as $ from 'jquery';
import { SearchPipe } from '../search.pipe';
@Component({
  selector: 'app-historyfilter',
  templateUrl: './historyfilter.component.html',
  styleUrls: ['./historyfilter.component.css'],
  providers: [SearchPipe]
})
export class HistoryfilterComponent implements OnInit,OnDestroy {
  mySearch: any;
  numPage=1;
  optionsModel: string[];
  myOptions: IMultiSelectOption[] = [];
  myHistory =[];
  id;
  pageToken;
  checkAll;
  mySettings: IMultiSelectSettings = {
    itemClasses:"dropdown-item.active",
   enableSearch: true,  
  checkedStyle: 'fontawesome',
  //  buttonClasses: 'btn btn-default btn-block',
    buttonClasses: 'btn btn-light',
    dynamicTitleMaxItems: 3,
    displayAllSelectedText: true,
    selectionLimit: 1,
  autoUnselect: true,
  closeOnSelect:true
  };
  currPage;   
  body;
  private eventOptions: boolean|{capture?: boolean, passive?: boolean};
  passiveSupported(){};
  constructor(private tasksService: TasksService,private pipe: SearchPipe,private ngZone: NgZone) { }

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
   let tarr =  this.tasksService.getTasksArray();
   tarr["models"].map((v)=> this.myOptions.push({id:v["_id"],name:v["TaskName"] }) ); 
  }
onShow(task){
  if(this.checkAll){
    this.onShowAll();
    return;
  }
  this.id = this.optionsModel[0];
  this.tasksService.getTaskHistorybyID(this.id).subscribe(
    (response:Response) =>{
      this.myHistory = response.json();
      this.pageToken = this.myHistory['pageToken'];
    },
    error=> console.log(error)
  )
  
  }
  onShowAll(){   
    this.tasksService.getTaskAllHistory().subscribe(
      (response:Response) =>{
        this.myHistory = response.json();
        this.pageToken = this.myHistory['pageToken'];
      },
      error=> console.log(error)
    )
    
    }
  onNext(){
    if(this.pageToken == null) {window.removeEventListener('scroll', this.scroll, <any>this.eventOptions);return;}
  //  this.router.navigate(["tasks"]);
  this.tasksService.getTaskHistorybyToken(this.id,this.pageToken ).subscribe(   
           (response:Response)=>{
            let pageArray = response.json();
          //  this.tasksArray['models'].concat(pageArray['models']);
         pageArray['models'].map(entry => this.myHistory['models'].push(entry));
          this.myHistory['pageToken'] = pageArray['pageToken'];
            this.pageToken = pageArray['pageToken'];
            this.mySearch= undefined;
            this.myHistory['models'] = this.pipe.transform(this.myHistory['models'],this.mySearch);
          },
           (error) =>{
             console.log(error)
        }
        ) 
}
scroll = (): void => {
  let scroll_top = $(document).scrollTop();//высота прокрученной области
  let page_height = $(document).height();//высота всей страницы
   let   wind_height = $(window).height();//высота окна браузера
   if(this.pageToken =="end"){window.removeEventListener('scroll', this.scroll, <any>this.eventOptions);return;}
 
 // if(pageYOffset >= (winheight) && this.pageToken!="end" ){
   if(this.pageToken !=null){
  // if((page_height - scroll_top) < wind_height*2 ){
   if( scroll_top>= (wind_height)*this.numPage-450 ){
    // document.body.scrollTop = scroll_top;
    $(document).scrollTop() >= page_height;
 //    alert( 'Текущая прокрутка сверху: ' + window.pageYOffset );
 //    alert ("scroll h "+document.body.scrollHeight+ ";Выс прокруч обл "+scroll_top + "Высота браузера" + wind_height);
     if(this.pageToken == null) {window.removeEventListener('scroll', this.scroll, <any>this.eventOptions);return;}
  // window.removeEventListener('scroll', this.scroll, <any>this.eventOptions);
   let but = document.getElementById("next");
   this.numPage = this.numPage +1;
   //this.onNext(); 
   but.click();
   }
  } 
 
   //handle your scroll here
   //notice the 'odd' function assignment to a class field
   //this is used to be able to remove the event listener
 };
onCheck(){
  if(this.checkAll)this.optionsModel[0]="select";
}
ngOnDestroy() {
  window.removeEventListener('scroll', this.scroll, <any>this.eventOptions);
  //unfortunately the compiler doesn't know yet about this object, so cast to any
}
}

