import { Component, Inject, OnInit } from '@angular/core';
import { AdminService } from '../../../admin.service';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeleteDialogueComponent } from '../../delete-dialogue/delete-dialogue.component';
import { Router } from '@angular/router';
import { TherapistService } from 'src/app/Modules/therapist/therapist.service';

@Component({
  selector: 'app-lmc-dialogue',
  templateUrl: './lmc-dialogue.component.html',
  styleUrls: ['./lmc-dialogue.component.scss']
})
export class LmcDialogueComponent implements OnInit {

  lmcForm = this.fb.group({
    medical: false,
    sessionFee: [0],
    cloudinary_id:'',
    file_url:''
  });


  constructor(private adminService: AdminService, private fb: FormBuilder,public dialogRef: MatDialogRef<DeleteDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private router : Router, private therapistService: TherapistService) { }

  ngOnInit(): void {
  }

  uploadStatus = false;
  onFileSelected(event){
    this.uploadStatus = true;
    this.file = event.target.files[0]
  }

  file:File= null;
  onUpload(){
    this.uploadStatus = false;
    this.adminService.uploadImage(this.file).subscribe(res=>{
      this.lmcForm.patchValue({
        cloudinary_id : res.public_id,
        file_url: res.url
      })
    })
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onConfirmClick(): void {
    if (this.lmcForm.get(['medical']).value === false) {
      this.router.navigateByUrl(`/admin/paylmcfees/${this.data.id}/${this.data.arrayid}`);
    }
    else if(this.lmcForm.get(['medical']).value === true){
      let data = {
        sessionFee : this.lmcForm.get(['sessionFee']).value,
      }
      this.adminService.updateLmcFeeMedical(this.data.id, data).subscribe((res)=>{})

      this.router.navigateByUrl(`/admin/paylmcfees/${this.data.id}/${this.data.arrayid}`)
    }
  }

  updateFeeStatus(data : any, id : String){
    this.adminService.updateFeeStatus(data,id).subscribe((status)=>{
    })
  }
}
