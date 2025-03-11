import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scenario } from './entities/scenario.entity';
import { ScenarioController } from './controllers/scenario.controllers';
import { ScenariosService } from './services/scenario.service';

@Module({
  imports: [TypeOrmModule.forFeature([Scenario])],
  providers: [ScenariosService],
  controllers: [ScenarioController],
  exports: [ScenariosService],
})
export class ScenariosModule {}
