import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompletedSessionsComponent } from './view-completed-sessions.component';

describe('ViewCompletedSessionsComponent', () => {
  let component: ViewCompletedSessionsComponent;
  let fixture: ComponentFixture<ViewCompletedSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCompletedSessionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCompletedSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
