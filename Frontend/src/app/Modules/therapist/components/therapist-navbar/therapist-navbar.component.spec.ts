import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapistNavbarComponent } from './therapist-navbar.component';

describe('TherapistNavbarComponent', () => {
  let component: TherapistNavbarComponent;
  let fixture: ComponentFixture<TherapistNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TherapistNavbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TherapistNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
