import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-start-session-dialogue',
  templateUrl: './start-session-dialogue.component.html',
  styleUrls: ['./start-session-dialogue.component.scss']
})
export class StartSessionDialogueComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<StartSessionDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  lmc(): void {
    this.dialogRef.close();
  }

  startSession(): void {
    this.dialogRef.close(true);
  }
}
