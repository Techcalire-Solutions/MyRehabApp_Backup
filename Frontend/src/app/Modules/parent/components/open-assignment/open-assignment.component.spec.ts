import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenAssignmentComponent } from './open-assignment.component';

describe('OpenAssignmentComponent', () => {
  let component: OpenAssignmentComponent;
  let fixture: ComponentFixture<OpenAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenAssignmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
