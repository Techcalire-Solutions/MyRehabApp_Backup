import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGoupMasterComponent } from './view-goup-master.component';

describe('ViewGoupMasterComponent', () => {
  let component: ViewGoupMasterComponent;
  let fixture: ComponentFixture<ViewGoupMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewGoupMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewGoupMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
