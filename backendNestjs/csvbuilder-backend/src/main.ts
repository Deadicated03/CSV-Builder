import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import path from 'path';
import * as fs from 'fs';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.enableCors();

  await app.listen(8080);
}
bootstrap();
