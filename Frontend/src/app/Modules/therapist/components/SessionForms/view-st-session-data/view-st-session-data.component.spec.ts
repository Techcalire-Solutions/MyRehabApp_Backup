import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStSessionDataComponent } from './view-st-session-data.component';

describe('ViewStSessionDataComponent', () => {
  let component: ViewStSessionDataComponent;
  let fixture: ComponentFixture<ViewStSessionDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewStSessionDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewStSessionDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
