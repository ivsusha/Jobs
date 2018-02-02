import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService } from '../tasks.service';
import { Response } from '@angular/http';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  private id: string;
  status;
  header: string = "View Task";
  taskArray: {
    'ActiveStatus': string, 'TaskName': string,'ConflictTasks':[""], 'Body': string,'Headers':{}, 'MaxDuration': string, 'Cron': string, 'ScheduledUrl': string
  }[]=[]; 
  //taskArray: { ActiveStatus: string, TaskName: string,Body: string, MaxDuration: string,Cron: string
 //    }[]= [];
 
  constructor(private activateRoute: ActivatedRoute, private tasksService: TasksService, private router: Router) {
    this.activateRoute.params.subscribe(param => this.id = param['id']);
  }

  ngOnInit() {
    this.tasksService.getTaskbyId(this.id).subscribe(
      (response: Response) => {
        this.taskArray = response.json();
  
      },
      (error) => {
        console.log(error)
      }
    );
  }
 
  onEdit(id){
    this.router.navigate(['/edit',id]);
  }
onEditTask(params){
  this.router.navigate(['/taskedit'],{ queryParams: params });
}
onBack(){
  this.router.navigate(['/tasks']);
}
onDelete(id){
  this.tasksService.deleteTask(this.id).subscribe(
    (response: Response) => {
      this.router.navigate(['']);
     
    },
    (error) => {
     console.log(error)
    }
  );
}
onShowStatus(id){
  this.tasksService.getTaskStatus(this.id).subscribe(
    (response: Response) => {
     let status=  response.json();
     
    },
    (error) => {
     console.log(error)
    }
  );
}

}
