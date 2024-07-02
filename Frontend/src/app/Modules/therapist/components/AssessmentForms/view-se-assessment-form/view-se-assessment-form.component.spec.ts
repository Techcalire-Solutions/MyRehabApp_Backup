import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSeAssessmentFormComponent } from './view-se-assessment-form.component';

describe('ViewSeAssessmentFormComponent', () => {
  let component: ViewSeAssessmentFormComponent;
  let fixture: ComponentFixture<ViewSeAssessmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSeAssessmentFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSeAssessmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
