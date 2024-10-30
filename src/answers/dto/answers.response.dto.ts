import UsersResponseDto from 'src/users/dto/users.response.dto';
import Answers from '../answers.entity';

export default class AnswersResponseDto {
  answerId: number;

  content: string;

  isRootAnswer: boolean;

  isUpdated: boolean;

  createdAt: Date;

  user: UsersResponseDto;
  childrenCount: number;
  likeCount: number;
  isLike: boolean;

  static async of(
    answer: Answers,
    likeCount?: number,
    childrenCount?: number,
    isLike?: boolean,
  ) {
    const newResponse = new AnswersResponseDto();
    newResponse.answerId = answer.answerId;
    newResponse.content = answer.content;
    newResponse.isRootAnswer = answer.isRootAnswer;
    newResponse.createdAt = answer.createdAt;
    newResponse.user = UsersResponseDto.of(await answer.user);
    newResponse.childrenCount = childrenCount ?? (await answer.children).length;
    newResponse.likeCount = likeCount ?? (await answer.children).length;
    newResponse.isLike = isLike ?? false;
    return newResponse;
  }

  static ofList(
    answers: Answers[],
    likesCounts: number[],
    childrenCounts: number[],
    isLikes: boolean[],
  ) {
    return Promise.all(
      answers.map((answer, index) =>
        AnswersResponseDto.of(
          answer,
          likesCounts[index],
          childrenCounts[index],
          isLikes[index],
        ),
      ),
    );
  }
}
