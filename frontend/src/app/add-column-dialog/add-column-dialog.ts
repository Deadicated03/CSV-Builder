import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-add-column-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
  ],
  templateUrl: './add-column-dialog.html',
  styleUrls: ['./add-column-dialog.scss']
})
export class AddColumnDialogComponent {
  column = {
    name: '',
    example: '',
    isRequired: false,
    format: '',
    errorMessage: '',
    regex:''
  };

  constructor(public dialogRef: MatDialogRef<AddColumnDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.column);
  }
}
