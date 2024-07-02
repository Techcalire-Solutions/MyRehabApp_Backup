import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBtAssessmentFormComponent } from './view-bt-assessment-form.component';

describe('ViewBtAssessmentFormComponent', () => {
  let component: ViewBtAssessmentFormComponent;
  let fixture: ComponentFixture<ViewBtAssessmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewBtAssessmentFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewBtAssessmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
