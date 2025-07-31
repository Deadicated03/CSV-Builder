import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { MappingService } from "./mapping.service";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import path, { extname } from "path";
import * as fs from 'fs'; 
import * as fsp from 'fs/promises';
import { parseCSVStream } from "src/utils/parser/csv.parser";

@Controller('mapping')
export class MappingController {
  constructor(private readonly mappingService: MappingService) {}

  @Post('match')
  matchHeaders(@Body() body: { csvHeaders: string[], jsonFields: string[] }) {
    return this.mappingService.getCsvTemplateMapping(body.csvHeaders, body.jsonFields);
  }

@Post('upload-all')
@UseInterceptors(
  FilesInterceptor('files', 2, {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const ext = extname(file.originalname);
        const type = file.mimetype === 'application/json' ? 'template.json' : 'template.csv';
        cb(null, type);
      }
    }),
    fileFilter: (req, file, cb) => {
      const allowed = ['application/json', 'text/csv'];
      cb(null, allowed.includes(file.mimetype));
    },
  }),
)
async handleUploadAll(@UploadedFiles() files: Express.Multer.File[]) {
  const jsonFile = files.find(f => f.mimetype === 'application/json');
  const csvFile = files.find(f => f.mimetype === 'text/csv');
  
    if (!jsonFile || !csvFile) {
    throw new BadRequestException('Both JSON and CSV files must be uploaded.');
  }

  const jsonContent = JSON.parse(await fsp.readFile(jsonFile.path, 'utf8'));
  const templateFields = Object.keys(jsonContent.properties);

  const csvContent = await fsp.readFile(csvFile.path, 'utf8');
  const [headerLine] = csvContent.split('\n');
  const csvHeaders = headerLine.split(',');

  return { 
    csvHeaders, 
    templateFields,
    requiredFields: jsonContent.required,
    errorMessages: jsonContent.errorMessages,
    allProperties: jsonContent.properties,
    csvFilename: csvFile.filename };
}

@Get('csv/:filename')
async getCsvContent(@Param('filename') filename: string): Promise<any[]> {
  const filePath = path.join(process.cwd(), 'uploads', filename);

  if (!fs.existsSync(filePath)) {
    throw new NotFoundException('CSV file not found.');
  }

  return parseCSVStream(filePath);
}
}