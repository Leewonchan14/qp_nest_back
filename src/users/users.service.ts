import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import AuthService from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import Users from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    readonly userRepository: Repository<Users>,
    private readonly authService: AuthService,
  ) {}

  async kakaoLogin(code: string) {
    const findUser = await this.findUserOrCreate(code);
    const { accessToken, refreshToken } =
      await this.authService.login(findUser);

    return { user: findUser, accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    const { user, accessToken } = await this.authService.refresh(refreshToken);
    return { user, accessToken, refreshToken };
  }

  async findById(userId: number) {
    return this.userRepository.findOneBy({ userId });
  }

  async delete(user: Users) {
    await this.userRepository.update(user.userId, {
      isDeleted: true,
    });
  }

  async updatePoint(user: Users, point: number) {
    const updatedUser = await this.userRepository.update(
      { userId: user.userId },
      { point: user.point + point },
    );
    return updatedUser.affected;
  }

  async findUserOrCreate(code: string) {
    const { email, profileImage, username } =
      await this.authService.getKakaoEmailNickProfile(code);

    let findUser: Users | null;
    findUser = await this.userRepository.findOne({ where: { email } });

    if (!findUser) {
      findUser = this.userRepository.create({ email, username, profileImage });
    }

    return this.userRepository.save(findUser);
  }
}
