import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFakeCustomers1741005955870 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Get the Fly.dev company ID
    const companyResult = await queryRunner.query(`
      SELECT id FROM companies WHERE name = 'Fly.dev';
    `);
    const companyId = companyResult[0].id;

    // Insert fake customers
    await queryRunner.query(`
      INSERT INTO customers (
        id,
        company_id,
        name,
        email,
        phone,
        address,
        notes,
        status,
        created_at,
        updated_at
      )
      VALUES 
      (
        uuid_generate_v4(),
        '${companyId}',
        'Acme Corporation',
        'contact@acme.com',
        '+1 (555) 123-4567',
        '123 Business Ave, Suite 100, San Francisco, CA 94107',
        'Key enterprise customer with multiple departments',
        'ACTIVE',
        NOW(),
        NOW()
      ),
      (
        uuid_generate_v4(),
        '${companyId}',
        'TechStart Inc',
        'info@techstart.com',
        '+1 (555) 234-5678',
        '456 Innovation Blvd, Austin, TX 78701',
        'Startup in growth phase, potential for expansion',
        'LEAD',
        NOW(),
        NOW()
      ),
      (
        uuid_generate_v4(),
        '${companyId}',
        'Global Industries Ltd',
        'sales@globalindustries.com',
        '+1 (555) 345-6789',
        '789 Corporate Park, New York, NY 10001',
        'International client with multiple locations',
        'ACTIVE',
        NOW(),
        NOW()
      ),
      (
        uuid_generate_v4(),
        '${companyId}',
        'Local Services Co',
        'support@localservices.com',
        '+1 (555) 456-7890',
        '321 Main Street, Chicago, IL 60601',
        'Regional service provider, regular customer',
        'ACTIVE',
        NOW(),
        NOW()
      ),
      (
        uuid_generate_v4(),
        '${companyId}',
        'Future Systems',
        'hello@futuresystems.com',
        '+1 (555) 567-8901',
        '654 Tech District, Seattle, WA 98101',
        'Prospective client, in evaluation phase',
        'LEAD',
        NOW(),
        NOW()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove fake customers
    await queryRunner.query(`
      DELETE FROM customers 
      WHERE email IN (
        'contact@acme.com',
        'info@techstart.com',
        'sales@globalindustries.com',
        'support@localservices.com',
        'hello@futuresystems.com'
      );
    `);
  }
}
