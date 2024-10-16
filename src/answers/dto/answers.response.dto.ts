import UsersResponseDto from 'src/users/dto/users.response.dto';

export default class AnswersResponseDto {
  answerId: number;

  content: string;

  isRootAnswer: boolean;

  isUpdated: boolean;

  isDeleted: boolean;

  user: UsersResponseDto;
  childrenCount: number;
  likeCount: number;
}
