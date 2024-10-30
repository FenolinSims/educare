import { Component, OnInit } from '@angular/core';

import { FilterServ } from '../services/filter.service';
import { StudentsListObj } from '../services/students-list.service';

import {Batches} from '../shared/listing.model';
import {Students} from '../shared/listing.model';

import {NgForm, FormBuilder, FormGroup, FormControl} from '@angular/forms';

import {DepartmentList} from '../services/department-list.service';
import {DepartmentLists} from '../shared/listing.model';

import { DateFormatDirective } from '../format-datepicker.directive';

import { Moment } from 'moment';
import moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';

import {Subscription, Observable} from 'rxjs';
import { ActivatedRoute, Data } from '@angular/router';

import { HttpClient, HttpHeaders, HttpEventType, HttpEvent } from '@angular/common/http';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss',
              '../placement-listing/placement-listing.component.scss'
    ]
})
export class StudentsComponent implements OnInit {
  private API_BASE_URL = environment.API_BASE_URL;

  sh_popup: boolean = false;
  sh_confirm_pop: boolean = false;
  sh_focus_pop: boolean = false;
  sh_batch_pop: boolean = false;
  sh_student_pop: boolean = false;
  sh_sort_student: boolean = true;

  isEditBatch: boolean = false;

  isAddRecordBtn: boolean = true;
  isSingleDelBtn: boolean = true;
  isStudMultiDelBtn: boolean = false;
  isAddRecBatch: boolean = true;
  batch_sel: boolean = true;
  isAddRecStud: boolean = true;

  isBatchDel: boolean = false;
  isAddFocus: boolean = false;

  gender_sel: boolean = true;

  dep_lists: DepartmentLists[] = [];
  batches: Batches[] = [];
  students: Students[] = [];

  batch: string = "";
  year: string = "2022";
  batch_id: string = "";
  batch_year_dp: string;
  output_year_format: 'YYYY';
  outputDateFormat = 'yyyy-MM-DD';

  dob: string = "";
  stud_gender: any[] = ["Male", "Female", "Others"];
  gender_selected: any = 1;
  gender_selected_val: string = "Male";

  selected_dep: any;
  selected_batch_dep: any;
  selected_batch: any;
  selected_student_dep: any;
  selected_student_batch: any;
  selected_student: any;

  batch_inp_disable: boolean = false;

  // batchesSub: Subscription;
  // studSub: Subscription;
  // studBatchSub: Subscription;
  // dep_lists_Obj: Subscription;
  // sorted_students: Subscription;
  // upload_student_subj: Subscription;
  // fetched_data_Obj: Subscription;
  // batchStudentSubj: Subscription;

  selected_edit_batch: any;
  fetched_data: any;

  batch_years: any[] = [];
  batch_year_selected: any;
  batch_year_sel: boolean = true;

  batch_yearedit_selected: any;
  batch_yearedit_sel: boolean = true;

  student_id: string;
  side_bar: boolean = false;

  dep_id: string = "";

  del_stud_id: string = "";

  del_stud_ids: string[] = [];

  roll_stud_no: string = "";
  roll_stud_nos: string[] = [];

  form: any;

  progress: number = 0;

  mfoot_sel_all: boolean = false;
  del_stud_nos: number = 0;

  msel_all_footer: boolean = true;

  stud_sort_name: boolean = false;
  stud_sort_roll: boolean = true;

  mass_transfer_data: any;
  mt_field: string;
  mt_field_value: number;

  file: any;

  import_pop: boolean = false;

  focus_popsel_intern: boolean = false;
  focus_popsel_place: boolean = false;

  confirm_txt: string = "Batch";

  dep_id_subs: Subscription;

  sort_name: boolean = true;
  sort_rollno: boolean = false;

  random_batch_id: string = "";

  student_form = new FormGroup({
      name: new FormControl(''),
      age: new FormControl(''),
      student_dob: new FormControl(''),
      roll_no: new FormControl(''),
      contact_no: new FormControl(''),
      contact_email: new FormControl(''),
      alternate_no: new FormControl(''),
      ten: new FormControl(''),
      twelve: new FormControl(''),
      ug: new FormControl(''),
      pg: new FormControl(''),
      diploma: new FormControl(''),
  })

   batch_form = new FormGroup({
      user_id: new FormControl(''),
      batch_n: new FormControl(''),
    })

  constructor(private filterService: FilterServ,
        private studentService: StudentsListObj,
        private depService: DepartmentList,
        private fb: FormBuilder,
        private http: HttpClient,
        private activated_route: ActivatedRoute
      ) { 


       }

  ngOnInit() {
    
     this.activated_route.data
      .subscribe((data: Data) => {

        this.side_bar = data["side_bar"];
        this.filterService.getSidebarData(this.side_bar);
        console.log(data);
      });

      this.batchYears();

      this.form = this.fb.group({
        file: [null]
      });

      this.mass_transfer_data = {
        "field": "",
        "field_value": ""
      }

      this.selected_dep = {
        "department_name": "",
        "_id": ""
      }

      this.selected_batch = {
        "batch": "",
        "year": "",
        "total_student": ""
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

        this.selected_edit_batch = {
          "batch": "",
          "year": "",

        } 
        

        this.dep_id_subs = this.studentService.dep_id_subj
          .subscribe((updated_dep_id) => {
            
              this.dep_id = updated_dep_id;
            // this.fetchBatchStudentsData(this.dep_id);
            this.getBatchesWdepIdData();
            this.fetchBatchStudentsData(updated_dep_id);
                        
            console.log(this.dep_id);
          });
          //   this.dep_id_subs = this.studentService.dep_id_subj
          // .subscribe((updated_dep_id) => {
          //   this.dep_id = updated_dep_id;
          //   // this.fetchBatchStudentsData(this.dep_id);
          //   this.studentService.getBatchesWdepId(this.dep_id);
          //       // BATCHES WITH DEP ID
          //   this.batchesSub = this.studentService.rgetUpdateBatchesWdepId()
          //     .subscribe((a) => {
          //         this.batches = a;

          //          if(this.batches.length == 0) {
                          
          //           this.selected_batch = {
          //             "batch": "",
          //             "year": "",
          //             "total_student": ""
          //           }
          //         }
          //         else {
          //           this.selected_batch = this.batches[0];
          //           this.batch_id = this.selected_batch._id;
          //           console.log(this.selected_batch);
          //           console.log(this.batch_id);
          //           this.studentService.getStudentsWbatchId(this.selected_batch._id);

          //         }

          //     });
                        
          //   console.log(this.dep_id);
          // });

                    
          // this.studSub = this.studentService.rgetUpdateStudentsWbatchId()
          //   .subscribe((students_batch) => {
          //     this.students = students_batch;
          //     console.log(this.students);
          //   });
       

      // this.depService.fetchBatchStudents("all");
      // this.fetched_data_Obj = this.depService.rfetchBatchStudents()
      //   .subscribe((fetched_data) => {
      //     this.dep_lists = fetched_data.data.department;
      //     this.batches = fetched_data.data.batch;
      //     this.students = fetched_data.data.student;
      //     this.selected_dep = this.dep_lists[0];
      //     this.dep_id = this.selected_dep._id;
      //     this.selected_batch_dep = this.batches[0];
      //     this.selected_batch = this.selected_batch_dep[0];
      //     this.selected_student_dep = this.students[0];
      //     this.students = this.selected_student_dep[0];
      //     this.selected_student = this.students[0];

      //   });

      //   this.fetchBatchStudentsData();

      // this.depService.getDepartments();
      // this.dep_lists_Obj = this.depService.getUpdateDepartments()
      //   .subscribe((dep_data: DepartmentLists[]) => {
      //     this.dep_lists = dep_data;
      //     this.selected_dep = this.dep_lists[0];
      //     this.dep_id = this.selected_dep._id;

      //     this.depService.fetchBatchStudents(this.dep_id, "all");
      //     this.fetched_data_Obj = this.depService.rfetchBatchStudents()
      //       .subscribe((fetched_data) => {
      //         console.log(fetched_data);
      //       });
      //   });



      // this.depService.getDepartments();
      // this.dep_lists_Obj = this.depService.getUpdateDepartments()
      //   .subscribe((dep_data: DepartmentLists[]) => {
      //         this.dep_lists = dep_data;
      //         this.selected_dep = this.dep_lists[0];
      //         this.dep_id = this.selected_dep._id;
      //             this.depService.rfetchBatchStudents()
      //               .subscribe((data) => {
      //                 console.log(data);
      //               });
      //   }

      // this.depService.getDepartments();
      // this.dep_lists_Obj = this.depService.getUpdateDepartments()
      // .subscribe((dep_data: DepartmentLists[]) => {
      //   this.dep_lists = dep_data;
      //   this.selected_dep = this.dep_lists[0];
      //   this.dep_id = this.selected_dep._id;

      //     this.studentService.getBatches(this.dep_id);
      //     this.batchesSub = this.studentService.getUpdateBatches()
      //     .subscribe((updated_batches) => {
      //       if(updated_batches.length != 0) {

      //       this.batches = updated_batches;
      //       this.selected_batch = this.batches[0];
      //       }
      //       else {
      //           this.selected_batch = {
      //             "batch": "",
      //             "year": "",
      //             "total_student": ""
      //           }
      //       }
            
      //     });

      // });

      

      // this.studSub = this.studentService.getUpdateStudents()
      //   .subscribe((stud_data) => {
      //     this.students = stud_data;        
              
      //   });
      

  }

  // ngOnDestroy() {
  //     this.batchesSub.unsubscribe();  
  //     this.studSub.unsubscribe(); 
  //     this.dep_id_subs.unsubscribe(); 
  //     // this.dep_lists_Obj.unsubscribe();
  //     // this.studBatchSub.unsubscribe();
  // }

  get name() {
    return this.student_form.get('name');
  }
   get student_dob() {
    return this.student_form.get("student_dob");
  }
  get age() {
    return this.student_form.get("age");
  }

  get contact_no() {
    return this.student_form.get("contact_no");
  }
   get contact_email() {
    return this.student_form.get("contact_email");
  }
  get roll_no() {
    return this.student_form.get("roll_no");
  }
  get alternate_no() {
    return this.student_form.get("alternate_no");
  }
  get ten() {
    return this.student_form.get("ten");
  }
  get twelve() {
    return this.student_form.get("twelve");
  }
   get ug() {
    return this.student_form.get("ug");
  }
   get pg() {
    return this.student_form.get("pg");
  }
   get diploma() {
    return this.student_form.get("diploma");
  }

   get batch_n() {
    return this.batch_form.get("batch_n");
  }
   get user_id() {
    return this.batch_form.get("user_id");
  }

  getBatchesWdepIdData() {
      // BATCHES WITH DEP ID
      this.studentService.getBatchesWdepId(this.dep_id)
           .subscribe({
             next: (res) =>{
              console.log(res);
                this.batches = res.data;
                 if(this.batches.length == 0) {
                        
                  this.selected_batch = {
                    "batch": "",
                    "year": "",
                    "total_student": ""
                  }
                }
                else {
                  this.selected_batch = this.batches[0];
                  this.batch_id = this.selected_batch._id;
                  console.log(this.selected_batch);
                  console.log(this.batch_id);
                  this.getStudentsData();

                }
             },
             error: () => {
               console.log("error");
             }
           });
  }

  getStudentsData() {
        this.studentService.getStudentsBD(this.selected_batch._id)
          .subscribe({
            next: (res) => {
              console.log('* * * students fetched * * *');
              console.info(res);

              this.students = res.data;
            },
            error: (err) => {
              console.log('* * * Error in Student Fetching !!!:');
              console.error(err);
            }
          })
  }

  studDob(dateObject: any) {
    if(dateObject !== ""){
    this.dob = dateObject;
    console.log(dateObject);
    }

  }

  selectBatchYear() {
    if(this.batch_year_sel == true) {
      this.batch_year_sel = false;
    }
    else {
      this.batch_year_sel = true;
    }
  }


  selectBatchEditYear() {
    if(this.batch_yearedit_sel == true) {
      this.batch_yearedit_sel = false;
    }
    else {
      this.batch_yearedit_sel = true;
    }
  }

  batchYears() {
    let j=1999;

    for(let i=0; i<101; i++) {
      j = j + 1;
      this.batch_years.push({id: "by" + i, by: String(j)});
    }
  }

  selectBatchYears(event: Event) {
    let bat_year_id = ((event.currentTarget) as HTMLElement).id;
    for(let i=0; i<101; i++) {
      if(bat_year_id === this.batch_years[i].id) {
        this.batch_year_selected = this.batch_years[i].by;
        this.batch_year_sel = true;

      }
    }
  }

  selectBatchEditYears(event: Event) {
    let bat_year_id = ((event.currentTarget) as HTMLElement).id;
    for(let i=0; i<101; i++) {
      if(bat_year_id === this.batch_years[i].id) {
        this.batch_yearedit_selected = this.batch_years[i].by;
        this.batch_yearedit_sel = true;

      }
    }
  }

  // fetchBatches() {
  //   this.depService.getDepartments();
  //     this.dep_lists_Obj = this.depService.getUpdateDepartments()
  //     .subscribe((dep_data: DepartmentLists[]) => {
  //       this.dep_lists = dep_data;
  //       this.selected_dep = this.dep_lists[0];
  //       this.dep_id = this.selected_dep._id;

  //         this.studentService.getBatches(this.dep_id);
  //         this.batchesSub = this.studentService.getUpdateBatches()
  //         .subscribe((updated_batches) => {
  //           if(updated_batches.length != 0) {

  //           this.batches = updated_batches;
  //           this.selected_batch = this.batches[0];
  //           }
  //           else {
  //               this.selected_batch = {
  //                 "batch": "",
  //                 "year": "",
  //                 "total_student": ""
  //               }
  //           }
            
  //         });

  //     });
  // }

  // batchYearSelect(normalizedYear: Moment, create_batch_year: MatDatepicker<Moment>) {
  //   const yearValue = this.form.controls.yearForm.value;
  //   console.log(yearValue.year(normalizedYear.year()));
  //   this.year = yearValue.year(normalizedYear.year());
  //   this.form.controls.yearForm.setValue(yearValue);

  //   create_batch_year.close();
  // }

     popupOpenCall(sh_popup: boolean){
      if(this.sh_popup == false){
          this.sh_popup = true;
      }
      else {
        this.sh_popup = false;
      }

      this.filterService.popupOpenCall(this.sh_popup);

  } 
   closePop() {
    if (this.sh_popup == false) {
      this.sh_popup = true;
    } else {
      this.sh_popup = false;
    }

  }


  closeConfirmPop() {

    if (this.sh_confirm_pop == false) {
      this.sh_confirm_pop = true;
    } else {
      this.sh_confirm_pop = false;
    }

  }

  closeFocusPop(){
    this.sh_focus_pop = false;
  }

  selectBatch() {
    if(this.batch_sel == false) {
    this.batch_sel = true;

    }
    else {
      this.batch_sel = false;
    }
  }

  selectGender() {

    if(this.gender_sel == false) {
    this.gender_sel = true;

    }
    else {
      this.gender_sel = false;
    }
  }  

  genderSelected(event: Event) {
    let gender_sel_id = ((event.currentTarget) as HTMLElement).id;
    if(gender_sel_id == "0") {
      this.gender_selected_val = "Male";
      this.gender_selected = 1;
    }
    else if(gender_sel_id == "1") {
      this.gender_selected_val = "Female";
      this.gender_selected = 2;
    }
    else if(gender_sel_id == "2") {
      this.gender_selected_val = "Others";
      this.gender_selected = 3;
    }

  }

  fetchBatchStudentsData(dep_id: any) {
    console.log(dep_id);

     this.depService.getDepartmentsWid(dep_id)
          .subscribe({
            next: (res) => {
              console.log('* * * Department With ID Fetched Successfully * * *');
              console.info(res);

              this.dep_lists = res.data;
              this.selected_dep = res.data[0];
            },
            error: (err) => {
              console.log('* * * Department Not Fetched * * *');
              console.error(err);
            }
          });


    // this.studentService.getBatchesWdepId(dep_id);
    // this.batchesSub = this.studentService.rgetUpdateBatchesWdepId()
    //   .subscribe((a) => {
    //     this.batches = a;

    //      if(this.batches.length == 0) {
                
    //       this.selected_batch = {
    //         "batch": "",
    //         "year": "",
    //         "total_student": ""
    //       }
    //     }
    //     else {
    //       this.selected_batch = this.batches[0];
    //       this.batch_id = this.selected_batch._id;
    //       console.log(this.selected_batch);
    //       console.log(this.batch_id);
    //       this.studentService.getStudentsWbatchId(this.batch_id);

    //     }

    //   });

     // this.depService.fetchBatchStudents("all");
     //  this.fetched_data_Obj = this.depService.rfetchBatchStudents()
     //    .subscribe((fetched_data) => {
     //      this.dep_lists = fetched_data.data.department;
     //      this.batches = fetched_data.data.batch;
     //      this.students = fetched_data.data.student;

     //      this.selected_dep = this.dep_lists[0];
     //      this.dep_id = this.selected_dep._id;

     //      this.selected_batch_dep = this.batches[0];
     //      this.selected_batch = this.selected_batch_dep[0];

     //      this.selected_student_dep = this.students[0];
     //      this.students = this.selected_student_dep[0];

     //      this.selected_student = this.students[0];

     //      if(this.dep_id) {

     //        for(let dep_batch=0; dep_batch< this.batches.length; dep_batch++) {

     //          let batch_dep1: any;
     //          let batch_dep2: any[] = [];
     //          let batch_dep3: any[] = [];

     //          batch_dep1 = (this.batches[dep_batch]);
     //          // console.log(batch_dep1);
                
     //           for(let inner_batch=0; inner_batch< batch_dep1.length; inner_batch++) {
     //              console.log(batch_dep1[inner_batch]);
     //              if(batch_dep1[inner_batch].department_id == "627f5f5971ec827c2ca81398") {
     //                batch_dep2.push(batch_dep1[inner_batch]);
     //                // console.log(batch_dep2);
                    
     //              } 
     //           }
     //          this.batches = batch_dep2;
     //           console.log(this.batches);

     //        }
             


     //      }


     //    });

        console.log("student comp called");

  }


   fetchCreatedStudent(dep_id: any) {
    console.log(dep_id);

    // this.studentService.getBatchesWdepId(dep_id);
    // this.batchesSub = this.studentService.rgetUpdateBatchesWdepId()
    //   .subscribe((a) => {
    //     this.batches = a;
    //     // this.selected_batch = this.batches[0];
    //     this.batch_id = this.selected_batch._id;
    //     console.log(this.selected_batch);
    //     console.log(this.batch_id);

    //   this.studentService.getStudentsWbatchId(this.batch_id);

    //     if(this.batches.length == 0) {
                
    //       this.selected_batch = {
    //         "batch": "",
    //         "year": "",
    //         "total_student": ""
    //       }
    //     }
        
    //   });

      console.log(this.batches);

  }



  loadBatchStud(event: Event) {
    this.batch_id = ((event.currentTarget) as HTMLElement).id;
    console.log(this.batches);
    for(let i=0; i< (this.batches.length); i++) {

    if(this.batch_id == (this.batches[i]._id)) {
        this.selected_batch = this.batches[i];
        console.log(this.selected_batch);
      }
    }

    this.getStudentsData();
  }

  loadDepartment() {
       for(let i=0; i< (this.dep_lists.length); i++) {

        if(this.dep_id == (this.dep_lists[i]._id)) {
        this.selected_dep = this.dep_lists[i];
      }
    }
  }


  shCreateBatch() {
    if(this.sh_batch_pop == false) {
    this.sh_batch_pop = true;
      this.batch_inp_disable = false;

    }
    else {
      this.sh_batch_pop = false;
    }
  }

  shImportPop() {
    if(this.import_pop == false) {
    this.import_pop = true;

    }
    else {
      this.import_pop = false;
    }
  }

    shMselFooter() {
    

    if (this.msel_all_footer == false) {
      this.msel_all_footer = true;
    } else {
      this.msel_all_footer = false;
    }
     for (let b = 0; b < this.students.length; b++) {
      this.students[b].is_select = 0;
      this.del_stud_ids.pop();
      this.del_stud_nos = 0;
    }
  }

  shCreateStud() {
    this.isAddRecStud = true;
    if(this.sh_student_pop == false) {
      this.sh_student_pop = true;
      this.student_form.reset();
    }
    else {
      this.sh_student_pop = false;
    }
  }

  shSortStud(){
      if(this.sh_sort_student == false) {
    this.sh_sort_student = true;

    }
    else {
      this.sh_sort_student = false;
    }
  }

  createBatch(){
    console.log(this.dep_id);

    this.studentService.crateBatchServ(
       this.batch_n.value,
       this.batch_year_selected,
       this.user_id.value,
       this.dep_id
    ).subscribe({
       next: () => {
         this.getBatchesWdepIdData();
         this.batch_form.reset();
       }
    });
      
    this.sh_batch_pop = false;
    // this.studentService.getBatchesWdepId(this.dep_id);

      // setTimeout(() => {
      //    this.studentService.getBatchesWdepId(this.dep_id);
      //    this.studentService.getStudentsWbatchId(this.selected_batch._id);
      // }, 500);
    }

    editBatch() {
      if(this.isEditBatch == false) {
      this.isEditBatch = true;
      for(let i=0; i< (this.batches.length); i++) {

       if(this.batch_id == (this.batches[i]._id)) {
        this.selected_edit_batch = this.batches[i];
        this.batch_yearedit_selected = this.selected_edit_batch.year;
       }  
      }

      this.batch_form.patchValue({
        batch_n: this.selected_edit_batch.batch
      })
    }
    else {
      this.isEditBatch = false;
     }

    }

    closeEditBatch() {
      if(this.isEditBatch == false) {
      this.isEditBatch = true;
    
    }
    else {
      this.isEditBatch = false;

    //     this.studentService.getBatches(this.batch_id);
    // this.batchesSub = this.studentService.getUpdateBatches()
    //   .subscribe((a) => {
    //     this.batches = a;
    //     console.log(this.batches);
    //     this.selected_batch = this.batches[0];
      
    //   });
      
     }

    }

    createStudent() {
       

      this.studentService.createStudentServ(
          this.name.value,
          this.dob,
          this.age.value,
          this.gender_selected,
          this.gender_selected_val,
          this.roll_no.value,
          this.contact_no.value,
          this.alternate_no.value,
          this.contact_email.value,
          this.ten.value,
          this.twelve.value,
          this.ug.value,
          this.pg.value,
          this.diploma.value,
          this.selected_batch._id
      ).subscribe({
        next: (res) => {
          this.getBatchesWdepIdData();
          console.log('Student Created Successfully ~ ~ ~' + res);
        },
        error: (err) => {
          console.log('Student Not Created !!!' + err);
        }
      })
      this.sh_student_pop = false;
      this.student_form.reset();

      // setTimeout(() => {
      //   this.studentService.getStudentsWbatchId(this.batch_id);
      // }, 500);

    };

    editBatchData() {
      // this.fetchBatchStudentsData(this.dep_id);
      console.log("ff");
      this.studentService.editBatchServ(
          this.batch_n.value,
          this.batch_yearedit_selected,
          this.selected_batch._id
        ).subscribe({
          next: (res) => {
            this.getBatchesWdepIdData();
            console.log("~ ~ ~ Batch Edited Successfully ~ ~ ~");
          },
          error: (err) => {
            console.log('Batch Not Saved !!!' + err);
          }
        })
      this.isEditBatch = false;
      // this.studentService.getBatchesWdepId(this.dep_id);
      this.batch_form.reset();
    };

    deleteBatch() {
      this.confirm_txt = "Batch";

      this.sh_confirm_pop = true;

      this.isBatchDel = true;
      this.isAddFocus = false;
      this.isStudMultiDelBtn = false;
      this.isSingleDelBtn = false;
    }

    deleteBatchServCall() {
      this.confirm_txt = "Student";
      // this.fetchBatchStudentsData(this.dep_id);

      this.studentService.deleteBatchServ(this.batch_id)
        .subscribe({
          next: (res) => {
            console.log('~ ~ ~Batch Deleted Successfully ~ ~ ~');
            this.getBatchesWdepIdData();
          },
          error: (err) => {
            console.log('! ! ! Batch Not Deleted ! ! !' + err);
          }
        });

      this.sh_confirm_pop = false;

    }

    editExistStudent(event: Event) {
      this.sh_student_pop = true;
      this.student_id = ((event.currentTarget) as HTMLElement).id;
      for(let k=0; k<(this.students.length); k++) {
        if(this.student_id == (this.students[k]).roll_no) {
            this.selected_student = this.students[k];
        }
      }
      console.log(this.selected_student);
      this.student_form.patchValue({
        name: this.selected_student.name,
        student_dob: this.selected_student.dob,
        age: this.selected_student.age,
        gender: this.gender_selected,
        front_end_gender: this.gender_selected_val,
        roll_no: this.selected_student.roll_no,
        contact_no: this.selected_student.mobile,
        alternate_no: this.selected_student.alternative_mobile,
        contact_email: this.selected_student.email,
        ten: this.selected_student.percentage.ten,
        twelve: this.selected_student.percentage.twelve,
        ug: this.selected_student.percentage.ug,
        pg: this.selected_student.percentage.pg,
        diploma: this.selected_student.percentage.diploma,

      });
      this.dob = this.selected_student.dob;

      this.isAddRecStud = false;
    }

    editStudentVal() {
        let selected_student = {
          name: this.name.value,
          dob: this.dob,
          age: this.age.value,
          gender: this.gender_selected,
          front_end_gender: this.gender_selected_val,
          roll_no: this.roll_no.value,
          mobile: this.contact_no.value,
          alternative_mobile: this.alternate_no.value,
          email: this.contact_email.value,
          percentage: {
            ten: this.ten.value,
            twelve: this.twelve.value,
            ug: this.ug.value,
            pg: this.pg.value,
            diploma: this.diploma.value,
          }
        }

        this.studentService.editStudent(this.student_id, selected_student, this.batch_id)
          .subscribe({
            next: (res) => {
              this.getStudentsData();
              console.log('~ ~ ~ Student Edited Successfully ~ ~ ~');
            },
            error: (err) => {
              console.log('~ ~ ~ Student Edited Error !!! ' + err);
            }
          })
        this.sh_student_pop = false;
        this.isAddRecStud = true;
    };

    deleteStudent(event: Event) {
      this.confirm_txt = "Student";

      this.sh_confirm_pop = true;
      this.isBatchDel = false;
      this.isStudMultiDelBtn = false;
      this.isSingleDelBtn = true;
      this.isAddFocus = false;
      this.del_stud_id = ((event.currentTarget) as HTMLElement).id;
    } 

    deleteStudeServCall() {
      this.confirm_txt = "Batch";

      console.log(this.del_stud_id);

      this.studentService.deleteStudentServ(this.del_stud_id)
        .subscribe({
          next: (res) => {
            console.log('~ ~ ~ Student Deleted Successfully ~ ~ ~' + res)
            this.getStudentsData();
          },
          error: (err) => {
            console.log('Student Delete Error !!!' + err)
          }
        })

      this.sh_confirm_pop = false;
    };

     shMConfirmPop() {
      this.filterService.popupConfirmCall(this.sh_confirm_pop);
      this.isSingleDelBtn = false;
      this.sh_confirm_pop = true;
      this.isBatchDel = false;
      this.isStudMultiDelBtn = true;
      this.isSingleDelBtn = false;

  }

   shMultiStudConfirmPop() {
      this.sh_confirm_pop = true;

      this.filterService.popupConfirmCall(this.sh_confirm_pop);
      this.isSingleDelBtn = false;
      this.isBatchDel = false;
      this.isStudMultiDelBtn = true;
      this.isSingleDelBtn = false;
      this.isAddFocus = false;
    
  }

   shMConfirmFocusPop() {
      this.filterService.popupConfirmCall(this.sh_confirm_pop);
      this.isSingleDelBtn = false;
      this.sh_confirm_pop = true;
      this.isBatchDel = false;
      this.isStudMultiDelBtn = false;
      this.isSingleDelBtn = false;
      this.isAddFocus = true;
  }

    msel_foot_selectall(event: Event) {

    for (let b = 0; b < this.students.length; b++) {
      this.students[b].is_select = this.mfoot_sel_all;
    }

    let msel_all_checks = ((event.target) as HTMLInputElement).checked;
    if (msel_all_checks == true) {

      if (this.del_stud_ids.length == 0) {
        this.del_stud_nos = 0;
        for (let i = 0; i < (this.students.length); i++) {
          this.del_stud_ids.push(this.students[i]._id!);
          this.students[i].is_select = 1;

        }
        this.del_stud_nos = this.students.length;
      } else {
        this.del_stud_nos = 0;

        let ids_len = this.del_stud_ids.length;
        for (let a = 0; a < (ids_len); a++) {
          this.del_stud_ids.pop();

        }
        for (let i = 0; i < (this.students.length); i++) {
          this.del_stud_ids.push(this.students[i]._id!);

        }
        this.del_stud_nos = this.students.length;

      }


    } else {

      let ids_len = this.del_stud_ids.length;
      for (let a = 0; a < (ids_len); a++) {
        this.del_stud_ids.pop();
        this.students[a].is_select = 0;

      }
      this.del_stud_nos = 0;


    }

  }

    multiStudentDelete(event: Event) {
      this.msel_all_footer = false;

      // this.del_stud_id = ((event.currentTarget) as HTMLElement).id;
      this.roll_stud_no = ((event.currentTarget) as HTMLElement).id;

      this.mfoot_sel_all = this.students.every((item: any) => {
        return item.is_select == 1;
      });
      this.mselGetCheckedList(event, this.del_stud_id, this.roll_stud_no);
    }

    mselGetCheckedList(event: Event, del_stud_id: string, roll_stud_no: string) {
         if (((event.target) as HTMLInputElement).checked) {

      // this.del_stud_ids.push(this.del_stud_id);
      this.roll_stud_nos.push(this.roll_stud_no);

      this.del_stud_nos++;

      for (let sel_all = 0; sel_all < this.students.length; sel_all++) {
        if (this.students[sel_all].is_select === 1) {
          this.mfoot_sel_all = true;

        }
      }

    } else {
      // let msel_arr_ind = this.del_stud_ids.indexOf(this.del_stud_id);
      let msel_arr_ind_roll = this.roll_stud_nos.indexOf(this.roll_stud_no);

      if (msel_arr_ind_roll > -1) {
        // this.del_stud_ids.splice(msel_arr_ind, 1);
        this.roll_stud_nos.splice(msel_arr_ind_roll, 1);

      }
      this.del_stud_nos--;

      if (this.del_stud_nos == 0) {
        this.msel_all_footer = true;
      }

     }
    }

    multiStudDelServ() {
      this.studentService.deleteMultiStudent(this.roll_stud_nos, this.batch_id)
        .subscribe({
          next: (res) => {
          console.log('~ ~ ~ Students Deleted Successfully ~ ~ ~' + res)
          this.getStudentsData();
          },
          error: (err) => {
            console.log('Students Delete Error !!!' + err)
          }
        })
      // this.del_stud_nos = 0;
      this.del_stud_nos = 0;
        for (let b = 0; b < this.students.length; b++) {
          this.students[b].is_select = 0;
        }
      if(this.del_stud_nos == 0) {
        this.msel_all_footer = true;

      }

      this.closeConfirmPop();
    };

    massTransferBatchSel(event: Event) {
      this.mt_field = ((event.currentTarget) as HTMLElement).id;
      if(this.mt_field == "intern") {
        this.mt_field_value = 1;
        this.focus_popsel_place = false;
        this.focus_popsel_intern = true;
       
      }
      else if(this.mt_field == "placement") {
        this.mt_field_value = 2;
        this.focus_popsel_place = true;
        this.focus_popsel_intern = false;
      }
      else{
        this.mt_field_value = 0;
      }
      this.mass_transfer_data = {
        "field": this.mt_field,
        "field_value": this.mt_field_value
      }
      console.log(this.mass_transfer_data);
    }

    massTransferOpen() {
      this.sh_focus_pop = true;
    }

    massTransferBatch(){
      this.studentService.massTransferBatch(this.selected_batch._id, this.mass_transfer_data);
    }

    multiTransferStudent() {
      if(this.selected_batch.focus_student == 2) {
          this.mass_transfer_data = {
            "field": "placement",
            "field_value": 2
        }
        
      }
      else if(this.selected_batch.focus_student == 1) {
            this.mass_transfer_data = {
            "field": "intern",
            "field_value": 1
          }
        }
      
      this.studentService.transferMultipleStudents(this.selected_batch._id,
       this.del_stud_ids, this.mass_transfer_data);
    }

    sortOptionDisable(event: Event) {
      let opt_sort = ((event.target) as HTMLInputElement).id;

      if(opt_sort == "stud_sort_name"){
        this.stud_sort_name = true;
        this.sort_name = false;
        this.sort_rollno = true;
        this.stud_sort_roll = false;
      }
      else if(opt_sort == "stud_sort_rollno") {
        this.stud_sort_name = false;
        this.sort_name = true;
        this.sort_rollno = false;
        this.stud_sort_roll = true;
      }

    }

    sortBatchStudents(event: Event) {
      let order_check = ((event.currentTarget) as HTMLInputElement);
      let order_check_id = ((event.currentTarget) as HTMLInputElement).id;

      if(order_check.checked == true) {
          this.studentService.sortStudents(this.batch_id, "desc", order_check_id)
                .subscribe({
                  next: (res) => {
                    this.students = res.data;
                    console.log('* * * Sorted Students Succesfully * * *');
                    console.info(res);
                  },
                  error: (err) => {
                    console.log('* * * Sort Not Applied Error * * *');
                    console.info(err);
                  }
                });
      }
      else if(order_check.checked == false){
          this.studentService.sortStudents(this.batch_id, "asc", order_check_id)
                .subscribe({
                  next: (res) => {
                    this.students = res.data;
                    console.log('* * * Sorted Students Succesfully * * *');
                    console.info(res);
                  },
                  error: (err) => {
                    console.log('* * * Sort Not Applied Error * * *');
                    console.info(err);
                  }
                });   
      }
    };

    randomBatchId() {
      this.random_batch_id = Math.random().toString(20).substr(2, 7);
      console.log(this.random_batch_id);
      this.batches.forEach((bat) => {
        console.log(bat.user_id)

        if(bat.user_id === this.random_batch_id) {
          this.random_batch_id = Math.random().toString(20).substr(2, 7);
          console.log(this.random_batch_id);

        }
          
      });
      console.log(this.random_batch_id);
      
       this.batch_form.patchValue({
            user_id: this.random_batch_id
        });   
      this.batch_inp_disable = true;
    }

    uploadStudent(studentCsvFile: File): Observable<HttpEvent<any>> {
        let form_data = new FormData();
        console.log(studentCsvFile);

        form_data.append("file", studentCsvFile);
         const headers = {
          'Accept': '*/*',
          'content-type': 'application/x-www-form-urlencoded',
        }
        console.log(form_data.get('file'));
         return this.http.post(`${this.API_BASE_URL}educare/upload-student/${this.selected_batch._id}`, 
          form_data, 
          {
            reportProgress: true,
            observe: 'events',
            'headers': headers
          });
          
    }

    uploadStudentCsv(event: Event) {

        this.file = ((event.target) as HTMLInputElement).files[0];
          this.form.patchValue({
              file: this.file
            });
            this.form.get('file').updateValueAndValidity();
      }
    

    submitStudent(){
      console.log(this.form.value.file)
        this.uploadStudent(
            this.form.value.file
          )
          .subscribe((event: HttpEvent<any>) => {
              switch (event.type) {
                case HttpEventType.Sent:
                  console.log("File Sent");
                  break;
                case HttpEventType.ResponseHeader:
                  console.log("ResponseHeader received");
                  break;
                case HttpEventType.UploadProgress:
                  this.progress = Math.round(event.loaded / event.total * 100);
                  console.log("Uploaded: " + this.progress);
                  break;
                case HttpEventType.Response:
                  console.log("Student Added: ", event.body);
                  setTimeout(() => {
                    this.progress = 0;
                  }, 1500);
                  break;
              }
          },
            (error) => {
              console.log(error);
            }
          )
          

    };

    exportBatchStudents(){
      this.studentService.downloadCsvStudent(this.students , 'Student Data');
    }
}

