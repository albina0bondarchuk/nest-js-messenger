import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Token {
  @PrimaryColumn("varchar", { name: "token_id" })
  tokenId: string;

  @Column({ name: "user_id" })
  userId: number;
}
