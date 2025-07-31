import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import stringSimilarity from 'string-similarity';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mapping-result',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './mapping-result.html',
  styleUrl: './mapping-result.scss',
})
export class MappingResult implements OnInit {
  csvHeaders: string[] = [];
  templateFields: string[] = [];
  requiredFields: string[] = [];
  errorMessages: Record<string,string> = {};
  allProperties: Record<string,any> = {};
  fieldMapping: Record<string,string> = {};
  fieldEnabled: { [key: string]: boolean } = {};
  csvFilename: string = '';


  constructor(private router: Router) {}

  goToCsvJsonMapping() { 
    
  const duplicates = this.getDuplicateTemplateFields();
  if (duplicates.length > 0) {
    alert('❌ Δεν επιτρέπονται διπλότυπα Template Fields. Κάθε CSV πεδίο πρέπει να αντιστοιχεί σε μοναδικό πεδίο του template.');
    return; // ⛔ σταματάει η υποβολή
  }

  

  const enabledHeaders = this.csvHeaders.filter(h => this.fieldEnabled[h]);
  const enabledMapping: Record<string, string> = {};

    enabledHeaders.forEach(h => {
    enabledMapping[h] = this.fieldMapping[h];
  });

  const data = {
    csvHeaders: enabledHeaders,
    templateFields: this.templateFields,
    requiredFields: enabledMapping,
    errorMessages: this.errorMessages,
    allProperties: this.allProperties,
    fieldMapping: this.fieldMapping,
    csvFilename: this.csvFilename 
  };

  localStorage.setItem('mappingData', JSON.stringify(data));
  this.router.navigate(['csv-json-mapping']);
}

ngOnInit(): void {
  console.log('aaaaaaaaaaaaaaaaaaaaaaa');
  
  const data = localStorage.getItem('uploadData');
  if (data) {
    const parsed = JSON.parse(data);
    this.csvHeaders = parsed.csvHeaders;
    this.templateFields = parsed.templateFields;
    this.csvFilename = parsed.csvFilename || '';
    this.errorMessages = parsed.errorMessages || {};
    this.allProperties = parsed.allProperties || {};
    console.log('📁 [Component] CSV reqf:', this.requiredFields);
    console.log(this.templateFields);
    console.log(this.csvFilename);

    this.fieldMapping = {};

    this.fieldEnabled = {}; // καθαρίζουμε

    this.csvHeaders.forEach(header => {
      this.fieldEnabled[header] = true; // ✅ Τικάρισμα
    });
    

    this.csvHeaders.forEach(header => {
      const result = stringSimilarity.findBestMatch(header, this.templateFields);
      const bestMatch = result.bestMatch.target;
      const score = result.bestMatch.rating;

      this.fieldMapping[header] = bestMatch;
      console.log(`Header: "${header}" matched with "${bestMatch}" with score ${score}`);
    }
  );
    
  }
}

logEnabledHeaders() {
  const enabled = this.csvHeaders.filter(h => this.fieldEnabled[h]);
  this.requiredFields = enabled;
  console.log(`Ενεργά headers (${enabled.length}):`, enabled);
}

getDuplicateTemplateFields(): string[] {
  const counts: Record<string, number> = {};

  this.csvHeaders.forEach(header => {
    if (this.fieldEnabled[header]) {
      const field = this.fieldMapping[header];
      if (!field) return;
      counts[field] = (counts[field] || 0) + 1;
    }
  });

  return Object.keys(counts).filter(field => counts[field] > 1);
}

isDuplicate(header: string): boolean {
  const duplicates = this.getDuplicateTemplateFields();
  return this.fieldEnabled[header] && duplicates.includes(this.fieldMapping[header]);
}
}