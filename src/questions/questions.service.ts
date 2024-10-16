import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import HashTags from 'src/hashtag/hashtags.entity';
import HashTagsService from 'src/hashtag/hashtags.service';
import Users from 'src/users/users.entity';
import { LessThan, Like, MoreThan, Repository } from 'typeorm';
import CreateQuestionRequestDto from './dto/create-question.request.dto';
import UpdateQuestionRequestDto from './dto/update-question.request.dto';
import Questions from './questions.entity';

@Injectable()
export default class QuestionsService {
  constructor(
    @InjectRepository(Questions)
    private readonly questionsRepository: Repository<Questions>, //
    private readonly hashTagsService: HashTagsService,
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

  async findOne(question: Questions): Promise<Questions> {
    await this.questionsRepository.update(question.questionId, {
      hit: question.hit + 1,
    });

    question.hit = question.hit + 1;

    return question;
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
    const [questions, count] = await this.questionsRepository.findAndCount({
      where: [
        {
          isDeleted: false,
          title: Like(`%${search}%`),
        },
        {
          isDeleted: false,
          content: Like(`%${search}%`),
        },
      ],
      relations: {
        user: true,
        hashTags: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take: pageSize,
      skip: page * pageSize,
    });

    return { questions, count };
  }

  async delete(question: Questions) {
    await this.questionsRepository.update(question.questionId, {
      isDeleted: true,
    });

    question.isDeleted = true;

    return question;
  }

  async update(
    question: Questions,
    updateDto: UpdateQuestionRequestDto,
  ): Promise<Questions> {
    let hashTags: HashTags[] | undefined;

    if (updateDto.hashTags) {
      hashTags = await this.hashTagsService.createBulk(updateDto.hashTags);
    }

    return await this.questionsRepository.save(
      UpdateQuestionRequestDto.assign(question, updateDto, hashTags), //
    );
  }

  async findByUser(
    user: Users, //
    page: number,
    pageSize: number,
  ) {
    const [questions, count] = await this.questionsRepository.findAndCount({
      where: {
        user: { userId: user.userId },
      },
      relations: {
        user: true,
        hashTags: true,
      },
      take: pageSize,
      skip: page * pageSize,
      order: { createdAt: 'DESC' },
    });

    return { questions, count };
  }
}
