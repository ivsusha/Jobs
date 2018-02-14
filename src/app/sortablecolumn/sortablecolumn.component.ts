import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { SortService } from '../sort.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[sortable-column]',
  templateUrl: './sortablecolumn.component.html',
  styleUrls: ['./sortablecolumn.component.css']
})
export class SortablecolumnComponent implements OnInit {
  private columnSortedSubscription: Subscription;
  constructor(private sortService: SortService) { }

  // tslint:disable-next-line:no-input-rename
  @Input('sortable-column')
  columnName: string;

  // tslint:disable-next-line:no-input-rename
  @Input('sort-direction')
  sortDirection = '';

  @HostListener('click')
  sort() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortService.columnSorted({ sortColumn: this.columnName, sortDirection: this.sortDirection });
  }

  ngOnInit() {
    // subscribe to sort changes so we can react when other columns are sorted
    this.columnSortedSubscription = this.sortService.columnSorted$.subscribe(event => {
      // reset this column's sort direction to hide the sort icons
      if (this.columnName !== event.sortColumn) {
        this.sortDirection = '';
      }
    });
  }

}
