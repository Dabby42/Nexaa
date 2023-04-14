import * as bcrypt from "bcryptjs";
import { config } from "../../config/config";
import { Column, PrimaryGeneratedColumn } from "typeorm";

export class BaseUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  static async comparePasswords(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }

  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(config.salt);
    return await bcrypt.hash(password, salt);
  }

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public created_at: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  public updated_at: Date;
}
