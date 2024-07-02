import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSeAssessmentFormComponent } from './edit-se-assessment-form.component';

describe('EditSeAssessmentFormComponent', () => {
  let component: EditSeAssessmentFormComponent;
  let fixture: ComponentFixture<EditSeAssessmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSeAssessmentFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSeAssessmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
