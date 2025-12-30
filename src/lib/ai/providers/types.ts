import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════
// LLM Provider Abstraction - Model-agnostic interface
// ═══════════════════════════════════════════════════════════════

/**
 * Supported LLM providers
 * Add new providers here as they're integrated
 */
export type LLMProvider = 'gemini' | 'openai' | 'anthropic';

/**
 * Model tiers for cost optimization
 * - fast: Cheap, high-throughput (Gemini Flash, GPT-3.5, Haiku)
 * - balanced: Good quality/cost ratio (Gemini Pro, GPT-4o-mini, Sonnet)
 * - premium: Best quality, higher cost (GPT-4o, Opus, Gemini Ultra)
 */
export type ModelTier = 'fast' | 'balanced' | 'premium';

/**
 * Provider configuration
 */
export interface ProviderConfig {
  provider: LLMProvider;
  apiKey: string;
  defaultTier?: ModelTier;
}

/**
 * Generation options passed to any provider
 */
export interface GenerateOptions<T extends z.ZodType> {
  schema: T;
  prompt: string;
  tier?: ModelTier;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Streaming generation result
 */
export interface StreamResult<T> {
  stream: ReadableStream;
  object: Promise<T>;
}

/**
 * Provider interface - implement this for each LLM
 */
export interface ILLMProvider {
  readonly name: LLMProvider;
  
  /**
   * Stream structured object generation
   */
  streamObject<T extends z.ZodType>(
    options: GenerateOptions<T>
  ): Promise<{
    toTextStreamResponse: () => Response;
    object: Promise<z.infer<T>>;
  }>;
  
  /**
   * Health check - verify API key and connectivity
   */
  healthCheck(): Promise<{ ok: boolean; error?: string }>;
}

/**
 * Model mapping per provider and tier
 */
export const MODEL_MAP: Record<LLMProvider, Record<ModelTier, string>> = {
  gemini: {
    fast: 'gemini-2.0-flash',           // Free tier, stable (NOT -exp)
    balanced: 'gemini-2.5-flash',       // Better quality
    premium: 'gemini-2.5-pro',          // Best available
  },
  openai: {
    fast: 'gpt-4o-mini',
    balanced: 'gpt-4o',
    premium: 'gpt-4o',
  },
  anthropic: {
    fast: 'claude-3-5-haiku-latest',
    balanced: 'claude-sonnet-4-20250514',
    premium: 'claude-opus-4-20250514',
  },
};
