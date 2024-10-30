import TimeStampEntity from 'src/common/entity/timestamp.entity';
import Questions from 'src/questions/questions.entity';
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
export default class Answers extends TimeStampEntity {
  @PrimaryGeneratedColumn('increment')
  answerId: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: true })
  isRootAnswer: boolean;

  @Column({ default: false })
  isUpdated: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  @ManyToOne(() => Answers, (answer) => answer.children, { nullable: true })
  @JoinColumn()
  parent: Promise<Answers>;

  @OneToMany(() => Answers, (answer) => answer.parent, { cascade: true })
  children: Promise<Answers[]>;

  @ManyToOne(() => Users, (users) => users.answers)
  @JoinColumn()
  user: Promise<Users>;

  @ManyToOne(() => Questions, (quesition) => quesition.answers)
  question: Promise<Questions>;

  @ManyToMany(() => Users, (users) => users.likeAnswers)
  @JoinTable({
    name: 'answers_likes',
    joinColumn: {
      name: 'answerId',
      referencedColumnName: 'answerId',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'userId',
    },
  })
  likeUsers: Promise<Users[]>;
}
