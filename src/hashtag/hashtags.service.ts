import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import HashTags from './hashtags.entity';
import CreateQuestionRequestDto from 'src/questions/dto/create-question.request.dto';

@Injectable()
export default class HashTagsService {
  constructor(
    @InjectRepository(HashTags)
    private readonly hashTagsRepository: Repository<HashTags>,
  ) {}

  async findByQuestion(questionId: number) {
    return this.hashTagsRepository.find({
      where: {
        questions: {
          questionId: questionId,
        },
      },
      relations: {
        questions: true,
      },
    });
  }

  async create(hashTag: string) {
    let findHashTag: HashTags | null = await this.hashTagsRepository.findOneBy({
      hashTag,
    });
    if (!findHashTag) {
      findHashTag = await this.hashTagsRepository.save({
        hashTag,
      });
    }

    return findHashTag;
  }

  async createBulk(hashTags: string[]): Promise<HashTags[]> {
    await CreateQuestionRequestDto.validateHashTag(hashTags);

    const queryRunner =
      this.hashTagsRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existHashTags = await queryRunner.manager.findBy(
        HashTags, //
        { hashTag: In(hashTags) },
      );

      const existHashTagValues = existHashTags.map((v) => v.hashTag);

      const newHashTagValues = hashTags.filter(
        (tag) => !existHashTagValues.includes(tag),
      );
      await queryRunner.manager.save(
        newHashTagValues.map((hashTag) =>
          this.hashTagsRepository.create({ hashTag }),
        ),
      );

      await queryRunner.commitTransaction();

      const allHashTags = await queryRunner.manager.findBy(HashTags, {
        hashTag: In(hashTags),
      });

      return allHashTags;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
