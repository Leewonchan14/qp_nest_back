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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import PaginateResponse from 'src/common/api-response/paginate.response';
import SuccessResponse from 'src/common/api-response/success.response';
import HashTags from 'src/hashtag/hashtags.entity';
import { ValueToHashTag } from 'src/hashtag/pipes/hashtags-value-to-hashtag.pipe';
import { CurrentUser } from 'src/users/decorators/current.user.decorator';
import { ExistUserIdPipe } from 'src/users/pipes/user-exist-validator.pipe';
import Users from 'src/users/users.entity';
import AdjacentQuestionResponseDto from './dto/adjacent-question.response.dto';
import CreateQuestionRequestDto from './dto/create-question.request.dto';
import QuestionResponseDto from './dto/question.response.dto';
import UpdateQuestionRequestDto from './dto/update-question.request.dto';
import { ExistQuestionIdPipe } from './pipes/questions-exist-validator.pipe';
import Questions from './questions.entity';
import QuestionsService from './questions.service';

@Controller('questions')
export default class QuestionController {
  constructor(private readonly questionsService: QuestionsService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser(ExistUserIdPipe) user: Users,
    @Body() createQuestionRequestDto: CreateQuestionRequestDto,
    @Body('hashTags', ValueToHashTag) hashTags: HashTags[],
  ) {
    const { questionId } = await this.questionsService.create(
      user,
      hashTags,
      createQuestionRequestDto,
    );
    return SuccessResponse.of(
      HttpStatus.CREATED, //
      { questionId },
    );
  }

  @Get(':questionId')
  async findById(
    @Param('questionId', ExistQuestionIdPipe) question: Questions, //
  ) {
    const {
      question: findQuestion,
      answerCount,
      expertCount,
    } = await this.questionsService.findOne(question);
    return SuccessResponse.of(
      HttpStatus.OK,
      await QuestionResponseDto.of(
        findQuestion,
        answerCount?.answerCounts,
        expertCount?.expertCounts,
      ),
    );
  }

  @Get('/adjacent/:questionId')
  async findAdjacentId(
    @Param('questionId', ExistQuestionIdPipe) question: Questions, //
  ) {
    return SuccessResponse.of(
      HttpStatus.OK,
      AdjacentQuestionResponseDto.of(
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
    const { questions, count, answerCounts, expertCounts } =
      await this.questionsService.findAll(page, pageSize, search ?? '');
    // console.log('questions: ', questions);
    console.log('expertCounts: ', expertCounts, questions.length);
    return SuccessResponse.of(
      HttpStatus.OK,
      PaginateResponse.toPaginate(
        await QuestionResponseDto.ofList(questions, answerCounts, expertCounts),
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
    const {
      question: updatedQuestion,
      answerCount,
      expertCount,
    } = await this.questionsService.update(
      question, //
      updateQuestionRequestDto,
    );
    return SuccessResponse.of(
      HttpStatus.OK,
      await QuestionResponseDto.of(updatedQuestion, answerCount, expertCount),
    );
  }

  @Get('users/:userId')
  async findByUser(
    @Param('userId', ExistUserIdPipe) user: Users, //
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
  ) {
    const { questions, count, answerCounts, expertCounts } =
      await this.questionsService.findByUser(user, page, pageSize);
    return SuccessResponse.of(
      HttpStatus.OK, //
      PaginateResponse.toPaginate(
        await QuestionResponseDto.ofList(questions, answerCounts, expertCounts),
        count,
        page,
        pageSize,
      ),
    );
  }
}
