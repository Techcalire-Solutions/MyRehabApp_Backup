import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSessionDialogComponent } from './group-session-dialog.component';

describe('GroupSessionDialogComponent', () => {
  let component: GroupSessionDialogComponent;
  let fixture: ComponentFixture<GroupSessionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupSessionDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupSessionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
