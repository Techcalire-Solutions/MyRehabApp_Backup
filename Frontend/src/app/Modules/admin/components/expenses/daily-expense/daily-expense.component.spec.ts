import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyExpenseComponent } from './daily-expense.component';

describe('DailyExpenseComponent', () => {
  let component: DailyExpenseComponent;
  let fixture: ComponentFixture<DailyExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyExpenseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
