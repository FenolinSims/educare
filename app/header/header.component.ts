import { Component, OnInit } from '@angular/core';

import { FilterServ } from '../services/filter.service';

import { ActivatedRoute, Data } from '@angular/router';

import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  placement_search: string = "";

  filter_expmin: boolean = false;
  filter_res_expmin: boolean = true;

  sh_popup: boolean = false;
  isAddRecordBtn: boolean ;


  msel_all_footer: boolean = false;

  page_title: string = 'Placement';
  filter: boolean = false;
  add_rec: boolean = false;
  head_search: boolean = false;

  search_close: boolean = true;
  page_action_text: string = 'Add';
  
  place_no_data:boolean = true;

  constructor(private filterService: FilterServ, public activatedroute: ActivatedRoute,
      private route: Router
    ) {}

  ngOnInit() {

     this.activatedroute.data.subscribe((data: Data) => {
      this.page_title = data['title'];
      this.filter = data['filter'];
      this.add_rec = data['add_rec'];
      this.head_search = data['head_search'];
    });

    this.filterService.rgetAddRecordFn().subscribe((addRecCall) => {
        this.isAddRecordBtn = addRecCall;
    });

    this.filterService.rmselAllFooter().subscribe((msel_all_footer_call) => {
      this.msel_all_footer = msel_all_footer_call;
    });

  }

  sendPlacementSearch() {
    if(this.placement_search != "") {
      this.search_close = false;
    }
    else {
      this.search_close = true;
    }

    this.filterService.placementSearchGet(this.placement_search);
  }

  searchReset() {
      this.placement_search = "";
      this.sendPlacementSearch();
    this.filterService.placementSearchGet(this.placement_search);
  }

  filterExpMin(filter_expmin: boolean, filter_res_expmin: boolean) {

    if (this.filter_expmin == false) {

      this.filter_expmin = true;
      this.filter_res_expmin = true;
      // return this.filter_expmin;

    } else {

      this.filter_expmin = false;
      this.filter_res_expmin = false;
      // return this.filter_expmin;
    }

    this.filterService.filterExpMin(this.filter_expmin);
    this.filterService.filterResExpmin(this.filter_res_expmin);
  }

    popupOpenCall(sh_popup: boolean){
      this.filterService.mselAllFooter(this.msel_all_footer);
      if(this.sh_popup == false){
          this.sh_popup = true;
      }
      else {
        this.sh_popup = false;
      }

      this.filterService.popupOpenCall(this.sh_popup);
      this.addRecBtnChange();

  } 

  logout() {
    this.route.navigateByUrl('admin-login');
  }  
   
  addRecBtnChange(){
     
      this.isAddRecordBtn = true;
    this.filterService.getAddRecordFn(this.isAddRecordBtn);
  }

}
