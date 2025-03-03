import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Company, SubscriptionPlan } from '../entities/company.entity';
import { User, UserRole } from '../../users/entities/user.entity';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { AddUserToCompanyDto } from '../dto/add-user-to-company.dto';
@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async find(query: any): Promise<Company[]> {
    return this.companyRepository.find(query);
  }

  async updateOne(id: string, body: Partial<Company>): Promise<Company> {
    let company: Company = await this.companyRepository
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

    return this.companyRepository.save(company);
  }

  async findOne(query: any): Promise<Company> {
    return this.companyRepository.findOne(query);
  }

  async deleteOne(id: number): Promise<DeleteResult> {
    return this.companyRepository.delete(id);
  }

  async createCompany(
    ownerId: string,
    createCompanyDto: CreateCompanyDto
  ): Promise<Company> {
    const owner = await this.userRepository.findOne({ where: { id: ownerId } });

    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    const company = this.companyRepository.create({
      ...createCompanyDto,
      ownerId,
      subscriptionPlan: SubscriptionPlan.FREE,
      subscriptionStartDate: new Date(),
    });

    const savedCompany = await this.companyRepository.save(company);

    // Update owner's company association
    owner.company = savedCompany;
    owner.role = UserRole.OWNER;
    await this.userRepository.save(owner);

    return savedCompany;
  }

  async addUserToCompany(
    companyId: string,
    addUserDto: AddUserToCompanyDto
  ): Promise<User> {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
      relations: ['users'],
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const user = await this.userRepository.findOne({
      where: { email: addUserDto.email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.companyId) {
      throw new BadRequestException('User already belongs to a company');
    }

    user.company = company;
    user.role = addUserDto.role || UserRole.USER;
    await this.userRepository.save(user);

    await this.companyRepository.save(company);

    return user;
  }

  async removeUserFromCompany(
    companyId: string,
    userId: string
  ): Promise<void> {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId, companyId },
    });

    if (!user) {
      throw new NotFoundException('User not found in company');
    }

    if (user.role === UserRole.OWNER) {
      throw new BadRequestException('Cannot remove company owner');
    }

    user.company = null;
    user.role = UserRole.USER;
    await this.userRepository.save(user);

    await this.companyRepository.save(company);
  }

  async updateCompany(
    companyId: string,
    updateCompanyDto: UpdateCompanyDto
  ): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    Object.assign(company, updateCompanyDto);
    return this.companyRepository.save(company);
  }

  async upgradeCompanySubscription(companyId: string): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (company.subscriptionPlan === SubscriptionPlan.PRO) {
      throw new BadRequestException('Company is already on PRO plan');
    }

    company.subscriptionPlan = SubscriptionPlan.PRO;
    company.subscriptionStartDate = new Date();
    // Set subscription end date to 1 year from now
    company.subscriptionEndDate = new Date();
    company.subscriptionEndDate.setFullYear(
      company.subscriptionEndDate.getFullYear() + 1
    );

    return this.companyRepository.save(company);
  }

  async getCompanyUsers(companyId: string): Promise<User[]> {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
      relations: ['users'],
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company.users;
  }

  async getCompanyByOwner(ownerId: string): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { ownerId },
      relations: ['users'],
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }
}
