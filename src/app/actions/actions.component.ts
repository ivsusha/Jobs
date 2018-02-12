import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.css']
})
export class ActionsComponent implements OnInit {
  mySearch;
  @Output() onSearch = new EventEmitter<string>();
  constructor( private router: Router) { }

  ngOnInit() {
  }
  onEnter(val){
    this.onSearch.emit(val);
  }
  addNew(){
    this.router.navigate(["/new"]);
  }
}
