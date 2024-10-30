import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router'

import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';

import { FilterServ } from './services/filter.service';
import { PlacementListObj } from './services/placements-list.service';
import { CompanyListsObj } from './services/company-list.service';
import {DepartmentList} from './services/department-list.service';
import { StudentsListObj } from './services/students-list.service';
import { FocusStudentServ } from './services/focus-student-list.service';

import { NgxSliderModule } from '@angular-slider/ngx-slider';

import { HttpClientModule } from '@angular/common/http';



import { AppComponent } from './app.component';
import { PlacementListingComponent } from './placement-listing/placement-listing.component';
import { HeaderComponent } from './header/header.component';
import { FilterComponent } from './filter/filter.component';
import { SelectBoxComponent } from './select-box/select-box.component';
import { DepartmentComponent } from './department/department.component';
import { CompanyListingComponent } from './company-listing/company-listing.component';
import { StudentsComponent } from './students/students.component';
import { FocusStudentsComponent } from './focus-students/focus-students.component';
import { SelectedStudentsComponent } from './selected-students/selected-students.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';


import { PlSidebarComponent } from './pl-sidebar/pl-sidebar.component';
import { FilterSearchPipe } from './filter-search.pipe';
import { PlacementSearchPipe } from './placement-search.pipe';


import { MaterialModule } from './material.module';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateFormatDirective } from './format-datepicker.directive';
import { TooltipDirective } from './directives/tooltip/tooltip.directive';
import { yearDatePicker } from './directives/datepicker-year/datepicker-year.directive';



const routes: Routes = [
{
  path: '',
  redirectTo: 'admin-login',
  pathMatch: 'full'
},
{
  path: 'placement',
  component: PlacementListingComponent,
  data: {title: 'Placement', filter: false, add_rec: false, side_bar: false, head_search: false}
},
{
  path: 'company',
  component: CompanyListingComponent,
  data: {title: 'Company', filter: true, add_rec: false, side_bar: false, head_search: false}
},
{
  path: 'department',
  component: DepartmentComponent,
  data: {title: 'Departments', filter: true, add_rec: false, side_bar: false, head_search: true}
},
{
  path: ':dep_id/students',
  component: StudentsComponent,
  data: {title: 'Students', filter: true, add_rec: true,  side_bar: false, head_search: true}
},
{
  path: 'focus-students',
  component: FocusStudentsComponent,
  data: {title: 'Focus Students', filter: true, add_rec: true, side_bar: false, head_search: true}
},
{
  path:'placement-report',
  component: SelectedStudentsComponent,
  data: {title: 'Placement Reports', filter: true, add_rec: false, side_bar: false, head_search: true}
},
{
  path: 'admin-login',
  component: AdminLoginComponent,
  data: {title: 'Admin Login', filter: true, add_rec: false, side_bar: true, 
  outlet: 'admin_login'}
}



];

export const APP_DATE_FORMATS = {
  parse: {
    dateInput: ['yyyy-MM-DD'],
  },
  display: {
    dateInput: 'yyyy-MM-DD',
    monthYearLabel: 'MMMM DD yyyy',
    dateA11yLabel: 'yyyy-MM-DD',
    monthYearA11yLabel: 'yyyy-MM-DD', 
  }
};



@NgModule({
  declarations: [
    AppComponent,
    PlacementListingComponent,
    HeaderComponent,
    FilterComponent,
    SelectBoxComponent,
    CompanyListingComponent,
    StudentsComponent,
    PlSidebarComponent,
    FilterSearchPipe,
    PlacementSearchPipe,
    DateFormatDirective,
    DepartmentComponent,
    TooltipDirective,
    yearDatePicker,
    FocusStudentsComponent,
    SelectedStudentsComponent,
    AdminLoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    NgxSliderModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule,
    TooltipDirective
  ],
  providers: [
    FilterServ,
    PlacementListObj,
    CompanyListsObj,
    DepartmentList,
    StudentsListObj,
    FocusStudentServ,
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [
        MAT_DATE_LOCALE,
        MAT_MOMENT_DATE_ADAPTER_OPTIONS
      ]},
    {provide: MAT_DATE_FORMATS, useValue: 
         APP_DATE_FORMATS 
    },
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
