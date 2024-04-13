import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn
} from 'typeorm';
import { Users } from './user.entity';

@Entity()
export class Settings {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Users)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id'
  })
  userId: number;

  @Column({ type: 'json', nullable: true })
  chatSetting: object;
}
