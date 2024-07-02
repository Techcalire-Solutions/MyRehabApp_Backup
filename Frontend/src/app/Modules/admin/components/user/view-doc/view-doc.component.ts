import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-doc',
  templateUrl: './view-doc.component.html',
  styleUrls: ['./view-doc.component.scss']
})
export class ViewDocComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA)public data: any) { }

  exp: any;
  qual: any;
  id: any;
  ngOnInit(): void {
    this.exp = this.data.url.experience_file;
    this.qual = this.data.url.qualification_file;
    this.id = this.data.url.idProof_file;
  }

}
