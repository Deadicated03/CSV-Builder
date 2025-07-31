import { Injectable } from '@nestjs/common';
import { parseCSVStream } from 'src/utils/parser/csv.parser';
import * as fs from 'fs';
import csvParser from 'csv-parser';


@Injectable()
export class CsvService {
  async handleFile(file: Express.Multer.File): Promise<Record<string, string>[]> {
    const rows = await parseCSVStream(file.path);
    return rows; 
  }


async extractHeaders(filePath: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const headers: string[] = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('headers', (h) => {
        resolve(h);
      })
      .on('error', (err) => reject(err));
  });
}
}



