import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLeaveSessionDialogueComponent } from './edit-leave-session-dialogue.component';

describe('EditLeaveSessionDialogueComponent', () => {
  let component: EditLeaveSessionDialogueComponent;
  let fixture: ComponentFixture<EditLeaveSessionDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLeaveSessionDialogueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLeaveSessionDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
