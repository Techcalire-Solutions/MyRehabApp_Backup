import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingFeesComponent } from './pending-fees.component';

describe('PendingFeesComponent', () => {
  let component: PendingFeesComponent;
  let fixture: ComponentFixture<PendingFeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingFeesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
