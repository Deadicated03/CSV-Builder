import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UploadService } from './json.upload.service';
import { extname } from 'path';

@Controller('json')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}


  @Post('upload')
   @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          cb(null, `uploaded-${Date.now()}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/json') {
          cb(new BadRequestException('Only JSON files are allowed!'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
    async uploadJson(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.handleJsonUpload(file.path);
  }

}