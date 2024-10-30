import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { FilterServ } from '../services/filter.service';
import { PlacementListObj } from '../services/placements-list.service';
import { CompanyListsObj } from '../services/company-list.service';



import { Subscription } from 'rxjs';

import { PlacementList } from '../shared/listing.model';
import { CompanyLists } from '../shared/listing.model';


import { HttpClient } from '@angular/common/http';

import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';

import { ActivatedRoute, Data } from '@angular/router';

import { Salary } from '../shared/listing.model';

import { DateFormatDirective } from '../format-datepicker.directive';

@Component({
  selector: 'app-placement-listing',
  templateUrl: './placement-listing.component.html',
  styleUrls: ['./placement-listing.component.scss']
})
export class PlacementListingComponent implements OnInit {

  placement_list: PlacementList[];


  selected_placement: any;
  sel_placement_id: string;

  place_no_data: boolean = true;

  comp_search_txt: string = "";
  placement_search:string = "";

  msel_placement_ids: string[] = [];
  msel_placement_id: string = "";
  msel_id_nos: number = 0;

  place_catg_sel: boolean = true;
  placement_category: string[] = ["Placement", "Internship"];
  place_catg_selected: string = "Placement";
  place_catg_number: number = 1;

  msel_all_footer: boolean = true;
  mfoot_sel_all: any = 0;

  date = new Date();
  outputDateFormat = 'yyyy-MM-DD';



  place_date: string = "";
  register_date: string = "";

  shSelectBox: boolean;
  sh_popup: boolean;
  sh_confirm_pop: boolean;
  confirm_ok: boolean = true;


  filter_expmin: boolean;
  filter_res_expmin: boolean;
  loopel: Number[];
  filter_header: number;

  company_name: string = "";
  company_email: string = "";
  job_role: string = "";
  placement_date: string = "";

  registration_date: string = "";
  registration_link: string = "";
  location: string = "";
  percentage: {
    ten: number;
    twelve: number;
    ug: number;
    pg: number;
    diploma: number;
  };
  open_check: boolean;
  open_to_all: number = 0;

  filter_param: Subscription;

  company_name_list: CompanyLists[];
  c_id: string;
  c_names: string[] = [];
  c_ids: string[] = [];
  cname_sel_oh: boolean;

  pop_openall_fade: boolean = false;

  isAddRecordBtn: boolean;
  isSingleDelBtn: boolean = true;

  date_transformed: string = '';

  side_bar: boolean = false;

  page_action_text: string = 'Add';

  placement_form = new FormGroup({
    placement_fcname : new FormControl(''),
    placement_fcemail: new FormControl(''),
    placement_fpdate: new FormControl(''),
    placement_frdate: new FormControl(''),
    placement_fotall: new FormControl(''),
    placement_fcwebsite: new FormControl(''),
    placement_fjob_role: new FormControl(''),
    placement_fsfrom: new FormControl(''),
    placement_fsto: new FormControl(''),
    placement_freg_link: new FormControl(''),
    placement_floc: new FormControl(''),
    placement_fp10: new FormControl(''),
    placement_fp12: new FormControl(''),
    placement_fpug: new FormControl(''),
    placement_fppg: new FormControl(''),
    placement_fpdip: new FormControl('')

  });

  constructor(
    private filterService: FilterServ,
    public placementlistObj: PlacementListObj,
    public companylistsObj: CompanyListsObj,
    private activated_route: ActivatedRoute
  ) {

  }

  ngOnInit() {
       this.activated_route.data
        .subscribe((data: Data) => {
          this.side_bar = data["side_bar"];
          this.filterService.getSidebarData(this.side_bar);
        });

    console.log(this.company_name_list);

    this.filterService.rfilterExpMin().subscribe((f) => {
      this.filter_expmin = f;

    });

    this.filterService.rfilterResExpmin().subscribe((c) => {
      this.filter_res_expmin = c;

    });

    this.filterService.selectboxCloseCall().subscribe((selbox_call) => {
      this.shSelectBox = selbox_call;
    });


    this.filterService.popupCloseCall().subscribe((shpopup_call) => {
      this.sh_popup = shpopup_call;

    });

    this.filterService.rpopupConfirmCall().subscribe((shpopup_confirm_call) => {
      this.sh_confirm_pop = shpopup_confirm_call;

    });

    this.filterService.rmselAllFooter().subscribe((msel_all_footer_call) => {
      this.msel_all_footer = msel_all_footer_call;
    });

    this.filterService.rplacementSearchGet().subscribe((placement_search) => {
      this.placement_search = placement_search;
    });


    this.filterService.rgetAddRecordFn().subscribe((addRecCall) => {
      this.isAddRecordBtn = addRecCall;
    });



    this.selected_placement = {
      "company_name": "",
      "job_role": "",
      "placement_date": "",
      "registration_date": "",
      "salary": {
        "min_salary": null,
        "max_salary": null
      },
      "registration_link": "",
      "company_website": "",
      "location": "",
      "company_email": "",
      "percentage": {
        "ten": null,
        "twelve": null,
        "ug": null,
        "pg": null,
        "diploma": null
      },
      "open_to_all": 0
    }
    this.getCompanyData();
    this.getPlacementData();

    this.filter_param = this.filterService.filter_param_obj
      .subscribe({
        next: (res) => {
          this.placementlistObj.filterPlacementData(res)
            .subscribe({
              next: (res) => {
                   if(res.data == []) {
                      this.placement_list = [];
                      console.log('Filter Applied - No Results');
                    }
                    else {
                      this.placement_list = res.data;
                      console.log('Filter Applied');
                    }
                    console.log(res);
              }
            })
         
        }
      })

    this.filterService.rgetCnameSelsh().subscribe((cname_sel_oh) => {
      this.cname_sel_oh = cname_sel_oh;
    });

  }

  get placement_fcname() {
    return this.placement_form.get('placement_fcname');
  }

  get placement_fcemail() {
    return this.placement_form.get("placement_fcemail");
  }
  get placement_fcwebsite() {
    return this.placement_form.get("placement_fcwebsite");
  }
  get placement_fjob_role() {
    return this.placement_form.get("placement_fjob_role");
  }
  get placement_fsfrom() {
    return this.placement_form.get("placement_fsfrom");
  }
  get placement_fsto() {
    return this.placement_form.get("placement_fsto");
  }
  get placement_freg_link() {
    return this.placement_form.get("placement_freg_link");
  }

  get placement_floc() {
    return this.placement_form.get("placement_floc");
  }

  get placement_fp10() {
    return this.placement_form.get("placement_fp10");
  }
  get placement_fp12() {
    return this.placement_form.get("placement_fp12");
  }
  get placement_fpug() {
    return this.placement_form.get("placement_fpug");
  }
  get placement_fppg() {
    return this.placement_form.get("placement_fppg");
  }
  get placement_fpdip() {
    return this.placement_form.get("placement_fpdip");
  }
  get placement_fpdate() {
    return this.placement_form.get("placement_fpdate");
  }
  get placement_frdate() {
    return this.placement_form.get("placement_frdate");
  }

  getCompanyData() {
     this.companylistsObj.getCompanies()
            .subscribe({
              next: (res) => {
                this.company_name_list = res.data;
                console.log('* * * Company Fetched Successfully * * * ');
                console.info(res);
              },
              error: (err) => {
                console.log('* * * Company Not Fetched * * * ');
                console.error(err);
              }
            });
  }

  getPlacementData() {

    this.placementlistObj.getPlacements()
          .subscribe({
            next: (res) => {
              this.placement_list = res.data;
              if(this.placement_list.length == 0) {
                  this.place_no_data = false;
              }
              else {
                this.place_no_data = true;
              }
              console.log('* * * Placement Fetched Successfully * * * ');
              console.info(res);
            },
            error: (err) => {
              console.log('* * * Placement Not Fetched * * * ');
              console.info(err);
            }
          });
  }

  // customFormReset(createPlacementForm: NgForm){

  //   this.placement_list = [
  //   {

  //   company_name: "",
  //     company_email: "",
  //     company_website: "",
  //     job_role: "",
  //     placement_date: "",
  //     salary: {
  //       min_salary: null,
  //       max_salary: null
  //     },
  //     location: "",
  //     open_to_all: 0,
  //     registration_date: "",
  //     registration_link: "",
  //     percentage: {
  //       ten: null,
  //       twelve: null,
  //       ug: null,
  //       pg:null,
  //       diploma: null
  //     }
  //   }

  //   ]

  // }
  selPlaceCatgOpen(){
    if (this.place_catg_sel == true) {
      this.place_catg_sel = false;
    } else {
      this.place_catg_sel = true;
    }
  }
  cname_sel_sh() {
    if (this.cname_sel_oh == true) {
      this.cname_sel_oh = false;
    } else {
      this.cname_sel_oh = true;
    }
  }

  cpop_perc_fade() {
    if (this.pop_openall_fade == true) {
      this.pop_openall_fade = false;
    } else {
      this.pop_openall_fade = true;
    }
  }


  cnameInputClick(event: Event) {
    if ((((event.target) as HTMLInputElement).value) != "") {
      this.cname_sel_oh = false;
      this.comp_search_txt = this.placement_fcname.value;
      console.log(this.comp_search_txt)
    }
    if ((((event.target) as HTMLInputElement).value) == "") {
      this.cname_sel_oh = true;

    }

  }

  closePop() {
    if (this.sh_popup == false) {
      this.sh_popup = true;
    } else {
      this.sh_popup = false;
    }

  }

  closeEditPop() {
    this.placement_form.reset();
 
      this.page_action_text = "Add";

     if (this.sh_popup == false) {
      this.sh_popup = true;
    } else {
      this.sh_popup = false;
    }
       this.pop_openall_fade = false;

  }

  closeConfirmPop() {

    if (this.sh_confirm_pop == false) {
      this.sh_confirm_pop = true;
    } else {
      this.sh_confirm_pop = false;
    }

  }

  delConfirm() {

    if (this.confirm_ok == false) {
      this.confirm_ok = true;
    } else {
      this.confirm_ok = false;
    }
    return this.confirm_ok;
  }

  getOpenToAll(event: Event) {

    if ((event.target as HTMLInputElement).checked == true) {
        this.open_to_all = 1;
        this.placement_form.patchValue({
            placement_fp10: null,
            placement_fp12: null,
            placement_fpug: null,
            placement_fppg: null,
            placement_fpdip: null,
        });
            this.pop_openall_fade = true;        
    
    } else {
      this.open_to_all = 0;
      this.pop_openall_fade = false;
    }
  }

  shMselFooter() {
    

    if (this.msel_all_footer == false) {
      this.msel_all_footer = true;
    } else {
      this.msel_all_footer = false;
    }
     for (let b = 0; b < this.placement_list.length; b++) {
      this.placement_list[b].is_selected = 0;
      this.msel_placement_ids.pop();
      this.msel_id_nos = 0;
    }
  }

  updatePlacementDate(dateObject: any) {
    if(dateObject !== ""){
    this.place_date = dateObject;
    console.log(dateObject);
    }

  }
  updateRegistrationEndDate(dateObject: any) {
    this.register_date = dateObject;
  }


  createNewPlacement() {
          this.place_no_data = true;

    this.placementlistObj.addPlacements(
      this.placement_fcname.value,
      this.placement_fcemail.value,
      this.placement_fcwebsite.value,
      this.placement_fjob_role.value,
      this.place_date,
      this.placement_fsfrom.value,
      this.placement_fsto.value,
      this.register_date,
      this.placement_freg_link.value,
      this.placement_floc.value,
      this.open_to_all,
      this.placement_fp10.value,
      this.placement_fp12.value,
      this.placement_fpug.value,
      this.placement_fppg.value,
      this.placement_fpdip.value,
      this.place_catg_number
    )
     .subscribe({
            next: (res) => {
              this.getPlacementData();
              console.log('* * * Placement Created Successfully * * * ');
              console.info(res);
            },
            error: (err) => {
              console.log('* * * Placement Not Created * * * ');
              console.info(err);
            }
          });
   
    this.closePop();
    this.placement_form.reset();
  }

  editExistPlacement(event: Event) {
    this.page_action_text = 'Edit';
    this.sel_placement_id = ((event.currentTarget) as Element).id;

    this.placement_list.find((sel_id) => {
      if (sel_id.placement_id === this.sel_placement_id) {
        this.selected_placement = sel_id;

        this.filterService.popupOpenCall(this.sh_popup);
        this.comp_search_txt = this.selected_placement.company_name;

        this.place_date = this.selected_placement.placement_date;
        this.register_date = this.selected_placement.registration_date;


        this.placement_form.patchValue({
            placement_fcname: this.selected_placement.company_name,
            placement_fcemail: this.selected_placement.company_email,
            placement_fcwebsite: this.selected_placement.company_website,
            placement_fjob_role: this.selected_placement.job_role,
            placement_fsfrom: this.selected_placement.salary.min_salary,
            placement_fsto: this.selected_placement.salary.max_salary,
            placement_floc: this.selected_placement.location,
            placement_freg_link: this.selected_placement.registration_link,
            placement_fp10: this.selected_placement.percentage.ten,
            placement_fp12: this.selected_placement.percentage.twelve,
            placement_fpug: this.selected_placement.percentage.ug,
            placement_fppg: this.selected_placement.percentage.pg,
            placement_fpdip: this.selected_placement.percentage.diploma,
            placement_fpdate: this.selected_placement.placement_date,
            placement_frdate: this.selected_placement.registration_date,
            placement_fotall: this.selected_placement.open_to_all
        });

        if(this.selected_placement.type == 1) {
          this.place_catg_selected = "Placement";
        }
        else {
          this.place_catg_selected = "Internship";
        }

        console.log(this.open_to_all);
          if(this.selected_placement.open_to_all == 1) {
            console.log(this.open_to_all);
            this.pop_openall_fade = true;
          }
      }

    });
    this.isAddRecordBtn = false;
    console.log(this.placement_list);
  };

  getEditedValue() {

      let edited_placement = {
        company_name: this.placement_fcname.value,
        job_role: this.placement_fjob_role.value,
        placement_date: this.place_date,
        registration_date: this.register_date,
        salary: {
           min_salary: this.placement_fsfrom.value,
           max_salary: this.placement_fsto.value,
        },
         registration_link: this.placement_freg_link.value,
         company_website: this.placement_fcwebsite.value,
         location: this.placement_floc.value,
         company_email: this.placement_fcemail.value,
         percentage: {
           ten: this.placement_fp10.value,
           twelve: this.placement_fp12.value,
           ug: this.placement_fpug.value,
           pg: this.placement_fppg.value,
           diploma: this.placement_fpdip.value,
        },
        open_to_all:  this.open_to_all,
        type: this.place_catg_number
          
      }

      // company_email: this.placement_fcemail.value,
      // company_website: this.placement_fcwebsite.value,
      // job_role: this.placement_fjob_role.value,
      // placement_date: this.place_date,
      // salary: {
      //   min_salary: this.placement_fsfrom.value,
      //   max_salary: this.placement_fsto.value,
      // },
      // registration_date: this.register_date,
      // registration_link: this.placement_freg_link.value,
      // location: this.placement_floc.value,
      // open_to_all: this.open_to_all,
      // percentage: {
      //   ten: this.placement_fp10.value,
      //   twelve:this.placement_fp12.value,
      //   ug: this.placement_fpug.value,
      //   pg: this.placement_fppg.value,
      //   diploma: this.placement_fpdip.value
      // },
      // type: this.place_catg_number

    console.log(this.selected_placement);

    this.placementlistObj.editPlacement(
      this.sel_placement_id,
      edited_placement
      )
     .subscribe({
          next: (res) => {
            this.getPlacementData();
            console.log('* * * Placement Edited Successfully * * * ');
            console.info(res);
          },
          error: (err) => {
            console.log('* * * Placement Not Edited * * * ');
            console.info(err);
          }
      });

    this.closePop();
    this.placement_form.reset();
    this.page_action_text = "Add";
  };

  deleteExistPlacement(event: Event) {

    this.filterService.popupConfirmCall(this.sh_confirm_pop);

    this.sel_placement_id = ((event.currentTarget) as Element).id;

  }

  delCallService() {
    this.isSingleDelBtn = true;

    this.placementlistObj.deletePlacement(this.sel_placement_id)
          .subscribe({
              next: (res) => {
                this.getPlacementData();
                console.log('* * * Placement Deleted Successfully * * *');
                console.info(res);
              },
              error: (err) => {
                console.log('* * * Placement Not Deleted * * * ');
                console.info(err);
              }
          });
    this.closeConfirmPop();

  }

  shMConfirmPop() {
    this.isSingleDelBtn = false;

    this.filterService.popupConfirmCall(this.sh_confirm_pop);
  }

  msel_foot_selectall(event: Event) {

    for (let b = 0; b < this.placement_list.length; b++) {
      this.placement_list[b].is_selected = this.mfoot_sel_all;
    }

    let msel_all_checks = ((event.target) as HTMLInputElement).checked;
    if (msel_all_checks == true) {

      if (this.msel_placement_ids.length == 0) {
        this.msel_id_nos = 0;
        for (let i = 0; i < (this.placement_list.length); i++) {
          this.msel_placement_ids.push(this.placement_list[i].placement_id!);
          this.placement_list[i].is_selected = 1;

        }
        this.msel_id_nos = this.placement_list.length;
      } else {
        this.msel_id_nos = 0;

        let ids_len = this.msel_placement_ids.length;
        for (let a = 0; a < (ids_len); a++) {
          this.msel_placement_ids.pop();

        }
        for (let i = 0; i < (this.placement_list.length); i++) {
          this.msel_placement_ids.push(this.placement_list[i].placement_id!);

        }
        this.msel_id_nos = this.placement_list.length;

      }

      console.log(this.msel_placement_ids);

    } else {

      let ids_len = this.msel_placement_ids.length;
      for (let a = 0; a < (ids_len); a++) {
        this.msel_placement_ids.pop();
        this.placement_list[a].is_selected = 0;

      }
      this.msel_id_nos = 0;
      console.log(this.msel_placement_ids);


    }


    console.log("1");
  }

  multiDeleteExistPlacement(event: Event) {


    this.msel_all_footer = false;

    this.msel_placement_id = ((event.currentTarget) as HTMLElement).id;

    this.mfoot_sel_all = this.placement_list.every((item: any) => {
      return item.is_selected == 1;
    });
    this.mselGetCheckedList(event, this.msel_placement_id);

  }

  mselGetCheckedList(event: Event, msel_placement_id: string) {


    if (((event.target) as HTMLInputElement).checked) {

      this.msel_placement_ids.push(this.msel_placement_id);
      this.msel_id_nos++;

      for (let sel_all = 0; sel_all < this.placement_list.length; sel_all++) {
        if (this.placement_list[sel_all].is_selected === 1) {
          this.mfoot_sel_all = true;

        }
      }

    } else {
      let msel_arr_ind = this.msel_placement_ids.indexOf(this.msel_placement_id);

      if (msel_arr_ind > -1) {
        this.msel_placement_ids.splice(msel_arr_ind, 1);
        // this.msel_placement_ids.removeAt(msel_arr_ind);
      }
      this.msel_id_nos--;

      if (this.msel_id_nos == 0) {
        this.msel_all_footer = true;
      }

      // this.msel_placement_ids.pop(this.msel_placement_id);
    }
    console.log(this.msel_placement_ids);

  }


  multiDeleteCallService() {
    this.isSingleDelBtn = false;
     this.msel_id_nos = 0;
    console.log(this.msel_id_nos);

    if (this.msel_id_nos == 0) {
      this.msel_all_footer = true;
    }
    this.placementlistObj.multiDeletePlacement(this.msel_placement_ids)
           .subscribe({
              next: (res) => {
                this.getPlacementData();
                console.log('* * * Placements Deleted Successfully * * *');
                console.info(res);
              },
              error: (err) => {
                console.log('* * * Placements Not Deleted * * * ');
                console.info(err);
              }
          });

    this.closeConfirmPop();

  }

  getCompanyid(event: Event) {

    this.c_id = (event.currentTarget as HTMLElement).id;

    for (let i = 0; i < this.company_name_list.length; i++) {


      if (this.c_id == this.company_name_list[i].id) {


        // this.selected_placement.company_email = this.company_name_list[i].email;
        // this.selected_placement.company_website = this.company_name_list[i].website;

        this.comp_search_txt = this.company_name_list[i].company_name;

        this.placement_fcemail.setValue(this.company_name_list[i].email);
        this.placement_fcname.setValue(this.company_name_list[i].company_name);
        this.placement_fcwebsite.setValue(this.company_name_list[i].website);

        this.cname_sel_sh();
      }

    }

  }

  selPlaceCategory(event: Event) {
    let place_ind = ((event.currentTarget) as HTMLElement).id;
    if(place_ind == "0") {
      this.place_catg_number = 1;
      this.place_catg_selected = "Placement";
    }
    else if(place_ind == "1") {
      this.place_catg_number = 2;
      this.place_catg_selected = "Internship";
    }
  }


}

