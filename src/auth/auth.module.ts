import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Users from 'src/users/users.entity';
import AuthService from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [],
  providers: [AuthService, JwtStrategy, JwtService],
  exports: [JwtService],
})
export class AuthModule {}
