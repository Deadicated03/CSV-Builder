// src/app/csv-details/csv-details.component.ts
import { Component }           from '@angular/core';
import { CommonModule }        from '@angular/common';
import { Router }              from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-csv-details',
  standalone: true,
  imports: [CommonModule, ScrollingModule],
  templateUrl: './csv-details.html',
  styleUrls: ['./csv-details.scss']
})
export class CsvDetailsComponent {
  csvData: any[] = [];
  headers: string[] = [];
  filename = '';
  inferredTypes: Record<string, string> = {};

  constructor(private router: Router) {
    // παίρνουμε ό,τι περάσαμε σαν state στην πλοήγηση
    const state = this.router.getCurrentNavigation()?.extras.state as any;
    this.csvData = state?.csvData  || [];
    this.headers = state?.headers  || [];
    this.filename = state?.filename || '';
    this.inferredTypes = state?.inferredTypes || {};
  }

  goToCreateTemplate(): void {
    this.router.navigate(['/create/template'],
      {
        state: {
          csvData: this.csvData,
          headers: this.headers,
          filename: this.filename,
          inferredTypes: this.inferredTypes,
        }
      }
    );
  }

}