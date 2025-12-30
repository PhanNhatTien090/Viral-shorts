export * from './registry';
export * from './system';
export * from './styles';
export * from './tasks';

import { getSystemPrompt } from './system';
import { getStylePrompt, mapVibeToStyle } from './styles';

/**
 * Duration types and structure mapping
 */
export type VideoDuration = '15-30' | '30-60' | '60-90';

interface DurationConfig {
  format: string;
  style: string;
  instruction: string;
}

const DURATION_CONFIGS: Record<VideoDuration, DurationConfig> = {
  '15-30': {
    format: 'Bullet Points (• hoặc Bước 1, 2, 3)',
    style: 'Direct, actionable, no fluff. Witty but professional.',
    instruction: `STRUCTURE: Viết chính xác 3-4 bullet points.
• Mỗi point ngắn gọn, punch mạnh (max 12 từ)
• Focus vào HOW - hành động cụ thể
• Không dài dòng giải thích

VÍ DỤ OUTPUT:
"• Ăn trái cây TRƯỚC bữa ăn, không phải sau
• Tránh ăn sau 6h tối - đường chuyển thành mỡ
• Chuối + sữa chua = combo giảm cân thần thánh
• Thử 1 tuần, cân nặng sẽ thay đổi"`,
  },
  '30-60': {
    format: 'Intro sentence + 3-4 Bullet Points + Closing',
    style: 'Balanced - có context ngắn rồi đi vào chi tiết',
    instruction: `STRUCTURE: Mở đầu 1 câu context, sau đó 3-4 bullet points, kết 1 câu.

VÍ DỤ OUTPUT:
"Tui từng nghĩ ăn trái cây lúc nào cũng tốt. Sai bét.

• Buổi sáng: Cơ thể cần năng lượng → đường hấp thu nhanh, tốt
• Buổi tối: Không vận động → đường chuyển thành mỡ bụng
• Sau bữa ăn: Enzyme tiêu hóa bị loãng → đầy hơi, khó tiêu
• Golden hour: 10h sáng hoặc 3h chiều là lý tưởng nhất

Chỉ cần đổi timing, bụng phẳng hơn sau 2 tuần."`,
  },
  '60-90': {
    format: '3 đoạn văn tách biệt bằng <br><br>',
    style: 'Storytelling / Deep Dive. Analytical hoặc Narrative.',
    instruction: `STRUCTURE: Viết 3 đoạn rõ ràng, KHÔNG dùng bullet points.
- Đoạn 1: Context/Problem - Đặt vấn đề
- Đoạn 2: Analysis/Insight - Giải thích sâu
- Đoạn 3: Lesson/Action - Kết luận + hành động

Dùng <br><br> để tách đoạn. Viết như đang kể chuyện.

VÍ DỤ OUTPUT:
"Bạn có bao giờ thắc mắc tại sao ăn trái cây đều đặn mà bụng vẫn to không? Tui cũng từng như vậy. Ăn cam, ăn táo mỗi ngày mà cân không giảm. Cho đến khi tui phát hiện ra vấn đề không phải WHAT mà là WHEN.

<br><br>

Đây là science: Buổi sáng, cortisol cao, metabolism nhanh. Đường fructose trong trái cây được đốt cháy ngay lập tức thành năng lượng. Nhưng buổi tối? Cơ thể đang chuẩn bị nghỉ ngơi. Insulin spike từ đường sẽ ra lệnh cho cơ thể: 'Store as fat'. Đó là lý do bạn ăn healthy mà vẫn tích mỡ.

<br><br>

Giải pháp đơn giản: Ăn trái cây trước 3h chiều. Không cần diet, không cần gym. Chỉ cần thay đổi timing. Tui đã giảm 3kg trong 1 tháng chỉ với trick này. Thử đi, cảm ơn sau."`,
  },
};

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
  persona?: 'genz' | 'expert' | 'storyteller';
}

/**
 * Build the complete prompt - Clean & Sharp version
 */
export function buildPrompt(options: PromptBuildOptions): string {
  const {
    topic,
    vibe,
    platform,
    duration = '30-60',
    includeVisuals = false,
    webContext,
    persona = 'genz',
  } = options;

  const durationConfig = DURATION_CONFIGS[duration] || DURATION_CONFIGS['30-60'];
  
  // Debug log for duration
  console.log(`🎬 Duration: ${duration} → Format: ${durationConfig.format}`);
  
  const systemPrompt = getSystemPrompt(persona);
  const styleVibe = mapVibeToStyle(vibe);
  const stylePrompt = getStylePrompt(styleVibe);

  const prompt = `
${systemPrompt}

${stylePrompt}

═══════════════════════════════════════════════════════════════
📋 INPUT
═══════════════════════════════════════════════════════════════

TOPIC: ${topic}
PLATFORM: ${platform}
VIDEO LENGTH: ${duration} giây
FORMAT: ${durationConfig.format}

${webContext ? `
🌐 CONTEXT TỪ WEB (Facts thật, dùng để tham khảo):
${webContext}
` : ''}

═══════════════════════════════════════════════════════════════
� CRITICAL STRUCTURE CONSTRAINT - BẮT BUỘC TUÂN THỦ
═══════════════════════════════════════════════════════════════

Video dài ${duration} giây. BẮT BUỘC viết script theo format sau:

${durationConfig.instruction}

⚠️ QUAN TRỌNG: 
- Nếu ${duration === '15-30' ? 'viết quá 4 bullet points' : duration === '30-60' ? 'không có intro + bullets + closing' : 'dùng bullet points thay vì 3 đoạn văn'}, script sẽ BỊ TỪ CHỐI.
- Độ dài script PHẢI phù hợp với ${duration} giây khi đọc to.

═══════════════════════════════════════════════════════════════
📝 OUTPUT FORMAT
═══════════════════════════════════════════════════════════════

{
  "hook": "Câu mở đầu dưới 5 giây. Dùng Negative Warning hoặc Contrarian Statement.",
  "script": "Nội dung chính. TUÂN THỦ STRUCTURE CONSTRAINT ở trên. PHẢI đúng format cho ${duration} giây.",
  "cta": "Kêu gọi hành động ngắn gọn",
  "analysis": {
    "hookPsychology": "Tại sao hook này hiệu quả (1 câu)",
    "viralScore": 1-10,
    "audienceInsight": "Đối tượng mục tiêu",
    "viralFramework": "Framework đã dùng"
  }
}
${includeVisuals ? `
THÊM:
"visualPrompt": "English prompt for AI video (Kling/Runway). Describe: subject, scene, camera, lighting."
` : ''}
`.trim();

  return prompt;
}

/**
 * Estimate token count for a prompt
 */
export function estimateTokens(prompt: string): number {
  return Math.ceil(prompt.length / 4);
}
