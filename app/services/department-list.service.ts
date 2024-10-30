import {Injectable} from '@angular/core';

import {Subject, Observable} from 'rxjs';
import {mergeMap} from 'rxjs/operators';


import {DepartmentLists} from '../shared/listing.model';
import {Students} from '../shared/listing.model';
import {Batches} from '../shared/listing.model';

import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Subscription} from 'rxjs';
import {environment} from '../../environments/environment';


@Injectable()

export class DepartmentList{
	private API_BASE_URL = environment.API_BASE_URL;

	dep_lists: DepartmentLists[] = [];
	students: Students[] = [];
	batches: Batches[] = [];

	selected_dep: any;

	department_name: string = "";
  category: string = "";
  duration: string = "";
  department_head: string = "";
  incharge: string = "";
  incharge_phone: string = "";
  incharge_mail: string = "";

	updated_dep_list = new Subject<DepartmentLists[]>();
	updated_student_list = new Subject<any>();

	fetched_dep_data: any;

	fetched_data: any;
	fetched_dep_data_def = new Subject<any>();

	constructor(private http: HttpClient) {

	}

	ngOnInit() {

		 this.selected_dep = {
        "department_name": "",
        "_id": ""
      }
		
	}

	getDepartments() {
		return this.http.get<{data: DepartmentLists[], message: string}>
		   				(`${this.API_BASE_URL}educare/get-department`);
	}

	// getDepartments() {
	// 	this.http.get<{data: DepartmentLists[], message: string}>
	// 	(`${this.API_BASE_URL}educare/get-department")
	// 		.subscribe((dep_data) => {
	// 			this.dep_lists = dep_data.data;
	// 			this.updated_dep_list.next([...this.dep_lists])
	// 		})
	// }

	// getUpdateDepartments() {
	// 	return this.updated_dep_list.asObservable();
	// }
	getDepartmentsWid(id: string) {
		return this.http.get<{data: DepartmentLists[], message: string}>
					(`${this.API_BASE_URL}educare/get-department?id=${id}`);	
	}

	// getDepartmentsWid(id: string) {
	// 	this.http.get<{data: DepartmentLists[], message: string}>
	// 	(`${this.API_BASE_URL}educare/get-department?id=${id}`)
	// 		.subscribe((dep_data) => {
	// 			this.dep_lists = dep_data.data;
	// 			this.updated_dep_list.next([...this.dep_lists])
	// 		})
	// }

	// rgetUpdateDepartmentsWid() {
	// 	return this.updated_dep_list.asObservable();
	// }

	addDepartmentServ(
		department_name: string,
		department_head: string,
		category: string,
		duration: string,
		incharge: string,
		incharge_phone: number,
		incharge_mail: string
		){

		if(department_name == null) {
				department_name = "";
		}
		if (department_head == null) {
				department_head = "";
		}
		if(duration == null) {
				duration = "";
		}
		if(category == null) {
				category = "";
		}
		if(incharge == null) {
				incharge = "";
		}
		if(incharge_mail == null) {
				incharge_mail = "";
		}

    const headers = {
      'Accept': '*/*',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, HEAD',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers': 'X-Requested-With,content-type'
    }


		const dep_list = {
			department_name: department_name,
			category: category,
			duration: duration,
			department_head: department_head,
			incharge: incharge,
			incharge_phone: incharge_phone,
			incharge_mail: incharge_mail
		}

		return this.http.post(`${this.API_BASE_URL}educare/new-department`, 
			             JSON.stringify(dep_list) , {headers})
	}

	updateDepartment(id: string, selected_dep: any) {
		console.log(selected_dep);

		if(!('placement_offer_letter' in selected_dep)) {
			if(selected_dep.department_name == null ||
			selected_dep.duration == null
			) {
				selected_dep.department_name = "";
				selected_dep.duration = "";
			}
		}

		return this.http.put(`${this.API_BASE_URL}educare/edit-department/${id}`, 
			JSON.stringify(selected_dep),
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
	};

	deleteDepartmentServ(dep_id: string) {
		return this.http.delete(`${this.API_BASE_URL}educare/delete-department/${dep_id}`);
	};

	// fetchBatchStudents(fetch_option: any) {
	// 	this.http.get<{ statuscode: any, data: any }>
	// 		(`${this.API_BASE_URL}educare/multi-api?take=" + fetch_option)
	// 			.subscribe((fetched_data) => {
	// 				console.log(fetched_data);
	// 				this.fetched_data = fetched_data;
	// 					this.updated_student_list.next(this.fetched_data);
	// 			});	
	// };

	// rfetchBatchStudents() {
	// 	return this.updated_student_list.asObservable();
	// }

	// initialBatchStudents() {
	// 	   this.http.get<{data: DepartmentLists[], message: string}>
	// 			(`${this.API_BASE_URL}educare/get-department")
	// 				.pipe(mergeMap((departments: any) => {
	// 					this.dep_lists = departments.data;
	// 					this.selected_dep = this.dep_lists[0];
	// 					 return this.http.get<{ statuscode: any, data: any }>
	// 						(`${this.API_BASE_URL}educare/multi-api?department_id=" + this.selected_dep._id + "&take=one")
	// 				}))
	// 				.subscribe((fetched_data) => {
	// 					this.fetched_dep_data = fetched_data;
	// 					console.log(this.fetched_dep_data);

	// 					this.fetched_dep_data_def.next(this.fetched_dep_data);
	// 				});
	// }

	// rinitialBatchStudents() {
	// 	return this.fetched_dep_data_def.asObservable();
	// }


	
}