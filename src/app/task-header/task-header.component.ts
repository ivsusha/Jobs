import { Component, OnInit, Input } from '@angular/core';
import { TasksService } from '../tasks.service';


@Component({
  selector: 'app-task-header',
  templateUrl: './task-header.component.html',
  styleUrls: ['./task-header.component.css']
})
export class TaskHeaderComponent implements OnInit {
  
@Input() myHeader: string;
  constructor(private tasksService: TasksService) { }

  ngOnInit() {   
  
  }

}
