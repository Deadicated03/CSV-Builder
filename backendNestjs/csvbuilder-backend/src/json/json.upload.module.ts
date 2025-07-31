import { Module } from '@nestjs/common';
import { UploadController } from './json.upload.controller';
import { UploadService } from './json.upload.service';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}