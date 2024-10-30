import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/common/enum/role';
import Questions from 'src/questions/questions.entity';
import Users from 'src/users/users.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import Answers from './answers.entity';
import CreateAnswersRequestDto from './dto/create-answers.request.dto';
import UpdateAnswerRequestDto from './dto/update-answers.request.dto';

@Injectable()
export default class AnswersService {
  constructor(
    @InjectRepository(Answers)
    private readonly answersRepository: Repository<Answers>,
  ) {}

  async create(question: Questions, user: Users, dto: CreateAnswersRequestDto) {
    const newAnswer = this.answersRepository.create({ ...dto });
    newAnswer.question = Promise.resolve(question);
    newAnswer.user = Promise.resolve(user);

    if (dto.parentAnswer) {
      newAnswer.parent = Promise.resolve(dto.parentAnswer);
    }

    return await this.answersRepository.save(newAnswer);
  }

  async findByQuestion(
    question: Questions,
    page: number,
    pageSize: number,
    userId?: number,
  ) {
    const query = this.defaultQuery()
      .andWhere('answers.isRootAnswer = :isRootAnswer ', {
        isRootAnswer: true,
      })
      .andWhere('question.questionId = :questionId', {
        questionId: question.questionId,
      })
      .orderBy({
        likeCount: 'DESC',
        'answers.createdAt': 'DESC',
      })
      .offset(page * pageSize)
      .limit(pageSize);

    const { answers, count, childrenCounts, likesCounts, isLikes } =
      await this.getAnswersAndLikesCountAndChildrenCountAnyCount(query, userId);

    return { answers, count, childrenCounts, likesCounts, isLikes };
  }

  async findByParent(
    answer: Answers,
    page: number,
    pageSize: number,
    userId?: number,
  ) {
    const query = this.defaultQuery() //
      .leftJoinAndSelect('answers.parent', 'parent')
      .andWhere('parent.answerId = :answerId', {
        answerId: answer.answerId,
      })
      .orderBy({
        likeCount: 'DESC',
        'answers.createdAt': 'DESC',
      })
      .offset(page * pageSize)
      .limit(pageSize);

    return await this.getAnswersAndLikesCountAndChildrenCountAnyCount(
      query.clone(),
      userId,
    );
  }
  async delete(answer: Answers) {
    await this.answersRepository.update(answer.answerId, {
      isDeleted: true,
    });

    answer.isDeleted = true;

    return answer;
  }

  async update(
    answer: Answers,
    updateDto: UpdateAnswerRequestDto,
  ): Promise<Answers> {
    await this.answersRepository.update(answer.answerId, {
      ...updateDto,
    });
    UpdateAnswerRequestDto.assign(answer, updateDto);
    return answer;
  }

  async likeAnswer(answer: Answers, user: Users) {
    if ((await answer.likeUsers).find(({ userId }) => user.userId === userId)) {
      answer.likeUsers = Promise.resolve(
        (await answer.likeUsers).filter(({ userId }) => userId !== user.userId),
      );
    } else {
      (await answer.likeUsers).push(user);
    }
    await this.answersRepository.save(answer);
  }

  async findAnswerCountAndExpertCountByQuestion(question: Questions) {
    const answerCount = await this.answersRepository.count({
      where: {
        isDeleted: false,
        question: {
          questionId: question.questionId,
        },
      },
    });

    const expertCount = await this.answersRepository.count({
      where: {
        isDeleted: false,
        user: {
          role: Role.EXPERT,
        },
        question: {
          questionId: question.questionId,
        },
      },
    });

    return { answerCount, expertCount };
  }

  defaultQuery() {
    return (
      this.answersRepository
        .createQueryBuilder('answers')
        .select('answers')
        .addSelect((qb) => {
          return qb
            .select('count(DISTINCT likeUsers.userId)')
            .from('answers_likes', 'likeUsers')
            .where('likeUsers.answerId = answers.answerId');
        }, 'likeCount')
        .addSelect((qb) => {
          return qb
            .select('count(DISTINCT childrens.answerId)')
            .from('answers', 'childrens')
            .where('childrens.parentAnswerId = answers.answerId');
        }, 'childrenCount')
        // .addSelect('count(DISTINCT childrens.answerId)', 'childrenCount')
        // .leftJoin('answers.likeUsers', 'likeUsers')
        // .leftJoin('answers.children', 'childrens')
        .leftJoinAndSelect('answers.question', 'question')
        .leftJoinAndSelect(
          'answers.user',
          'user',
          'user.isDeleted = :isDeleted',
          {
            isDeleted: false,
          },
        )
        .where('answers.isDeleted = :isDeleted', {
          isDeleted: false,
        })
        .groupBy('answers.answerId')
    );
  }

  async getAnswersAndLikesCountAndChildrenCountAnyCount(
    query: SelectQueryBuilder<Answers>,
    userId?: number,
  ) {
    const getCountPromise = query.clone().getCount();

    query
      // userId에 따라 like 여부를 확인하기 위해 추가
      .addSelect((qb) => {
        return qb
          .select('COUNT(likeUsers.userId)')
          .from('answers_likes', 'likeUsers')
          .where('likeUsers.answerId = answers.answerId')
          .andWhere('likeUsers.userId = :userId', {
            userId: userId ?? 0,
          });
      }, 'isLike');

    const getRawAndEntitiesPromise = query.getRawAndEntities<{
      isLike: number;
      likeCount: number;
      childrenCount: number;
    }>();

    const [count, { entities: answers, raw }] = await Promise.all([
      getCountPromise,
      getRawAndEntitiesPromise,
    ]);

    const likesCounts = raw.map(({ likeCount }) => likeCount);
    const childrenCounts = raw.map(({ childrenCount }) => childrenCount);
    const isLikes = raw.map(({ isLike }) => Boolean(Number(isLike)));

    return { answers, count, likesCounts, childrenCounts, isLikes };
  }
}
