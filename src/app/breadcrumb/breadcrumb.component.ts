import { Component, OnInit, Input } from '@angular/core';
import { StringifyOptions } from 'querystring';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
 @Input() Admin:string;
 @Input() Views:string;
 @Input() Details:string;
 @Input() Task:string;
  constructor() {}
  
  ngOnInit() {
  }

}
