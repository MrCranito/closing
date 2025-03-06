import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { SessionController } from './controllers/session.controllers';
import { SessionsService } from './services/session.service';

@Module({
  imports: [TypeOrmModule.forFeature([Session])],
  providers: [SessionsService],
  controllers: [SessionController],
  exports: [SessionsService],
})
export class SessionsModule {}
