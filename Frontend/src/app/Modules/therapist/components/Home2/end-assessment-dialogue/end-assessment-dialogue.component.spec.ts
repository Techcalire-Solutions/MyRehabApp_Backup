import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndAssessmentDialogueComponent } from './end-assessment-dialogue.component';

describe('EndAssessmentDialogueComponent', () => {
  let component: EndAssessmentDialogueComponent;
  let fixture: ComponentFixture<EndAssessmentDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EndAssessmentDialogueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EndAssessmentDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
