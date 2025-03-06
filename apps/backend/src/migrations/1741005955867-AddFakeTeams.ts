import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFakeTeams1741005955867 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Get the Fly.dev company ID
    const companyResult = await queryRunner.query(`
      SELECT id FROM companies WHERE name = 'Fly.dev';
    `);
    const companyId = companyResult[0].id;

    // Create two teams
    await queryRunner.query(`
      INSERT INTO teams (
        id,
        name,
        company_id,
        created_at,
        updated_at
      )
      VALUES (
        uuid_generate_v4(),
        'Engineering Team',
        '${companyId}',
        NOW(),
        NOW()
      );
    `);

    await queryRunner.query(`
      INSERT INTO teams (
        id,
        name,
        company_id,
        created_at,
        updated_at
      )
      VALUES (
        uuid_generate_v4(),
        'Product Team',
        '${companyId}',
        NOW(),
        NOW()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove teams
    await queryRunner.query(`
      DELETE FROM teams WHERE name IN ('Engineering Team', 'Product Team');
    `);
  }
}
