import { Injectable, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionsNotFoundException } from 'src/common/filters/questions-not-found.filter';
import { Repository } from 'typeorm';
import Questions from '../questions.entity';

@Injectable()
export class ExistQuestionIdPipe
  implements PipeTransform<number, Promise<Questions>>
{
  constructor(
    @InjectRepository(Questions)
    private readonly questionsRepository: Repository<Questions>,
  ) {}
  async transform(
    questionId: number, //
    // metadata: ArgumentMetadata,
  ) {
    const findQuestion = await this.questionsRepository.findOneBy({
      questionId,
      isDeleted: false,
    });
    if (!findQuestion) {
      throw new QuestionsNotFoundException(questionId);
    }
    return findQuestion;
  }
}
