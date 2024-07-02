import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeSessionDataComponent } from './se-session-data.component';

describe('SeSessionDataComponent', () => {
  let component: SeSessionDataComponent;
  let fixture: ComponentFixture<SeSessionDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeSessionDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeSessionDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
