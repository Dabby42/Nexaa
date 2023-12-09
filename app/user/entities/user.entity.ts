import * as bcrypt from "bcryptjs";
import { config } from "../../config/config";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum RoleEnum {
  BRAND = "brand",
  CREATOR = "creator",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  avatar: string;

  @Column({
    type: "enum",
    enum: RoleEnum,
    default: RoleEnum.CREATOR,
  })
  account_type: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column()
  description: string;

  @Column()
  gender: string;

  static async comparePasswords(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }

  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(config.salt);
    return await bcrypt.hash(password, salt);
  }

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
