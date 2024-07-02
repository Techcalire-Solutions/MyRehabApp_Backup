import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClientSchoolFormComponent } from './edit-client-school-form.component';

describe('EditClientSchoolFormComponent', () => {
  let component: EditClientSchoolFormComponent;
  let fixture: ComponentFixture<EditClientSchoolFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditClientSchoolFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditClientSchoolFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
