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

export enum ScenarioStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ARCHIVED = 'ARCHIVED',
}

@Entity('scenario')
export class Scenario {
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
    enum: ScenarioStatus,
    default: ScenarioStatus.ACTIVE,
  })
  status: ScenarioStatus;

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
