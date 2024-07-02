import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionHandoverDialogComponent } from './session-handover-dialog.component';

describe('SessionHandoverDialogComponent', () => {
  let component: SessionHandoverDialogComponent;
  let fixture: ComponentFixture<SessionHandoverDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionHandoverDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionHandoverDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
