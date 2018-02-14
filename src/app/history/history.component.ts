import { Component, OnInit } from '@angular/core';
import { TasksService } from '../tasks.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
id;
historyArray;
  constructor(private activateRoute: ActivatedRoute, private router: Router,  private tasksService: TasksService ) {
    this.activateRoute.params.subscribe(param => this.id = param['id']);
   }

  ngOnInit() {
    this.tasksService.header = 'View History';
    this.tasksService.getHistorybyId(this.id).subscribe(
      (response: Response) => {
        this.historyArray = response.json();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  onBack() {
    this.router.navigate(['/history']);
  }
}
