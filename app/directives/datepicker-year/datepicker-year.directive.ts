import {MAT_DATE_FORMATS} from '@angular/material/core';
import {Directive} from '@angular/core';


export const YEAR_FORMATS = {
  parse: {
    dateInput: 'YYYY'
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }

}

@Directive({
	selector: '[appYearFormat]',
	providers: [
	{provide: MAT_DATE_FORMATS, useValue : YEAR_FORMATS}
	]
})

export class yearDatePicker {

}