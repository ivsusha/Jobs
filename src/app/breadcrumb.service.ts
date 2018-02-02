export class BreadCrumbService {
    brArray: {Administration:string}[] =[];
    getForEditTask(){
       this.brArray['Administration']= '#';
       this.brArray['Tasks']= '#';
       this.brArray['ViewTask']= '#';
       return this.brArray;
    }
  }