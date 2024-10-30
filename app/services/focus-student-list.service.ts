import {Injectable} from '@angular/core';

import {HttpClient} from '@angular/common/http';

import {DepartmentLists} from '../shared/listing.model';
import {Batches} from '../shared/listing.model';
import {Students} from '../shared/listing.model';


import {Subject, Observable} from 'rxjs';

@Injectable()

export class FocusStudentServ {

  departments: DepartmentLists[] = [];
	batches: Batches[] = [];
  students: Students[] = [];

  selected_batch: any;
  selected_dep: any;

  dep_id: string = "";
  batch_id: string = "";

  update_department_list = new Subject < DepartmentLists[] > ();
  update_batch_list = new Subject < Batches[] > ();
  update_student_list = new Subject < Students[] > ();
  compaign_student_list = new Subject < Students[] > ();


	constructor(private http: HttpClient) {

	}

	  loadTargetDepartment(focus_tab_val: string) {
    this.http
    .get<{message: string, data: DepartmentLists[]}>
      ("http://localhost:2020/educare/get-department?" +
        focus_tab_val)
      .subscribe((target_dep) => {
        console.log(target_dep);
        this.departments = target_dep.data;
        if(this.departments.length !== 0) {
          this.selected_dep = this.departments[0];
          this.dep_id = this.selected_dep._id;
          console.log(this.selected_dep);
        }
        this.update_department_list.next([...this.departments])
      });
  }

  updateTargetDepartment() {
    return this.update_department_list.asObservable();
  }

  loadTargetBatches(dep_id: string, focus_tab_batch: string) {
    this.http
    .get<{message: string, data: Batches[]}>
    ("http://localhost:2020/educare/get-batch?department_id=" +
      dep_id + "&" + focus_tab_batch)
      .subscribe((target_batches) => {
        console.log(target_batches);
        this.batches = target_batches.data;
        if(this.batches.length !== 0) {
          this.selected_batch = this.batches[0];
          this.batch_id = this.selected_batch._id;
          console.log(this.batch_id);
          
        }
        this.update_batch_list.next([...this.batches]);
      });
  }

  updateTargetBatches() {
    return this.update_batch_list.asObservable();
  }

  loadTargetStudent(batch_id: string, focus_tab_dep: string) {
    this.http
    .get<{message: string, data: Students[]}>
    ("http://localhost:2020/educare/get-student?batch_id=" +
      batch_id + "&" + focus_tab_dep)
      .subscribe((target_students) => {
        console.log(target_students);
        this.students = target_students.data;
        this.update_student_list.next([...this.students]);
      });
  }

   updateTargetStudents() {
    return this.update_student_list.asObservable();
  }

  filterCompaignStudents(compaign_id: string) {
    this.http.get<{ message: string, data: Students[] }>("http://localhost:2020/educare/search-student?placement_id=" 
        + compaign_id + "&id=" + this.batch_id
      )
      .subscribe((compaign_students) => {
        this.students = compaign_students.data;
        this.compaign_student_list.next([...this.students]);
      });
  }

  rfilterCompaignStudents() {
    return this.compaign_student_list.asObservable();
  }


}