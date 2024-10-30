import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PlacementList } from '../shared/listing.model';

import { Subject, Observable } from 'rxjs';
import {environment} from '../../environments/environment';


@Injectable()

export class PlacementListObj {

  private API_BASE_URL = environment.API_BASE_URL;

  placement_list: PlacementList[];
  update_placement_list = new Subject < PlacementList[] > ();

  company_name: string = "";
  company_email: string = "";
  company_website: string = "";
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
  open_to_all: number;


  constructor(private http: HttpClient) {


    // this.placement_list = [
    //     {
    //     "company_name": "Infosys",
    //     "job_role": "developer",
    //     "placement_date": "12-10-2021",
    //     "min_salary": 20000,
    //     "max_salary": 499994,
    //     "percentage": {
    //         "ten": 50,
    //       "twelve": 50,
    //       "ug": 60,
    //       "pg": 50,
    //       "deplomo": 50,
    //     },
    //     "location": "chennai",
    //     "registration_link": "link",
    //     "registration_date": "20-12-2021",
    //     "company_email": "www",
    //     }

    // ];

  }



  getPlacements() {
    return this.http.get < { message: string, data: PlacementList[] } >
          (`${this.API_BASE_URL}educare/view-placement`);
  };

  // getUpdatePlacements() {
  //   return this.update_placement_list.asObservable();
  // }



  addPlacements(
    company_name: string,
    company_email: string,
    company_website: string,
    job_role: string,
    placement_date: string,
    min_salary: number,
    max_salary: number,
    registration_date: string,
    registration_link: string,
    location: string,
    open_to_all: number,
    ten: number,
    twelve: number,
    ug: number,
    pg: number,
    diploma: number,
    type: number
  ) {
    

    const headers = {
      'Accept': '*/*',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, HEAD',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers': 'X-Requested-With,content-type'
    }
        if(company_name == null) {
          company_name = "";
        }
        if(company_email == null) {
            company_email = "";          
        }
        if(company_website == null) {
          company_website = "";
        }
        if(job_role == null) {
          job_role = "";
        }
        if(placement_date == null) {
          placement_date = "";
        }
         
        if(location == null) {
          location = "";
        }
        if(registration_date == null) {
          registration_date = "";
        }
        if(registration_link == null) {
          registration_link = "";
        }
       

        const placement_list = {
            company_name: company_name,
            company_email: company_email,
            company_website: company_website,
            job_role: job_role,
            placement_date: placement_date,
            salary: {
              min_salary: min_salary,
              max_salary: max_salary
            },
            location: location,
            open_to_all: open_to_all,
            registration_date: registration_date,
            registration_link: registration_link,
            percentage: {
              ten: ten,
              twelve: twelve,
              ug: ug,
              pg: pg,
              diploma: diploma
            },
            type: type
       };
     return this.http.post(`${this.API_BASE_URL}educare/new-placement`,
        JSON.stringify(placement_list), { headers });

  }

  editPlacement(sel_placement_id: string, selected_placement: any) {

    return this.http.put(`${this.API_BASE_URL}educare/edit-placement/${sel_placement_id}`,
        JSON.stringify(selected_placement), {
          headers: new HttpHeaders({
            'Accept': '*/*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, HEAD',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers': 'X-Requested-With,content-type'
          })
        }
      );
  };


  deletePlacement(selected_id: string) {
    return this.http.delete(`${this.API_BASE_URL}educare/delete-placement/${selected_id}`);
  };

  multiDeletePlacement(msel_placement_ids: string[]) {

    let del_obj = {
      ids: msel_placement_ids
    }
 
    const del_options = {
      headers: new HttpHeaders({
        'Accept': '*/*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, HEAD',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers': 'X-Requested-With,content-type'
      }),
      body: JSON.stringify(del_obj)
    }

    return this.http.delete(`${this.API_BASE_URL}educare/bulk-delete-placement`,
          del_options)
  }

  filterPlacementData(filter_param: any){
    return this.http.get<{data: PlacementList[], statuscode: number}>
              (`${this.API_BASE_URL}educare/view-placement?${filter_param}`);
  }

}
