import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSessionMssterDialogueComponent } from './view-session-msster-dialogue.component';

describe('ViewSessionMssterDialogueComponent', () => {
  let component: ViewSessionMssterDialogueComponent;
  let fixture: ComponentFixture<ViewSessionMssterDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSessionMssterDialogueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSessionMssterDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
