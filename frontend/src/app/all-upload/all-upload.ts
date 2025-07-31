import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-files',
  standalone: true,
  templateUrl: './all-upload.html',
  styleUrl: './all-upload.scss',
})
export class allUpload {
  csvFile: File | null = null;
  jsonFile: File | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  onCsvUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.csvFile = file;
  }

  onJsonUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.jsonFile = file;
  }

  submitFiles() {
    if (!this.csvFile || !this.jsonFile) {
      alert('Πρέπει να ανεβάσεις **και CSV και JSON** αρχείο!');
      return;
    }

    const formData = new FormData();
    formData.append('files', this.csvFile);
    formData.append('files', this.jsonFile);

    this.http.post('http://localhost:8080/mapping/upload-all', formData).subscribe({
      next: (data) => {
        localStorage.setItem('uploadData', JSON.stringify(data));
        console.log(data);
        this.router.navigate(['/mapping-result']);
      },
      error: (err) => {
        console.error(err);
        alert('Σφάλμα κατά την αποστολή αρχείων.');
      }
    });
  }
}