import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEndAssessmentsComponent } from './view-end-assessments.component';

describe('ViewEndAssessmentsComponent', () => {
  let component: ViewEndAssessmentsComponent;
  let fixture: ComponentFixture<ViewEndAssessmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEndAssessmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEndAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
