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
import PaginateResponse from 'src/common/api-response/paginate.response';
import SuccessResponse from 'src/common/api-response/success.response';
import { ExistQuestionIdPipe } from 'src/questions/pipes/questions-exist-validator.pipe';
import Questions from 'src/questions/questions.entity';
import { ExistUserIdPipe } from 'src/users/pipes/user-exist-validator.pipe';
import Users from 'src/users/users.entity';
import Answers from './answers.entity';
import AnswersService from './answers.service';
import AnswersResponseDto from './dto/answers.response.dto';
import CreateAnswersRequestDto from './dto/create-answers.request.dto';
import { ExistAnswerIdPipe } from './pipes/answers-exist-validator.pipe';
import { CreateAnswerParentAnswerPipe } from './pipes/create-answer.validator.pipe';
import UpdateAnswerRequestDto from './dto/update-answers.request.dto';

@Controller('answers')
export default class AnswersController {
  constructor(
    private readonly answerService: AnswersService, //
  ) {}
  @Post('questions/:questionId')
  async create(
    @Param('questionId') question: Questions, //
    @Body('userId', ExistUserIdPipe) user: Users,
    @Body(CreateAnswerParentAnswerPipe)
    createAnswersRequestDto: CreateAnswersRequestDto,
  ) {
    return SuccessResponse.of(
      HttpStatus.OK, //
      await AnswersResponseDto.of(
        await this.answerService.create(
          question,
          user,
          createAnswersRequestDto,
        ),
      ),
    );
  }

  @Get(':answerId')
  async findById(@Param('answerId', ExistAnswerIdPipe) answer: Answers) {
    return SuccessResponse.of(
      HttpStatus.OK, //
      await AnswersResponseDto.of(answer),
    );
  }

  @Get('questions/:questionId')
  async findByQuestion(
    @Param('questionId', ExistQuestionIdPipe) question: Questions, //
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
  ) {
    const { answers, count } = await this.answerService.findByQuestion(
      question,
      page,
      pageSize,
    );
    return SuccessResponse.of(
      HttpStatus.OK, //
      PaginateResponse.toPaginate(
        await Promise.all(answers.map(AnswersResponseDto.of)),
        count,
        page,
        pageSize,
      ),
    );
  }

  @Get('parent/:answerId')
  async findByParent(
    @Param('answerId', ExistAnswerIdPipe) parent: Answers, //
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
  ) {
    const { answers, count } = await this.answerService.findByParent(
      parent,
      page,
      pageSize,
    );
    return SuccessResponse.of(
      HttpStatus.OK, //
      PaginateResponse.toPaginate(
        await Promise.all(answers.map(AnswersResponseDto.of)),
        count,
        page,
        pageSize,
      ),
    );
  }
  @Delete(':answerId')
  async delete(
    @Param('answerId', ExistAnswerIdPipe) answers: Answers, //
  ) {
    await this.answerService.delete(answers);
    return SuccessResponse.of(
      HttpStatus.OK, //
      { answerId: answers.answerId },
    );
  }

  @Patch(':answerId')
  async update(
    @Param('answerId', ExistAnswerIdPipe) answer: Answers, //
    @Body() updateAnswerRequestDto: UpdateAnswerRequestDto,
  ) {
    return SuccessResponse.of(
      HttpStatus.OK,
      await AnswersResponseDto.of(
        await this.answerService.update(
          answer, //
          updateAnswerRequestDto,
        ),
      ),
    );
  }

  @Post(':answerId/like/:userId')
  async likeAnswer(
    @Param('answerId', ExistAnswerIdPipe) answer: Answers, //
    @Param('userId', ExistUserIdPipe) user: Users,
  ) {
    await this.answerService.likeAnswer(answer, user);
    return SuccessResponse.of(
      HttpStatus.OK, //
      'ok',
    );
  }
  // @Post(':answerId/unlike/:userId')
  // async unlikeAnswer(
  //   @Param('')
  // )
}
