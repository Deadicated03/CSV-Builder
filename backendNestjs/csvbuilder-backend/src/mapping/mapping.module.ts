import { Module } from '@nestjs/common';
import { MappingController } from './mapping.controller';
import { MappingService } from './mapping.service';

@Module({
  controllers: [MappingController],
    providers: [MappingController,MappingService],
    exports: [MappingService]
})
export class MappingModule {}