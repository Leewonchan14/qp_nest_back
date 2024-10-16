import { BadRequestException } from '@nestjs/common';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsString,
  Length,
  validate,
  ValidateIf,
} from 'class-validator';

const HASH_TAG_GROUP = 'hashtags';

export default class CreateQuestionRequestDto {
  userId: number;

  @IsArray({ groups: [HASH_TAG_GROUP] })
  @ArrayMaxSize(20, { groups: [HASH_TAG_GROUP] })
  @Length(1, 20, { each: true, groups: [HASH_TAG_GROUP] })
  hashTags: string[];

  @IsString()
  @Length(1, 50)
  title: string;

  @IsString()
  @Length(1, 500)
  content: string;

  @ValidateIf((o: CreateQuestionRequestDto) => o.isChild)
  @IsBoolean()
  isChild: boolean;

  static async validateHashTag(hashTags: string[]) {
    const newRequest = new CreateQuestionRequestDto();
    newRequest.hashTags = hashTags;
    const errors = await validate(newRequest, { groups: [HASH_TAG_GROUP] });
    if (errors.length > 0) {
      throw new BadRequestException(
        errors.map((e) => Object.values(e.constraints || {})).flat(),
      );
    }
  }
}
