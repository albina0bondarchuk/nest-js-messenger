import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./user.entity";
import { Chats } from "./chat.entity";
import { UserRole } from "src/constants/chats";

@Entity()
export class ChatUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users)
  user: Users;

  @ManyToOne(() => Chats)
  @JoinColumn({
    name: "chat_id",
    referencedColumnName: "id",
  })
  chatId: number;

  @Column()
  role: UserRole;
}
