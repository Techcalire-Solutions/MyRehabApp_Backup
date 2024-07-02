import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PFormComponent } from './p-form.component';

describe('PFormComponent', () => {
  let component: PFormComponent;
  let fixture: ComponentFixture<PFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
