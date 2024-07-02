import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGoalSeComponent } from './add-goal-se.component';

describe('AddGoalSeComponent', () => {
  let component: AddGoalSeComponent;
  let fixture: ComponentFixture<AddGoalSeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGoalSeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddGoalSeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
