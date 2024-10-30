import { Injectable } from '@angular/core';

import { Subject, Observable, BehaviorSubject } from 'rxjs'

@Injectable()

export class FilterServ {

  shSelectBox: boolean = false;
  sh_popup: boolean = true;
  sh_confirm_pop: boolean = true;
  msel_all_footer: boolean = true;

  public filter_param_obj = new BehaviorSubject('');
  filter_param = this.filter_param_obj.asObservable();

  isAddRecordBtn: boolean = true;

  cname_sel_oh: boolean = false;

  placement_search: string = "";

  dep_id: string = "";
  batch_id: string = "";

  fetched_data: any;
  side_bar: boolean = false;

  private subject = new Subject<boolean>();
  private subject2 = new Subject<boolean>();
  private sel_subj = new Subject<boolean>();
  private pop_subj = new Subject<boolean>();
  private nav_expmin = new Subject<boolean>();
  private confirm_pop_subj = new Subject<boolean>();
  private msel_all_footSubj = new Subject<boolean>();

  private placement_search_Subj = new Subject<string>();

  private cname_sel_list_obj = new Subject<boolean>();
  private get_add_rec_obj = new Subject<boolean>();
  private side_bar_obj = new Subject<boolean>();

  private get_dep_id = new Subject<string>();
  private get_batch_id = new Subject<string>();
  private fetched_data_subj = new Subject<any>();


  // private subject3 = new Subject<number>();

  constructor() {}

  placementSearchGet(placement_search: string){
    this.placement_search_Subj.next(placement_search);
  }

  rplacementSearchGet(): Observable<string> {
    return this.placement_search_Subj.asObservable();
  }

  filterExpMin(filter_expmin: boolean){
    this.subject.next(filter_expmin);
  }

  rfilterExpMin(): Observable<boolean> {
    return this.subject.asObservable();
  }

  filterResExpmin(filter_res_expmin: boolean){
    this.subject2.next(filter_res_expmin);
  }

  rfilterResExpmin(): Observable<boolean> {
    return this.subject2.asObservable();
  }


  selectboxOpenCall(shSelectBox: boolean){
    this.sel_subj.next(shSelectBox);
  }

  selectboxCloseCall(): Observable<boolean> {
    return this.sel_subj.asObservable();
  }


  popupOpenCall(sh_popup: boolean){
    this.pop_subj.next(this.sh_popup);
  }

  popupCloseCall(): Observable<boolean> {
    return this.pop_subj.asObservable();
  }

  popupConfirmCall(sh_confirm_pop: boolean){
    this.confirm_pop_subj.next(this.sh_confirm_pop);
  }

  rpopupConfirmCall(): Observable<boolean> {
    return this.confirm_pop_subj.asObservable();
  }

  mselAllFooter(msel_all_footer: boolean){
    this.msel_all_footSubj.next(this.msel_all_footer);
  }

  rmselAllFooter(): Observable<boolean> {
    return this.msel_all_footSubj.asObservable();
  }

   sidenavExpmin(side_nav_expmin: boolean){
    this.nav_expmin.next(side_nav_expmin);
  }

  rsidenavExpmin(): Observable<boolean> {
    return this.nav_expmin.asObservable();
  }

  
   getCnameSelsh(cname_sel_oh: boolean){
    this.cname_sel_list_obj.next(cname_sel_oh);
  }

  rgetCnameSelsh(): Observable<boolean> {
    return this.cname_sel_list_obj.asObservable();
  }


   getAddRecordFn(isAddRecordBtn: boolean){
    this.get_add_rec_obj.next(isAddRecordBtn);
  }

  rgetAddRecordFn(): Observable<boolean> {
    return this.get_add_rec_obj.asObservable();
  }

  getDepId(dep_id: string){
    this.get_dep_id.next(dep_id);
  }

  rgetDepId(): Observable<string> {
    return this.get_dep_id.asObservable();
  }

   getBatchId(dep_id: string){
    this.get_batch_id.next(dep_id);
  }

  rgetBatchId(): Observable<string> {
    return this.get_batch_id.asObservable();
  }


   getBatchStudents(fetched_data: any){
    this.fetched_data_subj.next(fetched_data);
  }

  rgetBatchStudents(): Observable<any> {
    return this.fetched_data_subj.asObservable();
  }

   getSidebarData(side_bar: boolean){
    this.side_bar_obj.next(side_bar);
  }

  rgetSidebarData(): Observable<any> {
    return this.side_bar_obj.asObservable();
  }

  gfilterParam(fparam: any) {
    this.filter_param_obj.next(fparam);
  }
}
