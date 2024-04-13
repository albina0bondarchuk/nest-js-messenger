import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./user.entity";
import { ChatType } from "src/constants/chats";

@Entity()
export class Chats {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users)
  creator: Users;

  @Column({ name: "created_at", type: "timestamptz", nullable: false })
  createdAt: Date;

  @Column({ name: "modified_at", type: "timestamptz", nullable: true })
  modifiedAt: Date;

  @Column()
  status: number;

  @Column({ nullable: true })
  title: string;

  @Column()
  type: ChatType;

  @Column({ nullable: true })
  icon: string;
}