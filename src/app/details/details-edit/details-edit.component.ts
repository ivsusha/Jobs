import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TasksService } from '../../tasks.service';
import { Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import {NgForm } from '@angular/forms';
import { NgModel } from '@angular/forms/src/directives/ng_model';

//import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-details-edit',
  templateUrl: './details-edit.component.html',
  styleUrls: ['./details-edit.component.css'],
  
})
export class DetailsEditComponent implements OnInit {

  private id: string;
  header: string = "Edit Task";
  Admin: string = "Administration"; 
  Views: string = "Tasks";
  Details: string = "View Task";
  Task: string = "active";
  isActive;
  ValidUrl:boolean = true;
  CronValidalid: boolean = true;
  MaxDur: boolean = true;
  taskArray: {
    'ActiveStatus': string, 'TaskName': string,'ConflictTasks':[""], 'Body': string,'Headers':{}, 'MaxDuration': string, 'Cron': string, 'ScheduledUrl': string
  }=
  { 'ActiveStatus':"false", 'TaskName': "",'ConflictTasks':[""], 'Body': "",'Headers':{}, 'MaxDuration': "", 'Cron': "", 'ScheduledUrl': ""};

// @ViewChild('cron') 
//	private cron : NgModel;
   
  constructor(private activateRoute: ActivatedRoute, private tasksService: TasksService,  private router: Router) {
   // this.activateRoute.params.subscribe(params => this.id = params['id']);
 //  this.activateRoute.params.subscribe(params => this.taskArray = params['params']);
// this.activateRoute.queryParams.subscribe(params => this.setTaskArray(params));
this.activateRoute.params.subscribe(param => this.id = param['id']);
 
  }

  ngOnInit() {
    if(this.id == undefined) return;
    this.tasksService.setHeader("Edit Task");
    this.tasksService.getTaskbyId(this.id).subscribe(
      (response: Response) => {
        this.taskArray = response.json();
        if(this.taskArray["ActiveStatus"] ) this.isActive = "Active"
        else this.isActive = "Inactive"
      },
      (error) => {
       console.log(error)
      }
    );

  }
  setTaskArray(params){      
    this.taskArray = params;       
  //  this.taskArray['TaskName']= params['TaskName'];
  //  this.taskArray['Body']= params['Body'];
  //  this.taskArray['ScheduledUrl']= params['ScheduledUrl'];

  }
 
  
  onUpdate(){
   if(this.isCorrectUrl()== false)  return;
  if(this.taskArray["TaskName"].trim() =="") return;
  if(this.taskArray["Cron"].trim() =="") return;
  if (this.CheckCron()== false) return; 
 
    this.tasksService.saveTask(this.taskArray,this.taskArray['_id'],this.taskArray['_rev']).subscribe(
      (response: Response) => {
        this.router.navigate(['details', this.taskArray['_id']]);
        // response.json();
       // console.log(response);
     },
     (error) => {
       console.log(error)
     }
    );
  }
  isCorrectUrl():boolean{
    const url_s = this.taskArray["ScheduledUrl"];
     if(url_s == undefined )  {this.ValidUrl = false; return this.ValidUrl};
    if((url_s.indexOf("http://") == -1 && url_s.indexOf("https://") == -1) ||  url_s.indexOf(".") == -1){
   //   this.elDiv.nativeElement.style.display = 'block';	
    
      this.ValidUrl = false;
    } 
    else{ 
      
     this.ValidUrl = true;} 
    return this.ValidUrl;
  }
  onChangeStatus(){
    if(this.isActive=="Active" ) this.isActive ="Inactive"
    else this.isActive ="Active"
  }
  CheckCron(){
    if(this.taskArray["Cron"] == "") return true;
    let obj = this.taskArray["Cron"].split(" ");
    let ind = 0;
     obj.map((v) =>{if(v.trim()!="") ind +=1;} ) 
     if (ind != 6) return false;
     else return true;   
  }
  CheckDuration(){
   // if ((this.taskArray["MaxDuration"]).length() == 0) return false;
    if(parseInt(this.taskArray["MaxDuration"])<=14) return false;
    else return true
  }
  onCancel(id){
    if(id==undefined) return this.router.navigate(['/tasks'])
    else return this.router.navigate(['details', id])
  }
  onSubmit(id){
    this.tasksService.submitTaskbyId(this.id).subscribe(
      (response: Response) => {
        this.router.navigate(['']);
       
      },
      (error) => {
       console.log(error)
      }
    );
  }
  onRun(id){
    this.tasksService.runTask(this.id).subscribe(
      (response: Response) => {
        this.router.navigate(['']);
       
      },
      (error) => {
       console.log(error)
      }
    );
  }
  }

 