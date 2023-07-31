import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class AffiliateOrders {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public affiliate_id: number;

  @Column()
  public order_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
