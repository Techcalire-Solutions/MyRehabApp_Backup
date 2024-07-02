import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLmcTodayComponent } from './view-lmc-today.component';

describe('ViewLmcTodayComponent', () => {
  let component: ViewLmcTodayComponent;
  let fixture: ComponentFixture<ViewLmcTodayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewLmcTodayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewLmcTodayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
