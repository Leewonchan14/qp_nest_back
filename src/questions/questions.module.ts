import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import HashTags from 'src/hashtag/hashtags.entity';
import Users from 'src/users/users.entity';
import QuestionController from './questions.controller';
import Questions from './questions.entity';
import QuestionsService from './questions.service';
import HashTagsService from 'src/hashtag/hashtags.service';
import AnswersService from 'src/answers/answers.service';
import Answers from 'src/answers/answers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Questions, Users, HashTags, Answers])],
  controllers: [QuestionController],
  providers: [QuestionsService, HashTagsService, AnswersService],
})
export class QuestionsModule {}
