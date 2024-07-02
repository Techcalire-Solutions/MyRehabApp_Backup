import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOtDataComponent } from './edit-ot-data.component';

describe('EditOtDataComponent', () => {
  let component: EditOtDataComponent;
  let fixture: ComponentFixture<EditOtDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditOtDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditOtDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
