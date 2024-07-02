import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBtDataComponent } from './edit-bt-data.component';

describe('EditBtDataComponent', () => {
  let component: EditBtDataComponent;
  let fixture: ComponentFixture<EditBtDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBtDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditBtDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
