import { Injectable, Input } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TasksService {
 tasksArray:{"models":[ {
  "Body": "string",
  "ConflictTasks": [
    "string"
  ],
  "Cron": "0 * * * * ?",
  "Headers": {},
  "MaxDuration": 15,
  "ScheduledUrl": "string",
  "TaskName": "string",
  "_id": "string",
  "_rev": "string"
}],'pageToken':string}[]=[] ;

pageToken;
pageTokenPrev;
header;
  constructor(private http: Http ) { }
  getTasks(pattern) {

        const headers = new Headers({
      'Content-Type': 'application/json;charset=UTF-8'   
      }); 
   if(pattern == null) return (this.http.get('https://ldd-scheduler-test.mybluemix.net/api/scheduler/tasks', { headers: headers }));  
    return (this.http.get('https://ldd-scheduler-test.mybluemix.net/api/scheduler/tasks/'+pattern, { headers: headers }));
  }
  getNextTasks(pattern) {
    const headers = new Headers({
  'Content-Type': 'application/json;charset=UTF-8'   
  });
 return (this.http.get('https://ldd-scheduler-test.mybluemix.net/api/scheduler/tasks/'+pattern, { headers: headers }));  
}
getTaskbyId(id: string ){
  if(id == null) return;
  const headers = new Headers({
    'Accept': 'application/json;charset=UTF-8'   
    });
    return (this.http.get('https://ldd-scheduler-test.mybluemix.net/api/scheduler/task/'+id, { headers: headers })); 
}
submitTaskbyId(id: string ){
  const headers = new Headers({
    'Accept': 'application/json;charset=UTF-8'   
    });
    return (this.http.get('https://ldd-scheduler-test.mybluemix.net/api/scheduler/task/submit/'+id, { headers: headers })); 
}
saveTask(body,id,rev) { 
 // const headers = new Headers({ 'Access': 'application/json;charset=utf-8'});
 const headers = new Headers();
//  const headers = new Headers([{ 'Content-Type': 'application/json'}]);
  headers.append('Content-Type', 'application/json;charset=utf-8');
 const params = JSON.stringify(body);
//const params = body;
//  return (this.http.put('http://172.20.3.88:8080/api/scheduler/task/update/'+id +'/'+rev , params, { headers: headers }));
if(body['_id'] == undefined) return (this.http.post('https://ldd-scheduler-test.mybluemix.net/api/scheduler/task/create', params, { headers: headers }));
return (this.http.put('https://ldd-scheduler-test.mybluemix.net/api/scheduler/task/update/'+id +'/'+rev , params, { headers: headers }));

}
createTask(body){
  const headers = new Headers();
//  const headers = new Headers([{ 'Content-Type': 'application/json'}]);
  headers.append('Content-Type', 'application/json;charset=utf-8');
 const params = JSON.stringify(body);

return (this.http.put('https://ldd-scheduler-test.mybluemix.net/api/scheduler/task/create', params, { headers: headers }));
}
getTasksArray(){return this.tasksArray};
//setTasksArray(pageArray){ 
 // this.pageToken = pageArray['pageToken'];
//  if(this.pageToken== null) this.pageToken= "end";

//    if(this.tasksArray['models'] == undefined)this.tasksArray['models']=[];
//  pageArray.models.map(
///    (item)=>{this.tasksArray['models'].push(item)}

//  ) 

 // this.tasksArray['pageToken'] = this.pageToken;

//}
setTasksArray(tasksArray){
  this.tasksArray = tasksArray;
}
deleteTask(id){
  const headers = new Headers();
  headers.append('Content-Type', '*/*');
  return (this.http.delete('https://ldd-scheduler-test.mybluemix.net/api/scheduler/task/delete/'+id, { headers: headers })); 
}
getTaskStatus(id){
  const headers = new Headers();
  headers.append('Content-Type', '*/*');
  return (this.http.get('https://ldd-scheduler-test.mybluemix.net/api/scheduler/task/status/'+id, { headers: headers })); 
}
runTask(id){
  const headers = new Headers();
  headers.append('Content-Type', '*/*');
  return (this.http.get('https://ldd-scheduler-test.mybluemix.net/api/scheduler/task/run/'+id, { headers: headers })); 
}
getTaskHistorybyID(id){
  const headers = new Headers();
  headers.append('Content-Type', '*/*');
  return (this.http.get('https://ldd-scheduler-test.mybluemix.net/api/scheduler/history/task/'+id, { headers: headers })); 
}
getTaskHistorybyToken(id,token){
  if(token == null) return;
  const headers = new Headers();
  headers.append('Content-Type', '*/*');
  return (this.http.get('https://ldd-scheduler-test.mybluemix.net/api/scheduler/history/task/'+id +"/"+token, { headers: headers })); 
}
getTaskAllHistory(){
  const headers = new Headers();
  headers.append('Content-Type', '*/*');
  return (this.http.get('https://ldd-scheduler-test.mybluemix.net/api/scheduler/histories', { headers: headers })); 
}
getCurrPage(){
  return this.pageToken;
}
getHeader(){
  return this.header;
}
setHeader(header){
  this.header = header;
}
}
