import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';



@Component({
  selector: 'app-csv-json-mapping',
  imports: [CommonModule,ScrollingModule],
  standalone: true,
  templateUrl: './csv-json-mapping.html',
  styleUrl: './csv-json-mapping.scss'
})
export class CsvJsonMapping {
  csvData: any[] = [];
  headers: string[] = [];
  filename = '';
  templateFields: string[] = [];
  requiredFields: Record<string,string> = {};
  errorMessages: Record<string,string> = {};
  allProperties: Record<string,any> = {};
  fieldMapping: Record<string,string> = {};
  objectKeys = Object.keys;
  validationErrors: string[][] = [];
  editRowIndex: number | null = null;
  editColIndex: number | null = null;
  editValue: string = '';
   

  @ViewChild(CdkVirtualScrollViewport)
   viewport!: CdkVirtualScrollViewport;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const mappingDataRaw = localStorage.getItem('mappingData');
    if (!mappingDataRaw) return;

    const mappingData = JSON.parse(mappingDataRaw);
    this.filename = mappingData.csvFilename;
    this.headers = mappingData.csvHeaders || [];

    this.templateFields = mappingData.templateFields;
    this.fieldMapping = mappingData.fieldMapping;
    this.allProperties = mappingData.allProperties;
    this.requiredFields = mappingData.requiredFields;
    this.errorMessages = mappingData.errorMessages;
    console.log('📁 [Component] CSV Headers:', this.headers);
    console.log('📁 [Component] Field Mapping:', this.fieldMapping);
    console.log('📁 [Component] All Properties:', this.allProperties);
    console.log('📁 [Component] Required Fields:', this.requiredFields);
    console.log('📁 [Component] Error Messages:', this.errorMessages);
    console.log('📁 [Component] template fields:', this.templateFields);
    

    if (this.filename) {
      this.http.get<any[]>(`http://localhost:8080/mapping/csv/${this.filename}`)
        .subscribe(parsedRows => {
          if (parsedRows.length > 0) {
            this.headers = Object.keys(this.requiredFields); // παίρνουμε τις κεφαλίδες
            this.csvData = parsedRows.map(row =>
              this.headers.map(h => row[h] || '')
            );
            console.log('📁 [Component] csvdata:', this.csvData);
            
            this.ngAfterViewInit();
          }
        }, err => {
          console.error('❌ CSV fetch error:', err);
        });
    }
    console.log('📁 [Component] csvdata:', this.csvData);
  }


validateData(): void {
  if (!this.viewport) return;


  const range = this.viewport.getRenderedRange();
  const start = range.start;
  const end = range.end;
  this.validationErrors = [];

   for (let rowIndex = start; rowIndex < end; rowIndex++) {
    const row = this.csvData[rowIndex];
    const rowErrors: string[] = [];

    row.forEach((value: string, colIndex:number) => {
      const csvHeader = this.headers[colIndex]; // π.χ. "Name"
      const jsonField = this.fieldMapping[csvHeader]; // π.χ. "EMPName"
      const fieldSpec = this.allProperties[jsonField];
      console.log(`Validating "${csvHeader}" (${jsonField}):`, value, fieldSpec);


      if (fieldSpec?.type === 'string' && /^\d+$/.test(value)) {


        const customMessage = this.errorMessages[jsonField];
        const finalMessage = customMessage
          ? `Line ${rowIndex + 1}, "${jsonField}": ${customMessage}`
          : `Line ${rowIndex + 1}, "${jsonField}" must be a string`;

        rowErrors.push(finalMessage);
      }

      if (fieldSpec?.type === 'string') {
        

          if (fieldSpec?.format === 'custom-boolean') {

            const normalized = String(value).toLowerCase();

            const isValidBoolean =
              normalized === 'true' ||
              normalized === 'false' ||
              normalized === '1' ||
              normalized === '0';

            if (!isValidBoolean) {
              const customMessage = this.errorMessages[jsonField];
              const finalMessage = customMessage
                ? `Line ${rowIndex + 1}, "${jsonField}": ${customMessage}`
                : `Line ${rowIndex + 1}, "${jsonField}" must be boolean`;

              rowErrors.push(finalMessage);
            }
          }
          
          if (fieldSpec?.pattern) {
            try {
              const regex = new RegExp(fieldSpec.pattern);
              if (!regex.test(value)) {
                const customMessage = this.errorMessages[jsonField];
                const finalMessage = customMessage
                  ? `Line ${rowIndex + 1}, "${jsonField}": ${customMessage}`
                  : `Line ${rowIndex + 1}, "${jsonField}" does not match the required pattern`;

                rowErrors.push(finalMessage);
              }
            } catch (e) {
              console.error(`Invalid regex pattern for field "${jsonField}":`, fieldSpec.pattern);
            }
          }

        }
      
      if (fieldSpec?.type === 'number' && isNaN(Number(value))) {
        
        const customMessage = this.errorMessages[jsonField];
        const finalMessage = customMessage
          ? `Line ${rowIndex + 1}, "${jsonField}": ${customMessage}`
          : `Line ${rowIndex + 1}, "${jsonField}" must be a number`;

        rowErrors.push(finalMessage);
      }

            
      if (fieldSpec?.type === 'number') {  
        if (fieldSpec?.pattern) {
            try {
              const regex = new RegExp(fieldSpec.pattern);
              if (!regex.test(value)) {
                const customMessage = this.errorMessages[jsonField];
                const finalMessage = customMessage
                  ? `Line ${rowIndex + 1}, "${jsonField}": ${customMessage}`
                  : `Line ${rowIndex + 1}, "${jsonField}" does not match the required pattern`;

                rowErrors.push(finalMessage);
              }
            } catch (e) {
              console.error(`Invalid regex pattern for field "${jsonField}":`, fieldSpec.pattern);
            }
          }
      }
    });

    this.validationErrors[rowIndex] = rowErrors;
  }

  console.log('🛑 Validation Errors:', this.validationErrors);
}

hasError(rowIndex: number, colIndex: number): boolean {
  const csvHeader = this.headers[colIndex];
  const templateField = this.fieldMapping[csvHeader];
  const errors = this.validationErrors[rowIndex] || [];
  return errors.some(err => err.includes(`"${templateField}"`));
}

ngAfterViewInit(): void {
  this.viewport.renderedRangeStream.subscribe(() => {
    this.validateData();  
  });
}

trackByIndex(index: number, item: any): number {
  return index;
}



startEditing(rowIndex: number, colIndex: number) {
  // Ο κώδικάς σου παραμένει ακριβώς ο ίδιος
  this.editRowIndex = rowIndex;
  this.editColIndex = colIndex;
  const value = this.csvData[rowIndex]?.[colIndex];
  this.editValue = value !== undefined && value !== null ? value : '';

  // ★★★ ΠΡΟΣΘΕΤΕΙΣ ΑΥΤΟ ΤΟ ΜΠΛΟΚ ΚΩΔΙΚΑ ★★★
  // Περιμένουμε για την επόμενη "αναλαμπή" του rendering...
  setTimeout(() => {
    // ...βρίσκουμε το input που ΜΟΛΙΣ δημιουργήθηκε μέσα στο κελί...
    const inputElement = document.querySelector<HTMLInputElement>('td input');
    
    // ...και αν το βρούμε, του δίνουμε focus!
    if (inputElement) {
      inputElement.focus();
    }
  }, 0); // Το "0" σημαίνει "κάν' το το συντομότερο δυνατό"
}

saveEdit(rowIndex: number, colIndex: number) {
  if (this.csvData[rowIndex]) {
    this.csvData[rowIndex][colIndex] = this.editValue;
    this.validateData(); // αν κάνεις validation ξανά
  }
  this.editRowIndex = null;
  this.editColIndex = null;
}

cancelEdit() {
  this.editRowIndex = null;
  this.editColIndex = null;
}

downloadCSV(): void {
  if (!this.csvData || this.csvData.length === 0 || !this.headers) return;

  // Δημιουργία CSV string
  const csvRows = [];
  csvRows.push(this.headers.join(',')); // κεφαλίδες
  for (const row of this.csvData) {
    const values = this.headers.map(h => {
      const val = row[this.headers.indexOf(h)];
      return `"${(val ?? '').toString().replace(/"/g, '""')}"`; // escaping quotes
    });
    csvRows.push(values.join(','));
  }

  const csvContent = csvRows.join('\n');

  // Δημιουργία Blob και λήψη
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', 'updated-data.csv');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}


}
