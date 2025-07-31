import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-download-buttons',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './download-buttons.html',
  styleUrl: './download-buttons.scss'
})
export class DownloadButtons {
  @Input() headers: string[] = [];
  @Input() uploadedFileName!: string;
  @Input() isRequired: boolean[] = [];
  @Input() columnTypes: string[] = [];   // αυτό πρέπει να το περνάς από τον γονέα component

  fileName: string = '';

  constructor(private http: HttpClient) {}

  downloadCsv(): void {
  if (!this.uploadedFileName) {
    console.error('No uploaded file available');
    return;
  }

  const name = this.fileName.trim() || 'template';
  const url = `http://localhost:8080/csv/download-headers?file=${this.uploadedFileName}&name=${name}`;

  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}.csv`;
  a.click();
}

  downloadJson(): void {
    if (!this.uploadedFileName || !this.headers.length) {
      console.error('No uploaded file available');
      return;
    }



    const name = this.fileName.trim() || 'template';
    const requiredFields: string[] = [];
    const inferredTypes: Record<string, string> = {};
    


    this.headers.forEach((header, index) => {
      const selectedType = this.columnTypes[index] || 'STRING';
      const required = this.isRequired[index];

      inferredTypes[header] = selectedType;
      if (required) {
        requiredFields.push(header);
      }
      console.log(`Header: ${header}, Type: ${selectedType}, Required: ${required}`);
      
    
  });

  this.http.post('http://localhost:8080/csv/generate-json', {
      inferredTypes,
      required: requiredFields,
      name
    }, { responseType: 'blob' }).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    }, err => {
      console.error('❌ Error downloading JSON template', err);
    });
  }
}


