import { SecondsComponent } from './cron/seconds/seconds.component';
import { MonthsComponent } from './cron/months/months.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import { AppComponent } from './app.component';
import { TasksService } from './tasks.service';
import { TasksComponent } from './tasks/tasks.component';
import { HttpModule } from '@angular/http';
import { ActionsComponent } from './actions/actions.component';
import { DetailsComponent } from './details/details.component';
import { DetailsEditComponent } from './details/details-edit/details-edit.component';
import { TaskHeaderComponent } from './task-header/task-header.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { SearchPipe } from './search.pipe';
import {NgForm } from '@angular/forms';
import { HistoryComponent } from './history/history.component';
import { HistoryfilterComponent } from './historyfilter/historyfilter.component';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { OrderbyPipe } from './orderby.pipe';
import { SortablecolumnComponent } from './sortablecolumn/sortablecolumn.component';
import { SortService } from './sort.service';
import { SortableTableDirective } from './sortable-table.directive';
import { SorttasksService } from './sorttasks.service';
import { FindhistoryPipe } from './findhistory.pipe';
import { FooterComponent } from './footer/footer.component';
import { CronComponent } from './cron/cron.component';
import { DaysComponent } from './cron/days/days.component';
import { MinutesComponent } from './cron/minutes/minutes.component';
import { HoursComponent } from './cron/hours/hours.component';
// import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

export const appRoutes: Routes = [
  { path: '', component: AppComponent},
  { path: 'tasks', component: TasksComponent},
  { path: 'history', component: HistoryfilterComponent},
  {path: 'history/:id', component: HistoryComponent},
  { path: 'tasks/:token', component: TasksComponent},
  {path: 'details/:id', component: DetailsComponent},
  {path: 'tasks/details/:id', component: DetailsComponent},
  {path: 'taskedit', component: DetailsEditComponent},
  {path: 'edit/:id', component: DetailsEditComponent},
  {path: 'new', component: DetailsEditComponent},
  { path: '**', redirectTo: '/'}
];

@NgModule({
  declarations: [
    AppComponent,
    TasksComponent,
    ActionsComponent,
    DetailsComponent,
    DetailsEditComponent,
    TaskHeaderComponent,
    BreadcrumbComponent,
    SearchPipe,
    HistoryComponent,
    HistoryfilterComponent,
    OrderbyPipe,
    SortablecolumnComponent,
    SortableTableDirective,
    FindhistoryPipe,
    FooterComponent,
    CronComponent,
    DaysComponent,
    MonthsComponent,
    SecondsComponent,
    MinutesComponent,
    HoursComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MultiselectDropdownModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [TasksService, SortService, SorttasksService],
  bootstrap: [AppComponent]
})
export class AppModule { }
