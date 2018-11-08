import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-deletion-dialog',
  templateUrl: './deletion-dialog.component.html',
  styleUrls: ['./deletion-dialog.component.css']
})
export class DeletionDialogComponent implements OnInit {

  dialogType: string;

  constructor(public dialogRef: MatDialogRef<DeletionDialogComponent>, @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
    if (this.data.hasOwnProperty("deletionConfirmation")) this.dialogType = "deletionConfirmation";
  }

}
