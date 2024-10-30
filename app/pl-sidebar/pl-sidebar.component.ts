import { Component, OnInit } from '@angular/core';

import { FilterServ } from '../services/filter.service';
import { ActivatedRoute, Data } from '@angular/router';


@Component({
  selector: 'app-pl-sidebar',
  templateUrl: './pl-sidebar.component.html',
  styleUrls: ['./pl-sidebar.component.scss']
})
export class PlSidebarComponent implements OnInit {

  side_nav_expmin: boolean = true;

  side_bar: boolean = true;

  constructor(private filterService: FilterServ,
    private route: ActivatedRoute
    ) { }

  ngOnInit() {
    this.filterService.rgetSidebarData()
      .subscribe((side_bar) => {
        // console.log(side_bar);
        this.side_bar = side_bar;
      });
  }

  sidenavExpmin(side_nav_expmin: boolean){
    if(this.side_nav_expmin == false){
        this.side_nav_expmin = true;
    }
    else {
      this.side_nav_expmin = false;
    }
    this.filterService.sidenavExpmin(this.side_nav_expmin);
  }

}
