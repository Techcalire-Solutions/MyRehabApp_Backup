import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentFeePayComponent } from './assessment-fee-pay.component';

describe('AssessmentFeePayComponent', () => {
  let component: AssessmentFeePayComponent;
  let fixture: ComponentFixture<AssessmentFeePayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentFeePayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssessmentFeePayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
