import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity('news')
export class News {
  @PrimaryGeneratedColumn()
  id : number;

  @Column({ length : 120 })
  title : string;

  @Column({ length : 500 })
  body : string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'publisher_id' })
  publisher : User

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
