import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { TokenNotValidException } from 'src/common/filters/token-not-valid.filter';
import Users from 'src/users/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export default class AuthService {
  constructor(
    @InjectRepository(Users)
    readonly userRepository: Repository<Users>,
    private readonly configService: ConfigService, //
    private readonly jwtService: JwtService,
  ) {}
  async login(user: Users) {
    const accessToken = await this.createAccessToken(user.userId);
    const refreshToken = await this.createRefreshToken(user.userId);
    user.refreshToken = refreshToken;
    await this.userRepository.save(user);
    return { userId: user.userId, accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    const { user } = await this.verifyToken(refreshToken);
    const accessToken = await this.createAccessToken(user.userId);
    return { user, accessToken };
  }

  async createAccessToken(userId: number) {
    return this.jwtService.signAsync(
      { userId },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '30s',
      },
    );
  }

  async createRefreshToken(userId: number) {
    return this.jwtService.signAsync(
      { userId },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '120m',
      },
    );
  }

  async verifyToken(token: string) {
    let userId: number | undefined;
    let user: Users | undefined;
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      userId = payload.userId!;
      user = await this.userRepository.findOneOrFail({
        where: { userId, isDeleted: false },
      });
    } catch (error) {
      console.log(error);
      throw new TokenNotValidException(userId!);
    }

    return { user };
  }

  async getKakaoEmailNickProfile(code: string) {
    const { access_token } = await getAccessTokenByKakaoCode(
      code, //
      this.configService.get<string>('KAKAO_CLIENT_ID')!,
      this.configService.get<string>('KAKAO_REDIRECT_URI')!,
    );

    const { kakao_account, properties } =
      await getUserInfoByKakaoAccessToken(access_token);
    return {
      email: kakao_account.email,
      username: properties.nickname,
      profileImage: properties.profile_image,
    };
  }
}

async function getUserInfoByKakaoAccessToken(accessToken: string) {
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

async function getAccessTokenByKakaoCode(
  code: string,
  client_id: string,
  redirect_uri: string,
) {
  let response: AxiosResponse<{
    access_token: string;
    refresh_token: string;
  }>;

  try {
    response = await axios.request<{
      access_token: string;
      refresh_token: string;
    }>({
      method: 'post',
      url: 'https://kauth.kakao.com/oauth/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      data: {
        grant_type: 'authorization_code',
        client_id,
        redirect_uri,
        code,
      },
    });
  } catch (error) {
    response = error.response;
  }

  const { access_token, refresh_token } = response.data;
  return { access_token, refresh_token };
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
