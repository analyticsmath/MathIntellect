import axios, { AxiosInstance, AxiosError } from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PromptContract } from './prompt-builder.service';

interface OpenAiChatCompletion {
  choices?: Array<{
    message?: {
      content?: string | Array<{ type?: string; text?: string }>;
      refusal?: string | null;
    };
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}

export interface StructuredGenerationResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
  latencyMs: number;
  attempts: number;
  tokenUsage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

@Injectable()
export class OpenAIClientService {
  private readonly logger = new Logger(OpenAIClientService.name);
  private readonly http: AxiosInstance;
  private readonly timeoutMs = 10_000;
  private readonly maxRetries = 2;

  constructor(private readonly config: ConfigService) {
    this.http = axios.create({
      baseURL: 'https://api.openai.com/v1',
      timeout: this.timeoutMs,
    });
  }

  async generateStructured<T>(
    contract: PromptContract<T>,
  ): Promise<StructuredGenerationResult<T>> {
    const apiKey = this.config.get<string>('OPENAI_API_KEY');
    const model = this.config.get<string>('OPENAI_MODEL') ?? 'gpt-4o-mini';

    if (!apiKey) {
      return {
        ok: false,
        error: 'OPENAI_API_KEY is not configured',
        latencyMs: 0,
        attempts: 0,
      };
    }

    let lastError = 'Unknown OpenAI error';
    let totalLatency = 0;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      const startedAt = Date.now();

      try {
        const response = await this.http.post<OpenAiChatCompletion>(
          '/chat/completions',
          {
            model,
            temperature: 0,
            messages: [
              {
                role: 'system',
                content: contract.systemPrompt,
              },
              {
                role: 'user',
                content: contract.userPrompt,
              },
            ],
            response_format: {
              type: 'json_schema',
              json_schema: {
                name: contract.schemaName,
                schema: contract.schema,
                strict: true,
              },
            },
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          },
        );

        const latencyMs = Date.now() - startedAt;
        totalLatency += latencyMs;
        this.logger.log(`OpenAI latency ${latencyMs}ms (attempt ${attempt + 1})`);

        const content = this.extractContent(response.data);
        const parsed = this.parseJsonPayload(content);

        if (!contract.validator(parsed)) {
          throw new Error('Structured output validation failed');
        }

        return {
          ok: true,
          data: parsed,
          latencyMs: totalLatency,
          attempts: attempt + 1,
          tokenUsage: {
            promptTokens: response.data.usage?.prompt_tokens,
            completionTokens: response.data.usage?.completion_tokens,
            totalTokens: response.data.usage?.total_tokens,
          },
        };
      } catch (error) {
        const latencyMs = Date.now() - startedAt;
        totalLatency += latencyMs;
        lastError = this.readableError(error);

        if (attempt < this.maxRetries) {
          this.logger.warn(
            `OpenAI call attempt ${attempt + 1} failed (${lastError}). Retrying...`,
          );
          continue;
        }

        this.logger.warn(
          `OpenAI call failed after ${attempt + 1} attempt(s): ${lastError}`,
        );
      }
    }

    return {
      ok: false,
      error: lastError,
      latencyMs: totalLatency,
      attempts: this.maxRetries + 1,
    };
  }

  private extractContent(response: OpenAiChatCompletion): string {
    const content = response.choices?.[0]?.message?.content;

    if (typeof content === 'string' && content.trim().length > 0) {
      return content;
    }

    if (Array.isArray(content)) {
      const combined = content
        .map((part) => (typeof part.text === 'string' ? part.text : ''))
        .join('')
        .trim();
      if (combined.length > 0) {
        return combined;
      }
    }

    throw new Error('OpenAI returned empty content');
  }

  private parseJsonPayload(content: string): unknown {
    try {
      return JSON.parse(content);
    } catch {
      const firstBrace = content.indexOf('{');
      const lastBrace = content.lastIndexOf('}');
      if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
        throw new Error('OpenAI content is not valid JSON');
      }

      const candidate = content.slice(firstBrace, lastBrace + 1);
      return JSON.parse(candidate);
    }
  }

  private readableError(error: unknown): string {
    if (error instanceof AxiosError) {
      const apiMessage =
        (error.response?.data as { error?: { message?: string } } | undefined)
          ?.error?.message ?? error.message;
      return apiMessage;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return String(error);
  }
}
