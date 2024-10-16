import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Repository } from 'typeorm';
import Users from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    readonly userRepository: Repository<Users>,
  ) {}

  async signup(accessToken: string) {
    const { kakao_account, properties } =
      await getUserInfoByKakakoCode(accessToken);
    const kakaoEmail = kakao_account.email;

    let findUser: Users | null;

    findUser = await this.userRepository.findOneBy({ email: kakaoEmail });

    if (!findUser) {
      findUser = this.userRepository.create({
        email: kakaoEmail,
        username: properties.nickname,
      });
    }

    return findUser;
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
}

async function getUserInfoByKakakoCode(accessToken: string) {
  let response: AxiosResponse<KakaoUser>;
  try {
    response = await axios.request({
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      const { code, msg } = error.response!.data as {
        code: string;
        msg: string;
      };
      console.log('code, msg: ', code, msg);
      throw new Error(msg);
    }
  }

  return response!.data;
}

interface KakaoUser {
  id: string;
  connected_at: string;
  properties: {
    nickname: string;
    profile_image: string;
    thumbnail_image: string;
  };
  kakao_account: {
    has_email: boolean;
    email_needs_agreement: boolean;
    is_email_valid: boolean;
    is_email_verified: boolean;
    email: string;
  };
}
