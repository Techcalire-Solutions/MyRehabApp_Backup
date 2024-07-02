import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertMessageDialogueComponent } from './alert-message-dialogue.component';

describe('AlertMessageDialogueComponent', () => {
  let component: AlertMessageDialogueComponent;
  let fixture: ComponentFixture<AlertMessageDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertMessageDialogueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertMessageDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
