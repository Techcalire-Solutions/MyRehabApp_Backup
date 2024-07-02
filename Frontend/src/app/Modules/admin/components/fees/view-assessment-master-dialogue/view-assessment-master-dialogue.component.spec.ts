import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAssessmentMasterDialogueComponent } from './view-assessment-master-dialogue.component';

describe('ViewAssessmentMasterDialogueComponent', () => {
  let component: ViewAssessmentMasterDialogueComponent;
  let fixture: ComponentFixture<ViewAssessmentMasterDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAssessmentMasterDialogueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAssessmentMasterDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
