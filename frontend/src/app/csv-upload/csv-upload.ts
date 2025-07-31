import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-csv-upload',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './csv-upload.html',
  styleUrl: './csv-upload.scss'
})
export class CsvUpload {

  csvData: any[] = [];
  headers: string[] = [];
  uploadedFilename: string = '';
  inferredTypes: Record<string, string> = {};
  message: string = '';


  constructor(private http: HttpClient,
              private router: Router) {}

  onFileSelected(event: Event): void {

      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

     const formData = new FormData();       // ← ΕΔΩ
     formData.append('file', file);  
    
    this.http.post<any>('http://localhost:8080/csv/upload', formData)
      .subscribe((data) => {
        this.csvData  = data.data;
        console.log('📁 [Component] CSV Data:', this.csvData);
        this.headers  = Object.keys(this.csvData[0] || {});
        this.uploadedFilename = data.uploadedFilename;
        this.inferredTypes = data.inferredTypes;
        this.message = data.message;
        console.log('📁 [Component] headers:', this.headers);
        console.log('📁 [Component] uploadedFilename:', this.uploadedFilename);
        console.log('📁 [Component] inferredTypes:', this.inferredTypes);
        console.log('📁 [Component] messages:', this.message);

        // εδώ κάνουμε redirect και στέλνουμε state
        this.router.navigate(['/csv/details'], {
          state: {
            csvData: this.csvData,
            headers: this.headers,
            filename: this.uploadedFilename,
            inferredTypes: this.inferredTypes,
            }
        });
      }, (error) => {
        console.error('Error uploading file:', error);
      });
  }
}
