import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { StudentsListObj } from '../services/students-list.service';
import { FilterServ } from '../services/filter.service';
import { ActivatedRoute, Data } from '@angular/router';


import {Subscription} from 'rxjs';

@Component({
  selector: 'app-selected-students',
  templateUrl: './selected-students.component.html',
  styleUrls: ['./selected-students.component.scss',
               '../placement-listing/placement-listing.component.scss',
               '../company-listing/company-listing.component.scss'
               ]
})
export class SelectedStudentsComponent implements OnInit {

  sh_popup: boolean = false;

  selected_students: any;

  side_bar: boolean = false;
  
  selected_type_no: number;
  selected_type: string = "";

  selected_students_subj: Subscription;

  constructor(private studentService: StudentsListObj,
    private filterService: FilterServ,
     private activated_route: ActivatedRoute
    ) { }

  ngOnInit() {
    this.activated_route.data
        .subscribe((data: Data) => {
          this.side_bar = data["side_bar"];
          this.filterService.getSidebarData(this.side_bar);
          console.log(data["side_bar"]);
        });

         this.filterService.popupCloseCall().subscribe((shpopup_call) => {
      this.sh_popup = shpopup_call;
    });

    this.studentService.fetchSelectedStudent();
    this.selected_students_subj = this.studentService.rfetchSelectedStudent()
      .subscribe((selected_students: any) => {
        this.selected_students = selected_students;
        console.log(this.selected_students);
      }); 

  }

     popupOpenCall(sh_popup: boolean){
      if(this.sh_popup == false){
          this.sh_popup = true;
      }
      else {
        this.sh_popup = false;
      }

  } 


  addSelectedStudent(form: NgForm) {
          this.sh_popup = false;


    this.studentService.addSelectedStudents(
        form.value.placement_id,
        form.value.students_attended,
        form.value.roll_no
      );
     
    this.studentService.fetchSelectedStudent();
  }

  fetchSelectedType(selected_students: any) {

    for(let a=0; a<this.selected_students.length; a++) {
       // this.selected_type_no = this.selected_students[a].type;
       if(this.selected_students[a].type == 1) {
          this.selected_type = "Placement";
       }
       else if(this.selected_students[a].type == 2) {
          this.selected_type = "Internship";
       }
    }
  }

  closeEditPop(form: NgForm) {
    
  }

  exportPlacementReport(){
      this.studentService.downloadCsvReport(this.selected_students , 'Placement Report');
    }

}
