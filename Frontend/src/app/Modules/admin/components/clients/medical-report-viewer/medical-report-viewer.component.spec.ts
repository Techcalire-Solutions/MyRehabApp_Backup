import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalReportViewerComponent } from './medical-report-viewer.component';

describe('MedicalReportViewerComponent', () => {
  let component: MedicalReportViewerComponent;
  let fixture: ComponentFixture<MedicalReportViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalReportViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalReportViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
