import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CsvModule } from './csv/csv.module';
import { TemplateModule } from './Templates/template/template.module';
import { UploadModule } from './json/json.upload.module';
import { MappingModule } from './mapping/mapping.module';

@Module({
  imports: [CsvModule,
    TemplateModule,
    UploadModule,
    MappingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
