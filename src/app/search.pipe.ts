import { Pipe, PipeTransform, Injectable } from '@angular/core';
@Injectable()
@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {


  transform(items: any[], criteria: any): any {
  //  {'searchvalue':searchValue,'showactive':showactive}
   let bOk;
   let bSearch;
    if (items === undefined || items.length === 0 ) { return false; }
    if ( criteria['showactive'] === undefined ) { criteria['showactive'] = 'All'; }
    let status = criteria['showactive'] === 'Active' ? 0 : 1;
    if (criteria['showactive'] === 'All') { status = 2; }
    return items.filter(item => {
    bOk = false; bSearch = false;
     if (criteria === undefined || ((criteria['searchvalue'] === ''
     || criteria['searchvalue'] === undefined) && status === 2)) { return true; }
     if (criteria['searchvalue'] !== undefined && criteria['searchvalue'] !== '') {
   //   for (let key in item) {
  //      if (key == 'TaskName' || key == 'taskName') {
          if (('' + item['TaskName']).toUpperCase().includes(criteria['searchvalue'].toUpperCase())) {
            bSearch = true;
          }
   //     }
   //     }
      }
      if ( status !== 2) {
        if (criteria['searchvalue'] === undefined || criteria['searchvalue'] === '' || bSearch === true) {
        if (item['ActiveStatus'] === true && status === 0  ) { return true; }
        if (item['ActiveStatus'] === false && status === 1) { return true; } else { return false; }
        }
      }
      if (bSearch) { return true; }
      return false;
    });

}
}

