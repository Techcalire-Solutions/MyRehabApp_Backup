import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtAssessmentFormComponent } from './bt-assessment-form.component';

describe('BtAssessmentFormComponent', () => {
  let component: BtAssessmentFormComponent;
  let fixture: ComponentFixture<BtAssessmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BtAssessmentFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtAssessmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
