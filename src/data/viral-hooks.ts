// 🎯 Viral Hook Library - 54 High-Converting Hooks for TikTok Vietnam
// Categorized by Scenario Type for Smart Selection (Token-Efficient)

/**
 * Scenario types matching the prompt detection system
 */
export type ScenarioType = 'STORY' | 'KNOWLEDGE' | 'OPINION';

/**
 * Categorized Viral Hooks Library
 * Each category contains 18 battle-tested hooks
 */
export const VIRAL_HOOKS: Record<ScenarioType, string[]> = {
  // ═══════════════════════════════════════════════════════════════
  // 📖 STORY HOOKS (Narrative/Drama/POV) - 18 hooks
  // Trigger: Personal stories, relationships, daily life drama
  // ═══════════════════════════════════════════════════════════════
  STORY: [
    // Drama/Conflict hooks
    "Toang rồi mấy bà ơi! Chuyện là thế này...",
    "Không thể tin được! Hôm nay tui đã...",
    "Cái kết đắng cho những ai tin người như tui...",
    "Bóc phốt chính bản thân mình vì cái tội...",
    "Mấy bà ơi biến căng! Tui vừa phát hiện ra...",
    "Ông nào cũng bị như tui thì giơ tay...",
    
    // POV/Relatable hooks
    "POV: Crush nhắn tin lúc 2h sáng và bạn...",
    "POV: Mẹ gọi tên đầy đủ họ tên và bạn biết...",
    "Tui kể mấy bà nghe chuyện này nè, căng lắm...",
    "Ai từng bị như tui thì comment đi...",
    "Chuyện có thật 100%! Hôm qua tui đi...",
    "Và đây là lý do tui trust issue từ đó đến giờ...",
    
    // Emotional/Suspense hooks  
    "Điều tui sắp kể sẽ khiến bạn sốc...",
    "Tui đã khóc khi biết sự thật này...",
    "Đây là câu chuyện tui chưa bao giờ kể ai...",
    "Bạn thân 10 năm và cái kết không ngờ...",
    "Sếp nói một câu khiến tui muốn nghỉ việc luôn...",
    "Crush cuối cùng cũng nhắn tin, nhưng...",
  ],

  // ═══════════════════════════════════════════════════════════════
  // 📚 KNOWLEDGE HOOKS (Tips/Facts/How-to) - 18 hooks
  // Trigger: Learning, myths, secrets, mistakes
  // ═══════════════════════════════════════════════════════════════
  KNOWLEDGE: [
    // Myth-busting hooks
    "Dừng ngay việc [Topic] lại nếu không muốn hối hận!",
    "99% người Việt đang làm sai điều này về [Topic]...",
    "Sự thật ngã ngửa về [Topic] mà không ai nói cho bạn biết.",
    "Vứt ngay cái này đi nếu bạn vẫn đang dùng!",
    "Bạn đang phí tiền vào [Topic] mà không biết...",
    "Dẹp ngay thói quen này trước khi quá muộn!",
    
    // Secret/Insider hooks
    "Mẹo này tiết kiệm cả triệu mà ít ai biết...",
    "Bí mật mà các chuyên gia [Topic] không muốn bạn biết...",
    "Tui mất 3 năm mới học được điều này về [Topic]...",
    "Top 3 sai lầm chí mạng khi [Topic]...",
    "Đây là lý do bạn vẫn thất bại với [Topic]...",
    "Hack cuộc sống: Mẹo [Topic] mà bạn ước biết sớm hơn...",
    
    // Authority/Data hooks
    "Khoa học chứng minh: [Topic] thực sự hoạt động thế này...",
    "Nghiên cứu mới nhất về [Topic] sẽ khiến bạn sốc...",
    "Chuyên gia [Topic] tiết lộ: Đây là cách đúng...",
    "3 bước đơn giản để [Topic] mà ai cũng làm được...",
    "Làm theo cách này, [Topic] sẽ dễ như ăn bánh...",
    "Nhớ 3 điều này thôi là đủ master [Topic]...",
  ],

  // ═══════════════════════════════════════════════════════════════
  // 💬 OPINION HOOKS (Review/Comparison/Hot Take) - 18 hooks
  // Trigger: Reviews, debates, strong opinions
  // ═══════════════════════════════════════════════════════════════
  OPINION: [
    // Hot take hooks
    "Phí tiền! Đừng bao giờ mua [Topic] này...",
    "Tỉnh táo lại đi! [Topic] không thần thánh như bạn nghĩ đâu.",
    "Ai khen [Topic] ngon là tui block luôn...",
    "Tranh cãi: [Topic] có thực sự đáng tiền?",
    "Phí X triệu vào [Topic] này? Tui nói thật nha...",
    "Đây mới là chân ái nè, đừng nghe lời quảng cáo...",
    
    // Comparison hooks
    "[Thing A] vs [Thing B] - Cái nào thực sự đáng tiền?",
    "Tui đã thử cả hai và đây là sự thật...",
    "Đừng mua [A] khi [B] tồn tại! Đây là lý do...",
    "So sánh thật 100%: [Topic A] hay [Topic B]?",
    "Một bên X triệu, một bên Y triệu - Chọn cái nào?",
    "Dùng thử 30 ngày và đây là verdict của tui...",
    
    // Review/Verdict hooks
    "Đánh giá thật 100% sau khi dùng [Topic]...",
    "Tui mua [Topic] và đây là những điều họ không nói...",
    "Review không sugar coat: [Topic] có đáng không?",
    "Đỉnh hay Tệ? Sự thật về [Topic] sau 1 tháng dùng...",
    "Đáng đồng tiền bát gạo hay phí tiền? [Topic] review.",
    "Kết luận cuối cùng về [Topic] - Có nên mua?",
  ],
};

/**
 * Get random hooks from a specific category
 * Uses Fisher-Yates shuffle for true randomness
 * @param category - STORY | KNOWLEDGE | OPINION
 * @param count - Number of hooks to return (default: 3)
 * @returns Array of random unique hooks
 */
export function getRandomHooks(category: ScenarioType, count = 3): string[] {
  const hooks = VIRAL_HOOKS[category];
  if (!hooks || hooks.length === 0) {
    return VIRAL_HOOKS.KNOWLEDGE.slice(0, count);
  }
  
  // Fisher-Yates shuffle for true randomness
  const shuffled = [...hooks];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Detect scenario from topic keywords
 * @param topic - User's input topic
 * @returns Detected scenario type
 */
export function detectScenarioFromTopic(topic: string): ScenarioType {
  const lowerTopic = topic.toLowerCase();
  
  // STORY signals
  const storySignals = [
    'người yêu', 'crush', 'bạn thân', 'sếp', 'mẹ', 'bố', 'gia đình',
    'hôm nay', 'hôm qua', 'về quê', 'đi làm', 'đi học',
    'bị lừa', 'bị block', 'bị chửi', 'bị đuổi',
    'tui', 'tôi đã', 'mình đã', 'chuyện là',
    'pov:', 'story:', 'kể chuyện'
  ];
  
  // OPINION signals  
  const opinionSignals = [
    'review', 'đánh giá', 'nghĩ sao', 'có nên',
    'vs', 'hay', 'tốt hơn', 'nên mua', 'nên chọn',
    'tranh cãi', 'so sánh', 'phí tiền', 'đáng tiền',
    'iphone', 'samsung', 'shopee', 'lazada'
  ];
  
  // Check for STORY
  if (storySignals.some(signal => lowerTopic.includes(signal))) {
    return 'STORY';
  }
  
  // Check for OPINION
  if (opinionSignals.some(signal => lowerTopic.includes(signal))) {
    return 'OPINION';
  }
  
  // Default to KNOWLEDGE (most common for tips/how-to content)
  return 'KNOWLEDGE';
}

/**
 * Smart Hook Selection - Detects scenario and returns relevant hooks
 * This prevents token bloat by only sending 3-5 hooks instead of 54
 * 
 * @param topic - User's input topic
 * @param vibe - User's selected vibe (for future enhancement)
 * @param count - Number of hooks to return
 * @returns Object with detected category and random hooks
 */
export function getSmartHookExamples(
  topic: string,
  vibe: string,
  count = 3
): { category: ScenarioType; hooks: string[] } {
  // Detect scenario from topic
  const category = detectScenarioFromTopic(topic);
  
  // Get random hooks from that category
  const hooks = getRandomHooks(category, count);
  
  // Replace [Topic] placeholder with actual topic (truncated if too long)
  const shortTopic = topic.length > 20 ? topic.slice(0, 20) + '...' : topic;
  const filledHooks = hooks.map(hook => 
    hook.replace(/\[Topic\]/gi, shortTopic)
         .replace(/\[Thing A\]/gi, 'Option A')
         .replace(/\[Thing B\]/gi, 'Option B')
         .replace(/\[Topic A\]/gi, 'Option A')
         .replace(/\[Topic B\]/gi, 'Option B')
         .replace(/\[A\]/gi, 'A')
         .replace(/\[B\]/gi, 'B')
  );
  
  console.log(`🎣 Hook Selection: ${category} → ${count} hooks for "${topic.slice(0, 30)}..."`);
  
  return {
    category,
    hooks: filledHooks,
  };
}


// ═══════════════════════════════════════════════════════════════
// Legacy exports for backward compatibility with Templates page
// ═══════════════════════════════════════════════════════════════

export type HookCategory = 'education' | 'sales' | 'funny' | 'storytelling' | 'motivation';

export interface ViralHook {
  id: string;
  category: HookCategory;
  title: string;
  titleVi: string;
  pattern: string;
  patternVi: string;
  example: string;
  exampleVi: string;
  psychology: string;
  viralPotential: number;
}

export const categoryLabels: Record<HookCategory, { label: string; emoji: string; color: string }> = {
  education: { label: 'Education', emoji: '📚', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  sales: { label: 'Sales', emoji: '💰', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  funny: { label: 'Funny', emoji: '😂', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  storytelling: { label: 'Storytelling', emoji: '📖', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  motivation: { label: 'Motivation', emoji: '⚡', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
};

// Legacy hook data for Templates page (subset of hooks with full metadata)
export const viralHooks: ViralHook[] = [
  {
    id: 'myth-buster',
    category: 'education',
    title: 'The Myth Buster',
    titleVi: 'Phá Vỡ Lầm Tưởng',
    pattern: 'Stop doing [Task] like this! Here is the right way...',
    patternVi: 'Đừng làm [Công việc] như này nữa! Đây mới là cách đúng...',
    example: 'Đừng ăn táo như này nữa! Đây mới là cách gọt vỏ trong 2 giây.',
    exampleVi: 'Đừng ăn táo như này nữa! Đây mới là cách gọt vỏ trong 2 giây.',
    psychology: 'Tạo cảm giác "tôi đang làm sai" khiến người xem phải xem tiếp',
    viralPotential: 9,
  },
  {
    id: 'secret-reveal',
    category: 'education',
    title: 'The Secret Reveal',
    titleVi: 'Tiết Lộ Bí Mật',
    pattern: '99% of people don\'t know this trick about [Topic]...',
    patternVi: '99% mọi người không biết mẹo này về [Chủ đề]...',
    example: '99% mọi người không biết mẹo này khi nấu cơm - cơm sẽ ngon gấp 3 lần!',
    exampleVi: '99% mọi người không biết mẹo này khi nấu cơm - cơm sẽ ngon gấp 3 lần!',
    psychology: 'FOMO - Sợ bỏ lỡ thông tin quan trọng mà người khác đều biết',
    viralPotential: 9,
  },
  {
    id: 'comparison',
    category: 'education',
    title: 'The Comparison',
    titleVi: 'So Sánh Đối Lập',
    pattern: '[Thing A] vs [Thing B] - Which one is actually better?',
    patternVi: '[Thứ A] vs [Thứ B] - Cái nào thực sự tốt hơn?',
    example: 'iPhone vs Android - Cái nào thực sự tốt hơn cho công việc?',
    exampleVi: 'iPhone vs Android - Cái nào thực sự tốt hơn cho công việc?',
    psychology: 'Polarization - Người xem muốn bảo vệ "phe" của mình trong comment',
    viralPotential: 8,
  },
  {
    id: 'problem-agitator',
    category: 'sales',
    title: 'The Problem Agitator',
    titleVi: 'Khơi Gợi Vấn Đề',
    pattern: 'If you struggle with [Pain Point], you NEED to try [Solution]...',
    patternVi: 'Nếu bạn đang gặp khó khăn với [Vấn đề], bạn CẦN thử [Giải pháp] này...',
    example: 'Nếu bạn đang gặp khó khăn với mụn, bạn CẦN thử quy trình 3 bước này.',
    exampleVi: 'Nếu bạn đang gặp khó khăn với mụn, bạn CẦN thử quy trình 3 bước này.',
    psychology: 'Đánh trúng pain point → Người xem cảm thấy được thấu hiểu',
    viralPotential: 8,
  },
  {
    id: 'urgency-creator',
    category: 'sales',
    title: 'The Urgency Creator',
    titleVi: 'Tạo Sự Khẩn Cấp',
    pattern: 'I wish I knew about [Product/Method] earlier. It saved me [Benefit]...',
    patternVi: 'Ước gì tôi biết [Sản phẩm/Phương pháp] này sớm hơn. Nó đã giúp tôi [Lợi ích]...',
    example: 'Ước gì tôi biết app này sớm hơn. Nó đã giúp tôi tiết kiệm 2 triệu/tháng.',
    exampleVi: 'Ước gì tôi biết app này sớm hơn. Nó đã giúp tôi tiết kiệm 2 triệu/tháng.',
    psychology: 'Regret aversion - Không ai muốn hối hận vì bỏ lỡ',
    viralPotential: 9,
  },
  {
    id: 'pov-hook',
    category: 'storytelling',
    title: 'The POV Hook',
    titleVi: 'POV Kể Chuyện',
    pattern: 'POV: You just discovered [Situation]...',
    patternVi: 'POV: Bạn vừa phát hiện ra [Tình huống]...',
    example: 'POV: Bạn vừa phát hiện người yêu follow 100 gái trên Instagram.',
    exampleVi: 'POV: Bạn vừa phát hiện người yêu follow 100 gái trên Instagram.',
    psychology: 'Immersion - Đặt người xem vào tình huống để tăng engagement',
    viralPotential: 9,
  },
  {
    id: 'storytime',
    category: 'storytelling',
    title: 'The Storytime',
    titleVi: 'Kể Chuyện Drama',
    pattern: 'Storytime: The day I [Shocking Event]...',
    patternVi: 'Kể chuyện: Ngày tui [Sự kiện gây sốc]...',
    example: 'Kể chuyện: Ngày tui bị crush block và cái kết không ngờ...',
    exampleVi: 'Kể chuyện: Ngày tui bị crush block và cái kết không ngờ...',
    psychology: 'Curiosity gap - Tạo sự tò mò về "cái kết"',
    viralPotential: 8,
  },
  {
    id: 'roast-hook',
    category: 'funny',
    title: 'The Roast',
    titleVi: 'Tự Roast Bản Thân',
    pattern: 'Me trying to [Task] like a normal person...',
    patternVi: 'Tui cố [Công việc] như người bình thường...',
    example: 'Tui cố nấu ăn cho crush như người bình thường... và đây là kết quả.',
    exampleVi: 'Tui cố nấu ăn cho crush như người bình thường... và đây là kết quả.',
    psychology: 'Self-deprecating humor - Relatable và dễ viral qua meme',
    viralPotential: 8,
  },
  {
    id: 'hot-take',
    category: 'motivation',
    title: 'The Hot Take',
    titleVi: 'Ý Kiến Gây Tranh Cãi',
    pattern: 'Unpopular opinion: [Controversial Statement]...',
    patternVi: 'Ý kiến gây tranh cãi: [Phát biểu gây sốc]...',
    example: 'Ý kiến gây tranh cãi: Làm việc chăm chỉ không giúp bạn giàu.',
    exampleVi: 'Ý kiến gây tranh cãi: Làm việc chăm chỉ không giúp bạn giàu.',
    psychology: 'Controversy drives engagement - Người xem muốn comment đồng ý/không đồng ý',
    viralPotential: 9,
  },
];

// Get unique categories for filtering
export const hookCategories: HookCategory[] = ['education', 'sales', 'funny', 'storytelling', 'motivation'];
