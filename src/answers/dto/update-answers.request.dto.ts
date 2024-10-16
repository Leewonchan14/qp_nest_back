import { IsString, Length } from 'class-validator';
import Answers from '../answers.entity';

export default class UpdateAnswerRequestDto {
  @IsString()
  @Length(1, 500)
  content: string;

  static assign(answer: Answers, dto: UpdateAnswerRequestDto) {
    for (const [key, value] of Object.entries(dto)) {
      answer[key] = value;
    }

    return answer;
  }
}
