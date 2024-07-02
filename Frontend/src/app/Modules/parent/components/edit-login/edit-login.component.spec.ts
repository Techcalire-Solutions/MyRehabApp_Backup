import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLoginComponent } from './edit-login.component';

describe('EditLoginComponent', () => {
  let component: EditLoginComponent;
  let fixture: ComponentFixture<EditLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
