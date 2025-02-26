import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Company } from '../entities/company.entity';
import { CreateCompanyDto } from '../dto/company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private repository: Repository<Company>
  ) {}

  async find(query: any): Promise<Company[]> {
    return this.repository.find(query);
  }

  async updateOne(id: number, body: Partial<Company>): Promise<Company> {
    let company: Company = await this.repository
      .findOneOrFail({ where: { id } })
      .catch(() => {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Company does not exist',
          },
          HttpStatus.NOT_FOUND
        );
      });

    company = { ...company, ...body };

    return this.repository.save(company);
  }

  async findOne(query: any): Promise<Company> {
    return this.repository.findOne(query);
  }

  async deleteOne(id: number): Promise<DeleteResult> {
    return this.repository.delete(id);
  }

  async createOne(body: CreateCompanyDto): Promise<Company> {
    const company: Company = new Company();
    await this.repository
      .findOne({ where: { name: body.name } })
      .then((user) => {
        if (user) {
          throw new HttpException(
            {
              status: HttpStatus.UNPROCESSABLE_ENTITY,
              error: 'Company already exists',
            },
            HttpStatus.UNPROCESSABLE_ENTITY
          );
        }
      });

    return this.repository.save(company);
  }
}
