import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DiagramService } from './services/diagram.service';
import { DiagramController } from './controllers/diagram.controller';
import { Diagram, DiagramSchema } from './schemas/diagram.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Diagram.name, schema: DiagramSchema }]),
  ],
  controllers: [DiagramController],
  providers: [DiagramService],
  exports: [DiagramService],
})
export class DiagramModule {}
