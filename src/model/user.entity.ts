import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserContacts } from './user_contacts.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  nickname: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => UserContacts, (contacts) => contacts.owner)
  contacts: UserContacts[];

  @Column({ name: 'created_at', type: 'timestamptz', nullable: false })
  createdAt: Date;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ nullable: true })
  avatar: string;
}
