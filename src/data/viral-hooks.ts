// 🎯 Viral Hook Library - Proven patterns for maximum engagement
// These are battle-tested frameworks used by top creators

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
  psychology: string; // Why this works
  viralPotential: number; // 1-10 score
}

export const categoryLabels: Record<HookCategory, { label: string; emoji: string; color: string }> = {
  education: { label: 'Giáo dục', emoji: '', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  sales: { label: 'Bán hàng', emoji: '', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  funny: { label: 'Hài hước', emoji: '', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  storytelling: { label: 'Kể chuyện', emoji: '', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  motivation: { label: 'Động lực', emoji: '', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
};

export const viralHooks: ViralHook[] = [
  // 🎓 EDUCATION HOOKS
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

  // 💰 SALES HOOKS
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
    id: 'social-proof',
    category: 'sales',
    title: 'The Social Proof',
    titleVi: 'Bằng Chứng Xã Hội',
    pattern: '[Number] people already did this and got [Result]. Here\'s how...',
    patternVi: '[Số người] đã làm điều này và đạt được [Kết quả]. Đây là cách...',
    example: '10.000 người đã áp dụng phương pháp này và tăng thu nhập gấp đôi. Đây là cách...',
    exampleVi: '10.000 người đã áp dụng phương pháp này và tăng thu nhập gấp đôi. Đây là cách...',
    psychology: 'Herd mentality - "Nhiều người làm thì chắc đúng"',
    viralPotential: 8,
  },

  // 😂 FUNNY HOOKS
  {
    id: 'relatable-moment',
    category: 'funny',
    title: 'The Relatable Moment',
    titleVi: 'Khoảnh Khắc Đồng Cảm',
    pattern: 'POV: You are [Relatable Situation]...',
    patternVi: 'POV: Bạn đang [Tình huống ai cũng gặp]...',
    example: 'POV: Bạn đang giả vờ làm việc khi sếp đi ngang qua...',
    exampleVi: 'POV: Bạn đang giả vờ làm việc khi sếp đi ngang qua...',
    psychology: 'Relatability = Connection. Người xem tag bạn bè ngay lập tức',
    viralPotential: 9,
  },
  {
    id: 'expectation-subversion',
    category: 'funny',
    title: 'The Plot Twist',
    titleVi: 'Cú Twist Bất Ngờ',
    pattern: 'When [Setup expectation]... but then [Unexpected outcome]...',
    patternVi: 'Khi [Tình huống bình thường]... nhưng rồi [Kết quả bất ngờ]...',
    example: 'Khi bạn tính xin sếp tăng lương... nhưng sếp lại xin bạn cho vay tiền...',
    exampleVi: 'Khi bạn tính xin sếp tăng lương... nhưng sếp lại xin bạn cho vay tiền...',
    psychology: 'Surprise = Dopamine. Não thích những thứ unexpected',
    viralPotential: 9,
  },

  // 📖 STORYTELLING HOOKS
  {
    id: 'transformation',
    category: 'storytelling',
    title: 'The Transformation',
    titleVi: 'Câu Chuyện Lột Xác',
    pattern: 'From [Bad State] to [Good State] in [Timeframe]. Here\'s my story...',
    patternVi: 'Từ [Tình trạng tệ] đến [Tình trạng tốt] trong [Thời gian]. Đây là câu chuyện của tôi...',
    example: 'Từ 90kg xuống 65kg trong 6 tháng. Đây là câu chuyện của tôi...',
    exampleVi: 'Từ 90kg xuống 65kg trong 6 tháng. Đây là câu chuyện của tôi...',
    psychology: 'Before/After = Proof. Kết quả thực tế tạo niềm tin',
    viralPotential: 9,
  },
  {
    id: 'confession',
    category: 'storytelling',
    title: 'The Confession',
    titleVi: 'Lời Thú Nhận',
    pattern: 'I\'m going to tell you something I\'ve never told anyone about [Topic]...',
    patternVi: 'Tôi sẽ kể cho bạn điều tôi chưa từng nói với ai về [Chủ đề]...',
    example: 'Tôi sẽ kể cho bạn điều tôi chưa từng nói với ai về công việc freelance của tôi...',
    exampleVi: 'Tôi sẽ kể cho bạn điều tôi chưa từng nói với ai về công việc freelance của tôi...',
    psychology: 'Intimacy + Curiosity = Must watch. Cảm giác được nghe bí mật',
    viralPotential: 8,
  },

  // 🔥 MOTIVATION HOOKS
  {
    id: 'wake-up-call',
    category: 'motivation',
    title: 'The Wake-Up Call',
    titleVi: 'Hồi Chuông Cảnh Tỉnh',
    pattern: 'If you\'re still [Bad Habit] in [Year], you\'re going to regret it...',
    patternVi: 'Nếu bạn vẫn [Thói quen xấu] trong năm [Năm], bạn sẽ hối hận...',
    example: 'Nếu bạn vẫn lười biếng trong năm 2025, bạn sẽ hối hận trong 5 năm tới...',
    exampleVi: 'Nếu bạn vẫn lười biếng trong năm 2025, bạn sẽ hối hận trong 5 năm tới...',
    psychology: 'Fear of missing out on life + Urgency = Action',
    viralPotential: 8,
  },
  {
    id: 'permission-giver',
    category: 'motivation',
    title: 'The Permission Giver',
    titleVi: 'Cho Phép Bản Thân',
    pattern: 'It\'s okay to [Thing people feel guilty about]...',
    patternVi: 'Bạn được phép [Điều mọi người cảm thấy tội lỗi]...',
    example: 'Bạn được phép nghỉ ngơi. Bạn không cần hustle 24/7 để thành công.',
    exampleVi: 'Bạn được phép nghỉ ngơi. Bạn không cần hustle 24/7 để thành công.',
    psychology: 'Validation = Relief. Mọi người cần được "cho phép"',
    viralPotential: 9,
  },
];

// Get unique categories for filtering
export const hookCategories: HookCategory[] = ['education', 'sales', 'funny', 'storytelling', 'motivation'];
