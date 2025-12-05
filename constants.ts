import { SlideContent, LayoutType } from './types';

// Helper for icons (svg strings would be too long, using emoji/chars for simplicity in this demo, or simplistic HTML)
const ICON_CPU = '🧠';
const ICON_FILM = '🎬';
const ICON_ROCKET = '🚀';
const ICON_CAMERA = '🎥';
const ICON_PUZZLE = '🧩';

export const INITIAL_SLIDES: SlideContent[] = [
  {
    id: 1,
    title: "AI × 影视：<br/>生产逻辑的再设计与生态协同",
    subtitle: "从制作实践到创作者社区，共同探索下一阶段的内容生产模式",
    body: "<div class='mt-16 text-slate-300'><p class='text-2xl text-white font-bold mb-2'>李大任</p><p class='text-lg text-slate-400'>AI影视表达工作室</p></div>",
    imageDesc: "Circuit Board Background",
    layout: LayoutType.TITLE_ONLY
  },
  {
    id: 3,
    title: "AI影视制作，从能力突破走向系统化生产",
    subtitle: "不是替代传统影视，而是重建影视工业的底层逻辑",
    leftColumn: "<div class='text-center h-full flex flex-col justify-center'><div class='text-7xl mb-6 opacity-90'>📽️</div><h3 class='text-2xl font-bold text-white mb-8'>行业趋势</h3><ul class='text-left space-y-4 text-slate-200 text-sm list-none pl-0'><li class='flex items-start gap-2'><span class='text-white/60 mt-1'>•</span><span>多模态能力持续爆发</span></li><li class='flex items-start gap-2'><span class='text-white/60 mt-1'>•</span><span>AI 从工具 → 生产力体系</span></li><li class='flex items-start gap-2'><span class='text-white/60 mt-1'>•</span><span>制作逻辑被全面重写</span></li></ul></div>",
    middleColumn: "<div class='text-center h-full flex flex-col justify-center'><div class='text-7xl mb-6 opacity-90'>🧩</div><h3 class='text-2xl font-bold text-white mb-8'>核心洞察</h3><ul class='text-left space-y-4 text-slate-200 text-sm list-none pl-0'><li class='flex items-start gap-2'><span class='text-white/60 mt-1'>•</span><span>竞争力不在模型，而在混合制片方法论</span></li><li class='flex items-start gap-2'><span class='text-white/60 mt-1'>•</span><span>全AI & 混合制片双路径</span></li><li class='flex items-start gap-2'><span class='text-white/60 mt-1'>•</span><span>技术 × 工程 × 组织的重构</span></li></ul></div>",
    rightColumn: "<div class='text-center h-full flex flex-col justify-center'><div class='text-7xl mb-6 opacity-90'>🚀</div><h3 class='text-2xl font-bold text-white mb-8'>我们的进展</h3><ul class='text-left space-y-4 text-slate-200 text-sm list-none pl-0'><li class='flex items-start gap-2'><span class='text-white/60 mt-1'>•</span><span>已跑通可规模化的 AI 制作范式</span></li><li class='flex items-start gap-2'><span class='text-white/60 mt-1'>•</span><span>持续攻克专业制作的单点难题</span></li><li class='flex items-start gap-2'><span class='text-white/60 mt-1'>•</span><span>建立跨团队协作、质量判断体系</span></li></ul></div>",
    layout: LayoutType.THREE_COLUMN
  },
  {
    id: 2,
    title: "AI服务影视不只是转换制作工具，而是转换范式",
    subtitle: "解决模型限制、重构制作组织、放大创作表达",
    leftColumn: "<div class='h-full flex flex-col relative'><div class='absolute top-0 left-0 text-7xl text-cyan-400/15 font-black select-none pointer-events-none'>01</div><div class='relative z-10'><h3 class='text-xl font-bold text-white mb-4 border-l-4 border-cyan-500 pl-4'>模型能力 (行业难题)</h3><ul class='space-y-3 text-slate-200 text-sm flex-grow list-none pl-0'><li class='flex items-start gap-2'><span class='text-cyan-400 mt-1'>▸</span><span>三维物理难题：长镜头、复杂动作、肌肉动力...</span></li><li class='flex items-start gap-2'><span class='text-cyan-400 mt-1'>▸</span><span>多镜头/场景一致性困难</span></li><li class='flex items-start gap-2'><span class='text-cyan-400 mt-1'>▸</span><span>情感戏、复杂动作作为弱项</span></li></ul><div class='mt-auto p-4 bg-slate-800/90 rounded-lg border-2 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)] text-xs text-cyan-200'><span class='text-cyan-400 font-bold'>»</span> 必须建立&ldquo;AI能做 / 必须实拍做&rdquo;的镜头拆分标准。</div></div></div>",
    middleColumn: "<div class='h-full flex flex-col relative'><div class='absolute top-0 left-0 text-7xl text-blue-400/15 font-black select-none pointer-events-none'>02</div><div class='relative z-10'><h3 class='text-xl font-bold text-white mb-4 border-l-4 border-blue-500 pl-4'>制作组织重构 (真正门槛)</h3><ul class='space-y-3 text-slate-200 text-sm flex-grow list-none pl-0'><li class='flex items-start gap-2'><span class='text-blue-400 mt-1'>▸</span><span>引入 AI 导演、AI 制片、AI DIT 等新角色</span></li><li class='flex items-start gap-2'><span class='text-blue-400 mt-1'>▸</span><span>前期美术资产 → 分镜 → 混合拍摄 → AI生成 → 后期</span></li><li class='flex items-start gap-2'><span class='text-blue-400 mt-1'>▸</span><span>标准化&ldquo;AI 场记工作流&rdquo;</span></li></ul><div class='mt-auto p-4 bg-slate-800/90 rounded-lg border-2 border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.3)] text-xs text-blue-200'><span class='text-blue-400 font-bold'>»</span> 不只是工具升级，而是团队协同体系升级。</div></div></div>",
    rightColumn: "<div class='h-full flex flex-col relative'><div class='absolute top-0 left-0 text-7xl text-purple-400/15 font-black select-none pointer-events-none'>03</div><div class='relative z-10'><h3 class='text-xl font-bold text-white mb-4 border-l-4 border-purple-500 pl-4'>混合制片价值 (核心提升)</h3><ul class='space-y-3 text-slate-200 text-sm flex-grow list-none pl-0'><li class='flex items-start gap-2'><span class='text-purple-400 mt-1'>▸</span><span>外景/替身/多角色镜头成本下降</span></li><li class='flex items-start gap-2'><span class='text-purple-400 mt-1'>▸</span><span>快速镜头验证，提高表达自由度</span></li><li class='flex items-start gap-2'><span class='text-purple-400 mt-1'>▸</span><span>保持专业质感前提下让 AI 最大化</span></li></ul><div class='mt-auto p-4 bg-slate-800/90 rounded-lg border-2 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.3)] text-xs text-purple-200'><span class='text-purple-400 font-bold'>»</span> 内部测试《扫黑风暴》等重制尝试，实战跑通。</div></div></div>",
    layout: LayoutType.THREE_COLUMN
  },
  {
    id: 4,
    title: "技术实战1：《扫黑风暴》",
    subtitle: "跑通 实拍 + AI换脸 结合的完整链路",
    imageDesc: "Video Placeholder: 扫黑风暴 Clip",
    leftColumn: "VIDEO_PLACEHOLDER", // Handled by SlideView to show placeholder
    rightColumn: "<div class='flex flex-col gap-6 justify-center h-full'><div class='flex items-start gap-4 p-4 rounded-lg bg-slate-800/40 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]'><span class='text-4xl'>🎥</span><div class='flex-1'><div class='font-bold text-cyan-300 text-lg mb-1'>多角度/光线/动态表情</div><div class='text-sm text-slate-300'>→ 效果稳定</div></div></div><div class='flex items-start gap-4 p-4 rounded-lg bg-slate-800/40 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]'><span class='text-4xl'>🧠</span><div class='flex-1'><div class='font-bold text-cyan-300 text-lg mb-1'>AI 导演 × 技术制片</div><div class='text-sm text-slate-300'>× 实拍协同</div></div></div><div class='flex items-start gap-4 p-4 rounded-lg bg-slate-800/40 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]'><span class='text-4xl'>👤</span><div class='flex-1'><div class='font-bold text-cyan-300 text-lg mb-1'>素人拍摄 → AI后期</div><div class='text-sm text-slate-300'>→ 大幅提效</div></div></div></div>",
    bottomSection: "<div class='flex justify-between items-center px-4 py-6'><div class='flex flex-col items-center gap-2 group'><div class='w-16 h-16 rounded-full bg-orange-500/20 border-2 border-orange-400/50 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(249,115,22,0.3)] group-hover:scale-110 transition-transform'>🎨</div><span class='text-sm font-bold text-white mt-1'>美术资产定义</span></div><div class='flex-1 h-0.5 bg-gradient-to-r from-orange-400/50 to-blue-400/50 mx-2 relative'><div class='absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-l-blue-400/50 border-t-4 border-t-transparent border-b-4 border-b-transparent'></div></div><div class='flex flex-col items-center gap-2 group'><div class='w-16 h-16 rounded-full bg-orange-500/20 border-2 border-orange-400/50 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(249,115,22,0.3)] group-hover:scale-110 transition-transform'>📝</div><span class='text-sm font-bold text-white mt-1'>分镜 & 拍摄计划</span></div><div class='flex-1 h-0.5 bg-gradient-to-r from-blue-400/50 to-green-400/50 mx-2 relative'><div class='absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-l-green-400/50 border-t-4 border-t-transparent border-b-4 border-b-transparent'></div></div><div class='flex flex-col items-center gap-2 group'><div class='w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-400/50 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(34,197,94,0.3)] group-hover:scale-110 transition-transform'>🟩</div><span class='text-sm font-bold text-white mt-1'>绿棚拍摄</span></div><div class='flex-1 h-0.5 bg-gradient-to-r from-green-400/50 to-blue-500/50 mx-2 relative'><div class='absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-l-blue-500/50 border-t-4 border-t-transparent border-b-4 border-b-transparent'></div></div><div class='flex flex-col items-center gap-2 group'><div class='w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-400/50 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform'>🤖</div><span class='text-sm font-bold text-white mt-1'>AI换脸</span></div><div class='flex-1 h-0.5 bg-gradient-to-r from-blue-500/50 to-purple-400/50 mx-2 relative'><div class='absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-l-purple-400/50 border-t-4 border-t-transparent border-b-4 border-b-transparent'></div></div><div class='flex flex-col items-center gap-2 group'><div class='w-16 h-16 rounded-full bg-purple-500/20 border-2 border-purple-400/50 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(168,85,247,0.3)] group-hover:scale-110 transition-transform'>🎞️</div><span class='text-sm font-bold text-white mt-1'>合成 & 调优</span></div></div>",
    layout: LayoutType.SPLIT_WITH_BOTTOM
  },
  {
    id: 7,
    title: "技术实战2：《三体》",
    subtitle: "AI实现高写实镜头的可行性验证",
    imageDesc: "Video Placeholder: Three-Body Problem Clip",
    leftColumn: "VIDEO_PLACEHOLDER",
    rightColumn: "<div class='flex flex-col gap-6 justify-center h-full'><div class='flex items-start gap-4 p-4 rounded-lg bg-slate-800/40 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]'><span class='text-4xl bg-blue-900/50 p-3 rounded-lg'>🏞️</span><div class='flex-1'><div class='font-bold text-white text-lg mb-1'>高写实外景构造</div><div class='text-sm text-slate-300'>光影真实、非风格化</div></div></div><div class='flex items-start gap-4 p-4 rounded-lg bg-slate-800/40 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]'><span class='text-4xl bg-blue-900/50 p-3 rounded-lg'>👥</span><div class='flex-1'><div class='font-bold text-white text-lg'>多角色前后景关系稳定</div></div></div><div class='flex items-start gap-4 p-4 rounded-lg bg-slate-800/40 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]'><span class='text-4xl bg-blue-900/50 p-3 rounded-lg'>📹</span><div class='flex-1'><div class='font-bold text-white text-lg'>长镜头/横摇/推进下的角色一致性</div></div></div></div>",
    bottomSection: "<div class='grid grid-cols-3 gap-6 px-4'><div class='bg-slate-800/90 p-6 rounded-xl border-2 border-orange-500/40 shadow-[0_0_20px_rgba(249,115,22,0.3)] text-center hover:scale-105 transition-transform'><div class='text-4xl mb-3 text-orange-400'>💰</div><div class='font-bold text-white text-lg'>外景成本大幅下降</div></div><div class='bg-slate-800/90 p-6 rounded-xl border-2 border-orange-500/40 shadow-[0_0_20px_rgba(249,115,22,0.3)] text-center hover:scale-105 transition-transform'><div class='text-4xl mb-3 text-orange-400'>📉</div><div class='font-bold text-white text-lg'>复杂调度下降</div></div><div class='bg-slate-800/90 p-6 rounded-xl border-2 border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.3)] text-center hover:scale-105 transition-transform'><div class='text-4xl mb-3 text-blue-400'>☑️</div><div class='font-bold text-white text-lg'>现实主义题材可用性上升</div></div></div>",
    layout: LayoutType.SPLIT_WITH_BOTTOM
  },
  {
    id: 6,
    title: "灵芽：AIGC 社区与创作者生态",
    subtitle: "从技术探索到构建生态：构建 AIGC 影视的新生产网络",
    imageDesc: "LingYa Community Interface Screenshot",
    imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop", // Placeholder for screenshot
    leftColumn: "IMAGE_PLACEHOLDER_LEFT", // Logic to render image in SlideView
    rightColumn: "<ul class='space-y-6 text-lg list-none pl-0'><li class='p-5 bg-slate-800/50 border-l-4 border-cyan-500 rounded-r shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:bg-slate-800/60 transition-colors'><span class='text-cyan-400 font-bold'>•</span> 构建下一代精品内容的行业孵化器，汇聚有创意、有内容审美、对AI热爱的个人/机构创作者</li><li class='p-5 bg-slate-800/50 border-l-4 border-blue-500 rounded-r shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:bg-slate-800/60 transition-colors'><span class='text-blue-400 font-bold'>•</span> 统一的腾讯视频大赛品牌，灵活承载落地不同品类/IP/主题大赛</li></ul>",
    layout: LayoutType.TWO_COLUMN
  },
  {
    id: 5,
    title: "我们致力于构建<br/>AI影视的下一代生产范式",
    leftColumn: "<div class='flex flex-col gap-6 h-full justify-center'><h3 class='text-2xl font-bold border-b-2 border-cyan-500/30 pb-4 mb-2'>AI影视生产范式</h3><div class='flex gap-4 items-start'><span class='text-3xl text-cyan-400 mt-1'>📷</span> <span class='text-slate-200 flex-1'>技术积累：AI换脸、一致性、3D场景构造</span></div><div class='flex gap-4 items-start'><span class='text-3xl text-cyan-400 mt-1'>⚙️</span> <span class='text-slate-200 flex-1'>团队组织：混合制片、片场流程、人员组织方式</span></div><div class='flex gap-4 items-start'><span class='text-3xl text-cyan-400 mt-1'>🔗</span> <span class='text-slate-200 flex-1'>标准化能力：可重复、可规模化的制作链路</span></div></div>",
    middleColumn: "<div class='flex items-center justify-center h-full relative'><div class='relative'><div class='absolute inset-0 w-48 h-32 border-4 border-cyan-500/30 rounded-full rotate-45 animate-pulse shadow-[0_0_40px_rgba(6,182,212,0.6)]'></div><div class='absolute inset-0 w-48 h-32 border-4 border-purple-500/30 rounded-full -rotate-45 animate-pulse shadow-[0_0_40px_rgba(168,85,247,0.6)]' style='animation-delay: 0.5s;'></div><div class='relative w-48 h-32 flex items-center justify-center'><span class='text-5xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 -rotate-45'>♾️</span></div></div></div>",
    rightColumn: "<div class='flex flex-col gap-6 h-full justify-center text-right'><h3 class='text-2xl font-bold border-b-2 border-orange-500/30 pb-4 mb-2'>AIGC创作者生态</h3><div class='flex gap-4 items-center justify-end'><span class='text-slate-200 flex-1 text-right'>稳定创作者库 (2000+ 名活跃创作者)</span> <span class='text-3xl text-orange-400'>👥</span></div><div class='flex gap-4 items-center justify-end'><span class='text-slate-200 flex-1 text-right'>分类大赛体系 (短片 / 短剧 / 动漫 / MV)</span> <span class='text-3xl text-orange-400'>🏆</span></div><div class='flex gap-4 items-center justify-end'><span class='text-slate-200 flex-1 text-right'>持续内容供给链路 (作品展示、个人主页...)</span> <span class='text-3xl text-orange-400'>☁️</span></div></div>",
    bottomSection: "<div class='text-center py-6 px-8'><p class='text-lg text-white mb-3'>AI + 影视的价值远不止降本，而在于重构内容生产的底层逻辑。</p><p class='text-sm text-slate-300'>我们诚邀更多 AIGC 超创、学界与行业伙伴加入灵芽社区，共同打造未来十年的新型内容生产方式。</p></div>",
    layout: LayoutType.THREE_COLUMN
  }
];