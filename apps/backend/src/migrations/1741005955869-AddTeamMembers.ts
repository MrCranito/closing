import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTeamMembers1741005955869 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Get the user ID
    const userResult = await queryRunner.query(`
      SELECT id FROM users WHERE email = 'test@gmail.com';
    `);
    const userId = userResult[0].id;

    // Get the Engineering Team ID
    const teamResult = await queryRunner.query(`
      SELECT id FROM teams WHERE name = 'Engineering Team';
    `);
    const teamId = teamResult[0].id;

    // Add user to the Engineering Team using the junction table
    await queryRunner.query(`
      INSERT INTO team_members (team_id, user_id)
      VALUES ('${teamId}', '${userId}');
    `);

    // Update the user's team_ids array to maintain backward compatibility
    await queryRunner.query(`
      UPDATE users 
      SET team_ids = ARRAY['${teamId}']::uuid[]
      WHERE id = '${userId}';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Get the user ID
    const userResult = await queryRunner.query(`
      SELECT id FROM users WHERE email = 'test@gmail.com';
    `);
    const userId = userResult[0].id;

    // Get the Engineering Team ID
    const teamResult = await queryRunner.query(`
      SELECT id FROM teams WHERE name = 'Engineering Team';
    `);
    const teamId = teamResult[0].id;

    // Remove user from the Engineering Team
    await queryRunner.query(`
      DELETE FROM team_members 
      WHERE team_id = '${teamId}' AND user_id = '${userId}';
    `);

    // Clear the user's team_ids array
    await queryRunner.query(`
      UPDATE users 
      SET team_ids = ARRAY[]::uuid[]
      WHERE id = '${userId}';
    `);
  }
}
