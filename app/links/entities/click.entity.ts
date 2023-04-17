import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Links } from "./link.entity";

@Entity()
export class Clicks {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => Links, { nullable: true })
  @JoinColumn({ name: "link_id" })
  public link_id: Links;

  @Column()
  public unique_count: number;

  @Column()
  public count: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
