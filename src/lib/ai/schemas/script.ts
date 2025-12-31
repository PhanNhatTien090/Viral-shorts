import { z } from 'zod';

/**
 * Zod Schemas for Script Generation
 * 
 * Centralized schema definitions.
 * Descriptions are minimal - they're hints for the model.
 */

// ═══════════════════════════════════════════════════════════════
// Viral Analysis Schema (shared)
// ═══════════════════════════════════════════════════════════════
export const viralAnalysisSchema = z.object({
  hookPsychology: z.string().describe('Why this hook works - max 15 words'),
  viralScore: z.number().min(1).max(10).describe('Viral score 1-10'),
  audienceInsight: z.string().describe('Specific target audience'),
  viralFramework: z.string().describe('Framework used: Pattern Break / Harsh Truth / Counter-Intuitive / etc'),
});

// ═══════════════════════════════════════════════════════════════
// Base Script Schema (without visuals)
// ═══════════════════════════════════════════════════════════════
export const baseScriptSchema = z.object({
  scenario_detected: z.enum(['Narrative', 'Knowledge', 'Opinion']).describe('Detected scenario type based on topic analysis'),
  hook: z.string().describe('Savage opening line under 5 seconds. Pattern Break, Harsh Truth, or Counter-Intuitive style.'),
  script: z.string().describe('Main content following detected scenario structure. Use <br> for line breaks.'),
  cta: z.string().describe('Short, engagement-driving call to action'),
  analysis: viralAnalysisSchema,
});

// ═══════════════════════════════════════════════════════════════
// Full Script Schema (with visuals)
// ═══════════════════════════════════════════════════════════════
export const fullScriptSchema = baseScriptSchema.extend({
  visualPrompt: z.string().describe('English prompt for AI video generation (Kling/Runway). Describe: subject, scene, camera, lighting.'),
});

// ═══════════════════════════════════════════════════════════════
// Hook Variations Schema (for multi-hook generation)
// ═══════════════════════════════════════════════════════════════
export const hookVariationsSchema = z.object({
  hooks: z.array(z.object({
    text: z.string().describe('Hook text'),
    framework: z.string().describe('Framework used'),
  })).length(5),
});

// ═══════════════════════════════════════════════════════════════
// Type exports
// ═══════════════════════════════════════════════════════════════
export type ViralAnalysis = z.infer<typeof viralAnalysisSchema>;
export type BaseScriptResult = z.infer<typeof baseScriptSchema>;
export type FullScriptResult = z.infer<typeof fullScriptSchema>;
export type HookVariations = z.infer<typeof hookVariationsSchema>;

/**
 * Get appropriate schema based on options
 */
export function getScriptSchema(includeVisuals: boolean) {
  return includeVisuals ? fullScriptSchema : baseScriptSchema;
}
