export * from './schemas/script';
export * from './prompts';
export * from './providers';

/**
 * AI Module - Main Entry Point
 * 
 * Clean interface for AI operations.
 * Abstracts provider details from business logic.
 */

import { getDefaultProvider, type ModelTier } from './providers';
import { buildPrompt, type PromptBuildOptions, estimateTokens } from './prompts';
import { getScriptSchema } from './schemas/script';

export interface GenerateScriptOptions extends PromptBuildOptions {
  tier?: ModelTier;
}

/**
 * Generate viral script with streaming
 * 
 * @example
 * const { stream, object } = await generateScript({
 *   topic: 'Cà phê Việt Nam',
 *   vibe: 'educational',
 *   platform: 'tiktok',
 * });
 * 
 * // Use stream for SSE response
 * return new Response(stream);
 * 
 * // Or await final object
 * const script = await object;
 */
export async function generateScript(options: GenerateScriptOptions) {
  const provider = getDefaultProvider();
  const schema = getScriptSchema(options.includeVisuals ?? false);
  const prompt = buildPrompt(options);
  
  // Log token estimate for cost tracking
  const tokenEstimate = estimateTokens(prompt);
  console.log(`📊 Prompt tokens (est): ${tokenEstimate}`);
  
  return provider.streamObject({
    schema,
    prompt,
    tier: options.tier,
  });
}

/**
 * Health check for AI service
 */
export async function checkAIHealth(): Promise<{ ok: boolean; error?: string }> {
  const provider = getDefaultProvider();
  return provider.healthCheck();
}
