import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFeesComponent } from './manage-fees.component';

describe('ManageFeesComponent', () => {
  let component: ManageFeesComponent;
  let fixture: ComponentFixture<ManageFeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageFeesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
