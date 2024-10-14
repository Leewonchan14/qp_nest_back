import { Gender } from 'src/common/enum/gender';
import { Role } from 'src/common/enum/role';
import Users from '../users.entity';

export default class FindUserResponseDto {
  userId: number;
  username: string;
  profileImage: string;
  email: string;
  gender: Gender;
  point: number;
  role: Role;
  isDeleted: boolean;
  refreshToken: string;

  static of(users: Users) {
    const newDto = new FindUserResponseDto();
    Object.entries(users).forEach(([key, value]) => {
      newDto[key] = value;
    });
    return newDto;
  }
}
