import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamObject } from 'ai';
import { z } from 'zod';
import { 
  ILLMProvider, 
  GenerateOptions, 
  ModelTier, 
  MODEL_MAP 
} from './types';

/**
 * Google Gemini Provider Implementation
 * 
 * Currently using free tier (gemini-2.0-flash-exp)
 * Easy to upgrade to Pro models when needed
 */
export class GeminiProvider implements ILLMProvider {
  readonly name = 'gemini' as const;
  private client: ReturnType<typeof createGoogleGenerativeAI>;
  private defaultTier: ModelTier;

  constructor(apiKey: string, defaultTier: ModelTier = 'fast') {
    this.client = createGoogleGenerativeAI({ apiKey });
    this.defaultTier = defaultTier;
  }

  async streamObject<T extends z.ZodType>(options: GenerateOptions<T>) {
    const tier = options.tier ?? this.defaultTier;
    const modelId = MODEL_MAP.gemini[tier];
    
    console.log(`🤖 Gemini [${tier}]: ${modelId}`);

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
        model: this.client(MODEL_MAP.gemini.fast),
        schema: testSchema,
        prompt: 'Reply with status: "ok"',
      });
      
      const { object } = await result;
      const response = await object;
      
      return { ok: response?.status === 'ok' };
    } catch (error) {
      return { 
        ok: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}
