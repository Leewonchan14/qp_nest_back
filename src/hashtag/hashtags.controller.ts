import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import HashTagsService from './hashtags.service';
import SuccessResponse from 'src/common/api-response/success.response';

@Controller('hashtags')
export default class HashTagsController {
  constructor(
    private readonly hashtagsService: HashTagsService, //
  ) {}

  @Post()
  async create(
    @Body('hashTag') hashTag: string, //
  ) {
    const newHashTag = await this.hashtagsService.create(hashTag);
    return SuccessResponse.of(
      HttpStatus.CREATED, //
      { hashTagId: newHashTag.hashTagId },
    );
  }
}
