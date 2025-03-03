import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFakeTeams1741005955867 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Get the Fly.dev company ID
    const companyResult = await queryRunner.query(`
      SELECT id FROM companies WHERE name = 'Fly.dev';
    `);
    const companyId = companyResult[0].id;

    // Create two teams
    const team1Id = await queryRunner.query(`
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
      )
      RETURNING id;
    `);

    const team2Id = await queryRunner.query(`
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
      )
      RETURNING id;
    `);

    // Update the existing user to be part of the Engineering Team
    await queryRunner.query(`
      UPDATE users 
      SET team_ids = ARRAY['${team1Id[0].id}']::uuid[]
      WHERE email = 'test@gmail.com';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove team association from user
    await queryRunner.query(`
      UPDATE users 
      SET team_ids = ARRAY[]::uuid[]
      WHERE email = 'test@gmail.com';
    `);

    // Remove teams
    await queryRunner.query(`
      DELETE FROM teams WHERE name IN ('Engineering Team', 'Product Team');
    `);
  }
}
