import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Admin } from "../../user/entities/admin.entity";

@Entity("news")
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  title: string;

  @Column({ length: 500 })
  body: string;

  @ManyToOne(() => Admin)
  @JoinColumn({ name: "publisher_id" })
  publisher: Admin;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
