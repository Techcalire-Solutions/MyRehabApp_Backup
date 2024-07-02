import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBtAssessmentFormComponent } from './edit-bt-assessment-form.component';

describe('EditBtAssessmentFormComponent', () => {
  let component: EditBtAssessmentFormComponent;
  let fixture: ComponentFixture<EditBtAssessmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBtAssessmentFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditBtAssessmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
