import { Component, OnInit } from '@angular/core';

import { FilterServ } from '../services/filter.service';

import { PlacementListObj } from '../services/placements-list.service';

import { PlacementList } from '../shared/listing.model';

import { Subscription } from 'rxjs';

import { Options } from "@angular-slider/ngx-slider";

import { DateFormatDirective } from '../format-datepicker.directive';

import {NgForm} from "@angular/forms";


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})

export class FilterComponent implements OnInit {

  placement_list: PlacementList[];
  placementlistObj_sub: Subscription;

  // placement_filter_data: PlacementFilterData[];

  placement_filter_data: PlacementFilterData = {
    placement_date: "",
    registration_date: "",
    min_salary: 0,
    max_salary: 0,
    placement_status: 0,
    ten:0,
    twelve: 0,
    ug: 0,
    pg: 0,
    diploma: 0,
    open_to_all: 0
    }
  
  placement_filter_param: string = "";

  outputDateFormat = 'yyyy-MM-DD';

  placement_date: string = "";
  registration_date: string = "";

  sal_value = 0;
  sal_highValue = 0;
  sal_options: Options = {
    floor: 0,
    ceil: 900000,
    step: 50000,
    showSelectionBarEnd: true
  };


  tenth_mival = 10;
  tenth_maval = 100;
  tenth_options : Options = {
    floor: 10,
    ceil: 100,
    step: 5,
    showSelectionBarEnd: true
  };

  twelth_mival = 10;
  twelth_maval = 100;
  twelth_options : Options = {
    floor: 10,
    ceil: 100,
    step: 5,
    showSelectionBarEnd: true
  };

  ug_mival = 10;
  ug_maval = 100;
  ug_options : Options = {
    floor: 10,
    ceil: 100,
    step: 5,
    showSelectionBarEnd: true
  };

  pg_mival = 10;
  pg_maval = 100;
  pg_options : Options = {
    floor: 10,
    ceil: 100,
    step: 5,
    showSelectionBarEnd: true
  };

  dip_mival = 10;
  dip_maval = 100;
  dip_options : Options = {
    floor: 10,
    ceil: 100,
    step: 5,
    showSelectionBarEnd: true
  };

  selopenb: boolean = false;
  selopen_mon: boolean = false;
  selopen_yr: boolean = false;

  percent_disable: boolean = false;

  filter_header: number;

  salselected: String;
  s_mon_selected: String;
  s_yr_selected: String;

  sv_1: string;
  sv_2: string;

  d_no: number = 0;
  filter_expmin: boolean;
  filter_res_expmin: boolean;
  filter_expminup: boolean= true;

  sel_date: SelDate[];
  sel_month: SelMonth[];
  sel_year: SelYear[];
    h: number = 0;
    g: number;
    i: number = 1;
    a: any;

  slider_val_1: string = "1k";
  slider_val_2: string = "6k";

  open_to_all: any = 0;
  placement_sts: String[] = ['On Progress', 'Waiting for Result', 'Expired', 'Pending'];
  placement_sts_selected: string = '';
  psts_number: number = 4;

  filt_res_id: string = '';
  filt_keys: any = [];
  filt_values: any = [];

  tfilt_keys: any = [];
  tfilt_values: any = [];
  sal_val: any = '';

  constructor(private filterService: FilterServ,
              private placementlistObj: PlacementListObj
    ) {


  }


  ngOnInit() {



  this.selDateNo();

  this.selMonthNo();
  this.selYearNo();



    this.salselected = "1";
    this.s_mon_selected = "1";
    this.s_yr_selected = "2000";

    this.filterService.rfilterExpMin().subscribe( (f) => {
      this.filter_expmin = f;

    } );

     this.filterService.rfilterResExpmin().subscribe( (g) => {
      this.filter_res_expmin = g;

    } );
    

  }

   updatePlacementDate(dateObject: any) {
    if(dateObject !== ""){
    this.placement_date = dateObject;

    }

  }

   updateRegisterDate(dateObject: any) {
    if(dateObject !== ""){
    this.registration_date = dateObject;

    }

  }

  filterClose(){
     this.filterService.filterExpMin(this.filter_expmin);
  }  

  // selectbox

  selopen() {
    if (this.selopenb == false) {
      this.selopenb = true;
    } else {
      this.selopenb = false;
    }
  }

  selopenMon() {
    if (this.selopen_mon == false) {
      this.selopen_mon = true;
    } else {
      this.selopen_mon = false;
    }
  }

   selopenYr() {
    if (this.selopen_yr == false) {
      this.selopen_yr = true;
    } else {
      this.selopen_yr = false;
    }
  }


  selectedOption(event: Event) {
    this.placement_sts_selected = (event.target as HTMLElement).innerText;
    this.placement_sts_sn_changer();
  }

  placement_sts_sn_changer() {
    if(this.placement_sts_selected == 'On Progress') {
      this.psts_number = 0;
    }
    else if (this.placement_sts_selected == 'Waiting for Result') {
      this.psts_number = 1;
    }
    else if (this.placement_sts_selected == 'Expired') {
      this.psts_number = 2;
    }
    else if (this.placement_sts_selected == 'Pending') {
      this.psts_number = 3;
    }
  }

  placement_sts_ns_changer(psts_no: any) {
    if(psts_no == 0) {
      this.placement_sts_selected = 'On Progress';
    }
    else if (psts_no == 1) {
      this.placement_sts_selected = 'Waiting for Result';
    }
    else if (psts_no == 2) {
      this.placement_sts_selected = 'Expired';
    }
    else if (psts_no == 3) {
      this.placement_sts_selected = 'Pending'
    }
  }

  selectedOptionMonth(event: Event) {
    this.s_mon_selected = (event.target as HTMLElement).innerText;
  }

  selectedOptionYear(event: Event) {
    this.s_yr_selected = (event.target as HTMLElement).innerText;
  }  


  getSliderValue1(event: Event){
      this.sv_1 = (event.target as HTMLInputElement).value;


      this.slider_val_1 = ( parseInt(this.sv_1) / 100000 ) + "k";

  }

   getSliderValue2(event: Event){
      this.sv_2 = (event.target as HTMLInputElement).value;

      this.slider_val_2 = ( parseInt(this.sv_2) / 100000 ) + "k";


  }

   selDateNo(){

    this.sel_date = [

          { id: "sd1", sd_no: 1 },
          { id: "sd2", sd_no: 2 },
          { id: "sd3", sd_no: 3 },
          { id: "sd4", sd_no: 4 },
          { id: "sd5", sd_no: 5 },
          { id: "sd6", sd_no: 6 },
          { id: "sd7", sd_no: 7 },
          { id: "sd8", sd_no: 8 },
          { id: "sd9", sd_no: 9 },
          { id: "sd10", sd_no: 10 },
          { id: "sd11", sd_no: 11 },
          { id: "sd12", sd_no: 12 },
          { id: "sd13", sd_no: 13 },
          { id: "sd14", sd_no: 14 },
          { id: "sd15", sd_no: 15 },
          { id: "sd16", sd_no: 16 },
          { id: "sd17", sd_no: 17 },
          { id: "sd18", sd_no: 18 },
          { id: "sd19", sd_no: 19 },
          { id: "sd20", sd_no: 20 },
          { id: "sd21", sd_no: 21 },
          { id: "sd22", sd_no: 22 },
          { id: "sd23", sd_no: 23 },
          { id: "sd24", sd_no: 24 },
          { id: "sd25", sd_no: 25 },
          { id: "sd26", sd_no: 26 },
          { id: "sd27", sd_no: 27 },
          { id: "sd28", sd_no: 28 },
          { id: "sd29", sd_no: 29 },
          { id: "sd30", sd_no: 30 },
          { id: "sd31", sd_no: 31 },


    ];
  }


     selMonthNo(){

    this.sel_month = [

          { id: "sm1", sm_no: 1 },
          { id: "sm2", sm_no: 2 },
          { id: "sm3", sm_no: 3 },
          { id: "sm4", sm_no: 4 },
          { id: "sm5", sm_no: 5 },
          { id: "sm6", sm_no: 6 },
          { id: "sm7", sm_no: 7 },
          { id: "sm8", sm_no: 8 },
          { id: "sm9", sm_no: 9 },
          { id: "sm10", sm_no: 10 },
          { id: "sm11", sm_no: 11 },
          { id: "sm12", sm_no: 12 },

    ];



   // for(this.d_no = 0; this.d_no<32; this.d_no++){

   //  this.sel_date[] = {

   //      id: "sd" + this.d_no,
   //      sd_no: this.d_no

   //   };

   //  }

   //  return this.sel_date;

  }

   selYearNo(){

    for(this.h=1; this.h<2; this.h++){

    this.a = [
    {
        id: "sy0",
        sy_no: 2000 
      }
      ];


    for(this.g=2001; this.g<=2200; this.g++){

      this.a.push({id: "sy" + this.i++, sy_no: this.g});

  }

    };

      this.sel_year = this.a;

};
 
  filterResExpmin(filter_res_expmin: boolean) {
     if (this.filter_res_expmin == false || this.filter_expminup == false) {

      this.filter_res_expmin = true;

      this.filter_expminup = true;

      // return this.filter_expmin;

    } else {

      this.filter_res_expmin = false;
      this.filter_expminup = false;

      // return this.filter_expmin;
    }

    this.filterService.filterResExpmin(this.filter_res_expmin);

  }
      
  // ngAfterViewInit(){
  
  //   this.filterhead.nativeElement.classList.remove("filter-expmin");

  //   this.filter_header = this.filterhead.nativeElement.offsetHeight;
  //   console.log(this.filterhead.nativeElement.offsetHeight);
  //   this.filterService.filterHeadExpmin(this.filter_header);

  //   console.log(this.filterhead.nativeElement.className);
  // }

  percentDisable(){
    if(this.percent_disable == false){
      this.percent_disable = true;
      this.open_to_all = 1;

    }
    else {
      this.percent_disable = false;
      this.open_to_all = 0;
    }

  }

  // slider1 = document.querySelector("#slider1") !as HTMLInputElement;
  // slider2 = document.querySelector("#slider2") !as HTMLInputElement;



  //  slider1_inpval = parseInt(this.slider1.value)!;

  //  slider2_inpval = parseInt(this.slider2.value)!;





  // slider_val1 = document.getElementById("range_val1") !;
  // slider_val2 = document.getElementById("range_val2") !;

  // min_gap = 0;

  // slideOne() {

  //   if (parseInt(this.slider2.value) - parseInt(this.slider1.value) <= this.min_gap) {

  //     this.slider1_inpval = parseInt(this.slider2.value) - this.min_gap;

  //   }
  //   this.slider_val1.textContent = this.slider1.value;
  // }

  // slideTwo() {

  //   if (parseInt(this.slider2.value) - parseInt(this.slider1.value) <= this.min_gap) {

  //     this.slider2_inpval = parseInt(this.slider1.value) + this.min_gap;

  //   }
  //   this.slider_val2.textContent = this.slider2.value;

  // }

  //  this.slideOne();
  // this.slideTwo();

  filterPlacement(filer_placement: NgForm) {
    this.placement_filter_param = "";

    this.placement_filter_data = {
        placement_date: this.placement_date,
        registration_date: this.registration_date,
        min_salary: this.sal_value,
        max_salary: this.sal_highValue,
        placement_status: this.psts_number,
        ten: this.tenth_mival,
        twelve: this.twelth_mival,
        ug: this.ug_mival,
        pg: this.pg_mival,
        diploma: this.dip_mival,
        open_to_all: this.open_to_all
      }

    // this.placement_filter_data.placement_date = this.placement_date;
    //   this.placement_filter_data.min_salary = this.sal_value;
    //   this.placement_filter_data.max_salary = this.sal_highValue;


    //   Object.entries(this.placement_filter_data).forEach(([key, value]) => {
    //     if(value == '') {
    //     }
    //     else {
    //       let str2 = key + "=" + value + "&";

    //       this.placement_filter_param += str1.concat(str2.toString());
    //     } 
    

    // });
    
    this.generateFilter();
    
    console.log(this.placement_filter_param.slice(0, -1));
    this.filterService.gfilterParam(this.placement_filter_param.slice(0, -1));

    // this.placementlistObj.filterPlacementData(this.placement_filter_param.slice(0, -1))
    //   .subscribe({
    //     next: (res) => {
    //       console.log(res);

    //       // this.placement_list = res.data;
    //       console.log('Filter Applied Successfully');
    //     },
    //     error: (err) => {
    //       console.log('Filter Not Applied : '+ err);

    //     }
    //   });

  }

  clearIndFilter(event: Event) {
    this.filt_res_id = (event.currentTarget as HTMLElement).id;
    console.log(this.filt_res_id);
    if(this.filt_res_id == 'Placement Date') {
       this.placement_filter_data.placement_date = null;
       this.placement_date = null;
      document.getElementById(this.filt_res_id).remove();
      console.log(document.getElementById(this.filt_res_id));
    }
    if(this.filt_res_id == 'Registration Date') {
       this.placement_filter_data.registration_date = null;
       this.registration_date = null;
      document.getElementById(this.filt_res_id).remove();
      console.log(document.getElementById(this.filt_res_id));
    }
    else if(this.filt_res_id == 'Placement Status') {

       this.placement_filter_data.placement_status = null;
       this.placement_sts_selected = null;
       this.psts_number == null;
       this.psts_number = 4;
      document.getElementById(this.filt_res_id).remove();

    }
    else if(this.filt_res_id == 'Ten' || this.filt_res_id == 'Twelve' || this.filt_res_id == 'Ug' ||
            this.filt_res_id == 'Pg' || this.filt_res_id == 'Diploma'
      ) {

        if(this.filt_res_id == 'Ten') {
            this.placement_filter_data.ten = '';
            this.tenth_mival = 10;
        }
        if(this.filt_res_id == 'Twelve') {
            this.placement_filter_data.twelve = '';
            this.twelth_mival = 10;
        }
        if(this.filt_res_id == 'Ug') {
            this.placement_filter_data.ug = '';
            this.ug_mival = 10;
        }
        if(this.filt_res_id == 'Pg') {
            this.placement_filter_data.pg = '';
            this.pg_mival = 10;
        }
        if(this.filt_res_id == 'Diploma') {
            this.placement_filter_data.diploma = '';
            this.dip_mival = 10;
        }
       

       document.getElementById(this.filt_res_id).remove();

    }
    else if(this.filt_res_id == 'Salary') {
       this.sal_value = 0;
       this.sal_highValue = 0;
       document.getElementById(this.filt_res_id).remove();

    }

      this.generateFilter();

  }

  generateFilter() {
      this.filt_keys = [];
      this.filt_values = [];

      this.tfilt_keys = [];
      this.tfilt_values = [];
      this.sal_val = '';

      let str1 = "", fk, fv, fv_res;

      for(let [key, value] of (Object.entries(this.placement_filter_data))) {

        if(value == '' || value == null || value == 10 || value == 0 ) {
          continue;
        }
        else if(this.open_to_all == 1) {
          this.placement_filter_data.ten = 10;
          this.placement_filter_data.twelve = 10;
          this.placement_filter_data.ug = 10;
          this.placement_filter_data.pg = 10;
          this.placement_filter_data.diploma = 10;
        }
        else if(key == 'placement_status')  {
          if(this.psts_number == 4) {
            continue;
          }
          else {
            this.placement_sts_ns_changer(value);
            this.convertKeyResults(key);
            
            this.filt_keys.push(key);
            this.tfilt_values.push(this.placement_sts_selected);

            console.log(this.filt_values);

            this.generateFilterStrings(key, value);
            continue;
          }

        }


        // if(key == 'min_salary' || key == 'max_salary') {

        //     for(fk of (this.filt_keys)) {

        //         fk = 'Salary';
        //         this.tfilt_keys.push(fk);

        //         continue;

        //         fk = fk.replaceAll('_', ' ');
        //         fk = fk.split(' ');
        //         fk = this.toPascalCaseWord(fk);
        //         this.tfilt_keys.push(fk);

        //         this.filt_keys.push(key);
        //         console.log(this.filt_keys);

        //     }
           

        //     for(fv of (this.filt_values)) {
        //       console.log(fv);
              
        //       this.filt_values.push(value);
        //       console.log(this.filt_values);

        //       this.tfilt_values.push(fv);
        //       console.log(this.tfilt_values);

        //       if(fv.toString().slice(-3) === '000') {
        //         console.log(fv);
        //         fv_res = fv.toString().concat('-');
        //         console.log(fv_res);
        //       }

        //       else {
        //         this.tfilt_values.push(fv);
        //       }
              
        //       this.tfilt_values.push(fv_res);

        //       console.log(this.tfilt_values);
        //       console.log(this.filt_values);
        //     }
        //     console.log(this.tfilt_values);
        // }

        else if(value.toString().slice(-3) == '000') {
            this.sal_val = this.sal_val.concat(value.toString(), '-');
            // this.sal_val =  this.sal_val + value.toString() + '-';
            console.log(this.sal_val);
            console.log(value.toString().slice(-3));
            if(this.sal_val.length > 7) {
              this.convertKeyResults(key);
              this.tfilt_values.push(this.sal_val.slice(0, -1));
              console.log(this.tfilt_values);
            }
            
          continue;              
            
        }

        else {
          this.convertKeyResults(key);
          this.tfilt_values.push(value);

          console.log(this.tfilt_values);
          console.log(this.filt_values);

          this.generateFilterStrings(key, value);
        }   
      }
  }

  convertKeyResults(fk: any) {
      fk = fk.replaceAll('_', ' ');
      fk = fk.split(' ');
      fk = this.toPascalCaseWord(fk);
      console.log(fk);
      if(fk == 'Min Salary' || fk == 'Max Salary') {
        let sal_txt = 'Salary';
        this.tfilt_keys.push(sal_txt);
      }
      else {
        this.tfilt_keys.push(fk);
      }

      console.log(this.filt_keys);
  }

  generateFilterStrings(key: any, value: any) {
      let str1 = "";
      console.log(this.filt_keys + ':' + this.filt_values);

      let str2 = key + "=" + value + "&";

      this.placement_filter_param += str1.concat(str2.toString());
      console.log(this.placement_filter_param);
  }

  toPascalCaseWord(word_arr: any) {
    console.log(word_arr);
    let pascal_res = '';
    for(let word of word_arr) {

      pascal_res += word.substr(0, 1).toUpperCase() + word.substr(1).toLowerCase() + ' ';
      pascal_res.concat(pascal_res);

    }
    pascal_res = pascal_res.slice(0, pascal_res.length - 1)
    return pascal_res;
  }

}



interface PlacementFilterData  {
    placement_date?: string;
    registration_date: string;
    min_salary: any;
    max_salary: any;
    placement_status: any;
    ten: any;
    twelve: any;
    ug: any;
    pg: any;
    diploma: any;
    open_to_all: any;
}

class SelDate{

  id: string;
  sd_no: number;

}


class SelMonth{

  id: string;
  sm_no: number;

}


class SelYear{

  id: string;
  sy_no: number;

}
