import { Module } from '@nestjs/common';
import { EngineSafetyWrapperService } from './engine-safety-wrapper.service';

@Module({
  providers: [EngineSafetyWrapperService],
  exports: [EngineSafetyWrapperService],
})
export class EngineSafetyModule {}
