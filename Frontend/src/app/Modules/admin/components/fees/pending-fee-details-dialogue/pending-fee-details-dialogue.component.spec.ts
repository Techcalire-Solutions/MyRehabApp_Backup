import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingFeeDetailsDialogueComponent } from './pending-fee-details-dialogue.component';

describe('PendingFeeDetailsDialogueComponent', () => {
  let component: PendingFeeDetailsDialogueComponent;
  let fixture: ComponentFixture<PendingFeeDetailsDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingFeeDetailsDialogueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingFeeDetailsDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
