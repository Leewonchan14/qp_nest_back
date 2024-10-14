import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('auth/kakao/login')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(
    @Query()
    {
      code,
      error,
      error_description,
      state,
    }: {
      code: string;
      error: string;
      error_description: string;
      state: string;
    },
  ): string {
    return JSON.stringify({
      code,
      error,
      error_description,
      state,
    });
  }
}
