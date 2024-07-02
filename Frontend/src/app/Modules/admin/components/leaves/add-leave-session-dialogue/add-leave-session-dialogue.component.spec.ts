import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLeaveSessionDialogueComponent } from './add-leave-session-dialogue.component';

describe('AddLeaveSessionDialogueComponent', () => {
  let component: AddLeaveSessionDialogueComponent;
  let fixture: ComponentFixture<AddLeaveSessionDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLeaveSessionDialogueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLeaveSessionDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
