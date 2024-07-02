import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveSlotsComponent } from './leave-slots.component';

describe('LeaveSlotsComponent', () => {
  let component: LeaveSlotsComponent;
  let fixture: ComponentFixture<LeaveSlotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveSlotsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveSlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
