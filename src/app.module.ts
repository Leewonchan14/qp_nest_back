import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3301,
      username: 'root',
      password: '1234',
      database: 'qp',
      entities: [__dirname + '/**/*.entity.{ts,js}'],
      logging: true,
      synchronize: true,
      // autoLoadEntities: true,
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
// console.log(__dirname + '/**/*.entity.{ts,js}');
