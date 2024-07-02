import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClientPersonalFormComponent } from './edit-client-personal-form.component';

describe('EditClientPersonalFormComponent', () => {
  let component: EditClientPersonalFormComponent;
  let fixture: ComponentFixture<EditClientPersonalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditClientPersonalFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditClientPersonalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
