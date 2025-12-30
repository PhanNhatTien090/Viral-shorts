import { GeminiProvider } from './gemini';
import { OpenAIProvider } from './openai';
import { ILLMProvider, LLMProvider, ModelTier } from './types';

export * from './types';
export * from './gemini';
export * from './openai';

/**
 * LLM Provider Factory
 * 
 * Centralized provider instantiation with environment-based configuration.
 */

// Singleton instances (lazy initialization)
let geminiInstance: GeminiProvider | null = null;
let openaiInstance: OpenAIProvider | null = null;

/**
 * Get configured LLM provider
 */
export function getProvider(
  provider: LLMProvider = 'openai',  // ← DEFAULT: OpenAI (more stable)
  tier: ModelTier = 'fast'
): ILLMProvider {
  switch (provider) {
    case 'openai': {
      if (!openaiInstance) {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
          throw new Error('OPENAI_API_KEY not configured');
        }
        openaiInstance = new OpenAIProvider(apiKey, tier);
      }
      return openaiInstance;
    }
    
    case 'gemini': {
      if (!geminiInstance) {
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!apiKey) {
          throw new Error('GOOGLE_GENERATIVE_AI_API_KEY not configured');
        }
        geminiInstance = new GeminiProvider(apiKey, tier);
      }
      return geminiInstance;
    }
    
    case 'anthropic':
      throw new Error('Anthropic provider not yet implemented');
    
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

/**
 * Get default provider - NOW USES OPENAI
 */
export function getDefaultProvider(): ILLMProvider {
  return getProvider('openai', 'fast');  // ← gpt-4o-mini
}

/**
 * Reset provider instances (for testing)
 */
export function resetProviders(): void {
  geminiInstance = null;
  openaiInstance = null;
}
