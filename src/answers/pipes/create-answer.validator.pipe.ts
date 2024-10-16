import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Answers from '../answers.entity';
import CreateAnswersRequestDto from '../dto/create-answers.request.dto';
import { ExistAnswerIdPipe } from './answers-exist-validator.pipe';

@Injectable()
export class CreateAnswerParentAnswerPipe
  implements
    PipeTransform<CreateAnswersRequestDto, Promise<CreateAnswersRequestDto>>
{
  constructor(
    @InjectRepository(Answers)
    private readonly answersRepository: Repository<Answers>,
    private readonly existAnswerPipe: ExistAnswerIdPipe,
  ) {}
  async transform(
    value: CreateAnswersRequestDto, //
    // metadata: ArgumentMetadata,
  ) {
    const { isRootAnswer, parentAnswerId } = value;

    if (!isRootAnswer) {
      if (!parentAnswerId) {
        throw new BadRequestException(
          'parentAnswerId is required when isRootAnswer is false',
        );
      }

      // 기존 Pipe를 사용하여 parentAnswerId를 엔티티로 변환
      const parentAnswer = await this.existAnswerPipe.transform(
        parentAnswerId,
        // {
        //   type: 'param',
        //   metatype: Number,
        //   data: 'parentAnswerId',
        // },
      );

      // 변환된 엔티티를 value에 추가
      return { ...value, parentAnswer };
    }

    // isRootAnswer가 true인 경우 그대로 반환
    return value;
  }
}
