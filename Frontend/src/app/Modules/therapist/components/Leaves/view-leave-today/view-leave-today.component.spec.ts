import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLeaveTodayComponent } from './view-leave-today.component';

describe('ViewLeaveTodayComponent', () => {
  let component: ViewLeaveTodayComponent;
  let fixture: ComponentFixture<ViewLeaveTodayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewLeaveTodayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewLeaveTodayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
