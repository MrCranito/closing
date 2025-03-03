import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFlyDevMigrations1741005955865 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert Fly.dev company
    await queryRunner.query(`
      INSERT INTO companies (
        id,
        name,
        address,
        phone,
        website,
        description,
        owner_id,
        created_at,
        updated_at
      )
      VALUES (
        uuid_generate_v4(),
        'Fly.dev',
        '500 Howard St, San Francisco, CA 94105',
        '+1 (555) 123-4567',
        'https://fly.dev',
        'Fly.dev is a platform for running full stack apps and databases close to your users.',
        NULL,
        NOW(),
        NOW()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove Fly.dev company
    await queryRunner.query(`
      DELETE FROM companies WHERE name = 'Fly.dev';
    `);
  }
}
