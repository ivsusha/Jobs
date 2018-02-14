import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'findhistory'
})
export class FindhistoryPipe implements PipeTransform {

  transform(items: any, criteria?: any): any {
   // tname':tname,'sdate':sdate,'edate':edate,'body':body,'status':status,'dur':dur
    if (items === undefined) { return false; }
    let bOk = false;
    return items.filter(item => {
       bOk = false;
     if (criteria === undefined  || criteria === '') { return true; }
      // tslint:disable-next-line:prefer-const
      for (let key in item) {
        if (key === 'taskName') {
        if (criteria.tname !== undefined) {
          if (criteria.tname === '') { bOk = true; } else if (('' + item[key]).includes(criteria.tname)) { bOk =
            true; } else { return false; }
        }
      } else if ( key === 'StartDate') {
        if ( criteria.sdate !== undefined) {
          if ( criteria.sdate === '') { bOk = true; }else if (('' + item[key]) >=
           (criteria.sdate)) { bOk = true; } else { return false; }
        }
 if (criteria.edate !== undefined) {
          if ( criteria.edate === '') {bOk = true; }   else if (('' + item[key]) <=
           (criteria.edate + 'T24:00:00')) { bOk = true; } else {return false; }
      }
    } else if ( key === 'ResponseBody') {
        if ( criteria.body !== undefined) {
          if (criteria.body === '') { bOk = true; } else if (('' + item[key]).includes(criteria.body)) { bOk
             = true; } else { return false; }
        }
      } else if (key === 'Duration') {
        if ( criteria.dur !== undefined) {
          if (('' + item[key]).includes(criteria.dur)) { bOk = true; }   else { return false; }
        }
      }      else if ( key === 'ResponseStatus') {
        if (criteria.status !== undefined) {
          if (('' + item[key]).includes(criteria.status)) { bOk = true; }    else { return false; }
        }
      }

      }
      if (bOk === true) { return true; } else { return false; }
    });
  }

}
