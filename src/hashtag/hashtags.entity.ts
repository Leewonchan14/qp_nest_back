import TimeStampEntity from 'src/common/entity/timestamp.entity';
import Questions from 'src/questions/questions.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class HashTags extends TimeStampEntity {
  @PrimaryGeneratedColumn('increment')
  hashTagId: number;

  @Column({ length: 200, nullable: false, unique: true })
  hashTag: string;

  @Column({ default: false })
  isDeleted: boolean;

  @ManyToMany(() => Questions, (questions) => questions.hashTags)
  questions: Promise<Questions[]>;
}
