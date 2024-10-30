import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FocusStudentsComponent } from './focus-students.component';

describe('FocusStudentsComponent', () => {
  let component: FocusStudentsComponent;
  let fixture: ComponentFixture<FocusStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FocusStudentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FocusStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
