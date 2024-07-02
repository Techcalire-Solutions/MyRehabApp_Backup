import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtAssessmentFormComponent } from './ot-assessment-form.component';

describe('OtAssessmentFormComponent', () => {
  let component: OtAssessmentFormComponent;
  let fixture: ComponentFixture<OtAssessmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtAssessmentFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtAssessmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
