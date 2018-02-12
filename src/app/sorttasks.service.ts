import { Injectable } from '@angular/core';

@Injectable()
export class SorttasksService { 
  public sortEvent;
  constructor() {
    this.sortEvent=  {sortColumn:'TaskName', sortDirection: ''};
   }
  getResult(tasksArray,criteria: TaskSearchCriteria) {
    if(criteria.sortDirection=== "") return tasksArray['models'];
    return tasksArray['models'].sort((a,b) => {
      if(criteria.sortDirection === 'asc'){
        if( a[criteria.sortColumn] < b[criteria.sortColumn]){
          return -1;
        }
        if( a[criteria.sortColumn] > b[criteria.sortColumn]){
          return 1;
        }
        else return 0;
      //  return a[criteria.sortColumn] < b[criteria.sortColumn];
      }
      else {
        if( a[criteria.sortColumn] < b[criteria.sortColumn]){
          return 1;
        }
        if( a[criteria.sortColumn] > b[criteria.sortColumn]){
          return -1;
        }
        else return 0;
     //   return a[criteria.sortColumn] > b[criteria.sortColumn];
      }
    });
}
}
export class Task {
   taskname: string;
  status: string;
}

export class TaskSearchCriteria {
  sortColumn: string;
  sortDirection: string;
}