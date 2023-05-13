import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent {

  title: string;
  message: string;
  showButtonOk: boolean;
  showButtonCancel: boolean;
  buttonAlign: string;

  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel) {
    this.title = data.title;
    this.message = data.message;
    this.showButtonOk = data.showButtonOk;
    this.showButtonCancel = data.showButtonCancel;
    this.buttonAlign = data.buttonAlign;
  }

  onConfirm() {
    this.dialogRef.close(true);
  }

  onDismiss() {
    this.dialogRef.close(false);
  }
}

export class ConfirmDialogModel {
  constructor(
    public title: string,
    public message: string,
    public showButtonOk: boolean,
    public showButtonCancel: boolean,
    public buttonAlign: string,
  ) { }

}
