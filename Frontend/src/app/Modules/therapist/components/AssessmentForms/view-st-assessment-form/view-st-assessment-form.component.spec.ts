import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStAssessmentFormComponent } from './view-st-assessment-form.component';

describe('ViewStAssessmentFormComponent', () => {
  let component: ViewStAssessmentFormComponent;
  let fixture: ComponentFixture<ViewStAssessmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewStAssessmentFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewStAssessmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
