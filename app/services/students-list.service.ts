import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { PlacementList } from '../shared/listing.model';
import {Batches} from '../shared/listing.model';
import {Students} from '../shared/listing.model';

import { FilterServ } from '../services/filter.service';

import {DepartmentLists} from '../shared/listing.model';

import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import {environment} from '../../environments/environment';

@Injectable()

export class StudentsListObj {
	private API_BASE_URL = environment.API_BASE_URL;

	public dep_id_subj = new BehaviorSubject('');
	current_dep_id = this.dep_id_subj.asObservable();

  departments: DepartmentLists[] = [];
	batches: Batches[];
	students: Students[];

	added_students: any;
	selected_students = new Subject<any>();

	selected_dep: any;
	selected_batch: any;
	selected_student: any;
	selected_student_batch: any;


  	private batchSubj = new Subject<Batches[]>();
  	private studSubj = new Subject<Students[]>();
	  private sorted_student_list = new Subject < Students[] > ();
	  private upload_student = new Subject < any > ();
	  private added_student = new Subject < any > ();


  	batch: string = "";
  	year: string = "";
  	user_id: string = "";

  	batch_id: string;

  	dep_id: string;


	constructor(private http: HttpClient,
				private filterService: FilterServ){

	}

	ngOnInit() {
	}

   // 	getBatchesData(){
   //  this.batchSubj.next(this.batches);
  	// }

  	// rgetBatchesData(): Observable<Batches[]> {
   //  return this.batchSubj.asObservable();
  	// }

  changeDepId(dep_id: string) {
  	this.dep_id_subj.next(dep_id);
  }

  getBatches(dep_id: string) {
		return this.http.get<{ message: string, data: Batches[] }>
		(`${this.API_BASE_URL}educare/get-batch`);
	}

	// getBatches(dep_id: string) {
	// 	this.http.get<{ message: string, data: Batches[] }>
	// 	(`${this.API_BASE_URL}educare/get-batch`)
	// 		.subscribe((batches_data) => {
			
	// 			this.batches = batches_data.data;
	// 			this.batchSubj.next([...this.batches]);
	// 			if((batches_data.data).length != 0) {
	// 			  this.getStudents();
	// 			  this.selected_batch = batches_data.data[0];
	// 				this.dep_id = dep_id;
	// 			}
	// 		});
	// }

	// getUpdateBatches() {
	// 	return this.batchSubj.asObservable();
	// }

	// getBatchesWdepId(dep_id: string) {
	// 	this.http.get<{ message: string, data: Batches[] }>
	// 	(`${this.API_BASE_URL}educare/get-batch?department_id=" + dep_id)
	// 		.subscribe((batches_data) => {
			
	// 			this.batches = batches_data.data;
	// 			this.batchSubj.next([...this.batches]);
	// 			// if((batches_data.data).length != 0) {
	// 			//   // this.getStudents();
	// 			//   // this.selected_batch = batches_data.data[0];
	// 			// 	// this.dep_id = dep_id;
	// 			// }
	// 		});
	// }

	// rgetUpdateBatchesWdepId() {
	// 	return this.batchSubj.asObservable();
	// }


	getBatchesWdepId(dep_id: string) {
			return this.http.get<{message: string, data: Batches[]}>
			       (`${this.API_BASE_URL}educare/get-batch?department_id=${dep_id}`);
	}

	crateBatchServ(
		batch: string,
		year: string,
		user_id: string,
		dep_id: string
		) {

		 if(batch == null) {
		 	batch = "";
		 }
		 else if(year == null) {
		 	year = "";
		 }
		 else if(user_id == null) {
		 	user_id = "";
		 }
		 else if(dep_id == null) {
		 	dep_id = "";
		 }

		 const headers = {
      'Accept': '*/*',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, HEAD',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers': 'X-Requested-With,content-type'
    }

		const new_batch = {
			batch: batch,
			year: year,
			user_id: user_id,
			department_id: dep_id
		};

		return this.http.post(`${this.API_BASE_URL}educare/new-batch`, 
			      JSON.stringify(new_batch), {headers})
	};

	editBatchServ(
		batch: string,
		year: string,
		batch_id: string
		) {
		const edited_batch_data = {
			"batch": batch,
			"year": year
		}
		return this.http.put(`${this.API_BASE_URL}educare/edit-batch/${batch_id}`,
			JSON.stringify(edited_batch_data), {
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

	deleteBatchServ(batch_id: string) {
		return this.http.delete(`${this.API_BASE_URL}educare/delete-batch/${batch_id}`);
	}

	// getStudents() {
	// 	this.http.get<{message: string, data: Students[]}>
	// 	(`${this.API_BASE_URL}educare/get-direct-student")
	// 		.subscribe((students_data) => {
	// 			this.students = students_data.data;
	// 			this.studSubj.next([...this.students]);
	// 	});
	// }

	// getUpdateStudents() {
	// 	return this.studSubj.asObservable();
	// }

	// getStudentsWdepId(dep_id: string) {
	// 	this.http.get<{message: string, data: Students[]}>
	// 	(`${this.API_BASE_URL}educare/get-direct-student?department_id=" + dep_id)
	// 		.subscribe((students_data) => {
	// 			this.students = students_data.data;
	// 			this.studSubj.next([...this.students]);
			
	// 	});

	// }

	// rgetUpdateStudentsWdepId() {
	// 	return this.studSubj.asObservable();
	// }

	getStudentsBD(batch_id: string) {
		return this.http.get<{message: string, data: Students[]}>
		(`${this.API_BASE_URL}educare/get-student?batch_id=${batch_id}`)
	}

	// getStudentsWbatchId(batch_id: string) {
	// 	this.http.get<{message: string, data: Students[]}>
	// 	(`${this.API_BASE_URL}educare/get-direct-student?batch_id=" + batch_id)
	// 		.subscribe((students_data) => {

	// 			this.students = students_data.data;
	// 			this.studSubj.next([...this.students]);
			
	// 	});

	// }

	// rgetUpdateStudentsWbatchId() {
	// 	return this.studSubj.asObservable();
	// }

	createStudentServ(
			student_name: string,
			date_of_birth: string,
			age: number,
			gender: string,
			front_end_gender: string,
			roll_no: string,
			contact_no: number,
			alternate_no: number,
			contact_email: string,
			ten: number,
			twelve: number,
			ug: number,
			pg: number,
			diploma: number,
			batch_id: string
		) {

		if(student_name == null){
			student_name = "";	
		} 
		if(date_of_birth == null){
			date_of_birth = "";	
		} 
		if(gender == null){
			gender = "";	
		} 
		if(front_end_gender == null){
			front_end_gender = "";	
		} 
		if(roll_no == null){
			roll_no = "";	
		} 
		if(contact_email == null){
			contact_email = "";	
		} 
		

		 const headers = {
      'Accept': '*/*',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, HEAD',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers': 'X-Requested-With,content-type'
    }

			const student = {
				name: student_name,
				dob: date_of_birth,
				age: age,
				gender: gender,
				front_end_gender: front_end_gender,
				roll_no: roll_no,
				mobile: contact_no,
				alternative_mobile: alternate_no,
				email: contact_email,
				percentage : {
				ten: ten,
				twelve: twelve,
				ug: ug,
				pg: pg,
				diploma: diploma
				},
			
				batch_id: batch_id
			};
			
			return this.http.post(`${this.API_BASE_URL}educare/new-student`, JSON.stringify(student), {headers});
	}

	editStudent(student_id: string, selected_student: any, batch_id: string) {
		console.log(selected_student);
		let edit_stud_param = batch_id + "/" + student_id;
		return this.http.put(`${this.API_BASE_URL}educare/edit-student/${edit_stud_param}`,
				JSON.stringify(selected_student),
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

	deleteStudentServ(del_stud_id: string) {
		return this.http.delete(`${this.API_BASE_URL}educare/delete-student/${del_stud_id}`);
	};

	deleteMultiStudent(stud_del_ids: any, batch_id: string){
		let ids = {
			ids: stud_del_ids
		}

		const del_options = {
      headers: new HttpHeaders({
        'Accept': '*/*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, HEAD',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers': 'X-Requested-With,content-type'
      }),
      body: JSON.stringify(ids)
    }

		return this.http.delete(`${this.API_BASE_URL}educare/multi-delete-student/${batch_id}`
				,del_options)
			
	};

	massTransferBatch(batch_id: string, mass_transfer_data: any) {
		this.http.put(`${this.API_BASE_URL}educare/mass-transfer/${batch_id}`,
			JSON.stringify(mass_transfer_data),
				{
          	headers: new HttpHeaders({
            'Accept': '*/*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, HEAD',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers': 'X-Requested-With,content-type'
          			})
        		}
			)
			.subscribe((transferred_batch) => {

 			});
	}

	transferMultipleStudents(batch_id: string, student_roll_nos: any, mass_transfer_data: any) {

		const ids = {
			ids: student_roll_nos,
			field: mass_transfer_data.field,
			field_value: mass_transfer_data.field_value
		}

		this.http.put(`${this.API_BASE_URL}educare/transfer-student/${batch_id}`,
			JSON.stringify(ids),
				{
          	headers: new HttpHeaders({
            'Accept': '*/*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, HEAD',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers': 'X-Requested-With,content-type'
          			})
        		}
			)
			.subscribe((transferred_students) => {

			});
	};

	sortStudents(batch_id: string, order: string, field: string) {
    return this.http.get<{ message: string, data: Students[] }>
                (`${this.API_BASE_URL}educare/sort-student?batch_id=${batch_id}&order=${order}&field=${field}`);
  }

	 // sortStudents(batch_id: string, order: string, field: string) {
  //   this.http.get<{ message: string, data: Students[] }>(`${this.API_BASE_URL}educare/sort-student?batch_id=" +
  //     batch_id + "&order=" + order + "&field=" + field)
  //     .subscribe((sorted_students) => {
  //     	console.log(this.batch_id);
  //     	console.log(order);
  //     	console.log(field);

  //       this.students = sorted_students.data;
  //       this.sorted_student_list.next([...this.students]);
  //     });
  // }

  // rsortStudents() {
  //   return this.sorted_student_list.asObservable();
  // }

  uploadCsvStudent(formData: any) {
  	return this.http.post(`${this.API_BASE_URL}educare/upload-student/${this.batch_id}` , formData,
  	{
  		reportProgress: true,
  		observe: 'events'
  	})
  		.subscribe((uploaded_students) => {
  			console.log(uploaded_students);
  		});
  }

  ruploadCsvStudent() {
  	return this.upload_student.asObservable();
  }

  addSelectedStudents(placement_id: string, no_of_student_attend_placement: number, roll_no: any) {

  	let selectedStudentData = {
  		roll_no: roll_no,
  		placement_id: placement_id,
  		no_of_student_attend_placement: no_of_student_attend_placement
  	}


		 const headers = {
      'Accept': '*/*',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, HEAD',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers': 'X-Requested-With,content-type'
    }

  	this.http.post(`${this.API_BASE_URL}educare/new-report`, 
  		JSON.stringify(selectedStudentData),
  		{headers}
  		)
  		.subscribe((added_data) => {
  			console.log(added_data);
  		});
  }

  raddSelectedStudents() {
  	this.added_student.asObservable();
  }


  fetchSelectedStudent() {
  	this.http.get< {data: any}>(`${this.API_BASE_URL}educare/get-report`)
  		.subscribe((fetch_selected_student) => {
  			this.added_students = fetch_selected_student.data;
  			this.selected_students.next([...this.added_students]);
  		});
  }

  rfetchSelectedStudent() {
  	return this.selected_students.asObservable();
  }

  getDepBatStud() {
			// this.http.get<{data: DepartmentLists[], message: string}>
			// 		(`${this.API_BASE_URL}educare/get-department")
			// 			.pipe(
			// 					mergeMap((department) => {
			// 						this.departments = department.data;
			// 						this.selected_dep = this.departments[0];

										

			// 						return this.selected_batch;

							
			// 					}))
			// 				this.http.get<{ message: string, data: Batches[] }>
			// 						  			(`${this.API_BASE_URL}educare/get-batch?department_id=" + this.selected_dep._id)
			// 						.pipe(

			// 								mergeMap((batches) => {
			// 									this.batches = batches.data;
			// 									this.selected_batch = batches[0];
										
			// 							this.http.get<{message: string, data: Students[]}>
			// 								(`${this.API_BASE_URL}educare/get-student?batch_id=" + this.selected_batch._id)


			// 								}))
			// 									.subscribe((students_data) => {
			// 										console.log(this.batches);
			// 										return this.selected_dep;

			// 									});

  }

  downloadCsvStudent(data: any, filename='data') {
  	let csvData = this.ConvertToCSV(data, 
  		[
  		'name', 'age', 'dob', 'gender', 'roll_no', 
  		'ten', 'twelve', 'ug', 'pg', 'diploma', 
  		'mobile', 'alternative_mobile', 'email'
  		]

  		);
  	console.log(csvData);

  	let blob = new Blob(['\ufeff' + csvData], {
  		type: 'text/csv;charset=utf-8;'
  	});
  	let downloadLnk = document.createElement("a");
  	let url = URL.createObjectURL(blob);
  	let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
  			if(isSafariBrowser) {
  				downloadLnk.setAttribute('target', "_blank");
  			}
  	downloadLnk.setAttribute("href", url);
  	downloadLnk.setAttribute("download", filename + ".csv");
  	downloadLnk.style.visibility = "hidden";
  	document.body.appendChild(downloadLnk);
  	downloadLnk.click();
  	document.body.removeChild(downloadLnk);
  }

  ConvertToCSV(objArray: any, headerList: any) {
  	let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  	let str = '';
  	let row = 'S.no';

  	for(let index in headerList) {
  		row += headerList[index] + ',';
  	}
  	row = row.slice(0, -1);
  	str += row + '\r\n';
  	console.log(array);
  	for(let i=0; i< array.length; i++) {
  		let line = (i+1) + '';
  		for(let index in headerList) {
  			// console.log(array[i]);
  			// if(Number(index) >= 5 || Number(index) <= 9) {

  			// 	let head = headerList[index];
  			// 	head += 'percentage.' + head;
  			// 	line += ',' + array[i][head];
  			// 	console.log(array[i][head]);

  			// }
  			// else {
  				let head = headerList[index];
  				console.log(head);
  				if(
  					head == 'ten' || 
  					head == 'twelve' ||
  					head == 'ug' ||
  					head == 'pg' ||
  					head == 'diploma' 
  					) {
  					
  					line += ',' + array[i]['percentage'][head];
  				}
  				else {
	  					
	  				line += ',' + array[i][head];
	  				console.log(array[i][head]);
  				}

  			// }
  

  			// console.log(head + "-" + line);
  		}
  		str += line + '\r\n';
  	}
  	return str;
  }


  downloadCsvReport(data: any, filename='data') {
  	let csvData = this.ConvertToCSVReport(data, 
  		[
  		'company_name', 'placement_id', 'roll_no', 
  		'total_selected_student', 'total_student_attend', 
  		'type'
  		]

  		);
  	console.log(csvData);

  	let blob = new Blob(['\ufeff' + csvData], {
  		type: 'text/csv;charset=utf-8;'
  	});
  	let downloadLnk = document.createElement("a");
  	let url = URL.createObjectURL(blob);
  	let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
  			if(isSafariBrowser) {
  				downloadLnk.setAttribute('target', "_blank");
  			}
  	downloadLnk.setAttribute("href", url);
  	downloadLnk.setAttribute("download", filename + ".csv");
  	downloadLnk.style.visibility = "hidden";
  	document.body.appendChild(downloadLnk);
  	downloadLnk.click();
  	document.body.removeChild(downloadLnk);
  }

  ConvertToCSVReport(objArray: any, headerList: any) {
  	let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  	let str = '';
  	let row = 'S.no';

  	for(let index in headerList) {
  		row += headerList[index] + ',';
  	}
  	row = row.slice(0, -1);
  	str += row + '\r\n';
  	console.log(array);
  	for(let i=0; i< array.length; i++) {
  		let line = (i+1) + '';
  		for(let index in headerList) {
  				
  				let head = headerList[index];
  				if(head == "roll_no") {
	  				line += ',(' + array[i][head] + ')';
  				}
  				if(head == "type") {
  					if(array[i][head] == 1) {
	  				line += ',' + 'Placement';  						
  					}
  					else if(array[i][head] == 2) {
  						line += ',' + 'Internship';
  					}
  				}
  				else {
	  				line += ',' + array[i][head];
	  				console.log(array[i][head]);
  				}


  		}
  		str += line + '\r\n';
  	}
  	return str;
  }


}