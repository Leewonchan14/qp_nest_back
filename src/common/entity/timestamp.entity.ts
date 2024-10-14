import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export default class TimeStampEntity {
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
