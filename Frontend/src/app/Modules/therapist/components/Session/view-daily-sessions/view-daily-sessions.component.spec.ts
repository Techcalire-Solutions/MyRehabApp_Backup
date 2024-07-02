import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDailySessionsComponent } from './view-daily-sessions.component';

describe('ViewDailySessionsComponent', () => {
  let component: ViewDailySessionsComponent;
  let fixture: ComponentFixture<ViewDailySessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDailySessionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDailySessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
