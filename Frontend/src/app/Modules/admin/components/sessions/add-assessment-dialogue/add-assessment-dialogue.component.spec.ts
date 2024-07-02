import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssessmentDialogueComponent } from './add-assessment-dialogue.component';

describe('AddAssessmentDialogueComponent', () => {
  let component: AddAssessmentDialogueComponent;
  let fixture: ComponentFixture<AddAssessmentDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAssessmentDialogueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAssessmentDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
