import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewTaskComponent } from './review-task.component';

describe('ReviewTaskComponent', () => {
  let component: ReviewTaskComponent;
  let fixture: ComponentFixture<ReviewTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewTaskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
