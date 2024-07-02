import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-policies',
  templateUrl: './policies.component.html',
  styleUrls: ['./policies.component.scss']
})
export class PoliciesComponent implements OnInit {

  

  constructor() { }

  resumeUrl= "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210101201653/PDF.pdf"
  pdfSrc = "../../assets/Privacy Policy.pdf";

  ngOnInit(): void {
  }

}
