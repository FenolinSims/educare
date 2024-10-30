import { Component, OnInit } from '@angular/core';

import {HttpClient} from '@angular/common/http';

import {DepartmentLists} from '../shared/listing.model';
import {Batches} from '../shared/listing.model';
import {Students} from '../shared/listing.model';

import {FocusStudentServ} from '../services/focus-student-list.service';

import { StudentsListObj } from '../services/students-list.service';

import { FilterServ } from '../services/filter.service';

import {NgForm} from '@angular/forms';

import {Subscription} from 'rxjs';

@Component({
  selector: 'app-focus-students',
  templateUrl: './focus-students.component.html',
  styleUrls: ['./focus-students.component.scss',
              '../students/students.component.scss',
              '../placement-listing/placement-listing.component.scss'
  ]
})
export class FocusStudentsComponent implements OnInit {

  departments: DepartmentLists[] = [];
  batches: Batches[] = [];
  students: Students[] = [];

  batch_sel: boolean = true;
  dep_sel: boolean = true;

  batch_id: string = "";

  selected_batch: any;
  selected_dep: any;
  selected_student: any;

  dep_Subj: Subscription;
  batch_Subj: Subscription;
  stud_Subj: Subscription;
  compaign_filter_Subj: Subscription;

  dep_id: string = "";

  focus_tab_dep: string = "focus_student_placement=1";
  focus_tab_batch: string = "focus_student=2";

  mass_transfer_data: any;

  sh_confirm_pop: boolean = false;
  sh_filter_pop: boolean = false;

  page_text: string = "";

  filter: boolean = false;

  constructor(private http: HttpClient,
              private focusStudObj: FocusStudentServ,
              private studentService: StudentsListObj,
              private filterService: FilterServ
    ) { }

  ngOnInit(){

    this.page_text = "Batch";

    this.selected_dep = {
      "department_name": "",
      "_id": ""
    }

    this.selected_batch = {
      "batch": "",
      "year": "",
      "_id": ""
    }

    this.selected_student = {
          "name": "",
          "age": null,
          "dob": "",
          "gender": null,
          "front_end_gender": "",
          "roll_no": "",
          "percentage": {
            "ten": null,
            "twelve": null,
            "ug": null,
            "pg": null,
            "diploma": null
          },
          "mobile": null,
          "alternate_mobile": null,
          "email": "",
          "batch_id": ""

        }

    this.focusStudObj.loadTargetDepartment(this.focus_tab_dep);
    this.dep_Subj = this.focusStudObj.updateTargetDepartment()
      .subscribe((got_dep) => {
        this.departments = got_dep;
          console.log(this.departments);

        if(this.departments.length != 0) {
          this.selected_dep = this.departments[0];
          this.dep_id = this.selected_dep._id;

              if(this.dep_id != "") {

                  this.focusStudObj.loadTargetBatches(this.dep_id, this.focus_tab_batch);

                    this.batch_Subj = this.focusStudObj.updateTargetBatches()
                      .subscribe((got_batches) =>{
                          this.batches = got_batches;
                          if(this.batches.length !== 0) {
                          this.selected_batch = this.batches[0];
                          this.batch_id = this.selected_batch._id;
                          console.log(this.selected_batch);

                            if(this.batch_id != ""){
                                this.focusStudObj.loadTargetStudent(this.batch_id, this.focus_tab_dep);
                            }

                              this.stud_Subj = this.focusStudObj.updateTargetStudents()
                                .subscribe((got_students) =>{
                                this.students = got_students;
                                this.selected_student = got_students[0];
                            });
                     }
                  });
              }

                 

        }

      });
       
  }

    shMConfirmPop() {
    this.filterService.popupConfirmCall(this.sh_confirm_pop);
    this.sh_confirm_pop = true;
  }

    closeConfirmPop() {

    if (this.sh_confirm_pop == false) {
      this.sh_confirm_pop = true;
    } else {
      this.sh_confirm_pop = false;
    }

  }

  selectBatch() {
    if(this.batch_sel == false) {
      this.batch_sel = true;
    }
    else {
      this.batch_sel = false;
    }
  }

  selectDep() {
    if(this.dep_sel == false) {
      this.dep_sel = true;
    }
    else {
      this.dep_sel = false;
    }
  }

  shFilterPop() {
      if(this.sh_filter_pop == false) {
      this.sh_filter_pop = true;
    }
    else {
      this.sh_filter_pop = false;
    }
  }

  loadDepartmentStud(event: Event) {
     this.dep_id = ((event.currentTarget) as HTMLElement).id;

     for(let i=0; i< (this.departments.length); i++) {

    if(this.dep_id == (this.departments[i]._id)) {
        this.selected_dep = this.departments[i];
      
      }
    }

     if(this.dep_id != ""){
          console.log(this.dep_id);
            this.focusStudObj.loadTargetBatches(this.dep_id, this.focus_tab_dep);
        }
       this.batch_Subj = this.focusStudObj.updateTargetBatches()
            .subscribe((got_batches) =>{
                this.batches = got_batches;
        });

  }

  loadBatchStud(event: Event) {
     this.batch_id = ((event.currentTarget) as HTMLElement).id;

    for(let i=0; i< (this.batches.length); i++) {

    if(this.batch_id == (this.batches[i]._id)) {
        this.selected_batch = this.batches[i];
      
      }
    }
     if(this.batch_id != ""){
                    console.log(this.batch_id);
                      this.focusStudObj.loadTargetStudent(this.batch_id, this.focus_tab_dep);
                  }

                    this.stud_Subj = this.focusStudObj.updateTargetStudents()
                      .subscribe((got_students) =>{
                      this.students = got_students;
                      console.log(this.students);   

                  });
    
  };

  filterCompaignCall(form: NgForm) {
    this.focusStudObj.filterCompaignStudents(form.value.compaign_id);
    this.compaign_filter_Subj = this.focusStudObj.rfilterCompaignStudents()
      .subscribe((compaign_filter) => {
        console.log(compaign_filter);
        this.students = compaign_filter;
      });
  }

  changeIPfocus(event: Event) {
    let focus_tab_val = ((event.currentTarget) as HTMLElement).id;
    if(focus_tab_val == "placement") {
      this.focus_tab_dep = "focus_student_placement=1";
      this.focus_tab_batch = "focus_student=2";

            this.focusStudObj.loadTargetDepartment(this.focus_tab_dep);
          this.dep_Subj = this.focusStudObj.updateTargetDepartment()
            .subscribe((got_dep) => {
            this.departments = got_dep;

        if(this.departments.length != 0) {
          
          this.selected_dep = this.departments[0];
          this.dep_id = this.selected_dep._id;

              if(this.dep_id != "") {
                  console.log(this.dep_id);
                  this.focusStudObj.loadTargetBatches(this.dep_id, this.focus_tab_batch);
              }

              this.batch_Subj = this.focusStudObj.updateTargetBatches()
                .subscribe((got_batches) =>{
                  this.batches = got_batches;
                  if(this.batches.length !== 0) {
                  this.selected_batch = this.batches[0];
                  
                  this.batch_id = this.selected_batch._id;
                  console.log(this.batch_id);
                }
                });

                    if(this.batch_id != ""){
                    console.log(this.batch_id);
                      this.focusStudObj.loadTargetStudent(this.batch_id, this.focus_tab_dep);
                  }

                    this.stud_Subj = this.focusStudObj.updateTargetStudents()
                      .subscribe((got_students) =>{
                      this.students = got_students;
                      console.log(this.students);   

                  });

        }

       });
   

    }
    else if(focus_tab_val == "internship") {
      this.focus_tab_dep = "focus_student_intern=1";
      this.focus_tab_batch = "focus_student=1";

          this.focusStudObj.loadTargetDepartment(this.focus_tab_dep);
    this.dep_Subj = this.focusStudObj.updateTargetDepartment()
      .subscribe((got_dep) => {
        this.departments = got_dep;

        if(this.departments.length != 0) {
          
          this.selected_dep = this.departments[0];
          this.dep_id = this.selected_dep._id;
          console.log(this.dep_id);

              if(this.dep_id != "") {
                  console.log(this.dep_id);
                  this.focusStudObj.loadTargetBatches(this.dep_id, this.focus_tab_batch);
              }

              this.batch_Subj = this.focusStudObj.updateTargetBatches()
                .subscribe((got_batches) =>{
                  this.batches = got_batches;
                  if(this.batches.length !== 0) {
                  this.selected_batch = this.batches[0];
                  this.batch_id = this.selected_batch._id;
                  console.log(this.batch_id);
                }
                });

                    if(this.batch_id != ""){
                    console.log(this.batch_id);
                      this.focusStudObj.loadTargetStudent(this.batch_id, this.focus_tab_dep);
                  }

                    this.stud_Subj = this.focusStudObj.updateTargetStudents()
                      .subscribe((got_students) =>{
                      this.students = got_students;
                      this.selected_student = got_students[0];
                      console.log(this.students);   

                  });

        }

      });
   
    }
    
  }

    massTransferBatchDel() {
      let mt_field_value = 0;
      let mt_field = "normal";
      this.mass_transfer_data = {
        "field": mt_field,
        "field_value": mt_field_value
      }
      console.log(this.selected_batch._id);
      console.log(this.mass_transfer_data);

      this.studentService.massTransferBatch(this.selected_batch._id, this.mass_transfer_data);
      
    };

    exportFocusStudents() {
      this.studentService.downloadCsvStudent(this.students, "Focus Students");
    }


}
