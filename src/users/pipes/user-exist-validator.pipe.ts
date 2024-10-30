import { Injectable, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Users from '../users.entity';
import { UserNotFoundException } from 'src/common/filters/user-not-found.filter';

@Injectable()
export class ExistUserIdPipe implements PipeTransform<number, Promise<Users>> {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}
  async transform(
    userId: number, //
    // metadata: ArgumentMetadata,
  ) {
    const findUser = await this.userRepository.findOne({
      where: {
        userId: userId,
      },
    });
    if (!findUser || isNaN(Number(userId))) {
      throw new UserNotFoundException(userId);
    }
    return findUser;
  }
}
