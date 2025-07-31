import { Injectable } from '@nestjs/common';

@Injectable()
export class MappingService {
  getCsvTemplateMapping(csvHeaders: string[], jsonFields: string[]) {
    return csvHeaders.map(header => {
      const matched = jsonFields.find(field =>
        field.toLowerCase().includes(header.toLowerCase().replace(/\s/g, ''))
      );
      return {
        csvColumn: header,
        templateColumn: matched ?? '',
        selected: true,
      };
    });
  }
}