import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageConcessionComponent } from './manage-concession.component';

describe('ManageConcessionComponent', () => {
  let component: ManageConcessionComponent;
  let fixture: ComponentFixture<ManageConcessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageConcessionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageConcessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
