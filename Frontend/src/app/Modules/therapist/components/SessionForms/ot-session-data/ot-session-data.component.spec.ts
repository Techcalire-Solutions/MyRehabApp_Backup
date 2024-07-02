import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtSessionDataComponent } from './ot-session-data.component';

describe('OtSessionDataComponent', () => {
  let component: OtSessionDataComponent;
  let fixture: ComponentFixture<OtSessionDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtSessionDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtSessionDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
