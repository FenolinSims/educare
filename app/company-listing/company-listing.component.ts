import { Component, OnInit } from '@angular/core';

import { PlacementListObj } from '../services/placements-list.service';
import { CompanyListsObj } from '../services/company-list.service';


import { PlacementList } from '../shared/listing.model';
import {CompanyLists} from '../shared/listing.model';

import { FilterServ } from '../services/filter.service';

import { Subscription } from 'rxjs';

import { FormControl, NgForm, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Data } from '@angular/router';


@Component({
  selector: 'app-company-listing',
  templateUrl: './company-listing.component.html',
  styleUrls: ['./company-listing.component.scss',

  ]
})
export class CompanyListingComponent implements OnInit {

  sh_popup: boolean = false;
  sh_confirm_pop: boolean = false;

  placement_search: string = "";
  place_no_data: boolean = true;

  msel_placement_ids: string[] = [];
  msel_placement_id: string = "";
  msel_id_nos: number = 0;

  msel_all_footer: boolean = true;
  mfoot_sel_all: any = 0;

  company_lists: CompanyLists[];
  company_lists_selected: any;

  company_name: string;
  email: string;
  website: string;

  companylistObj_sub: Subscription;

  edit_id: string = '';
  delete_id: string = '';

  isAddRecord: boolean = true;

  isSingleDelBtn: boolean = false;

  side_bar: boolean = true;

  page_action_text: string = 'Add';

  company_form = new FormGroup({
    company_fname: new FormControl('', [
        Validators.required
    ]),
    company_femail: new FormControl('', [
      Validators.required
    ]),
    company_fwebsite: new FormControl('', [
      Validators.required
    ])
  });

  constructor(private companylistsObj: CompanyListsObj,
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

    
    this.filterService.rpopupConfirmCall().subscribe((b) => {
      this.sh_confirm_pop = b;
    });

    this.filterService.rmselAllFooter().subscribe((c) => {
      this.msel_all_footer = c;
    })

    this.getCompanyData();

    this.filterService.rplacementSearchGet().subscribe((placement_search) => {
      this.placement_search = placement_search;
      console.log(placement_search);
    });

      this.company_lists_selected = {
        company_name: "",
        email: "",
        website: ""
      }

  }

  getCompanyData() {
   this.companylistsObj.getCompanies()
          .subscribe({
            next: (res) => {
              this.company_lists = res.data;
              if(this.company_lists.length == 0) {
                  this.place_no_data = false;
              }
              else {
                this.place_no_data = true;
              }
              console.log('* * * Company Fetched Successfully * * * ');
              console.info(res);
            },
            error: (err) => {
              console.log('* * * Company Not Fetched * * * ');
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


  closePop(){
    if (this.sh_popup == false) {
      this.sh_popup = true;
    } else {
      this.sh_popup = false;
    }
  }

   closeEditPop() {
    this.company_form.reset();
    this.isAddRecord = true;
    
      this.page_action_text = "Add";
         // this.companylistsObj.getCompanies();
         //  this.companylistObj_sub = this.companylistsObj.getUpdatedCompanies()
         //    .subscribe((company_lists: CompanyLists[]) => {
         //      this.company_lists = company_lists;
         //  })

     if (this.sh_popup == false) {
      this.sh_popup = true;
    } else {
      this.sh_popup = false;
    }

  }

  shMselFooter() {

    if (this.msel_all_footer == false) {
      this.msel_all_footer = true;
    } else {
      this.msel_all_footer = false;
    }
      for (let b = 0; b < this.company_lists.length; b++) {
      this.company_lists[b].is_selected = 0;
      this.msel_placement_ids.pop();
      this.msel_id_nos = 0;
    }
  }

 shMConfirmPop() {
    this.isSingleDelBtn = false;
    this.filterService.popupConfirmCall(this.sh_confirm_pop);
  }


  msel_foot_selectall(event: Event) {

    for (let b = 0; b < this.company_lists.length; b++) {
      this.company_lists[b].is_selected = this.mfoot_sel_all;
    }

    let msel_all_checks = ((event.target) as HTMLInputElement).checked;
    if (msel_all_checks == true) {

      if (this.msel_placement_ids.length == 0) {
        this.msel_id_nos = 0;
        for (let i = 0; i < (this.company_lists.length); i++) {
          this.msel_placement_ids.push(this.company_lists[i].id);
          this.company_lists[i].is_selected = 1;

        }
        this.msel_id_nos = this.company_lists.length;
      } else {
        this.msel_id_nos = 0;

        let ids_len = this.msel_placement_ids.length;
        for (let a = 0; a < (ids_len); a++) {
          this.msel_placement_ids.pop();

        }
        for (let i = 0; i < (this.company_lists.length); i++) {
          this.msel_placement_ids.push(this.company_lists[i].id);

        }
        this.msel_id_nos = this.company_lists.length;

      }

      console.log(this.msel_placement_ids);

    } else {

      let ids_len = this.msel_placement_ids.length;
      for (let a = 0; a < (ids_len); a++) {
        this.msel_placement_ids.pop();
        this.company_lists[a].is_selected = 0;

      }
      this.msel_id_nos = 0;
      console.log(this.msel_placement_ids);


    }


    console.log("1");
  }

  multiDeleteExistPlacement(event: Event) {

    this.msel_all_footer = false;

    this.msel_placement_id = ((event.currentTarget) as HTMLElement).id;

    this.mfoot_sel_all = this.company_lists.every((item: any) => {
      return item.is_selected == 1;
    });
    this.mselGetCheckedList(event, this.msel_placement_id);

  }

  mselGetCheckedList(event: Event, msel_placement_id: string) {


    if (((event.target) as HTMLInputElement).checked) {

      this.msel_placement_ids.push(this.msel_placement_id);
      this.msel_id_nos++;

      for (let sel_all = 0; sel_all < this.company_lists.length; sel_all++) {
        if (this.company_lists[sel_all].is_selected === 1) {
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

    this.companylistsObj.multiDeletePlacement(this.msel_placement_ids)
           .subscribe({
                next: (res) => {
                  this.getCompanyData();
                  console.log('* * * Companies Deleted Successfully * * * ');
                  console.info(res);
                },
                error: (err) => {
                  console.log('* * * Companies Not Deleted * * * ');
                  console.error(err);
                }
              });
    this.msel_id_nos = 0;

    if (this.msel_id_nos == 0) {
      this.msel_all_footer = true;
    }
    this.closeConfirmPop();

  }

  get company_fname() {
    return this.company_form.get('company_fname');
  }

   get company_femail() {
    return this.company_form.get('company_femail');
  }
   get company_fwebsite() {
    return this.company_form.get('company_fwebsite');
  }

  createCompany(){

          this.place_no_data = true;
    
    this.companylistsObj.createCompany(
          this.company_name = this.company_fname.value,
          this.email = this.company_femail.value,
          this.website = this.company_fwebsite.value
      )
      .subscribe({
            next: (res) => {
              this.getCompanyData();
              console.log('* * * Company Created Successfully * * * ');
              console.info(res);
            },
            error: (err) => {
              console.log('* * * Company Not Created * * * ');
              console.error(err);
            }
          });

    this.sh_popup = false;
    this.company_form.reset();
  }

  getEditedCompany(event: Event) {
    this.isAddRecord = false;
    this.page_action_text = "Edit";

    this.edit_id = ((event.currentTarget) as HTMLElement).id;

    this.company_lists.find((c_obj) => {
        if(c_obj.id === this.edit_id){
            this.company_lists_selected = c_obj;
            this.company_form.patchValue({
              company_fname: this.company_lists_selected.company_name,
              company_femail: this.company_lists_selected.email,
              company_fwebsite: this.company_lists_selected.website,

            });
        }
      
    });
    this.sh_popup = true;


  }

  callEditedCompanyService() {
    this.sh_popup = false;
    this.isAddRecord = true;

        let company_lists_selected = {
          company_name: this.company_fname.value,
          email:this.company_femail.value,
          website: this.company_fwebsite.value,
        }

        this.companylistsObj.editCompany( this.edit_id , company_lists_selected)
              .subscribe({
                next: (res) => {
                  this.getCompanyData();
                  console.log('* * * Company Edited Successfully * * * ');
                  console.info(res);
                },
                error: (err) => {
                  console.log('* * * Company Not Edited * * * ');
                  console.error(err);
                }
              });
        this.company_form.reset();
  }

  deleteCompany(event: Event){
      this.isSingleDelBtn = true;
      this.filterService.popupConfirmCall(this.sh_confirm_pop); 
      this.delete_id = ((event.currentTarget) as HTMLElement).id;
  }

  callDeleteCompany() {
      this.companylistsObj.deleteCompany(this.delete_id)
            .subscribe({
              next: (res) => {
                this.getCompanyData();
                console.info(`* * * Company Deleted Successfully * * *${res}`)
              },
              error: (err) => {
                console.error(`* * * Company Not Deleted * * * ${err}`)
              }
            });
      this.closeConfirmPop();
  }

  multiDeleteCompany(){
      this.isSingleDelBtn = false;

  }

}
