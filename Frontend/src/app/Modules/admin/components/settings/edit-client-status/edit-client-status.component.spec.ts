import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClientStatusComponent } from './edit-client-status.component';

describe('EditClientStatusComponent', () => {
  let component: EditClientStatusComponent;
  let fixture: ComponentFixture<EditClientStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditClientStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditClientStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
