import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Customer } from '../../customers/entities/customer.entity';
export enum SessionStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ARCHIVED = 'ARCHIVED',
}

@Entity('session')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'tree_id' })
  treeId: string;

  @Column({ name: 'tree_name' })
  treeName: string;

  @Column({
    type: 'enum',
    enum: SessionStatus,
    default: SessionStatus.ACTIVE,
  })
  status: SessionStatus;

  @Column({ name: 'customer_id' })
  customerId: string;

  @ManyToOne(() => Customer, { nullable: false })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'archived_at', nullable: true })
  archivedAt: Date;
}
