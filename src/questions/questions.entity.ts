import TimeStampEntity from 'src/common/entity/timestamp.entity';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export default class Questions extends TimeStampEntity {
  @PrimaryGeneratedColumn('increment')
  questionId: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: 0 })
  hit: number;

  // @ManyToOne(fetch = FetchType.LAZY)
  // @JoinColumn(name = "user_id")
  // private User user;

  // @OneToMany(mappedBy = "question", cascade = CascadeType.ALL)
  // @Builder.Default
  // private List<QuestionHashTag> questionHashTagList = new ArrayList<>();

  // @OneToMany(mappedBy = "question", cascade = CascadeType.ALL)
  // @Builder.Default
  // private List<Answer> answers = new ArrayList<>();

  // @OneToMany(mappedBy = "question", cascade = CascadeType.ALL)
  // @Builder.Default
  // private List<UserQuestionAlarm> alarms = new ArrayList<>();
}
