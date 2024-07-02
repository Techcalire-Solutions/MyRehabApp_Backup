import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageGoalComponent } from './manage-goal.component';

describe('ManageGoalComponent', () => {
  let component: ManageGoalComponent;
  let fixture: ComponentFixture<ManageGoalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageGoalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
