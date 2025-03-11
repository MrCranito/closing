import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateBaseTables1741005955864 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create uuid-ossp extension if it doesn't exist
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create Companies table
    await queryRunner.createTable(
      new Table({
        name: 'companies',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'address',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'phone',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'website',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'owner_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'subscription_plan',
            type: 'enum',
            enum: ['FREE', 'PRO'],
            default: "'FREE'",
          },
          {
            name: 'subscription_start_date',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'subscription_end_date',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      })
    );

    // Create Customers table
    await queryRunner.createTable(
      new Table({
        name: 'customers',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'company_id',
            type: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'phone',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'address',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['ACTIVE', 'INACTIVE', 'LEAD'],
            default: "'ACTIVE'",
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      })
    );

    // Add foreign key for customers.company_id
    await queryRunner.createForeignKey(
      'customers',
      new TableForeignKey({
        columnNames: ['company_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'companies',
        onDelete: 'CASCADE',
      })
    );

    // Create Teams table
    await queryRunner.createTable(
      new Table({
        name: 'teams',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'company_id',
            type: 'uuid',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      })
    );

    // Create Scenario table
    await queryRunner.createTable(
      new Table({
        name: 'scenario',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'tree_id',
            type: 'varchar',
          },
          {
            name: 'tree_name',
            type: 'varchar',
          },
          {
            name: 'customer_id',
            type: 'uuid',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['ACTIVE', 'COMPLETED', 'CANCELLED', 'ARCHIVED'],
            default: "'ACTIVE'",
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'archived_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      })
    );

    // Create Users table
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'firstname',
            type: 'varchar',
          },
          {
            name: 'lastname',
            type: 'varchar',
          },
          {
            name: 'is_email_verified',
            type: 'boolean',
            default: false,
          },
          {
            name: 'email_verification_token',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'email_verification_token_expiry',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'password_reset_token',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'password_reset_token_expiry',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'last_login',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'role',
            type: 'enum',
            enum: ['admin', 'moderator', 'viewer'],
            default: "'viewer'",
          },
          {
            name: 'team_ids',
            type: 'uuid',
            isArray: true,
            default: 'ARRAY[]::uuid[]',
          },
          {
            name: 'company_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      })
    );

    // Create Team Members junction table
    await queryRunner.createTable(
      new Table({
        name: 'team_members',
        columns: [
          {
            name: 'team_id',
            type: 'uuid',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
        ],
      })
    );

    // Add foreign key constraints
    await queryRunner.createForeignKey(
      'teams',
      new TableForeignKey({
        columnNames: ['company_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'companies',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['company_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'companies',
        onDelete: 'CASCADE',
      })
    );

    // Add foreign key constraints for team_members
    await queryRunner.createForeignKey(
      'team_members',
      new TableForeignKey({
        columnNames: ['team_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'teams',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'team_members',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );

    // Add primary key constraint for team_members
    await queryRunner.query(`
      ALTER TABLE team_members
      ADD CONSTRAINT pk_team_members PRIMARY KEY (team_id, user_id);
    `);

    // Add foreign key for scenario.user_id
    await queryRunner.createForeignKey(
      'scenario',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );

    // Add foreign key for scenario.customer_id
    await queryRunner.createForeignKey(
      'scenario',
      new TableForeignKey({
        columnNames: ['customer_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'customers',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys first
    const scenarioTable = await queryRunner.getTable('scenario');
    if (scenarioTable) {
      const foreignKeys = scenarioTable.foreignKeys;
      for (const foreignKey of foreignKeys) {
        await queryRunner.dropForeignKey('scenario', foreignKey);
      }
    }

    const teamsTable = await queryRunner.getTable('teams');
    if (teamsTable) {
      const teamsCompanyForeignKey = teamsTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('company_id') !== -1
      );
      if (teamsCompanyForeignKey) {
        await queryRunner.dropForeignKey('teams', teamsCompanyForeignKey);
      }
    }

    // Then drop tables
    await queryRunner.dropTable('team_members');
    await queryRunner.dropTable('users');
    await queryRunner.dropTable('scenario');
    await queryRunner.dropTable('teams');
    await queryRunner.dropTable('customers');
    await queryRunner.dropTable('companies');
    await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp"`);
  }
}
