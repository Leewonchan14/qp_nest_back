import { Injectable, PipeTransform } from '@nestjs/common';
import HashTags from '../hashtags.entity';
import HashTagsService from '../hashtags.service';

@Injectable()
export class ValueToHashTag
  implements PipeTransform<string[], Promise<HashTags[]>>
{
  constructor(
    private readonly hashTagsService: HashTagsService, //
  ) {}
  async transform(
    hashTags: string[], //
    // metadata: ArgumentMetadata,
  ) {
    return this.hashTagsService.createBulk(hashTags);
  }
}
