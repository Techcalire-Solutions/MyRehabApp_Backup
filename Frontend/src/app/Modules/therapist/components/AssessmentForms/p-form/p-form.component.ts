import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-p-form',
  templateUrl: './p-form.component.html',
  styleUrls: ['./p-form.component.scss']
})
export class PFormComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  ptForm = this.fb.group({
    height:[''],
    weight: [''],
    cheifComplaint: [''],
    tried:[false],
    surgery:[false],
    surgeryName:[''],
    surgeryDate:[''],
    allergies:[false],
  });

  ngOnInit(): void {
  }

  onSubmit(){

  }

}
