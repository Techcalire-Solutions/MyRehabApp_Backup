import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndSessionDialogueComponent } from './end-session-dialogue.component';

describe('EndSessionDialogueComponent', () => {
  let component: EndSessionDialogueComponent;
  let fixture: ComponentFixture<EndSessionDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EndSessionDialogueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EndSessionDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
