import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StAssessmentFormComponent } from './st-assessment-form.component';

describe('StAssessmentFormComponent', () => {
  let component: StAssessmentFormComponent;
  let fixture: ComponentFixture<StAssessmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StAssessmentFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StAssessmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
