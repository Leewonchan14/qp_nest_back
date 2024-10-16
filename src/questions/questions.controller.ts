import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import SuccessResponse from 'src/common/api-response/success.response';
import HashTags from 'src/hashtag/hashtags.entity';
import { ValueToHashTag } from 'src/hashtag/pipes/hashtags-value-to-hashtag.pipe';
import { ExistUserIdPipe } from 'src/users/pipes/user-exist-validator.pipe';
import Users from 'src/users/users.entity';
import CreateQuestionRequestDto from './dto/create-question.request.dto';
import { ExistQuestionIdPipe } from './pipes/questions-exist-validator.pipe';
import Questions from './questions.entity';
import QuestionsService from './questions.service';
import AdjacentQuestionResponseDto from './dto/adjacent-question.response.dto';
import QuestionResponseDto from './dto/question.response.dto';
import UpdateQuestionRequestDto from './dto/update-question.request.dto';
import PaginateResponse from 'src/common/api-response/paginate.response';

@Controller('questions')
export default class QuestionController {
  constructor(private readonly questionsService: QuestionsService) {}
  @Post()
  async create(
    @Body() createQuestionRequestDto: CreateQuestionRequestDto,
    @Body('userId', ExistUserIdPipe) user: Users, //
    @Body('hashTags', ValueToHashTag) hashTags: HashTags[],
  ) {
    return SuccessResponse.of(
      HttpStatus.CREATED,
      await QuestionResponseDto.of(
        await this.questionsService.create(
          user,
          hashTags,
          createQuestionRequestDto,
        ),
      ),
    );
  }

  @Get(':questionId')
  async findById(
    @Param('questionId', ExistQuestionIdPipe) question: Questions, //
  ) {
    return SuccessResponse.of(
      HttpStatus.OK,
      await QuestionResponseDto.of(
        await this.questionsService.findOne(question), //
      ),
    );
  }

  @Get('/adjacent/:questionId')
  async findAdjacentId(
    @Param('questionId', ExistQuestionIdPipe) question: Questions, //
  ) {
    return SuccessResponse.of(
      HttpStatus.OK,
      await AdjacentQuestionResponseDto.of(
        await this.questionsService.findAdjacent(question),
      ),
    );
  }

  @Get()
  async findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('search') search?: string,
  ) {
    const { questions, count } = await this.questionsService.findAll(
      page,
      pageSize,
      search ?? '',
    );
    return SuccessResponse.of(
      HttpStatus.OK,
      PaginateResponse.toPaginate(
        await Promise.all(questions.map(QuestionResponseDto.of)),
        count,
        page,
        pageSize,
      ),
    );
  }

  @Delete(':questionId')
  async delete(
    @Param('questionId', ExistQuestionIdPipe) question: Questions, //
  ) {
    await this.questionsService.delete(question);
    return SuccessResponse.of(
      HttpStatus.OK, //
      { questionId: question.questionId },
    );
  }

  @Patch(':questionId')
  async update(
    @Param('questionId', ExistQuestionIdPipe) question: Questions, //
    @Body() updateQuestionRequestDto: UpdateQuestionRequestDto,
  ) {
    return SuccessResponse.of(
      HttpStatus.OK,
      await QuestionResponseDto.of(
        await this.questionsService.update(
          question, //
          updateQuestionRequestDto,
        ),
      ),
    );
  }

  @Get('users/:userId')
  async findByUser(
    @Param('userId', ExistUserIdPipe) user: Users, //
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
  ) {
    const { questions, count } = await this.questionsService.findByUser(
      user,
      page,
      pageSize,
    );
    return SuccessResponse.of(
      HttpStatus.OK, //
      PaginateResponse.toPaginate(
        await Promise.all(questions.map(QuestionResponseDto.of)),
        count,
        page,
        pageSize,
      ),
    );
  }
}
