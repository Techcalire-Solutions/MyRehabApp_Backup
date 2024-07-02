import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayPendingFeeComponent } from './pay-pending-fee.component';

describe('PayPendingFeeComponent', () => {
  let component: PayPendingFeeComponent;
  let fixture: ComponentFixture<PayPendingFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayPendingFeeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayPendingFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
