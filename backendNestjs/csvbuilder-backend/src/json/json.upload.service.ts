import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';


@Injectable()
export class UploadService {
   async handleJsonUpload(filePath: string): Promise<string[]> {
    try {
      const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const fields = Object.keys(json.properties); // ["Emp Age", ...]
      return fields;
    } catch (err) {
      throw new InternalServerErrorException('Failed to parse JSON file');
    }
  }
}