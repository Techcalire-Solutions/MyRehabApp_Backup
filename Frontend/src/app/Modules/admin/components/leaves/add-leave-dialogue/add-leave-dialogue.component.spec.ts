import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLeaveDialogueComponent } from './add-leave-dialogue.component';

describe('AddLeaveDialogueComponent', () => {
  let component: AddLeaveDialogueComponent;
  let fixture: ComponentFixture<AddLeaveDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLeaveDialogueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLeaveDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
