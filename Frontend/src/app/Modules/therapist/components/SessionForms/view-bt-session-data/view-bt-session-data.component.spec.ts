import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBtSessionDataComponent } from './view-bt-session-data.component';

describe('ViewBtSessionDataComponent', () => {
  let component: ViewBtSessionDataComponent;
  let fixture: ComponentFixture<ViewBtSessionDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewBtSessionDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewBtSessionDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
