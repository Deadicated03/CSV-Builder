import { Module } from '@nestjs/common';
import { CsvController } from './csv.upload_downloadcontroller';
import { CsvService } from './csv.service';
import { TemplateService } from 'src/Templates/template/template.service';

@Module({
  controllers: [CsvController],
  providers: [CsvService,TemplateService],
  exports: [CsvService]
})
export class CsvModule {}
