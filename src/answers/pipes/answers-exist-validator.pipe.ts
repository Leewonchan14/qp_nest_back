import { Injectable, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Answers from '../answers.entity';
import { AnswersNotFoundException } from 'src/common/filters/answer-not-found.filter';

@Injectable()
export class ExistAnswerIdPipe
  implements PipeTransform<number, Promise<Answers>>
{
  constructor(
    @InjectRepository(Answers)
    private readonly answersRepository: Repository<Answers>,
  ) {}
  async transform(
    answerId: number, //
    // metadata: ArgumentMetadata,
  ) {
    const findAnswer = await this.answersRepository.findOneBy({
      answerId,
      isDeleted: false,
    });
    if (!findAnswer) {
      throw new AnswersNotFoundException(answerId);
    }
    return findAnswer;
  }
}
