import { promptRegistry } from './registry';

/**
 * Style Prompts - Define content vibe/tone
 * 
 * These modify HOW the content is delivered.
 * Mapped to user's "vibe" selection in the UI.
 */

export type ContentVibe = 
  | 'funny' 
  | 'educational' 
  | 'dramatic' 
  | 'inspirational'
  | 'controversial';

// ═══════════════════════════════════════════════════════════════
// Funny/Entertainment Style
// ═══════════════════════════════════════════════════════════════
promptRegistry.register('style:funny_v1', {
  content: `STYLE: Hài hước thông minh

• Tạo humor qua irony và observations thực tế
• Twist bất ngờ ở cuối
• Tự giễu nhẹ nhàng OK
• Không ép cười, không overuse emoji`,
  metadata: {
    version: 'FUNNY_V1',
    category: 'style',
    description: 'Smart humor style',
    tokenEstimate: 50,
    createdAt: '2024-12-29',
  },
});

// ═══════════════════════════════════════════════════════════════
// Educational Style  
// ═══════════════════════════════════════════════════════════════
promptRegistry.register('style:educational_v1', {
  content: `STYLE: Giáo dục có insight

• Hook bằng fact bất ngờ hoặc misconception phổ biến
• Giải thích WHY, không chỉ WHAT
• Dùng số liệu cụ thể, ví dụ thực tế
• Kết thúc với actionable takeaway`,
  metadata: {
    version: 'EDUCATIONAL_V1',
    category: 'style',
    description: 'Insightful educational style',
    tokenEstimate: 50,
    createdAt: '2024-12-29',
  },
});

// ═══════════════════════════════════════════════════════════════
// Dramatic/Story Style
// ═══════════════════════════════════════════════════════════════
promptRegistry.register('style:dramatic_v1', {
  content: `STYLE: Kể chuyện có chiều sâu

• Mở đầu với hook tạo curiosity
• Build tension qua narrative
• Có twist hoặc revelation
• Kết thúc với lesson hoặc cliffhanger`,
  metadata: {
    version: 'DRAMATIC_V1',
    category: 'style',
    description: 'Narrative storytelling style',
    tokenEstimate: 50,
    createdAt: '2024-12-29',
  },
});

// ═══════════════════════════════════════════════════════════════
// Inspirational Style
// ═══════════════════════════════════════════════════════════════
promptRegistry.register('style:inspirational_v1', {
  content: `STYLE: Truyền cảm hứng
- Hook về transformation/success
- Emotional journey ngắn gọn
- CTA tạo động lực hành động`,
  metadata: {
    version: 'INSPIRATIONAL_V1',
    category: 'style',
    description: 'Inspirational/motivational style',
    tokenEstimate: 30,
    createdAt: '2024-12-29',
  },
});

// ═══════════════════════════════════════════════════════════════
// Controversial Style
// ═══════════════════════════════════════════════════════════════
promptRegistry.register('style:controversial_v1', {
  content: `STYLE: Gây tranh cãi (positive)
- Hook polarizing, chia đôi ý kiến
- Take góc nhìn bất ngờ
- CTA kích comment debate`,
  metadata: {
    version: 'CONTROVERSIAL_V1',
    category: 'style',
    description: 'Controversial/debate-inducing style',
    tokenEstimate: 30,
    createdAt: '2024-12-29',
  },
});

/**
 * Get style prompt by vibe
 */
export function getStylePrompt(vibe: ContentVibe): string {
  const key = `style:${vibe}_v1`;
  try {
    return promptRegistry.getContent(key);
  } catch {
    // Fallback to educational if vibe not found
    console.warn(`Style not found: ${vibe}, falling back to educational`);
    return promptRegistry.getContent('style:educational_v1');
  }
}

/**
 * Map UI vibe to ContentVibe type
 */
export function mapVibeToStyle(uiVibe: string): ContentVibe {
  const mapping: Record<string, ContentVibe> = {
    'funny': 'funny',
    'humorous': 'funny',      // UI sends 'humorous'
    'hài hước': 'funny',
    'educational': 'educational',
    'expert': 'educational',  // UI sends 'expert' for Chuyên gia
    'giáo dục': 'educational',
    'chuyên gia': 'educational',
    'dramatic': 'dramatic',
    'drama': 'dramatic',
    'storytelling': 'dramatic', // UI sends 'storytelling' for Kể chuyện
    'kể chuyện': 'dramatic',
    'inspirational': 'inspirational',
    'truyền cảm hứng': 'inspirational',
    'controversial': 'controversial',
    'gây tranh cãi': 'controversial',
  };
  
  return mapping[uiVibe.toLowerCase()] || 'funny';
}
