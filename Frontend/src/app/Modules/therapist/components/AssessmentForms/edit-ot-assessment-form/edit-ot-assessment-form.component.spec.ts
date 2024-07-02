import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOtAssessmentFormComponent } from './edit-ot-assessment-form.component';

describe('EditOtAssessmentFormComponent', () => {
  let component: EditOtAssessmentFormComponent;
  let fixture: ComponentFixture<EditOtAssessmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditOtAssessmentFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditOtAssessmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
