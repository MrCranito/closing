import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/user.dto';
import { CustomHttpErrors } from './../../../shared/errors/http.errors';
import { HashServiceHelper } from './../../../shared/helpers/hash.helper';
import { EmailService } from './../../../modules/email/services/email.service';
import { JwtService } from '@nestjs/jwt';
import { MailConfig } from './../../../config/mails/mail.config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    private hashService: HashServiceHelper,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  async find(query: any): Promise<User[]> {
    return this.repository.find(query);
  }

  async updateUser(id: number, body: Partial<User>): Promise<User> {
    let user: User = await this.repository
      .findOneOrFail({ where: { id } })
      .catch(() => {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: CustomHttpErrors.USER_NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      });

    user = { ...user, ...body };

    return this.repository.save(user);
  }

  async updateEmailIsConfirmed(email: string): Promise<User> {
    let user: User = await this.repository
      .findOneOrFail({ where: { email } })
      .catch(() => {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: CustomHttpErrors.USER_NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      });

    user = { ...user, isEmailConfirmed: true };

    return this.repository.save(user);
  }

  async findOne(query: any): Promise<User> {
    return this.repository.findOneByOrFail(query).catch(() => {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: CustomHttpErrors.USER_NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    const user: User = await this.repository
      .findOneByOrFail({ email })
      .catch(() => {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: CustomHttpErrors.USER_NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      });
    return user;
  }

  async removeUser(id: number): Promise<DeleteResult> {
    return this.repository.delete(id);
  }

  async createUser(body: CreateUserDto): Promise<User> {
    const user: User = new User();
    user.email = body.email;
    await this.hashService
      .hashPassword(body.password)
      .then((hash: string) => {
        user.password = hash;
      })
      .catch(() => {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: CustomHttpErrors.INTERNAL_SERVER_ERROR,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });

    // verify if user already exists
    // if user exists throw error
    await this.repository
      .findOne({ where: { email: body.email } })
      .then((user) => {
        if (user) {
          throw new HttpException(
            {
              status: HttpStatus.UNPROCESSABLE_ENTITY,
              error: CustomHttpErrors.USER_ALREADY_EXISTS,
            },
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }
      });

    await this.emailService.sendVerificationCode(user?.email);

    return this.repository.save(user);
  }

  async sendPasswordResetEmail(email: string): Promise<boolean> {
    const user: User = await this.repository.findOne({ where: { email } });
    if (!user)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: CustomHttpErrors.USER_NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    await this.emailService.sendResetPasswordLink(user?.email);
    return true;
  }

  async updateUserPassword(email: string, password: string): Promise<User> {
    const user: User = await this.repository
      .findOneOrFail({ where: { email } })
      .catch(() => {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: CustomHttpErrors.USER_NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      });

    await this.hashService
      .hashPassword(password)
      .then((hash: string) => {
        user.password = hash;
      })
      .catch(() => {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: CustomHttpErrors.INTERNAL_SERVER_ERROR,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });

    return this.repository.save(user);
  }

  async resetPasswordWithToken(token: string, password: string): Promise<any> {
    let user: Partial<User> = {};
    try {
      user = await this.jwtService.verifyAsync(token, {
        secret: MailConfig.token,
      });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Token is expired',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (!user.email) throw new UnauthorizedException();
    const userUpdated = await this.updateUserPassword(user?.email, password);
    return userUpdated;
  }
}
