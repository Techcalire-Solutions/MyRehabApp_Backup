import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAssessmentDialogueComponent } from './edit-assessment-dialogue.component';

describe('EditAssessmentDialogueComponent', () => {
  let component: EditAssessmentDialogueComponent;
  let fixture: ComponentFixture<EditAssessmentDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAssessmentDialogueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAssessmentDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
