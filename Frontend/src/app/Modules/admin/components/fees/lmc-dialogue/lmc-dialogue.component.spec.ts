import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmcDialogueComponent } from './lmc-dialogue.component';

describe('LmcDialogueComponent', () => {
  let component: LmcDialogueComponent;
  let fixture: ComponentFixture<LmcDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LmcDialogueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LmcDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
