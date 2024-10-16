import HashTagsResponseDto from 'src/hashtag/dto/hashtags.response.dto';
import UsersResponseDto from 'src/users/dto/users.response.dto';
import Questions from '../questions.entity';

export default class QuestionResponseDto {
  questionId: number;
  title: string;
  content: string;
  hit: number;
  isChild: boolean;
  isDeleted: boolean;

  user: UsersResponseDto;
  hashTags: HashTagsResponseDto[];

  static async of(question: Questions): Promise<QuestionResponseDto> {
    const newResponse = new QuestionResponseDto();
    newResponse.questionId = question.questionId;
    newResponse.title = question.title;
    newResponse.content = question.content;
    newResponse.hit = question.hit;
    newResponse.isChild = question.isChild;
    newResponse.isDeleted = question.isDeleted;

    newResponse.user = UsersResponseDto.of(await question.user);
    newResponse.hashTags = (await question.hashTags).map(
      HashTagsResponseDto.of,
    );

    return newResponse;
  }
}
