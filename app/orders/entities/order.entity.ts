import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";

export enum CommissionPaymentStatusEnum {
  PAID = 2,
  PENDING = 1,
  UNPAID = 0,
}
@Entity()
export class Orders {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "affiliate_id" })
  public affiliate_id: number;

  @Column()
  public product_id: number;

  @Column()
  public order_id: string;

  @Column()
  public status: string;

  @Column()
  public category: string;

  @Column()
  public return_id: string;

  @Column({
    type: "enum",
    enum: CommissionPaymentStatusEnum,
    default: CommissionPaymentStatusEnum.UNPAID,
  })
  public commission_payment_status: string;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  public commission: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  public total_amount: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
