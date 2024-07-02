import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapistDailySessionComponent } from './therapist-daily-session.component';

describe('TherapistDailySessionComponent', () => {
  let component: TherapistDailySessionComponent;
  let fixture: ComponentFixture<TherapistDailySessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TherapistDailySessionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TherapistDailySessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
