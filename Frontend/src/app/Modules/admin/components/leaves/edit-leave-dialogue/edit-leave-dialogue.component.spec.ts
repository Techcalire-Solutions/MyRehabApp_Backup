import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLeaveDialogueComponent } from './edit-leave-dialogue.component';

describe('EditLeaveDialogueComponent', () => {
  let component: EditLeaveDialogueComponent;
  let fixture: ComponentFixture<EditLeaveDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLeaveDialogueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLeaveDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
