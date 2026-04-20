import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EconomyTransaction } from './entities/economy-transaction.entity';
import { EconomyService } from './economy.service';

@Module({
  imports: [TypeOrmModule.forFeature([EconomyTransaction])],
  providers: [EconomyService],
  exports: [EconomyService],
})
export class EconomyModule {}
