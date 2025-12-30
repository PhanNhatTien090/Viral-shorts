import { promptRegistry } from './registry';

/**
 * Task Prompts - Define WHAT to generate
 * 
 * These specify the output format and requirements.
 * Separated from style/system for reusability.
 */

// ═══════════════════════════════════════════════════════════════
// Generate Short Video Script (Core task)
// ═══════════════════════════════════════════════════════════════
promptRegistry.register('task:generate_script_v1', {
  content: `📋 TASK: Tạo script video ngắn VIRAL cho TikTok/Reels

⚠️ QUY TẮC BẮT BUỘC:

1. **KHÔNG GENERIC:** 
   - ❌ SAI: "Ăn uống lành mạnh", "Cải thiện kỹ năng", "Tập thể dục đều đặn"
   - ✅ ĐÚNG: "Ăn 2 quả trứng trước 8h sáng", "Ngừng spam Valhein jungle", "Chạy bộ 5km lúc 6h sáng"
   - Luôn cho VÍ DỤ CỤ THỂ, số liệu thật, hành động rõ ràng

2. **PHẢI VIẾT ĐỦ DÀI:**
   - Viết đủ content theo LENGTH CONSTRAINT ở trên
   - KHÔNG viết bullet points ngắn cho video dài
   - Script phải viết như ĐANG NÓI, không phải gạch đầu dòng

3. **FORMAT OUTPUT:**
   - hook: Câu mở đầu shocking (dưới 5 giây)
   - script: Nội dung CHÍNH. Viết thành câu hoàn chỉnh, dùng "\\n" để xuống dòng. KHÔNG dùng markdown (*) hay bullet points.
   - cta: Kêu gọi hành động cuối video

4. **ANALYSIS:**
   - hookPsychology: Tại sao hook này hiệu quả (max 15 từ)
   - viralScore: Điểm 1-10 
   - audienceInsight: Đối tượng cụ thể
   - viralFramework: Framework đã dùng

📝 VÍ DỤ SCRIPT TỐT (60s):
"Bạn biết tại sao ăn trái cây buổi sáng lại khác hoàn toàn buổi tối không?
Buổi sáng, cơ thể bạn đang cần năng lượng nhanh. Đường fructose trong trái cây được hấp thu ngay lập tức, giúp bạn tỉnh táo.
Nhưng buổi tối? Cơ thể không cần năng lượng nữa. Đường đó sẽ chuyển thành mỡ bụng.
Nên từ giờ, ăn trái cây trước 2h chiều thôi nhé!"`,
  metadata: {
    version: 'GENERATE_SCRIPT_V1',
    category: 'task',
    description: 'Generate viral short video script',
    tokenEstimate: 350,
    createdAt: '2024-12-29',
  },
});

// ═══════════════════════════════════════════════════════════════
// Generate with Visual Prompt (Extended task)
// ═══════════════════════════════════════════════════════════════
promptRegistry.register('task:generate_script_visual_v1', {
  content: `TASK: Tạo script video ngắn viral + Visual Prompt

OUTPUT FORMAT:
1. HOOK (0-3s): Câu mở đầu gây chú ý, trigger cảm xúc
2. SCRIPT (3-20s): 3-4 bullet points, mỗi cái max 15 từ
3. CTA: Kêu gọi tương tác (follow/comment/share)
4. ANALYSIS:
   - hookPsychology: Tại sao hook này work (max 15 từ)
   - viralScore: Điểm 1-10
   - audienceInsight: Đối tượng cụ thể
   - viralFramework: Framework đã dùng
5. VISUAL PROMPT (English): 
   Describe scene for AI video tools (Kling/Runway/Luma).
   Include: subject, environment, camera movement, lighting, mood, colors.`,
  metadata: {
    version: 'GENERATE_SCRIPT_VISUAL_V1',
    category: 'task',
    description: 'Generate script with AI video prompt',
    tokenEstimate: 130,
    createdAt: '2024-12-29',
  },
});

// ═══════════════════════════════════════════════════════════════
// Rewrite/Polish Script (Future feature)
// ═══════════════════════════════════════════════════════════════
promptRegistry.register('task:rewrite_script_v1', {
  content: `TASK: Cải thiện script có sẵn

INPUT: Script gốc từ user
OUTPUT: Script được polish với:
- Hook mạnh hơn
- Ngôn ngữ tự nhiên hơn  
- Flow tốt hơn
- Giữ nguyên ý chính`,
  metadata: {
    version: 'REWRITE_SCRIPT_V1',
    category: 'task',
    description: 'Polish/improve existing script',
    tokenEstimate: 50,
    createdAt: '2024-12-29',
  },
});

// ═══════════════════════════════════════════════════════════════
// Generate Hook Only (Quick feature)
// ═══════════════════════════════════════════════════════════════
promptRegistry.register('task:generate_hooks_v1', {
  content: `TASK: Tạo 5 hook variations cho chủ đề

OUTPUT: Array of 5 hooks, mỗi hook dùng framework khác:
1. Negative Hook (cảnh báo/hậu quả)
2. Curiosity Gap (hé lộ bí mật)
3. Social Proof (số liệu thống kê)
4. Polarization (chia đôi ý kiến)
5. Transformation (before/after)`,
  metadata: {
    version: 'GENERATE_HOOKS_V1',
    category: 'task',
    description: 'Generate 5 hook variations',
    tokenEstimate: 60,
    createdAt: '2024-12-29',
  },
});

/**
 * Get task prompt
 */
export function getTaskPrompt(
  task: 'generate' | 'generate_visual' | 'rewrite' | 'hooks' = 'generate'
): string {
  const mapping: Record<string, string> = {
    'generate': 'task:generate_script_v1',
    'generate_visual': 'task:generate_script_visual_v1',
    'rewrite': 'task:rewrite_script_v1',
    'hooks': 'task:generate_hooks_v1',
  };
  
  return promptRegistry.getContent(mapping[task]);
}
