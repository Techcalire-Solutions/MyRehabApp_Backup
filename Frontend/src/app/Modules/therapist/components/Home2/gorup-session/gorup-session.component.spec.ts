import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GorupSessionComponent } from './gorup-session.component';

describe('GorupSessionComponent', () => {
  let component: GorupSessionComponent;
  let fixture: ComponentFixture<GorupSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GorupSessionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GorupSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
