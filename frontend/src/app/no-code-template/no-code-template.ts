import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { AddColumnDialogComponent } from '../add-column-dialog/add-column-dialog'; // adjust path accordingly
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-no-code-template',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule],
  templateUrl: './no-code-template.html',
  styleUrl: './no-code-template.scss'
})
export class NoCodeTemplate {


  columns: Column[] = [];
  templateName: string = '';

  constructor(private dialog: MatDialog) {}

  openAddColumn() {
    const dialogRef = this.dialog.open(AddColumnDialogComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.columns.push(result); // Add the new column
      }
    });
  }

  removeColumn(col: Column) {
    this.columns = this.columns.filter(c => c !== col);
  }

  saveTemplate(){
    const schema: any = {
    type: 'object',
    properties: {},
    required: [],
    errorMessages: {}
  };

   for (const column of this.columns) {
    let propSchema: any = {};
    // Προσθήκη τύπου (απλοποιημένο σε string πάντα, μπορεί να επεκταθεί)
    let format = column.format.toLowerCase();
   
    if (['text', 'email', 'date', 'name'].includes(format)) {
      // τύπος string
      propSchema.type = 'string';

      // regex: είτε custom, είτε default
      if (column.regex && column.regex.trim() !== '') {
        propSchema.pattern = column.regex;
      } else {
        propSchema.pattern = "(?!^\\d+$)^.+$";
      }

    } else if (format === 'number') {
      propSchema.type = 'number';

    } else if (format === 'boolean') {
      propSchema.type = 'string';
      propSchema.format = 'custom-boolean';
    }

    // Προσθήκη στο properties
    schema.properties[column.name] = propSchema;

    // Required πεδία
    if (column.isRequired) {
      schema.required.push(column.name);
    }

    // Error messages
    if (column.errorMessage && column.errorMessage.trim() !== '') {
      schema.errorMessages[column.name] = column.errorMessage;
    }
  }


  console.log('Generated Schema:', JSON.stringify(schema, null, 2));

    // ✅ Μετατροπή σε JSON string
  const jsonString = JSON.stringify(schema, null, 2);

  // ✅ Δημιουργία Blob και trigger download
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = this.templateName || "template";
  a.click();
  }
}

interface Column {
  name: string;
  format: string;
  example: string;
  isRequired: boolean;
  errorMessage: string;
  regex: string; 
}

