import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderby'
})
export class OrderbyPipe implements PipeTransform {

  transform(records: any, args?: any): any {
    if(args.property==undefined) return true;
    return records.sort(function(a, b){
      if(a[args.property] < b[args.property]){
          return -1;
      }
      else if( a[args.property] > b[args.property]){
          return  1;
      }
      else{
           return 0; 
      }
  });
  }

}
