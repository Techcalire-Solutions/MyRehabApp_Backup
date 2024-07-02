import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStAssessmentFormComponent } from './edit-st-assessment-form.component';

describe('EditStAssessmentFormComponent', () => {
  let component: EditStAssessmentFormComponent;
  let fixture: ComponentFixture<EditStAssessmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStAssessmentFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditStAssessmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
