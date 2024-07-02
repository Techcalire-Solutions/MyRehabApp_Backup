import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOtSessionDataComponent } from './view-ot-session-data.component';

describe('ViewOtSessionDataComponent', () => {
  let component: ViewOtSessionDataComponent;
  let fixture: ComponentFixture<ViewOtSessionDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewOtSessionDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewOtSessionDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
