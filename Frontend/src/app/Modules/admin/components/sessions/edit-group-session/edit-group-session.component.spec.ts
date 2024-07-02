import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGroupSessionComponent } from './edit-group-session.component';

describe('EditGroupSessionComponent', () => {
  let component: EditGroupSessionComponent;
  let fixture: ComponentFixture<EditGroupSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditGroupSessionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditGroupSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
