import { Component, OnInit } from '@angular/core';

import { FilterServ } from '../services/filter.service';
import {StudentsListObj} from '../services/students-list.service';

import {NgForm, FormControl, FormGroup} from '@angular/forms';

import {DepartmentLists} from '../shared/listing.model';
import {Batches} from '../shared/listing.model';

import {Subscription} from 'rxjs';

import {DepartmentList} from '../services/department-list.service';
import {Students} from '../shared/listing.model';
import { ActivatedRoute, Data } from '@angular/router';


import {Router} from '@angular/router';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss',
              '../placement-listing/placement-listing.component.scss'
              ]
})
export class DepartmentComponent implements OnInit {


  dep_lists: DepartmentLists[] = [];
  students: Students[] = [];

  place_no_data: boolean = true;

  selected_dep: any;
  selected_batch_dep: any;
  selected_batch: any;
  selected_student_dep: any;
  selected_student_batch: any;
  selected_student: any;

  dep_id: string = "";
  batch_id: string;

  del_dep_id: string = '';
  del_inp_id: string = '';
  del_dep_pn: boolean = true;

  // department_name: string = "";
  // category: string = "";
  // duration: string = "";
  // department_head: string = "";
  // incharge: string = "";
  // incharge_phone: string = "";
  // incharge_mail: string = "";

  dep_lists_Obj: Subscription;
  fetched_data_Obj: Subscription;

  isAddRecordBtn: boolean = true;

  sh_popup: boolean = false;
  sh_confirm_pop: boolean = false;
  dep_sett: boolean = false;

  fetched_data: any;

  selected_dep_sett: any;

  dep_category: any = ["UG", "PG", "Diploma"];
  dep_selected: string;
  dep_sel: boolean = true; 

  side_bar: boolean = false;

  batches: Batches[];
  batchesSub: Subscription;
  dep_id_subs: Subscription;

  department_form = new FormGroup({
    department_name : new FormControl(''),
    batch: new FormControl(''),
    category: new FormControl(''),
    duration: new FormControl(''),
    department_head: new FormControl(''),
    incharge: new FormControl(''),
    incharge_phone: new FormControl(''),
    incharge_mail: new FormControl(''),
  });

  constructor(private filterService: FilterServ,
              private depService: DepartmentList,
              private studentService: StudentsListObj,
              private route: Router,
              private activated_route: ActivatedRoute
    ) { }

  ngOnInit() { 
     this.activated_route.data
        .subscribe((data: Data) => {
          this.side_bar = data["side_bar"];
          this.filterService.getSidebarData(this.side_bar);
          // console.log(data["side_bar"]);
        });

    this.dep_id_subs = this.studentService.dep_id_subj
      .subscribe((updated_dep_id) => {
        this.dep_id = updated_dep_id;
        console.log(this.dep_id);
      })

    // this.studentService.getBatches();
    // this.batchesSub = this.studentService.getUpdateBatches()
    //   .subscribe((a) => {
    //     this.batches = a;
    //   });
    this.studentService.getBatches(this.dep_id)
    .subscribe({
        next: (res) => {
          this.batches = res.data;
          console.log('Batched Fetched Succesfully');
        },
        error: (err) => {
          console.log('Batched Not Fetched' + err);
        }
    })
      
    this.selected_dep_sett = {
          placement_limit: 0,
          internship_limit: 0
        }

    this.selected_dep = {
        "department_name": "",
        "department_head": "",
        "category": "",
        "duration": "",
        "incharge": "",
        "incharge_phone": "",
        "incharge_mail": ""
    }

     this.filterService.popupCloseCall().subscribe((shpopup_call) => {
      this.sh_popup = shpopup_call;
      this.isAddRecordBtn = true;
    });

    this.depService.getDepartments()
          .subscribe({
            next: (res) => {
              console.log('* * * Department Fetched Successfully * * *');
              console.info(res);

              this.dep_lists = res.data;
                if(this.dep_lists.length == 0) {
                  this.place_no_data = false;
              }
              else {
                this.place_no_data = true;
              }
            },
            error: (err) => {
              console.log('* * * Department Not Fetched * * *');
              console.error(err);
            }
          });
  }

  // ngOnDestroy() {
  //   this.dep_id_subs.unsubscribe();
  //   // this.batchesSub.unsubscribe();
  //   this.dep_lists_Obj.unsubscribe();
  // }

   get department_name() {
    return this.department_form.get('department_name');
  }

  get department_head() {
    return this.department_form.get("department_head");
  }
  get category() {
    return this.department_form.get("category");
  }
  get duration() {
    return this.department_form.get("duration");
  }
  get incharge() {
    return this.department_form.get("incharge");
  }
  get incharge_phone() {
    return this.department_form.get("incharge_phone");
  }
  get incharge_mail() {
    return this.department_form.get("incharge_mail");
  }

   closePop(){
    if (this.sh_popup == false) {
      this.sh_popup = true;
    } else {
      this.sh_popup = false;
    }
    this.depService.getDepartments()
      .subscribe({
            next: (res) => {
              console.log('* * * Department Fetched Successfully * * *');
              console.info(res);

              this.dep_lists = res.data;
              this.department_form.reset();

            },
            error: (err) => {
              console.log('* * * Department Not Fetched * * *');
              console.error(err);
            }
          });
  }


  closeConfirmPop() {

    if (this.sh_confirm_pop == false) {
      this.sh_confirm_pop = true;
    } else {
      this.sh_confirm_pop = false;
    }

  }

  addDepartment(){
          this.place_no_data = true;

      this.depService.addDepartmentServ(
        this.department_name.value,
        this.department_head.value,
        this.dep_selected,
        this.duration.value,
        this.incharge.value,
        this.incharge_phone.value,
        this.incharge_mail.value )
         .subscribe({
              next: (res) => {
                console.log('* * * Department Added Successfully * * *');
                console.info(res);
              },
              error: (err) => {
                console.log('* * * Department Not Added * * *');
                console.error(err);
              }
            });
      this.sh_popup = false;
      this.department_form.reset();
  }

  editExistDepartment(event: Event){
    event.stopPropagation();
    this.isAddRecordBtn = false;
    this.dep_id = (event.currentTarget as HTMLElement).id;


      for(let i=0; i< this.dep_lists.length; i++) {

        if(this.dep_id == this.dep_lists[i]._id){
          this.selected_dep = this.dep_lists[i];

          this.dep_selected = this.selected_dep.category;

          }
      }

    this.department_form.patchValue({
        department_name: this.selected_dep.department_name,
        department_head: this.selected_dep.department_head,
        category: this.dep_selected,
        duration: this.selected_dep.duration,
        incharge: this.selected_dep.incharge,
        incharge_phone: this.selected_dep.incharge_phone,
        incharge_mail: this.selected_dep.incharge_mail
    });

    this.sh_popup = true;
  }

  editDepartment() {
   
    let selected_dep = {
        department_name: this.department_name.value,
        department_head: this.department_head.value,
        category: this.dep_selected,
        duration: this.duration.value,
        incharge: this.incharge.value,
        incharge_phone: this.incharge_phone.value,
        incharge_mail: this.incharge_mail.value
    }


    this.depService.updateDepartment(this.dep_id, selected_dep);
    this.sh_popup = false;
    this.department_form.reset();
  }

  departmentSetting(event: Event, edit_dep_setting: NgForm) {
    event.stopPropagation();
    this.dep_id = ((event.currentTarget) as HTMLElement).id;

    for(let i=0; i< this.dep_lists.length; i++) {

      if(this.dep_id == this.dep_lists[i]._id){
        this.selected_dep_sett = {
          placement_limit: this.dep_lists[i].placement_offer_letter,
          internship_limit: this.dep_lists[i].intern_offer_letter
        }
        
      }

    }

    this.dep_sett = true;
  }

  departmentSettingValue(dep_sett_form: NgForm) {
    let department_setting = {
        placement_offer_letter: dep_sett_form.value.placement_limit,
        intern_offer_letter: dep_sett_form.value.internship_limit,
    }

    this.depService.updateDepartment(
        this.dep_id,
        department_setting 
        ).subscribe({
                next: (res) => {
                  console.log('* * * Department Edited & Saved Successfully * * *');
                  console.info(res);
                },
                error: (err) => {
                  console.log('* * * Department Not Saved * * *');
                  console.error(err);
                }
              });

    this.depService.getDepartments()
      .subscribe({
            next: (res) => {
              console.log('* * * Department Fetched Successfully * * *');
              console.info(res);

              this.dep_lists = res.data;
              this.dep_sett = false;
            },
            error: (err) => {
              console.log('* * * Department Not Fetched * * *');
              console.error(err);
            }
          });
    
    }
  

  deleteDepartment(event: Event) {
    this.dep_id = ((event.currentTarget) as HTMLElement).id;
    this.del_dep_id = this.generateRandomString();
    console.log(this.del_inp_id);
    this.setDelDepId();
    
    this.sh_confirm_pop = true;
    event.stopPropagation();
  }

  setDelDepId() {
    console.log(this.del_inp_id);
    if(this.del_dep_id === this.del_inp_id) {
    console.log(this.del_inp_id);
      this.del_dep_pn = false;
    }
    else {
      this.del_dep_pn = true;
    }
    return this.del_inp_id;

  }

  deleteDepartmentConfirm() {
    this.depService.deleteDepartmentServ(this.dep_id)
           .subscribe({
            next: (res) => {
              console.log('* * * Department Deleted Successfully * * *');
              console.info(res);
            },
            error: (err) => {
              console.log('* * * Department Not Deleted * * *');
              console.error(err);
            }
          });
    this.sh_confirm_pop = false;
  }

  generateRandomString() {
    return Math.random().toString(20).substr(2, 7);
  }

  openDepControl(){
    this.dep_sett = true;
  }

  closeDepControl(){
    this.dep_sett = false;
  }

  loadStudents(event: Event) {
    this.dep_id = ((event.currentTarget) as HTMLElement).id;

    this.studentService.changeDepId(this.dep_id);

    // this.studentService.getBatches(this.dep_id);
    // this.batchesSub = this.studentService.getUpdateBatches()
    //   .subscribe((a) => {
    //     this.batches = a;
    //     console.log(this.batches);
    //   });


      // this.depService.fetchBatchStudents("all");
      // this.fetched_data_Obj = this.depService.rfetchBatchStudents()
      //   .subscribe((fetched_data) => {
      //     this.dep_lists = fetched_data.data.department;
      //     this.batches = fetched_data.data.batch;
      //     this.students = fetched_data.data.student;

      //     // this.selected_dep = this.dep_lists[0];

      //     // this.selected_batch_dep = this.batches[0];
      //     // this.selected_batch = this.selected_batch_dep[0];

      //     // this.selected_student_dep = this.students[0];
      //     // this.students = this.selected_student_dep[0];
      //     // this.selected_student = this.students[0];
             

      //   });
    this.route.navigateByUrl( this.dep_id + '/students');

    // console.log(this.dep_id);
    //   this.studentService.getBatches(this.dep_id);
    //   this.batchesSub = this.studentService.getUpdateBatches()
    //   .subscribe((updated_batches) => {

    //     if(updated_batches.length != 0) {
    //       this.batches = updated_batches;
    //       this.selected_batch = this.batches[0];

    //     }
    //     else {

    //         this.selected_batch = {
    //           "batch": "",
    //           "year": "",
    //           "total_student": ""
    //         }
    //     }
        
    //   });
    
  }

  selDepCategory() {
    if (this.dep_sel == false) {
      this.dep_sel = true;

    } else {
      this.dep_sel = false;
    }
  }

  loadDepCategory(event: Event) {

    let dep_catg = ((event.currentTarget) as HTMLElement).id;
    if(dep_catg == "0") {
    this.dep_selected = "UG";
    }
    else if(dep_catg == "1") {
    this.dep_selected = "PG";
    }
    if(dep_catg == "2") {
    this.dep_selected = "Diploma";
    }

  }

}