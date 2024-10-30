import Questions from '../questions.entity';

export default class AdjacentQuestionResponseDto {
  preQuestion: AdjacentQuestionDto | null;
  nextQuestion: AdjacentQuestionDto | null;

  static of([pre, next]: [
    Questions | null,
    Questions | null,
  ]): AdjacentQuestionResponseDto {
    const newResponse = new AdjacentQuestionResponseDto();
    newResponse.preQuestion = pre ? AdjacentQuestionDto.of(pre) : null;
    newResponse.nextQuestion = next ? AdjacentQuestionDto.of(next) : null;

    return newResponse;
  }
}

export class AdjacentQuestionDto {
  questionId: number;
  title: string;

  static of(question: Questions): AdjacentQuestionDto {
    const newResponse = new AdjacentQuestionDto();
    newResponse.questionId = question.questionId;
    newResponse.title = question.title;
    return newResponse;
  }
}
