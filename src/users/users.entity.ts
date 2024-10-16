import Answers from 'src/answers/answers.entity';
import TimeStampEntity from 'src/common/entity/timestamp.entity';
import { Gender } from 'src/common/enum/gender';
import { Role } from 'src/common/enum/role';
import Questions from 'src/questions/questions.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export default class Users extends TimeStampEntity {
  @PrimaryGeneratedColumn('increment')
  userId: number;

  @Column({ length: 30 })
  username: string;

  @Column({ type: 'text', nullable: true })
  profileImage: string;

  @Column({ length: 50, nullable: false })
  email: string;

  @Column({ type: 'enum', enum: Gender, default: Gender.DEFAULT })
  gender: Gender;

  @Column({ default: 0 })
  point: number;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ length: 100, nullable: true })
  refreshToken: string;

  @OneToMany(() => Questions, (question) => question.user)
  questions: Promise<Questions[]>;

  @OneToMany(() => Answers, (answer) => answer.user)
  answers: Promise<Answers[]>;

  @ManyToMany(() => Answers, (answer) => answer.likeUsers)
  @JoinTable()
  likeAnswers: Promise<Answers[]>;
}
