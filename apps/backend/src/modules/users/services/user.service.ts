import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>
  ) {}

  async find(query: any): Promise<User[]> {
    return this.repository.find(query);
  }

  async updateOne(id: number, body: Partial<User>): Promise<User> {
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

    user = { ...user, ...body };

    return this.repository.save(user);
  }

  async findOne(query: any): Promise<User> {
    return this.repository.findOneByOrFail(query).catch(() => {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User does not exist',
        },
        HttpStatus.NOT_FOUND
      );
    });
  }

  async deleteOne(id: number): Promise<DeleteResult> {
    return this.repository.delete(id);
  }

  async createOne(body: CreateUserDto): Promise<User> {
    const user: User = new User();
    user.email = body.email;
    await this.repository
      .findOne({ where: { email: body.email } })
      .then((user) => {
        if (user) {
          throw new HttpException(
            {
              status: HttpStatus.UNPROCESSABLE_ENTITY,
              error: 'User already exists',
            },
            HttpStatus.UNPROCESSABLE_ENTITY
          );
        }
      });

    return this.repository.save(user);
  }
}
