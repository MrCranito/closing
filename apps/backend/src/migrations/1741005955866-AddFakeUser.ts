import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFakeUser1741005955866 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Get the Fly.dev company ID
    const companyResult = await queryRunner.query(`
      SELECT id FROM companies WHERE name = 'Fly.dev';
    `);
    const companyId = companyResult[0].id;

    // Insert fake user
    await queryRunner.query(`
      INSERT INTO users (
        id,
        email,
        password,
        firstname,
        lastname,
        company_id,
        created_at,
        updated_at
      )
      VALUES (
        uuid_generate_v4(),
        'test@gmail.com',
        '$2b$10$3NxNtR9d3X9Y9Y9Y9Y9Y9O',
        'John',
        'Doe',
        '${companyId}',
        NOW(),
        NOW()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove fake user
    await queryRunner.query(`
      DELETE FROM users WHERE email = 'test@gmail.com';
    `);
  }
}
