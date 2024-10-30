// export class PlacementList {

// 	constructor(
// 		public id: string, public c_id: string,
// 		public pl_cname: string,
// 		public pl_desig: string,
// 		public pl_date: string, public pl_sal: string,
// 		public pl_percent: {
// 			tenth_percent: number,
// 			twelth_percent: number,
// 			ug_percent: number,
// 			pg_percent: number,
// 			dip_percent: number,

// 		},
// 		public pl_loc: string,
// 		public pl_reglnk: string, public pl_regdate: string,
// 		public pl_cemail: string,
// 		public pl_status: string ){

// 	}

// }

export interface PlacementList {
		 placement_id?: string,
		 placement_status?: number;
		 registration_status?: number;
		 company_name: string;
		 job_role: string;
		 placement_date: string;
		 salary: Salary;
		 percentage: Percent;
		 location: string;
		 registration_link: string;
		 registration_date: string;
		 company_email: string;
		 company_website: string;
		 open_to_all: any;
		 is_selected?: any;
}

export interface Salary {
	min_salary: any;
	max_salary: any;
}

interface Percent {
			ten: any;
			twelve: any;
			ug: any;
			pg: any;
			diploma: any;
}

export interface CompanyLists {
	id: string;
	company_name: string;
	email: string;
	website: string;
	star: number;
	is_selected: number;
}

export interface DepartmentLists {
	_id: string;
	department_name: string;
	batch: string[];
	category: string;
	duration: number;
	department_head: string;
	incharge: string;
	incharge_phone: number;
	incharge_mail: string;
	placement_offer_letter: number;
	intern_offer_letter: number;
	focus_student_placement: number;
	focus_student_intern: number;
	total_students: number;
	total_male: number;
	total_female: number;
	total_others: number;
}

export interface Batches {
	_id: string;
	batch: string;
	year: string;
	total_student: number;
	male: string;
	female: string;
	department_id: string;
	focus_student: number;
	is_select: number;
	user_id: string;	
}

export interface Students {
	_id: string;
	name: string;
	age: number;
	dob: string;
	gender: number;
	front_end_gender: string;
	roll_no: string;
	percentage: Percent,
	mobile: number;
	alernative_mobile: number;
	email: string;
	department_id: string;
	batch_id: string;
	intern_offer_letter: number;
	placement_offer_letter: number;
	focus_student_intern: number;
	focus_student_placement: number;
	is_select: any;
	batch: string;
	user_id: string;	
}

