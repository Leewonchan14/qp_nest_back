import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import HashTags from './hashtags.entity';
import HashTagsController from './hashtags.controller';
import HashTagsService from './hashtags.service';

@Module({
  imports: [TypeOrmModule.forFeature([HashTags])],
  controllers: [HashTagsController],
  providers: [HashTagsService],
})
export class HashTasgModule {}
