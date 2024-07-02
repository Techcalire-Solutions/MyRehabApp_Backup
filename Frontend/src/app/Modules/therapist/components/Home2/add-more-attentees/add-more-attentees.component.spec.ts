import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMoreAttenteesComponent } from './add-more-attentees.component';

describe('AddMoreAttenteesComponent', () => {
  let component: AddMoreAttenteesComponent;
  let fixture: ComponentFixture<AddMoreAttenteesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMoreAttenteesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMoreAttenteesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
