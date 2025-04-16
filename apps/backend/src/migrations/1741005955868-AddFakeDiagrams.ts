import { MigrationInterface, QueryRunner } from 'typeorm';
import { MongoClient } from 'mongodb';
import {
  DiagramStatus,
  DiagramPermissionLevel,
} from '../modules/diagram/entities/diagram.entity';

export class AddFakeDiagrams1741005955868 implements MigrationInterface {
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

    // Connect to MongoDB
    const mongoClient = new MongoClient(
      process.env.MONGODB_URI ||
        'mongodb://admin:admin@mongodb:27017/closing?authSource=admin&directConnection=true'
    );
    await mongoClient.connect();

    try {
      const db = mongoClient.db(process.env.MONGODB_DATABASE || 'closing');
      const diagramsCollection = db.collection('diagrams');

      // Create three diagrams
      const diagrams = [
        {
          name: 'Project Management Diagram',
          description: 'Diagram for managing project tasks and milestones',
          status: DiagramStatus.ACTIVE,
          icon: 'pi pi-sitemap',
          createdBy: userId,
          updatedBy: userId,
          permissions: [
            {
              entityId: teamId,
              entityType: 'TEAM',
              level: DiagramPermissionLevel.EDIT,
              grantedAt: new Date(),
              grantedBy: userId,
              createdBy: userId,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          rootNode: {
            id: 'root-1',
            name: 'Project Root',
            description: 'Main project node',
            createdBy: userId,
            updatedBy: userId,
            widgets: [],
            children: [],
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Documentation Diagram',
          description: 'Diagram for organizing project documentation',
          status: DiagramStatus.ACTIVE,
          icon: 'pi pi-file',
          createdBy: userId,
          updatedBy: userId,
          permissions: [
            {
              entityId: teamId,
              entityType: 'TEAM',
              level: DiagramPermissionLevel.EDIT,
              grantedAt: new Date(),
              grantedBy: userId,
              createdBy: userId,
            },
          ],
          rootNode: {
            id: 'root-2',
            name: 'Documentation Root',
            description: 'Main documentation node',
            createdBy: userId,
            updatedBy: userId,
            widgets: [],
            children: [],
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Development Diagram',
          description: 'Diagram for tracking development progress',
          status: DiagramStatus.ACTIVE,
          icon: 'pi pi-code',
          createdBy: userId,
          updatedBy: userId,
          permissions: [
            {
              entityId: teamId,
              entityType: 'TEAM',
              level: DiagramPermissionLevel.EDIT,
              grantedAt: new Date(),
              grantedBy: userId,
              createdBy: userId,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          rootNode: {
            id: 'root-3',
            name: 'Development Root',
            description: 'Main development node',
            createdBy: userId,
            updatedBy: userId,
            widgets: [],
            children: [],
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      await diagramsCollection.insertMany(diagrams);
    } finally {
      await mongoClient.close();
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Get the user ID
    const userResult = await queryRunner.query(`
      SELECT id FROM users WHERE email = 'test@gmail.com';
    `);
    const userId = userResult[0].id;

    // Connect to MongoDB
    const mongoClient = new MongoClient(
      process.env.MONGODB_URI || 'mongodb://localhost:27017'
    );
    await mongoClient.connect();

    try {
      const db = mongoClient.db(process.env.MONGODB_DATABASE || 'closing');
      const diagramsCollection = db.collection('diagrams');

      // Remove all diagrams created by the user
      await diagramsCollection.deleteMany({ createdBy: userId });
    } finally {
      await mongoClient.close();
    }
  }
}
