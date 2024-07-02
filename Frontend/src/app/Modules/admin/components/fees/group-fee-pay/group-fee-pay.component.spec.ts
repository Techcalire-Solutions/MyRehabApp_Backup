import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupFeePayComponent } from './group-fee-pay.component';

describe('GroupFeePayComponent', () => {
  let component: GroupFeePayComponent;
  let fixture: ComponentFixture<GroupFeePayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupFeePayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupFeePayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
