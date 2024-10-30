import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Data } from '@angular/router';

import { FilterServ } from '../services/filter.service';

import {NgForm} from "@angular/forms";

import {Router} from '@angular/router';

import {FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {

  side_bar: boolean = false;

  email_wrong: boolean = false;
  pass_wrong: boolean = false;


  admin_login = new FormGroup({
    admin_email: new FormControl('', [
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
      ]),
    admin_pass: new FormControl('', [
       Validators.required,
       Validators.pattern("^[1-9]+")
      ])
  });

  constructor(private activated_route: ActivatedRoute,
             private route: Router,
             private filterService: FilterServ
    ) { }

  ngOnInit() {
    this.side_bar = true;
    
     this.activated_route.data
        .subscribe((data: Data) => {
          this.side_bar = data["side_bar"];
          this.filterService.getSidebarData(this.side_bar);
          console.log(data["side_bar"]);
        });
  }

  adminLogin() {
      if(this.admin_email.value === "placementadmin@email.com" &&
        this.admin_pass.value === "123456"
        ) {
      this.route.navigateByUrl("/placement");  

      }
      else if(this.admin_email.value != "placementadmin@email.com" || 
          this.admin_pass.value != "123456") {

        if(this.admin_email.value != "placementadmin@email.com" &&
          this.admin_pass.value != "123456"
          ) {
        this.email_wrong = true;
        this.pass_wrong = true;                    
        }
        else if(this.admin_email.value != "placementadmin@email.com"){
        this.email_wrong = true;
        }
        else{
        this.pass_wrong = true;
        }

      }
       
  }

  get admin_email() {
    return this.admin_login.get('admin_email');
  }

  get admin_pass() {
    return this.admin_login.get('admin_pass');
  }

}
