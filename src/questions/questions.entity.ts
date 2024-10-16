import Answers from 'src/answers/answers.entity';
import TimeStampEntity from 'src/common/entity/timestamp.entity';
import HashTags from 'src/hashtag/hashtags.entity';
import Users from 'src/users/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export default class Questions extends TimeStampEntity {
  @PrimaryGeneratedColumn('increment')
  questionId: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: 0 })
  hit: number;

  @Column({ default: false })
  isChild: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  @ManyToOne(() => Users, (user) => user.questions, { nullable: false })
  @JoinColumn()
  user: Promise<Users>;

  @ManyToMany(() => HashTags, (hashTags) => hashTags.questions)
  @JoinTable()
  hashTags: Promise<HashTags[]>;

  @OneToMany(() => Answers, (answer) => answer.question)
  answers: Promise<Answers[]>;
}
