import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private repository: Repository<Customer>
  ) {}

  async getMany(req, user: User): Promise<Customer[]> {
    const { page, size, sort, filter } = req.query || {};

    const query = this.repository.find({
      skip: (page - 1) * size,
      take: size,
      order: sort,
      where: {
        ...filter,
        company_id: user.companyId,
      },
      relations: ['teams'],
    });

    return query;
  }

  async createOne(customer: Customer): Promise<Customer> {
    return this.repository.save(customer);
  }

  async updateOne(customer: Customer): Promise<Customer> {
    return this.repository.save(customer);
  }

  async deleteOne(customer: Customer): Promise<Customer> {
    return this.repository.remove(customer);
  }

  async getOne(customer: Customer): Promise<Customer> {
    return this.repository.findOne({ where: { id: customer.id } });
  }
}
