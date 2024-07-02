import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClientMedicalFormComponent } from './edit-client-medical-form.component';

describe('EditClientMedicalFormComponent', () => {
  let component: EditClientMedicalFormComponent;
  let fixture: ComponentFixture<EditClientMedicalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditClientMedicalFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditClientMedicalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
