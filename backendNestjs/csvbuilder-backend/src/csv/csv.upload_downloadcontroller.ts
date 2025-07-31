// src/csv/csv.controller.ts

import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CsvService } from './csv.service';
import * as fs from 'fs';
import { Response } from 'express';
import {csvFileInterceptor} from './csv.interceptor'
import path, { join } from 'path';
import { TemplateService } from 'src/Templates/template/template.service';


@Controller('csv')
export class CsvController {
  constructor(private readonly csvService: CsvService, 
    private readonly templateService: TemplateService,) {}

  

  @Post('upload')
  @UseInterceptors(csvFileInterceptor)
  async uploadCsv(@UploadedFile() file: Express.Multer.File) {
    console.log('📁 [Controller] UploadedFile object:', file);
    const dir = path.dirname(file.path);
    const data = await this.csvService.handleFile(file);

    const inferredTypes = this.templateService.predictTypes(data);


    return {
      message: 'CSV parsed successfully',
      rowCount: data.length,
      data,
      uploadedFilename: file.filename,
      inferredTypes,
    };
  }


@Get('download-headers')
async downloadHeaders(
  @Query('file') file: string,
  @Query('name') name: string,
  @Res() res: Response,
) {
  if (!file) throw new NotFoundException('No file provided');

  const filePath = join(__dirname, '..', '..', 'uploads', file);

  if (!fs.existsSync(filePath)) {
    throw new NotFoundException('File not found on server');
  }

  const headers = await this.csvService.extractHeaders(filePath);
  const content = headers.join(',') + '\n';

  const tempFilePath = join(__dirname, '..', '..', 'uploads', `headers-${Date.now()}.csv`);
  fs.writeFileSync(tempFilePath, content);

  res.download(tempFilePath, `${name || 'headers'}.csv`, () => {
  });
}


@Post('generate-json')
async generateJsonTemplate(
  @Body() body: { inferredTypes: Record<string, string>, name: string,required?: string[]; },
  @Res() res: Response
) {
  const { inferredTypes, name, required = [] } = body;
  
  const errorMessages: Record<string, string> = {};

  const properties: Record<string, any> = {};

  for (const [key, type] of Object.entries(inferredTypes)) {
    if (type === 'NUMBER') {
      properties[key] = { type: 'number' };
      errorMessages[key] = `The field ${key} must be a NUMBER`;
    } else if (type === 'EMAIL') {
      properties[key] = {
        type: 'string',
        pattern: "(?!^\\d+$)^.+$"
      };
      errorMessages[key] = `The field ${key} must be a STRING`;
    } else if (type === 'DATE') {
      properties[key] = {
        type: 'string',
        pattern: "(?!^\\d+$)^.+$"
          // μπορείς να το προσαρμόσεις
      };
      errorMessages[key] = `The field ${key} must be a STRING`;
    } else if (type === 'BOOLEAN') {
      properties[key] = {
        type: 'string',
        format : "custom-boolean"
      };
      errorMessages[key] = `The field ${key} must be a BOOLEAN`;
    } else {
      properties[key] = { type: 'string' };
      errorMessages[key] = `The field ${key} must be a STRING`;
    }
  }

  const schema = {
    type: 'object',
    properties,
    required,
    errorMessages,
  };

  const jsonContent = JSON.stringify(schema, null, 2);
  const tempFilePath = join(__dirname, '..', '..', 'uploads', `custom-template-${Date.now()}.json`);
  fs.writeFileSync(tempFilePath, jsonContent);

  res.download(tempFilePath, `${name || 'template'}.json`, () => {});
}

}
