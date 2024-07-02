import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLmcFeeComponent } from './view-lmc-fee.component';

describe('ViewLmcFeeComponent', () => {
  let component: ViewLmcFeeComponent;
  let fixture: ComponentFixture<ViewLmcFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewLmcFeeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewLmcFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
