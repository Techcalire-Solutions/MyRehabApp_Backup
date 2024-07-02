import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLmcDialogueComponent } from './edit-lmc-dialogue.component';

describe('EditLmcDialogueComponent', () => {
  let component: EditLmcDialogueComponent;
  let fixture: ComponentFixture<EditLmcDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLmcDialogueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLmcDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
