import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSeDataComponent } from './edit-se-data.component';

describe('EditSeDataComponent', () => {
  let component: EditSeDataComponent;
  let fixture: ComponentFixture<EditSeDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSeDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSeDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
