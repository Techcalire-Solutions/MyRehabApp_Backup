import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmcSessionComponent } from './lmc-session.component';

describe('LmcSessionComponent', () => {
  let component: LmcSessionComponent;
  let fixture: ComponentFixture<LmcSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LmcSessionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LmcSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
