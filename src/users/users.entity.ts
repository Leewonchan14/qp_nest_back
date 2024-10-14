import TimeStampEntity from 'src/common/entity/timestamp.entity';
import { Gender } from 'src/common/enum/gender';
import { Role } from 'src/common/enum/role';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  // @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
  // private List<Question> questionList = new ArrayList<>();

  // @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
  // private List<Answer> answerList = new ArrayList<>();

  // @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
  // private List<AnswerLikes> answerLikesList = new ArrayList<>();
}
