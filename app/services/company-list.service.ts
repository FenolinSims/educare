import { Injectable, OnInit } from '@angular/core';

import { NgForm } from '@angular/forms';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Subject, Observable } from 'rxjs';

import { CompanyLists } from '../shared/listing.model';
import { PlacementList } from '../shared/listing.model';

import {environment} from '../../environments/environment';

@Injectable()

export class CompanyListsObj implements OnInit {
  private API_BASE_URL = environment.API_BASE_URL;

  company_lists: CompanyLists[] = [];
  cname_sel_oh: boolean = true;

  headers = {
      'Accept': '*/*',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, HEAD',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers': 'X-Requested-With,content-type'
    }

  updated_company_list = new Subject < CompanyLists[] > ();

  private cname_sel_list_obj = new Subject<boolean>();

  constructor(private http: HttpClient) {

  }

  ngOnInit(){


  }

  // getCnameSelsh(cname_sel_oh: boolean){
  //   this.cname_sel_list_obj.next(cname_sel_oh);
  // }

  // rgetCnameSelsh(): asObservable<boolean>{
  //   return this.cname_sel_oh.asObservable();
  // }
   getCompanies() {
    const headers = this.headers;

    return this.http.get < { message: string, data: CompanyLists[] } >
      (`${this.API_BASE_URL}educare/get-company`, { headers });
  }


  // getCompanies() {

  //   const headers = this.headers;
     

  //   this.http.get < { message: string;data: CompanyLists[] } >
  //     ("http://localhost:2020/educare/get-company", { headers })
  //     .subscribe((company_list) => {
  //       // console.log(company_list);
  //       this.company_lists = company_list.data;
  //       this.updated_company_list.next([...this.company_lists]);
  //     }
  //     );
  // }

  // getUpdatedCompanies() {
  //   return this.updated_company_list.asObservable();
  // }
 
  createCompany(
    company_name: string, 
    email: string, 
    website: string
    ) {
      if(company_name == null) {
        company_name = "";
      }
      if(email == null) {
        email = "";
      }
      if(website == null) {
        website = "";
      }

    const headers = this.headers;

    const company_list = {
      company_name: company_name,
      email: email,
      website: website,
    }

    return this.http.post(`${this.API_BASE_URL}educare/new-company`, 
      JSON.stringify(company_list), { headers } )
  }

  editCompany(selected_c_id: string, selected_company: any) {
    
      return this.http.put((`${this.API_BASE_URL}educare/edit-company/${selected_c_id}`),
       JSON.stringify(selected_company), 
      {
          headers: new HttpHeaders({
            'Accept': '*/*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, HEAD',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers': 'X-Requested-With,content-type'
          })
        }
       );
  }

  deleteCompany(selected_c_id: string) {
    return this.http.delete(`${this.API_BASE_URL}educare/delete-company/${selected_c_id}`);
  }

  multiDeletePlacement(selected_ids: any) {

    const del_obj = {
      ids: selected_ids
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

    return this.http.delete(`${this.API_BASE_URL}educare/bulk-delete-company/${del_options}`);
  }

}
