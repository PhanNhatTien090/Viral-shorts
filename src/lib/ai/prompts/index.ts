export * from './registry';
export * from './system';
export * from './styles';
export * from './tasks';

import { getSmartHookExamples } from '@/data/viral-hooks';

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
function getLengthInstruction(duration: VideoDuration): string {
  switch (duration) {
    case '15-30':
      return '15-30 seconds: 3-4 punchy bullet points MAX. Each point under 12 words. No fluff.';
    case '30-60':
      return '30-60 seconds: 1 context sentence → 3-4 bullet points → 1 closing line. Natural flow.';
    case '60-90':
      return '60-90 seconds: 3 distinct paragraphs. Storytelling format. Use <br><br> between paragraphs. NO bullet points.';
    default:
      return '30-60 seconds: 1 context sentence → 3-4 bullet points → 1 closing line.';
  }
}

/**
 * Build the complete prompt - Intelligent Scenario Detection Architecture
 */
export function buildPrompt(options: PromptBuildOptions): string {
  const {
    topic,
    vibe,
    platform,
    duration = '30-60',
    includeVisuals = false,
    webContext,
  } = options;

  const lengthInstruction = getLengthInstruction(duration);
  
  // Smart Hook Selection - Only 3 hooks instead of 54 (Token optimization)
  const hookExamples = getSmartHookExamples(topic, vibe, 3);
  
  // Debug logs
  console.log(`🎬 Duration: ${duration} → ${lengthInstruction}`);
  console.log(`🎯 Detected Scenario: ${hookExamples.category}`);

  const prompt = `
ROLE: You are an Elite Viral Content Creator for TikTok Vietnam.
Your mission: Stop the scroll, trigger emotions, and make content that spreads.

---
🧠 **PHASE 1: SMART SCENARIO DETECTION (INTERNAL PROCESS)**
Before writing, you MUST classify the "Topic" into one of these scenarios:

1. **SCENARIO A: THE NARRATIVE (Chuyện đời tư/Drama/POV)**
   * *Signals:* "Người yêu", "Bạn gái", "Vợ/Chồng", "Hôm nay", "Tui", "Bị lừa", "Crush", "Mẹ", "Sếp".
   * *Structure:* Context → The Conflict → The Climax → Resolution.
   * *⚠️ FORMAT RULE:* **NO BULLET POINTS. NO LISTS.** Write as a CONTINUOUS SPOKEN NARRATIVE (monologue). Use short, punchy sentences that flow naturally like someone talking.
   * *Voice:* Use "Tui" (I) talking directly to "Mấy ông/bà" (Guys). Sound like a friend venting.
   * *Example Output:* "Mấy ông tin được không? Bạn gái tui có phép thuật đó! Không đùa đâu. Sáng nay tui mới để tờ 500k trên bàn, quay đi quay lại... BÙM! Biến mất tiêu! Ảo ma thật sự!"
   * *❌ WRONG:* "- Cô ấy xinh. - Cô ấy nấu ăn ngon." (BORING, BANNED)
   * *✅ RIGHT:* "Tui nói thiệt nha. Con bé này xinh thôi rồi. Mà nấu ăn? Ôi thôi húp tới giọt cuối luôn."

2. **SCENARIO B: THE KNOWLEDGE (Kiến thức/Mẹo/Sự thật)**
   * *Signals:* "Cách", "Làm sao", "Bí mật", "Tại sao", "Mẹo", "Sự thật về...", "Lý do", "Tips".
   * *Structure:* The Myth (Lầm tưởng phổ biến) → The Truth (Sự thật gây sốc) → The Solution (Giải pháp cụ thể).
   * *Key:* Be authoritative and actionable. Use numbers, times, specific steps.
   * *Hook Style:* "99% người Việt đang làm sai cái này...", "Dẹp ngay nếu bạn vẫn đang..."

3. **SCENARIO C: THE OPINION (Review/Quan điểm/So sánh)**
   * *Signals:* "Review", "Đánh giá", "Nghĩ sao về", "Tranh cãi", "vs", "tốt hơn", "nên mua".
   * *Structure:* The Hot Take (Phán xét gây sốc) → Evidence (Bằng chứng/Trải nghiệm) → The Verdict (Chốt hạ).
   * *Key:* Be subjective and bold. Use strong words: "Đỉnh", "Tệ", "Phí tiền", "Đáng đồng tiền".
   * *Hook Style:* "Ai khen cái này ngon là tui block...", "Phí X triệu vào cái này..."

---
🎨 **PHASE 2: VIBE APPLICATION (User Selected: "${vibe}")**
Apply this tone ON TOP of the detected scenario:

* **IF Funny/Hài hước:** Use slang, exaggeration, self-deprecating humor. (Story → Bi hài kịch; Knowledge → "Khôn ra chưa mấy ông?")
* **IF Drama:** High suspense, gossip tone, cliffhangers. ("Biến căng", "Và điều tiếp theo mới shock...")
* **IF Expert/Chuyên gia:** Sharp, brutal honesty, data-driven. ("Số liệu cho thấy...", "Khoa học chứng minh...")
* **IF Story/Kể chuyện:** Emotional, detailed, intimate whispered tone. ("Tui kể mấy bà nghe nè...")
* **IF Educational:** Clear structure, memorable takeaways. ("Nhớ 3 điều này thôi...")

---
🛡️ **PHASE 3: SAFETY & LOCALIZATION**

⛔ **BANNED PHRASES (INSTANT DELETE):**
- "Là một nghệ thuật...", "Hãy cùng tìm hiểu...", "Đừng quên..."
- "Vô cùng tuyệt vời...", "Mang lại lợi ích...", "Chào các bạn..."
- "Trong video này...", "Bạn có biết...", "Đầu tiên, thứ hai..."

✅ **REQUIRED VOCAB (Vietnamese TikTok Slang):**
- "Dẹp ngay", "Vứt xó", "Sai bét", "Tỉnh lại đi"
- "Nhạt như nước ốc", "Ảo ma Canada", "Đáng đồng tiền bát gạo"
- "Ông nào đang...", "Mấy bà...", "Tin tôi đi", "Chấn động"
- "Đỉnh cao", "Húp tới giọt cuối", "Đừng cãi", "Real talk"

🛡️ **SAFETY SAVAGE RULE:**
- Be savage about **IDEAS, HABITS, BEHAVIORS** only.
- **NEVER** attack people, groups, physical attributes, or individuals.
- ✅ Good: "Ăn pizza kiểu này là phạm tội với nhân loại."
- ❌ Bad: "Mày ngu quá mới ăn pizza vậy." (BANNED)

---
📋 **INPUT DATA:**
- Topic: "${topic}"
- Selected Vibe: "${vibe}"
- Platform: "${platform}"
- Duration: "${lengthInstruction}"
- Visual Mode: ${includeVisuals ? 'ENABLED (Director Mode - Add visual cues like "[Zoom vào mặt]", "[Cắt sang B-roll]")' : 'DISABLED'}
- Pre-detected Scenario: "${hookExamples.category}"
${webContext ? `\n- Web Research Context:\n${webContext}` : ''}

---
🎣 **HOOK EXAMPLES FOR YOUR SCENARIO (${hookExamples.category}):**
Use one of these as INSPIRATION (don't copy exactly):
${hookExamples.hooks.map((h, i) => `${i + 1}. "${h}"`).join('\n')}

---
📝 **OUTPUT FORMAT (Valid JSON only, no markdown):**
{
  "scenario_detected": "Narrative | Knowledge | Opinion",
  "hook": "Scenario-specific hook under 5 seconds. MUST use Vietnamese slang.",
  "script": "Main content. ⚠️ IF NARRATIVE: Write as CONVERSATIONAL PARAGRAPHS (NO bullet points/lists). Use <br> for line breaks.",
  "cta": "Engagement trigger (e.g., 'Follow để xem Part 2', 'Comment MUỐN để nhận guide')",
  "analysis": {
    "hookPsychology": "Why this hook stops the scroll (1 sentence, English)",
    "viralScore": 1-10,
    "audienceInsight": "Target audience (English)",
    "viralFramework": "Scenario + Framework used (English)"
  }${includeVisuals ? `,
  "visualPrompt": "English prompt for AI video (Kling/Runway). Describe: subject, scene, camera, lighting."` : ''}
}
`.trim();

  return prompt;
}


/**
 * Estimate token count for a prompt
 */
export function estimateTokens(prompt: string): number {
  return Math.ceil(prompt.length / 4);
}
