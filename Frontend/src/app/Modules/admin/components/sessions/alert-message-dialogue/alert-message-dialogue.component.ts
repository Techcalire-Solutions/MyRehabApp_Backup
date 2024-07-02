import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-message-dialogue',
  templateUrl: './alert-message-dialogue.component.html',
  styleUrls: ['./alert-message-dialogue.component.scss']
})
export class AlertMessageDialogueComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AlertMessageDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }


  onCancelClick(): void {
    this.dialogRef.close();
  }

  onConfirmClick() {
    this.dialogRef.close(true);
  }

}
