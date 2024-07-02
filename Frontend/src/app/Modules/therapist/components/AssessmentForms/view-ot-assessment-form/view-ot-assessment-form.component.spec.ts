import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOtAssessmentFormComponent } from './view-ot-assessment-form.component';

describe('ViewOtAssessmentFormComponent', () => {
  let component: ViewOtAssessmentFormComponent;
  let fixture: ComponentFixture<ViewOtAssessmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewOtAssessmentFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewOtAssessmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
