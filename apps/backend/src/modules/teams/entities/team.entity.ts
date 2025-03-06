import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Company } from '../../company/entities/company.entity';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'company_id' })
  companyId: string;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'team_members',
    joinColumn: { name: 'team_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  members: User[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
