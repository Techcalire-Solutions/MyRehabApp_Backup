import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLmcDialogueComponent } from './add-lmc-dialogue.component';

describe('AddLmcDialogueComponent', () => {
  let component: AddLmcDialogueComponent;
  let fixture: ComponentFixture<AddLmcDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLmcDialogueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLmcDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
