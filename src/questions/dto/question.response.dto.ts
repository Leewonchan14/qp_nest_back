import HashTagsResponseDto from 'src/hashtag/dto/hashtags.response.dto';
import UsersResponseDto from 'src/users/dto/users.response.dto';
import Questions from '../questions.entity';
import QuestionsService from '../questions.service';

export default class QuestionResponseDto {
  questionId: number;
  title: string;
  content: string;
  hit: number;
  isChild: boolean;
  answerCount: number;
  expertCount: number;
  isDeleted: boolean;
  createdAt: Date;

  user: UsersResponseDto;
  hashTags: HashTagsResponseDto[];

  static async of(
    question: Questions,
    answerCount: number,
    expertCount: number,
  ): Promise<QuestionResponseDto> {
    const newResponse = new QuestionResponseDto();
    newResponse.questionId = question.questionId;
    newResponse.title = question.title;
    newResponse.content = question.content;
    newResponse.hit = question.hit;
    newResponse.isChild = question.isChild;
    newResponse.isDeleted = question.isDeleted;
    newResponse.createdAt = question.createdAt;
    newResponse.answerCount = answerCount ?? 0;
    newResponse.expertCount = expertCount ?? 0;

    newResponse.user = UsersResponseDto.of(await question.user);
    newResponse.hashTags = (await question.hashTags).map(
      HashTagsResponseDto.of,
    );

    return newResponse;
  }

  static async ofList(
    questions: Questions[],
    answerCounts: Awaited<
      ReturnType<QuestionsService['findAnswerCounts']>
    >['answerCounts'],
    expertCounts: Awaited<
      ReturnType<QuestionsService['findAnswerCounts']>
    >['expertCounts'],
  ) {
    return Promise.all(
      questions.map((q) =>
        QuestionResponseDto.of(
          q,
          answerCounts.find(({ questionId }) => q.questionId === questionId)
            ?.answerCounts ?? 0,
          expertCounts.find(({ questionId }) => q.questionId === questionId)
            ?.expertCounts ?? 0,
        ),
      ),
    );
  }
}
