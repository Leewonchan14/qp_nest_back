import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtUserGuard } from 'src/auth/jwt.user.guard';
import SuccessResponse from 'src/common/api-response/success.response';
import CreateUsersResponseDto from './dto/create-users.response.dto';
import UsersResponseDto from './dto/users.response.dto';
import { ExistUserIdPipe } from './pipes/user-exist-validator.pipe';
import Users from './users.entity';
import { UsersService } from './users.service';
import { CurrentUser } from './decorators/current.user.decorator';

@Controller('users')
export default class UsersController {
  constructor(
    private readonly userService: UsersService, //
  ) {}

  @Post('refresh')
  async refresh(
    @Body('refreshToken') refreshToken: string,
  ): Promise<SuccessResponse<CreateUsersResponseDto>> {
    const {
      user,
      accessToken,
      refreshToken: newRefreshToken,
    } = await this.userService.refresh(refreshToken);
    return SuccessResponse.of(
      HttpStatus.OK, //
      { userId: user.userId, accessToken, refreshToken: newRefreshToken },
    );
  }

  @Post('login/kakao')
  async signup(
    @Body('code') code: string,
  ): Promise<SuccessResponse<CreateUsersResponseDto>> {
    const { user, accessToken, refreshToken } =
      await this.userService.kakaoLogin(code);
    return SuccessResponse.of(
      HttpStatus.OK, //
      { userId: user.userId, accessToken, refreshToken },
    );
  }

  @Get('auto-login')
  @UseGuards(JwtAuthGuard)
  async autoLogin(
    @CurrentUser() userId: number, //
  ) {
    return SuccessResponse.of(
      HttpStatus.OK, //
      { userId },
    );
  }

  @Get(':userId')
  @UseGuards(JwtAuthGuard, JwtUserGuard)
  async findById(
    @Param('userId', ParseIntPipe, ExistUserIdPipe) user: Users, //
  ) {
    return SuccessResponse.of(
      HttpStatus.OK, //
      UsersResponseDto.of(user),
    );
  }

  @Delete(':userId')
  @UseGuards(JwtAuthGuard, JwtUserGuard)
  async deleteById(
    @Param('userId', ParseIntPipe, ExistUserIdPipe) user: Users, //
  ) {
    await this.userService.delete(user);
    return SuccessResponse.of(
      HttpStatus.OK, //
      'ok',
    );
  }

  @Patch(':userId/point')
  @UseGuards(JwtAuthGuard, JwtUserGuard)
  async updatePoint(
    @Param('userId', ParseIntPipe, ExistUserIdPipe) user: Users, //
    @Query('point', ParseIntPipe) point: number,
  ) {
    const userId = await this.userService.updatePoint(user, point);
    return SuccessResponse.of(
      HttpStatus.OK, //
      { userId },
    );
  }
}
