import { Component, OnInit, EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.css']
})
export class ActionsComponent implements OnInit {
  mySearch;
  @Output() onSearch = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {
  }
  onEnter(val){
    this.onSearch.emit(val);
  }
}
