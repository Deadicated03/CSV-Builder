import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DownloadButtons } from '../../download-buttons/download-buttons';


@Component({
  selector: 'app-create-template-page',
  standalone: true,
  imports: [CommonModule, FormsModule, DownloadButtons],
  templateUrl: './template.html',
  styleUrls: ['./template.scss']
})
export class TemplateComponent implements OnInit {
  csvData: any[] = [];
  headers: string[] = [];
  filename = '';
  inferredTypes: Record<string, string> = {};
  isRequired: boolean[] = []; // για να κρατάμε αν το πεδίο είναι υποχρεωτικό
  
  fieldTypes: string[] = ['STRING', 'NUMBER', 'BOOLEAN', 'EMAIL', 'DATE'];
  columnTypes: string[] = [];  // Αυτό θα γεμίσει από το backend
  
  constructor(private router: Router, private http: HttpClient){
    const state = this.router.getCurrentNavigation()?.extras.state as any;
    this.csvData = state?.csvData || [];
    this.headers = state?.headers || [];
    this.filename = state?.filename || '';
    this.inferredTypes = state?.inferredTypes || {};
  }


 ngOnInit(): void {
  console.log('📁 [inferredtypes] CSV Data:', this.inferredTypes);
  // Αντιστοιχίζουμε τους τύπους στη σειρά των headers
  this.columnTypes = this.headers.map(h => this.inferredTypes[h] || 'STRING');
  this.isRequired = new Array(this.headers.length).fill(true);
}

}