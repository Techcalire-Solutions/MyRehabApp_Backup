import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCompensationComponent } from './edit-compensation.component';

describe('EditCompensationComponent', () => {
  let component: EditCompensationComponent;
  let fixture: ComponentFixture<EditCompensationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCompensationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCompensationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
