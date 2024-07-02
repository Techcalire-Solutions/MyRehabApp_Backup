import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StSessionDataComponent } from './st-session-data.component';

describe('StSessionDataComponent', () => {
  let component: StSessionDataComponent;
  let fixture: ComponentFixture<StSessionDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StSessionDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StSessionDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
