import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from './user.entity';

@Entity()
export class UserContacts {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users)
  owner: Users;

  @ManyToOne(() => Users)
  contact: Users;

  @Column({ nullable: true })
  name: string;
}
