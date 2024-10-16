import HashTags from '../hashtags.entity';

export default class HashTagsResponseDto {
  hashTagId: number;
  hashTag: string;

  static of(hashTag: HashTags): HashTagsResponseDto {
    const newResponse = new HashTagsResponseDto();
    newResponse.hashTagId = hashTag.hashTagId;
    newResponse.hashTag = hashTag.hashTag;
    return newResponse;
  }
}
