import { Pipe, PipeTransform, Injectable } from '@angular/core';
@Injectable()
@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {


  transform(items: any[], criteria: any): any { 
    if(items==undefined) return false;  
    return items.filter(item => {
    
     if (criteria == undefined || criteria == "") return true;
      // tslint:disable-next-line:prefer-const
      for (let key in item) {
     //   if (key == 'TaskName' || key == 'taskName') {
          if (('' + item[key]).toUpperCase().includes(criteria.toUpperCase())) {
            return true;
          }
     //   }
      }
      return false;
    });
  }
}


