import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompensationSessionComponent } from './compensation-session.component';

describe('CompensationSessionComponent', () => {
  let component: CompensationSessionComponent;
  let fixture: ComponentFixture<CompensationSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompensationSessionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompensationSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
