import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Company } from '../../company/entities/company.entity';
import { Team } from '../../teams/entities/team.entity';

export enum UserRole {
  Admin = 'admin',
  Moderator = 'moderator',
  Viewer = 'viewer',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ name: 'is_email_verified', default: false })
  isEmailVerified: boolean;

  @Column({ name: 'email_verification_token', nullable: true })
  @Exclude()
  emailVerificationToken: string;

  @Column({ name: 'email_verification_token_expiry', nullable: true })
  emailVerificationTokenExpiry: Date;

  @Column({ name: 'password_reset_token', nullable: true })
  @Exclude()
  passwordResetToken: string;

  @Column({ name: 'password_reset_token_expiry', nullable: true })
  passwordResetTokenExpiry: Date;

  @Column({ name: 'last_login', nullable: true })
  lastLogin: Date;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Viewer,
  })
  role: UserRole;

  @Column('uuid', { name: 'team_ids', array: true, default: [] })
  teamIds: string[];

  @ManyToMany(() => Team, (team) => team.members)
  @JoinTable({
    name: 'team_members',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'team_id', referencedColumnName: 'id' },
  })
  teams: Team[];

  @ManyToOne(() => Company, (company) => company.users, { nullable: true })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'company_id', nullable: true })
  companyId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
