import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStDataComponent } from './edit-st-data.component';

describe('EditStDataComponent', () => {
  let component: EditStDataComponent;
  let fixture: ComponentFixture<EditStDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditStDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
