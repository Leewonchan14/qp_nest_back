import Questions from '../questions.entity';
import QuestionResponseDto from './question.response.dto';

export default class AdjacentQuestionResponseDto {
  preQuestion: QuestionResponseDto | null;
  nextQuestion: QuestionResponseDto | null;

  static async of([pre, next]: [
    Questions | null,
    Questions | null,
  ]): Promise<AdjacentQuestionResponseDto> {
    const newResponse = new AdjacentQuestionResponseDto();
    newResponse.preQuestion = pre ? await QuestionResponseDto.of(pre) : null;
    newResponse.nextQuestion = next ? await QuestionResponseDto.of(next) : null;

    return newResponse;
  }
}
