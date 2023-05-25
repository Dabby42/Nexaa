import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseUser } from "./base-user.entity";

export enum UserStatusEnum {
  PENDING = 0,
  APPROVED = 1,
  DISABLED = 2,
}

export enum RoleEnum {
  AFFILIATE = 1,
  ADMIN = 3,
}

@Entity()
export class User extends BaseUser {
  @Column({ unique: true })
  username: string;

  @Column()
  address: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column({ unique: true })
  phone_number: string;

  @Column({ nullable: true })
  website_url: string;

  @Column({ nullable: true })
  account_number: string;

  @Column({
    type: "enum",
    enum: UserStatusEnum,
    default: UserStatusEnum.PENDING,
  })
  status: number;

  @Column({
    type: "enum",
    enum: RoleEnum,
    default: RoleEnum.AFFILIATE,
  })
  role: number;

  @Column({ type: "timestamp", nullable: true })
  public verified_at: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "verified_by" })
  public verified_by: User;
}
