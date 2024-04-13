import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./user.entity";
import { Chats } from "./chat.entity";

@Entity()
export class Messages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne(() => Users)
  creator: Users;

  @ManyToOne(() => Chats)
  chat: Chats;

  @ManyToMany(() => Users)
  @JoinTable({
    name: "readed_message_by_user",
    joinColumn: {
      name: "message_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "user_id",
      referencedColumnName: "id",
    },
  })
  readBy: Users[];

  @Column({ type: "timestamptz" })
  createdAt: Date;

  @Column({ type: "timestamptz", nullable: true })
  modifiedAt: Date;

  @Column()
  status: number;

  @Column({ nullable: true })
  referenceTo: number;

  @Column({ nullable: true })
  forwardedBy: number;
}