import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSlotStatusComponent } from './edit-slot-status.component';

describe('EditSlotStatusComponent', () => {
  let component: EditSlotStatusComponent;
  let fixture: ComponentFixture<EditSlotStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSlotStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSlotStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
