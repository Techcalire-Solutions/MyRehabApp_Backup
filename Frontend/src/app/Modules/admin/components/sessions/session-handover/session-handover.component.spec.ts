import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionHandoverComponent } from './session-handover.component';

describe('SessionHandoverComponent', () => {
  let component: SessionHandoverComponent;
  let fixture: ComponentFixture<SessionHandoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionHandoverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionHandoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
