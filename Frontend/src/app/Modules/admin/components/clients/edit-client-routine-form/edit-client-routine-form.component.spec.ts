import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClientRoutineFormComponent } from './edit-client-routine-form.component';

describe('EditClientRoutineFormComponent', () => {
  let component: EditClientRoutineFormComponent;
  let fixture: ComponentFixture<EditClientRoutineFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditClientRoutineFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditClientRoutineFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
