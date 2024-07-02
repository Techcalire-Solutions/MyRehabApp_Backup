import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGroupSessionComponent } from './add-group-session.component';

describe('AddGroupSessionComponent', () => {
  let component: AddGroupSessionComponent;
  let fixture: ComponentFixture<AddGroupSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGroupSessionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddGroupSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
