import * as fs from 'fs';
import csv from 'csv-parser'; // ✅ σωστό import

export const parseCSVStream = (filePath: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const results: any[] = [];

    fs.createReadStream(filePath)
      .pipe(csv({ skipLines: 0 }))
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
};
