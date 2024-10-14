import TimeStampEntity from 'src/common/entity/timestamp.entity';
import {
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export default class Answers extends TimeStampEntity {
  @PrimaryGeneratedColumn('increment')
  answerId: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: true })
  isRootAnswer: boolean;

  @ManyToOne(() => Answers, (answer) => answer.children, { nullable: true })
  @JoinColumn({ name: 'answerId' })
  parent: Answers;

  @OneToMany(() => Answers, (answer) => answer.parent, { cascade: true })
  children: Answers[];

  // @ManyToOne(fetch = FetchType.LAZY)
  // @JoinColumn(name = "user_id")
  // private User user;

  // @ManyToOne(fetch = FetchType.LAZY)
  // @JoinColumn(name = "question_id")
  // private Question question;

  // @OneToMany(mappedBy = "answer", cascade = CascadeType.ALL)
  // private List<AnswerLikes> answerLikesList = new ArrayList<>();

  // @OneToMany(fetch = FetchType.LAZY, mappedBy = "parent", cascade = CascadeType.ALL)
  // private List<Answer> children = new ArrayList<>();
}
