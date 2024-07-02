import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFeePendingSessionComponent } from './view-fee-pending-session.component';

describe('ViewFeePendingSessionComponent', () => {
  let component: ViewFeePendingSessionComponent;
  let fixture: ComponentFixture<ViewFeePendingSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFeePendingSessionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewFeePendingSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
