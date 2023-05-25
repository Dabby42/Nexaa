import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Links } from "./link.entity";

@Entity()
export class Ips {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => Links, { nullable: true })
  @JoinColumn({ name: "link_id" })
  public link_id: Links;

  @Column()
  public ip_address: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
