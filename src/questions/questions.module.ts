import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Questions from './questions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Questions])],
  controllers: [],
  providers: [],
})
export class UsersModule {}
