import { Gender } from 'src/common/enum/gender';
import { Role } from 'src/common/enum/role';
import Users from '../users.entity';

export default class UsersResponseDto {
  userId: number;
  username: string;
  profileImage: string;
  email: string;
  gender: Gender;
  point: number;
  role: Role;
  isDeleted: boolean;

  static of(users: Users): UsersResponseDto {
    const newDto = new UsersResponseDto();
    Object.entries(users).forEach(([key, value]) => {
      newDto[key] = value;
    });
    return newDto;
  }
}
