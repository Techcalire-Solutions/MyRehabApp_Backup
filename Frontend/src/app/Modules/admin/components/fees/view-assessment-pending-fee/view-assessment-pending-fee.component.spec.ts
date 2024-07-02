import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAssessmentPendingFeeComponent } from './view-assessment-pending-fee.component';

describe('ViewAssessmentPendingFeeComponent', () => {
  let component: ViewAssessmentPendingFeeComponent;
  let fixture: ComponentFixture<ViewAssessmentPendingFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAssessmentPendingFeeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAssessmentPendingFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
