import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompletedAssessmentsComponent } from './view-completed-assessments.component';

describe('ViewCompletedAssessmentsComponent', () => {
  let component: ViewCompletedAssessmentsComponent;
  let fixture: ComponentFixture<ViewCompletedAssessmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCompletedAssessmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCompletedAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
