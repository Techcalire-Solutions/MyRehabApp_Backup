import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyLeaveComponent } from './emergency-leave.component';

describe('EmergencyLeaveComponent', () => {
  let component: EmergencyLeaveComponent;
  let fixture: ComponentFixture<EmergencyLeaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmergencyLeaveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmergencyLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
