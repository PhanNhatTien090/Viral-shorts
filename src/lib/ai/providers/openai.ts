import { createOpenAI } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { z } from 'zod';
import { 
  ILLMProvider, 
  GenerateOptions, 
  ModelTier, 
  MODEL_MAP 
} from './types';

/**
 * OpenAI Provider Implementation
 */
export class OpenAIProvider implements ILLMProvider {
  readonly name = 'openai' as const;
  private client: ReturnType<typeof createOpenAI>;
  private defaultTier: ModelTier;

  constructor(apiKey: string, defaultTier: ModelTier = 'fast') {
    this.client = createOpenAI({ apiKey });
    this.defaultTier = defaultTier;
  }

  async streamObject<T extends z.ZodType>(options: GenerateOptions<T>) {
    const tier = options.tier ?? this.defaultTier;
    const modelId = MODEL_MAP.openai[tier];
    
    console.log(`🤖 OpenAI [${tier}]: ${modelId}`);

    const result = streamObject({
      model: this.client(modelId),
      schema: options.schema,
      prompt: options.prompt,
      temperature: options.temperature,
      maxTokens: options.maxTokens,
    });

    return {
      toTextStreamResponse: () => result.toTextStreamResponse(),
      object: result.object as Promise<z.infer<T>>,
    };
  }

  async healthCheck(): Promise<{ ok: boolean; error?: string }> {
    try {
      const testSchema = z.object({ status: z.string() });
      
      const result = streamObject({
        model: this.client(MODEL_MAP.openai.fast),
        schema: testSchema,
        prompt: 'Reply with status: "ok"',
      });
      
      const response = await result.object;
      
      return { ok: response?.status === 'ok' };
    } catch (error) {
      return { 
        ok: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}
