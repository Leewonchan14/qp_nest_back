import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import Questions from '../questions.entity';
import HashTags from 'src/hashtag/hashtags.entity';

const HASH_TAG_GROUP = 'hashtags';

export default class UpdateQuestionRequestDto {
  @IsOptional()
  @IsArray({ groups: [HASH_TAG_GROUP] })
  @ArrayMaxSize(20, { groups: [HASH_TAG_GROUP] })
  @Length(1, 20, { each: true, groups: [HASH_TAG_GROUP] })
  hashTags?: string[];

  @IsOptional()
  @IsString()
  @Length(1, 50)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  content?: string;

  @IsOptional()
  @IsBoolean()
  isChild?: boolean;

  static assign(
    question: Questions,
    dto: UpdateQuestionRequestDto,
    hashTags: HashTags[] | undefined,
  ) {
    for (const [key, value] of Object.entries(dto)) {
      question[key] = value;
    }
    if (hashTags) {
      question.hashTags = Promise.resolve(hashTags);
    }

    return question;
  }
}
