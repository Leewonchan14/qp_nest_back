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
} from '@nestjs/common';
import SuccessResponse from 'src/common/api-response/success.response';
import CreateUsersResponseDto from './dto/create-users.response.dto';
import UsersResponseDto from './dto/users.response.dto';
import { ExistUserIdPipe } from './pipes/user-exist-validator.pipe';
import Users from './users.entity';
import { UsersService } from './users.service';
// import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe';

@Controller('users')
export default class UsersController {
  constructor(
    private readonly userService: UsersService, //
  ) {}

  @Post('signup')
  async signup(
    @Body() { accessToken }: { accessToken: string },
  ): Promise<SuccessResponse<CreateUsersResponseDto>> {
    const findUser = await this.userService.signup(accessToken);
    return SuccessResponse.of(
      HttpStatus.OK, //
      { userId: findUser.userId },
    );
  }

  @Get(':userId')
  async findById(
    @Param('userId', ParseIntPipe, ExistUserIdPipe) user: Users, //
  ) {
    return SuccessResponse.of(
      HttpStatus.OK, //
      UsersResponseDto.of(user),
    );
  }

  @Delete(':userId')
  async deleteById(
    @Param('userId', ParseIntPipe, ExistUserIdPipe) user: Users, //
  ) {
    await this.userService.delete(user);
    return SuccessResponse.of(
      HttpStatus.OK, //
      undefined,
    );
  }

  @Patch(':userId/point')
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
