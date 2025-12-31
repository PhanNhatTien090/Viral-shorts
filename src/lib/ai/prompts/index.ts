export * from './registry';
export * from './system';
export * from './styles';
export * from './tasks';

// import { getSmartHookExamples } from '@/data/viral-hooks';

/**
 * Duration types and structure mapping
 */
export type VideoDuration = '15-30' | '30-60' | '60-90';

/**
 * Prompt Builder Options
 */
export interface PromptBuildOptions {
  topic: string;
  vibe: string;
  platform: string;
  duration?: VideoDuration;
  includeVisuals?: boolean;
  webContext?: string | null;
}

/**
 * Get duration-specific length instruction
 */


/**
 * Build the complete prompt - Intelligent Scenario Detection Architecture
 */
import type { Archetype } from '@/types';

// Define the Archetypes
const ARCHETYPES: Record<Archetype, {
  role: string;
  structure: string;
  format_rule: string;
  tone: string;
}> = {
  Storytime: {
    role: "A relatable Vlogger sharing personal experiences.",
    structure: "NARRATIVE ARC (Context -> Conflict -> Climax -> Resolution).",
    format_rule: "NO Bullet points. Use spoken paragraphs. Use 'Tui' (I) and 'Mấy bà' (You).",
    tone: "Emotional, Whispering, Confessional."
  },
  Expert: {
    role: "A no-nonsense Industry Expert.",
    structure: "EDUCATIONAL LISTICLE (Hook -> The Problem -> 3 Steps Solution).",
    format_rule: "MUST use Bullet points or Numbered lists for clarity.",
    tone: "Authoritative, Helpful, Direct."
  },
  Savage: {
    role: "A Brutal Reviewer who hates mediocrity.",
    structure: "ARGUMENTATIVE (Controversial Hook -> Roast the bad -> Praise the good).",
    format_rule: "Short, punchy sentences. Rhetorical questions.",
    tone: "Aggressive, Witty, Sarky. Use vocab: 'Dẹp ngay', 'Phí tiền', 'Tỉnh lại đi'."
  },
  Drama: {
    role: "An Insider spilling the tea.",
    structure: "NEWS FLASH (Breaking News Hook -> The Details -> The Question).",
    format_rule: "Fast-paced reporting style.",
    tone: "Urgent, Suspenseful, Gossip-style. Vocab: 'Biến căng', 'Chấn động'."
  }
};

export function buildPrompt(options: PromptBuildOptions): string {
  const {
    topic,
    vibe,
    platform,
    // duration = '30-60',
    // includeVisuals = false,
    // webContext,
  } = options;

  // Map old vibe to new archetype if needed (fallback to Expert)
  const style = (vibe as Archetype) in ARCHETYPES ? (vibe as Archetype) : 'Expert';
  const selectedArchetype = ARCHETYPES[style as Archetype];

  const systemPrompt = `
ROLE: You are an Elite Viral Content Creator.
CURRENT MODE: **${style.toUpperCase()}** (${selectedArchetype.role})

STRICT STRUCTURE RULES:
- **Structure:** ${selectedArchetype.structure}
- **Formatting:** ${selectedArchetype.format_rule}
- **Tone:** ${selectedArchetype.tone}

INPUT DATA:
- Topic: "${topic}"
- Platform: "${platform}"

---
🛡️ SAFETY RULE:
Even in Savage/Drama mode, NEVER attack specific individuals (bullying) or protected groups. Attack ideas/behaviors only.

---
OUTPUT JSON:
{
  "hook": "Mode-specific hook (Under 3s)",
  "body": "The script content strictly following the Format Rule above.",
  "cta": "Engagement trigger",
  "viral_score": number,
  "viral_reason": "Why this fits the ${style} archetype"
}
`;

  return systemPrompt;
}


/**
 * Estimate token count for a prompt
 */
export function estimateTokens(prompt: string): number {
  return Math.ceil(prompt.length / 4);
}
