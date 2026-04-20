import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Result } from '../results/entities/result.entity';
import { Simulation } from '../simulations/entities/simulation.entity';
import { AiController } from './ai.controller';
import { AiOrchestratorService } from './services/ai-orchestrator.service';
import { CacheAiService } from './services/cache-ai.service';
import { DecisionEngineService } from './services/decision-engine.service';
import { InsightEngineService } from './services/insight-engine.service';
import { OpenAIClientService } from './services/openai-client.service';
import { PromptBuilderService } from './services/prompt-builder.service';
import { SimulationContextService } from './services/simulation-context.service';
import { GabeModule } from '../gabe/gabe.module';
import { ProgressionModule } from '../progression/progression.module';
import { AiMetaLearningModule } from '../ai-meta-learning/ai-meta-learning.module';
import { AiCoachService } from './services/ai-coach.service';
import { AiV2Controller } from './ai-v2.controller';
import { AiConsistencyModule } from '../ai-consistency/ai-consistency.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Simulation, Result]),
    GabeModule,
    ProgressionModule,
    AiMetaLearningModule,
    AiConsistencyModule,
  ],
  controllers: [AiController, AiV2Controller],
  providers: [
    AiOrchestratorService,
    PromptBuilderService,
    InsightEngineService,
    DecisionEngineService,
    SimulationContextService,
    OpenAIClientService,
    CacheAiService,
    AiCoachService,
  ],
  exports: [AiOrchestratorService],
})
export class AiModule {}
