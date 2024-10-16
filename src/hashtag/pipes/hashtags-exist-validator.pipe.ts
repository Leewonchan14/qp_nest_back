import { Injectable, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import HashTags from '../hashtags.entity';
import { HashTagsNotFoundException } from 'src/common/filters/hashtag-not-found.filter';

@Injectable()
export class ExistHashTagIdPipe
  implements PipeTransform<number[], Promise<HashTags[]>>
{
  constructor(
    @InjectRepository(HashTags)
    private readonly hashTagRepository: Repository<HashTags>,
  ) {}
  async transform(
    hashTagIds: number[], //
    // metadata: ArgumentMetadata,
  ) {
    const findHashTags = await this.hashTagRepository.findBy({
      hashTagId: In(hashTagIds),
    });
    if (findHashTags.length !== hashTagIds.length) {
      throw new HashTagsNotFoundException(hashTagIds);
    }
    return findHashTags;
  }
}
