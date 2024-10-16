import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Answers from './answers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Answers])],
  controllers: [],
  providers: [],
})
export class AnswersModule {}
