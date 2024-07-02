import { Component, inject, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-medical-report-viewer',
  templateUrl: './medical-report-viewer.component.html',
  styleUrls: ['./medical-report-viewer.component.scss']
})
export class MedicalReportViewerComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA)public data: any) { }

  secureUrl: any
  ngOnInit(): void {
    // this.secureUrl = this.data.url.replace('http://', 'https://');
  }
}
