import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Questions from 'src/questions/questions.entity';
import Users from 'src/users/users.entity';
import { Repository } from 'typeorm';
import Answers from './answers.entity';
import CreateAnswersRequestDto from './dto/create-answers.request.dto';
import UpdateAnswerRequestDto from './dto/update-answers.request.dto';

@Injectable()
export default class AnswersService {
  constructor(
    @InjectRepository(Answers)
    private readonly answersRespository: Repository<Answers>,
  ) {}

  async create(
    questsion: Questions,
    user: Users,
    dto: CreateAnswersRequestDto,
  ) {
    const newAnswer = this.answersRespository.create({ ...dto });
    newAnswer.question = Promise.resolve(questsion);
    newAnswer.user = Promise.resolve(user);
    if (dto.parentAnswer) {
      newAnswer.parent = Promise.resolve(dto.parentAnswer);
    }

    return await this.answersRespository.save(newAnswer);
  }

  async findByQuestion(question: Questions, page: number, pageSize: number) {
    const [answers, count] = await this.answersRespository.findAndCount({
      where: {
        isDeleted: false,
        isRootAnswer: true,
        question: {
          questionId: question.questionId,
        },
      },
      skip: page * pageSize,
      take: pageSize,
      order: {
        createdAt: 'desc',
      },
      relations: {
        user: true,
        likeUsers: true,
        children: true,
      },
    });

    return { answers, count };
  }

  async findByParent(answer: Answers, page: number, pageSize: number) {
    const [answers, count] = await this.answersRespository.findAndCount({
      where: {
        isDeleted: false,
        isRootAnswer: false,
        parent: {
          answerId: answer.answerId,
        },
      },
      skip: page * pageSize,
      take: pageSize,
      order: {
        createdAt: 'desc',
      },
      relations: {
        user: true,
        likeUsers: true,
        children: true,
      },
    });

    return { answers, count };
  }
  async delete(answer: Answers) {
    await this.answersRespository.update(answer.answerId, {
      isDeleted: true,
    });

    answer.isDeleted = true;

    return answer;
  }

  async update(
    answer: Answers,
    updateDto: UpdateAnswerRequestDto,
  ): Promise<Answers> {
    await this.answersRespository.update(answer.answerId, {
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
    await this.answersRespository.save(answer);
  }

  // async findById(answers: Answers) {
  //   const childrenCount = await this.answersRespository.count({
  //     where: {
  //       isDeleted: false,
  //       children: {
  //         parent: {
  //           answerId: answers.answerId,
  //         },
  //       },
  //     },
  //   });

  //   const likeCount = await this.answersRespository.count({
  //     where: {
  //       isDeleted: false,
  //       answerId: answers.answerId,
  //       likeUsers: {
  //         answers: {
  //           answerId: answers.answerId,
  //         },
  //       },
  //     },
  //   });
  // }
}
