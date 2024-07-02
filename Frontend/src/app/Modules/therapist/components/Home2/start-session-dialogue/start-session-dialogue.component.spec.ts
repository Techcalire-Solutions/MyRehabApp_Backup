import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartSessionDialogueComponent } from './start-session-dialogue.component';

describe('StartSessionDialogueComponent', () => {
  let component: StartSessionDialogueComponent;
  let fixture: ComponentFixture<StartSessionDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartSessionDialogueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartSessionDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
