import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { DeleteResult, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/user.dto';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { CrudRequest } from '@nestjsx/crud';

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>
  ) {
    super(repository);
  }

  async updateOne(req: CrudRequest, dto: Partial<User>): Promise<User> {
    const id = req.parsed.paramsFilter[0].value;
    let user: User = await this.repository
      .findOneOrFail({ where: { id } })
      .catch(() => {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'User does not exist',
          },
          HttpStatus.NOT_FOUND
        );
      });

    user = { ...user, ...dto };

    return this.repository.save(user);
  }

  async deleteOne(req: CrudRequest): Promise<void> {
    const id = req.parsed.paramsFilter[0].value;
    await this.repository.delete(id);
  }

  async createOne(req: CrudRequest, dto: CreateUserDto): Promise<User> {
    const user: User = new User();
    user.email = dto.email;
    user.firstname = dto.firstname;
    user.lastname = dto.lastname;

    await this.repository
      .findOne({ where: { email: dto.email } })
      .then((existingUser) => {
        if (existingUser) {
          throw new HttpException(
            {
              status: HttpStatus.UNPROCESSABLE_ENTITY,
              error: 'User already exists',
            },
            HttpStatus.UNPROCESSABLE_ENTITY
          );
        }
      });

    user.password = await bcrypt.hash(dto.password, 10);

    return this.repository.save(user);
  }
}
