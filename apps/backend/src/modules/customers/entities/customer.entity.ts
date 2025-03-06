import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CustomerStatus {
  COLD = 'COLD',
  PROSPECT = 'PROSPECT',
  HOT = 'HOT',
}

export enum CustomerType {
  INDIVIDUAL = 'INDIVIDUAL',
  BUSINESS = 'BUSINESS',
}

export enum CustomerSource {
  REFERRAL = 'REFERRAL',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  ONLINE_AD = 'ONLINE_AD',
  EVENT = 'EVENT',
  OTHER = 'OTHER',
}

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({
    type: 'enum',
    enum: CustomerStatus,
    nullable: true,
  })
  status: CustomerStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
