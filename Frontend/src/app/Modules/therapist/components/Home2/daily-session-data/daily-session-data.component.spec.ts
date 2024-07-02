import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailySessionDataComponent } from './daily-session-data.component';

describe('DailySessionDataComponent', () => {
  let component: DailySessionDataComponent;
  let fixture: ComponentFixture<DailySessionDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailySessionDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailySessionDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
