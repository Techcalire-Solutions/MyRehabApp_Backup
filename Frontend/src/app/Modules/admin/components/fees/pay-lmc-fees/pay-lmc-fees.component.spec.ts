import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayLmcFeesComponent } from './pay-lmc-fees.component';

describe('PayLmcFeesComponent', () => {
  let component: PayLmcFeesComponent;
  let fixture: ComponentFixture<PayLmcFeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayLmcFeesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayLmcFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
