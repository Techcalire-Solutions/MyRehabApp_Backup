import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAssessmentSessionComponent } from './view-assessment-session.component';

describe('ViewAssessmentSessionComponent', () => {
  let component: ViewAssessmentSessionComponent;
  let fixture: ComponentFixture<ViewAssessmentSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAssessmentSessionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAssessmentSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
