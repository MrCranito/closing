import { MigrationInterface, QueryRunner } from 'typeorm';
import { MongoClient } from 'mongodb';
import { ScenarioStatus } from '../modules/scenarios/entities/scenario.entity';
import { v4 as uuidv4 } from 'uuid';

const generateUUID = () => uuidv4();

export class AddFakeScenarios1741005955871 implements MigrationInterface {
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

      // Create scenarios for each tree
      for (const tree of trees) {
        // Create an active scenario
        await queryRunner.query(`
          INSERT INTO scenario (
            id,
            user_id,
            tree_id,
            tree_name,
            customer_id,
            status,
            created_at,
            updated_at
          ) VALUES (
            '${generateUUID()}',
            '${userId}',
            '${tree._id.toString()}',
            '${tree.name}',
            '${customerId}',
            '${ScenarioStatus.ACTIVE}',
            NOW(),
            NOW()
          );
        `);

        // Create a completed scenario
        await queryRunner.query(`
          INSERT INTO scenario (
            id,
            user_id,
            tree_id,
            tree_name,
            customer_id,
            status,
            created_at,
            updated_at
          ) VALUES (
            '${generateUUID()}',
            '${userId}',
            '${tree._id.toString()}',
            '${tree.name}',
            '${customerId}',
            '${ScenarioStatus.COMPLETED}',
            NOW(),
            NOW()
          );
        `);

        // Create an archived scenario
        await queryRunner.query(`
          INSERT INTO scenario (
            id,
            user_id,
            tree_id,
            tree_name,
            customer_id,
            status,
            created_at,
            updated_at,
            archived_at
          ) VALUES (
            '${generateUUID()}',
            '${userId}',
            '${tree._id.toString()}',
            '${tree.name}',
            '${customerId}',
            '${ScenarioStatus.ARCHIVED}',
            NOW(),
            NOW(),
            NOW()
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

    // Remove all scenarios for the test user
    await queryRunner.query(`
      DELETE FROM scenario WHERE user_id = '${userId}';
    `);
  }
}
