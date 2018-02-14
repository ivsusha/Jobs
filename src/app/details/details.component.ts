import { Component, ViewChild, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService } from '../tasks.service';
import { Response } from '@angular/http';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit, AfterViewInit {
  private id: string;
  status;
  header  = 'View Task';
  taskArray: {
    'ActiveStatus': string, 'TaskName': string, 'ConflictTasks': [''], 'Body': string,
    'Headers': {}, 'MaxDuration': string, 'Cron': string, 'ScheduledUrl': string
  }[]= [];
  // taskArray: { ActiveStatus: string, TaskName: string,Body: string, MaxDuration: string,Cron: string
 //    }[]= [];
 @ViewChild('err') err: ElementRef;
  constructor(private activateRoute: ActivatedRoute, private tasksService: TasksService, private router: Router) {
    this.activateRoute.params.subscribe(param => this.id = param['id']);
  }

  ngOnInit() {
    this.tasksService.header = 'View Task';
    this.tasksService.getTaskbyId(this.id).subscribe(
      (response: Response) => {
        this.taskArray = response.json();
      },
      (error) => {
        console.log(error);
      }
    );
  }
 ngAfterViewInit() {
  this.tasksService.getTaskStatus(this.id).subscribe(
    (response: Response) => {
      this.status = response.json();

    },
    (error) => {
      console.log(error);
    }
  );
 }
  onEdit(id) {
    this.router.navigate(['/edit', id]);
  }
onEditTask(params) {
  this.router.navigate(['/taskedit'], { queryParams: params });
}
updateArray(response: Response) {

  let alltasks = [];
  this.taskArray =  response.json();
 // if(response['_body']!="")  this.taskArray['_rev']= ver['_body'];
  alltasks = this.tasksService.getTasksArray();
  alltasks['models'].filter((entry, ind) => {
    if ( entry['_id'] === this.taskArray['_id']) {alltasks['models'][ind] = this.taskArray; }
  });
  this.tasksService.setTasksArray(alltasks);
}
onSubmit() {
  this.tasksService.submitTaskbyId(this.id).subscribe(
    (response: Response) => {
 //     this.updateArray(response);
      this.router.navigate(['']);

    },
    (error) => {
     console.log(error);
     this.err.nativeElement.innerHTML = '<p style = "color:red">' + error + '</p>';
    }
  );
}
onRun(id) {
  this.tasksService.runTask(this.id).subscribe(
    (response: Response) => {
    //  this.updateArray(response);
      this.router.navigate(['']);
    },
    (error) => {
     console.log(error);
     this.err.nativeElement.innerHTML = '<p style = "color:red">' + error + '</p>';
    }
  );
}
onDisable(id) {
  this.tasksService.disableTask(this.id).subscribe(
    (response: Response) => {
    //  this.updateArray(response);
      this.router.navigate(['']);
    },
    (error) => {
     console.log(error);
     this.err.nativeElement.innerHTML = '<p style = "color:red">' + error + '</p>';
   //  document.getElementById('debug').innerHTML = '<p style = "color:red">' + error + '</p>';
    }
  );
}


onBack() {
  this.router.navigate(['/tasks']);
}
onDelete(id) {
  this.tasksService.deleteTask(this.id).subscribe(
    (response: Response) => {
      this.router.navigate(['']);
    },
    (error) => {
     console.log(error);
     this.err.nativeElement.innerHTML = '<p style = "color:red">' + error + '</p>';
    }
  );
}
onShowStatus(id) {
  this.tasksService.getTaskStatus(this.id).subscribe(
    (response: Response) => {
     this.status =  response.json();
    },
    (error) => {
     console.log(error);
    }
  );
}

}
