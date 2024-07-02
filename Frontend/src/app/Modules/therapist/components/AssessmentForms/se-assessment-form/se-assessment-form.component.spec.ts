import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeAssessmentFormComponent } from './se-assessment-form.component';

describe('SeAssessmentFormComponent', () => {
  let component: SeAssessmentFormComponent;
  let fixture: ComponentFixture<SeAssessmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeAssessmentFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeAssessmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
