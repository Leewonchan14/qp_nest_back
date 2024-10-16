import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Users from 'src/users/users.entity';
import AnswersController from './answers.controller';
import Answers from './answers.entity';
import AnswersService from './answers.service';
import { CreateAnswerParentAnswerPipe } from './pipes/create-answer.validator.pipe';
import { ExistAnswerIdPipe } from './pipes/answers-exist-validator.pipe';
import Questions from 'src/questions/questions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Answers, Users, Questions])],
  controllers: [AnswersController],
  providers: [AnswersService, CreateAnswerParentAnswerPipe, ExistAnswerIdPipe],
})
export class AnswersModule {}
