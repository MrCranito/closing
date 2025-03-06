import { MigrationInterface, QueryRunner } from 'typeorm';
import { MongoClient } from 'mongodb';
import { SessionStatus } from '../modules/sessions/entities/session.entity';

export class AddFakeSessions1741005955871 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Get the test user ID
    const userResult = await queryRunner.query(`
      SELECT id FROM users WHERE email = 'test@gmail.com';
    `);
    const userId = userResult[0].id;

    // Get a customer ID (using Acme Corporation as the customer)
    const customerResult = await queryRunner.query(`
      SELECT id FROM customers WHERE email = 'contact@acme.com';
    `);
    const customerId = customerResult[0].id;

    // Connect to MongoDB to get tree IDs
    const mongoClient = new MongoClient(
      process.env.MONGODB_URI ||
        'mongodb://admin:admin@mongodb:27017/closing?authSource=admin&directConnection=true'
    );
    await mongoClient.connect();

    try {
      const db = mongoClient.db(process.env.MONGODB_DATABASE || 'closing');
      const treesCollection = db.collection('trees');

      // Get all trees created by the test user
      const trees = await treesCollection.find({ createdBy: userId }).toArray();

      // Create sessions for each tree
      for (const tree of trees) {
        // Create an active session
        await queryRunner.query(`
          INSERT INTO session (
            id,
            user_id,
            tree_id,
            tree_name,
            customer_id,
            status,
            created_at,
            updated_at
          )
          VALUES (
            uuid_generate_v4(),
            '${userId}',
            '${tree._id.toString()}',
            '${tree.name}',
            '${customerId}',
            '${SessionStatus.ACTIVE}',
            NOW() - INTERVAL '1 hour',
            NOW()
          );
        `);

        // Create a completed session
        await queryRunner.query(`
          INSERT INTO session (
            id,
            user_id,
            tree_id,
            tree_name,
            customer_id,
            status,
            created_at,
            updated_at
          )
          VALUES (
            uuid_generate_v4(),
            '${userId}',
            '${tree._id.toString()}',
            '${tree.name}',
            '${customerId}',
            '${SessionStatus.COMPLETED}',
            NOW() - INTERVAL '2 days',
            NOW() - INTERVAL '1 day'
          );
        `);

        // Create an archived session
        await queryRunner.query(`
          INSERT INTO session (
            id,
            user_id,
            tree_id,
            tree_name,
            customer_id,
            status,
            created_at,
            updated_at,
            archived_at
          )
          VALUES (
            uuid_generate_v4(),
            '${userId}',
            '${tree._id.toString()}',
            '${tree.name}',
            '${customerId}',
            '${SessionStatus.ARCHIVED}',
            NOW() - INTERVAL '10 days',
            NOW() - INTERVAL '5 days',
            NOW() - INTERVAL '5 days'
          );
        `);
      }
    } finally {
      await mongoClient.close();
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Get the test user ID
    const userResult = await queryRunner.query(`
      SELECT id FROM users WHERE email = 'test@gmail.com';
    `);
    const userId = userResult[0].id;

    // Remove all sessions for the test user
    await queryRunner.query(`
      DELETE FROM session WHERE user_id = '${userId}';
    `);
  }
}
