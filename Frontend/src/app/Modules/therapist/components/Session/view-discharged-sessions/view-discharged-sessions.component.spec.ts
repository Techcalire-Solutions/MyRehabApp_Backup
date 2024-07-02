import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDischargedSessionsComponent } from './view-discharged-sessions.component';

describe('ViewDischargedSessionsComponent', () => {
  let component: ViewDischargedSessionsComponent;
  let fixture: ComponentFixture<ViewDischargedSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDischargedSessionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDischargedSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
