import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSeSessionDataComponent } from './view-se-session-data.component';

describe('ViewSeSessionDataComponent', () => {
  let component: ViewSeSessionDataComponent;
  let fixture: ComponentFixture<ViewSeSessionDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSeSessionDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSeSessionDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
