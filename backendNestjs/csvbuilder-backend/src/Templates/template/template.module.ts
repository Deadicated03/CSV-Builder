import { Module } from '@nestjs/common';
import { TemplateService } from './template.service';
import { CsvModule } from 'src/csv/csv.module';

@Module({
  imports: [CsvModule],        // ← κάνουμε import
  controllers: [],
  providers: [TemplateService],
  exports: [TemplateService],
})
export class TemplateModule {}
