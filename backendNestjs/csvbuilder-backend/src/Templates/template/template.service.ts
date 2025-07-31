import { Injectable } from '@nestjs/common';

@Injectable()
export class TemplateService {
  /**
   * Προσπαθεί να προβλέψει τον τύπο κάθε πεδίου του CSV (στήλης).
   * @param data Πίνακας αντικειμένων από CSV (π.χ. [{ name: 'Alice', age: '25' }, ...])
   * @returns Αντικείμενο με προβλεπόμενο τύπο για κάθε στήλη
   */
  predictTypes(data: any[]): Record<string, string> {
    if (!data || data.length === 0) return {};

    const types: Record<string, string> = {};
    const sampleSize = Math.min(data.length, 50); // ανάλυση σε max 50 γραμμές

    const isBoolean = (val: string) =>
      ['true', 'false', 'yes', 'no', '1', '0'].includes(val.toLowerCase());

    const isNumber = (val: string) => !isNaN(Number(val)) && val.trim() !== '';

    const isEmail = (val: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

    const isDate = (val: string) =>
      !isNaN(Date.parse(val));

    const keys = Object.keys(data[0]);

    for (const key of keys) {
      const values = data.slice(0, sampleSize).map(row => row[key]?.toString().trim() || '');

      let counts = { email: 0, number: 0, boolean: 0, date: 0 };

      for (const val of values) {
        if (isEmail(val)) counts.email++;
        else if (isNumber(val)) counts.number++;
        else if (isBoolean(val)) counts.boolean++;
        else if (isDate(val)) counts.date++;
      }

      const total = values.length;

      if (counts.email >= total * 0.5) types[key] = 'EMAIL';
      else if (counts.boolean >= total * 0.5) types[key] = 'BOOLEAN';
      else if (counts.number >= total * 0.5) types[key] = 'NUMBER';
      else if (counts.date >= total * 0.5) types[key] = 'DATE';
      else types[key] = 'STRING';
    }
    
    return types;
  }
}
