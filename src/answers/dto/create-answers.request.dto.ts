import {
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';
import Answers from '../answers.entity';

export default class CreateAnswersRequestDto {
  userId: number;

  @ValidateIf((o: CreateAnswersRequestDto) => !o.isRootAnswer)
  @IsInt()
  parentAnswerId?: number;

  parentAnswer?: Answers;

  @Length(1, 500)
  @IsString()
  content: string;

  @IsNotEmpty()
  isRootAnswer: boolean;
}
