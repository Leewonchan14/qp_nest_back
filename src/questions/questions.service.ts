import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import AnswersService from 'src/answers/answers.service';
import { Role } from 'src/common/enum/role';
import HashTags from 'src/hashtag/hashtags.entity';
import HashTagsService from 'src/hashtag/hashtags.service';
import Users from 'src/users/users.entity';
import {
  Brackets,
  LessThan,
  MoreThan,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import CreateQuestionRequestDto from './dto/create-question.request.dto';
import UpdateQuestionRequestDto from './dto/update-question.request.dto';
import Questions from './questions.entity';

@Injectable()
export default class QuestionsService {
  constructor(
    @InjectRepository(Questions)
    private readonly questionsRepository: Repository<Questions>, //
    private readonly hashTagsService: HashTagsService,
    private readonly answersService: AnswersService,
  ) {}

  async create(
    user: Users,
    hashTags: HashTags[],
    createQuestionRequestDto: CreateQuestionRequestDto,
  ) {
    const newQuestion = this.questionsRepository.create({
      ...createQuestionRequestDto,
      user: undefined,
      hashTags: undefined,
    });

    newQuestion.hashTags = Promise.resolve(hashTags);
    newQuestion.user = Promise.resolve(user);

    return this.questionsRepository.save(newQuestion);
  }

  async findOne(question: Questions) {
    await this.questionsRepository.update(question.questionId, {
      hit: question.hit + 1,
    });

    const query = this.defaultQuery().andWhere(
      'questions.questionId = :questionId',
      {
        questionId: question.questionId,
      },
    );

    question.hit = question.hit + 1;

    const { answerCounts, expertCounts } = await this.findAnswerCounts(query);

    return {
      question,
      answerCount: answerCounts[0],
      expertCount: expertCounts[0],
    };
  }

  async findAdjacent(
    question: Questions,
  ): Promise<[Questions | null, Questions | null]> {
    const preQuestion = await this.questionsRepository.findOne({
      where: {
        questionId: LessThan(question.questionId),
        isDeleted: false,
      },
      order: {
        questionId: 'desc',
      },
    });

    const nextQuestion = await this.questionsRepository.findOne({
      where: {
        questionId: MoreThan(question.questionId),
        isDeleted: false,
      },
      order: {
        questionId: 'asc',
      },
    });

    return [preQuestion, nextQuestion];
  }

  async findAll(page: number, pageSize: number, search: string) {
    const query = this.defaultQuery()
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            'questions.title LIKE :title or questions.content LIKE :content',
            {
              title: `%${search}%`,
              content: `%${search}%`,
            },
          );
        }),
      )
      .orderBy({
        'questions.createdAt': 'DESC',
      });

    const totalPromise = query.getCount();
    const questionsPromise = query
      .clone()
      .offset(page * pageSize)
      .limit(pageSize)
      .getMany();

    const countsPromise = this.findAnswerCounts(
      query
        .clone()
        .offset(page * pageSize)
        .limit(pageSize),
    );

    const [count, questions, { answerCounts, expertCounts }] =
      await Promise.all([totalPromise, questionsPromise, countsPromise]);

    return {
      questions,
      count,
      answerCounts,
      expertCounts,
    };
  }

  async delete(question: Questions) {
    await this.questionsRepository.update(question.questionId, {
      isDeleted: true,
    });

    question.isDeleted = true;

    return question;
  }

  async update(question: Questions, updateDto: UpdateQuestionRequestDto) {
    let hashTags: HashTags[] | undefined;

    if (updateDto.hashTags) {
      hashTags = await this.hashTagsService.createBulk(updateDto.hashTags);
    }

    const updatedQuestion = await this.questionsRepository.save(
      UpdateQuestionRequestDto.assign(question, updateDto, hashTags), //
    );

    const { answerCount, expertCount } =
      await this.answersService.findAnswerCountAndExpertCountByQuestion(
        question,
      );

    return { question: updatedQuestion, answerCount, expertCount };
  }

  async findByUser(
    user: Users, //
    page: number,
    pageSize: number,
  ) {
    const query = this.defaultQuery().andWhere('user.userId = :userId', {
      userId: user.userId,
    });

    const countPromise = query.getCount();
    const questionsPromise = query
      .offset(page * pageSize)
      .limit(pageSize)
      .getMany();
    const countsPromise = this.findAnswerCounts(query);

    const [count, questions, { expertCounts, answerCounts }] =
      await Promise.all([countPromise, questionsPromise, countsPromise]);

    // const { expertCounts, answerCounts } = ;

    return {
      questions,
      count,
      expertCounts,
      answerCounts,
    };
  }

  defaultQuery() {
    return this.questionsRepository
      .createQueryBuilder('questions')
      .select('questions')
      .leftJoinAndSelect(
        'questions.user',
        'user',
        'user.isDeleted = :isDeleted',
        { isDeleted: false },
      )
      .where('questions.isDeleted = :isDeleted', { isDeleted: false })
      .groupBy('questions.questionId');
  }

  async findAnswerCounts(query: SelectQueryBuilder<Questions>) {
    const countQuery = query
      .clone()
      .addSelect('questions.questionId', 'questionId')
      .leftJoin(
        'questions.answers',
        'answers',
        'answers.isDeleted = :isDeleted',
        { isDeleted: false },
      );

    const { raw: aC } = await countQuery
      .clone()
      .leftJoin('answers.user', 'a_user', 'a_user.isDeleted = :isDeleted', {
        isDeleted: false,
      })
      .addSelect('COUNT(answers.answerId)', 'answerCounts')
      .getRawAndEntities<{ questionId: number; answerCounts: number }>();

    countQuery
      // .andWhere(
      //   new Brackets((qb) =>
      //     qb.where('a_user.role = :role', { role: Role.EXPERT }),
      //   ),
      // )
      .leftJoin(
        'answers.user',
        'a_user',
        'a_user.isDeleted = :isDeleted AND a_user.role = :role',
        {
          isDeleted: false,
          role: Role.EXPERT,
        },
      )
      .addSelect(`COUNT(DISTINCT a_user.userId)`, 'expertCounts');
    // .addSelect(
    //   `COUNT(CASE WHEN a_user.role = '${Role.EXPERT}' THEN answers.answerId END)`,
    //   'expertCounts',
    // );

    const { raw: eC } = await countQuery.getRawAndEntities<{
      questionId: number;
      expertCounts: number;
    }>();

    return { answerCounts: aC, expertCounts: eC };
  }
}
