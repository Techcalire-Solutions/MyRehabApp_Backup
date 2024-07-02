import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentSessionDataComponent } from './assessment-session-data.component';

describe('AssessmentSessionDataComponent', () => {
  let component: AssessmentSessionDataComponent;
  let fixture: ComponentFixture<AssessmentSessionDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentSessionDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssessmentSessionDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
