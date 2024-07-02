import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtSessionDataComponent } from './bt-session-data.component';

describe('BtSessionDataComponent', () => {
  let component: BtSessionDataComponent;
  let fixture: ComponentFixture<BtSessionDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BtSessionDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtSessionDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
