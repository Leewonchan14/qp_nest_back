import UsersResponseDto from 'src/users/dto/users.response.dto';
import Answers from '../answers.entity';

export default class AnswersResponseDto {
  answerId: number;

  content: string;

  isRootAnswer: boolean;

  isUpdated: boolean;

  parentAnswerId: number | null;

  user: UsersResponseDto;
  childrenCount: number;
  likeCount: number;

  static async of(answer: Answers) {
    const newResponse = new AnswersResponseDto();
    newResponse.answerId = answer.answerId;
    newResponse.content = answer.content;
    newResponse.isRootAnswer = answer.isRootAnswer;
    newResponse.user = UsersResponseDto.of(await answer.user);
    newResponse.childrenCount = (await answer.children).length;
    newResponse.likeCount = (await answer.likeUsers).length;
    newResponse.parentAnswerId = (await answer.parent)
      ? (await answer.parent).answerId
      : null;

    return newResponse;
  }
}
