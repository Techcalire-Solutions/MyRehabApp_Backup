import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapistHomeComponent } from './therapist-home.component';

describe('TherapistHomeComponent', () => {
  let component: TherapistHomeComponent;
  let fixture: ComponentFixture<TherapistHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TherapistHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TherapistHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
