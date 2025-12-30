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
  hookPsychology: z.string().describe('Tại sao hook này work - max 15 từ'),
  viralScore: z.number().min(1).max(10).describe('Điểm viral 1-10'),
  audienceInsight: z.string().describe('Đối tượng cụ thể'),
  viralFramework: z.string().describe('Framework đã dùng'),
});

// ═══════════════════════════════════════════════════════════════
// Base Script Schema (without visuals)
// ═══════════════════════════════════════════════════════════════
export const baseScriptSchema = z.object({
  hook: z.string().describe('Câu mở đầu shocking dưới 5 giây, trigger cảm xúc mạnh'),
  script: z.string().describe('Nội dung chính viết thành câu hoàn chỉnh. Dùng \\n để xuống dòng. KHÔNG dùng bullet points hay markdown. Phải đủ dài theo length constraint.'),
  cta: z.string().describe('Kêu gọi hành động cuối video, tạo FOMO'),
  analysis: viralAnalysisSchema,
});

// ═══════════════════════════════════════════════════════════════
// Full Script Schema (with visuals)
// ═══════════════════════════════════════════════════════════════
export const fullScriptSchema = baseScriptSchema.extend({
  visualPrompt: z.string().describe('English prompt for Kling/Runway/Luma AI video'),
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
