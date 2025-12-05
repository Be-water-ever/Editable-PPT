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
    body: "<div class='mt-12 text-slate-400'><p class='text-xl text-white font-bold'>李大任</p><p>AI影视表达工作室</p></div>",
    imageDesc: "Circuit Board Background",
    layout: LayoutType.TITLE_ONLY
  },
  {
    id: 3,
    title: "AI影视制作，从能力突破走向系统化生产",
    subtitle: "不是替代传统影视，而是重建影视工业的底层逻辑",
    leftColumn: "<div class='text-center'><div class='text-6xl mb-4 opacity-80'>📽️</div><h3 class='text-2xl font-bold text-white mb-6'>行业趋势</h3><ul class='text-left space-y-3 text-slate-300 text-sm'><li>多模态能力持续爆发</li><li>AI 从工具 → 生产力体系</li><li>制作逻辑被全面重写</li></ul></div>",
    middleColumn: "<div class='text-center'><div class='text-6xl mb-4 opacity-80'>🧩</div><h3 class='text-2xl font-bold text-white mb-6'>核心洞察</h3><ul class='text-left space-y-3 text-slate-300 text-sm'><li>竞争力不在模型，而在混合制片方法论</li><li>全AI & 混合制片双路径</li><li>技术 × 工程 × 组织的重构</li></ul></div>",
    rightColumn: "<div class='text-center'><div class='text-6xl mb-4 opacity-80'>🚀</div><h3 class='text-2xl font-bold text-white mb-6'>我们的进展</h3><ul class='text-left space-y-3 text-slate-300 text-sm'><li>已跑通可规模化的 AI 制作范式</li><li>持续攻克专业制作的单点难题</li><li>建立跨团队协作、质量判断体系</li></ul></div>",
    layout: LayoutType.THREE_COLUMN
  },
  {
    id: 2,
    title: "AI服务影视不只是转换制作工具，而是转换范式",
    subtitle: "解决模型限制、重构制作组织、放大创作表达",
    leftColumn: "<div class='h-full flex flex-col'><div class='text-4xl text-cyan-400 mb-4 opacity-20 font-black'>01</div><h3 class='text-xl font-bold text-white mb-4 border-l-2 border-cyan-500 pl-3'>模型能力 (行业难题)</h3><ul class='space-y-4 text-slate-300 text-sm flex-grow'><li>• 三维物理难题：长镜头、复杂动作、肌肉动力...</li><li>• 多镜头/场景一致性困难</li><li>• 情感戏、复杂动作作为弱项</li></ul><div class='mt-auto p-3 bg-slate-800/80 rounded border border-slate-600 text-xs text-cyan-300'>» 必须建立&ldquo;AI能做 / 必须实拍做&rdquo;的镜头拆分标准。</div></div>",
    middleColumn: "<div class='h-full flex flex-col'><div class='text-4xl text-blue-400 mb-4 opacity-20 font-black'>02</div><h3 class='text-xl font-bold text-white mb-4 border-l-2 border-blue-500 pl-3'>制作组织重构 (真正门槛)</h3><ul class='space-y-4 text-slate-300 text-sm flex-grow'><li>• 引入 AI 导演、AI 制片、AI DIT 等新角色</li><li>• 前期美术资产 → 分镜 → 混合拍摄 → AI生成 → 后期</li><li>• 标准化&ldquo;AI 场记工作流&rdquo;</li></ul><div class='mt-auto p-3 bg-slate-800/80 rounded border border-slate-600 text-xs text-blue-300'>» 不只是工具升级，而是团队协同体系升级。</div></div>",
    rightColumn: "<div class='h-full flex flex-col'><div class='text-4xl text-purple-400 mb-4 opacity-20 font-black'>03</div><h3 class='text-xl font-bold text-white mb-4 border-l-2 border-purple-500 pl-3'>混合制片价值 (核心提升)</h3><ul class='space-y-4 text-slate-300 text-sm flex-grow'><li>• 外景/替身/多角色镜头成本下降</li><li>• 快速镜头验证，提高表达自由度</li><li>• 保持专业质感前提下让 AI 最大化</li></ul><div class='mt-auto p-3 bg-slate-800/80 rounded border border-slate-600 text-xs text-purple-300'>» 内部测试《扫黑风暴》等重制尝试，实战跑通。</div></div>",
    layout: LayoutType.THREE_COLUMN
  },
  {
    id: 4,
    title: "技术实战1：《扫黑风暴》",
    subtitle: "跑通 实拍 + AI换脸 结合的完整链路",
    imageDesc: "Video Placeholder: 扫黑风暴 Clip",
    leftColumn: "VIDEO_PLACEHOLDER", // Handled by SlideView to show placeholder
    rightColumn: "<div class='flex flex-col gap-6 justify-center h-full'><div class='flex items-center gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700'><span class='text-3xl'>🎥</span><div><div class='font-bold text-cyan-300'>多角度/光线/动态表情</div><div class='text-sm text-slate-400'>→ 效果稳定</div></div></div><div class='flex items-center gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700'><span class='text-3xl'>🧠</span><div><div class='font-bold text-cyan-300'>AI 导演 × 技术制片</div><div class='text-sm text-slate-400'>× 实拍协同</div></div></div><div class='flex items-center gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700'><span class='text-3xl'>👤</span><div><div class='font-bold text-cyan-300'>素人拍摄 → AI后期</div><div class='text-sm text-slate-400'>→ 大幅提效</div></div></div></div>",
    bottomSection: "<div class='flex justify-between items-center px-8'><div class='flex flex-col items-center'><span class='text-2xl mb-2'>🎨</span><span class='text-sm font-bold'>美术资产定义</span></div><div class='text-slate-600'>➔</div><div class='flex flex-col items-center'><span class='text-2xl mb-2'>📝</span><span class='text-sm font-bold'>分镜 & 拍摄计划</span></div><div class='text-slate-600'>➔</div><div class='flex flex-col items-center'><span class='text-2xl mb-2'>🟩</span><span class='text-sm font-bold'>绿棚拍摄</span></div><div class='text-slate-600'>➔</div><div class='flex flex-col items-center'><span class='text-2xl mb-2'>🤖</span><span class='text-sm font-bold'>AI换脸</span></div><div class='text-slate-600'>➔</div><div class='flex flex-col items-center'><span class='text-2xl mb-2'>🎞️</span><span class='text-sm font-bold'>合成 & 调优</span></div></div>",
    layout: LayoutType.SPLIT_WITH_BOTTOM
  },
  {
    id: 7,
    title: "技术实战2：《三体》",
    subtitle: "AI实现高写实镜头的可行性验证",
    imageDesc: "Video Placeholder: Three-Body Problem Clip",
    leftColumn: "VIDEO_PLACEHOLDER",
    rightColumn: "<div class='flex flex-col gap-6 justify-center h-full'><div class='flex items-center gap-4'><span class='text-3xl bg-blue-900/50 p-2 rounded'>🏞️</span><div><div class='font-bold text-white'>高写实外景构造</div><div class='text-sm text-slate-400'>光影真实、非风格化</div></div></div><div class='flex items-center gap-4'><span class='text-3xl bg-blue-900/50 p-2 rounded'>👥</span><div><div class='font-bold text-white'>多角色前后景关系稳定</div></div></div><div class='flex items-center gap-4'><span class='text-3xl bg-blue-900/50 p-2 rounded'>📹</span><div><div class='font-bold text-white'>长镜头/横摇/推进下的角色一致性</div></div></div></div>",
    bottomSection: "<div class='grid grid-cols-3 gap-8 px-4'><div class='bg-slate-800/80 p-4 rounded-xl border border-slate-600 text-center'><div class='text-3xl mb-2 text-orange-400'>💰</div><div class='font-bold'>外景成本大幅下降</div></div><div class='bg-slate-800/80 p-4 rounded-xl border border-slate-600 text-center'><div class='text-3xl mb-2 text-orange-400'>📉</div><div class='font-bold'>复杂调度下降</div></div><div class='bg-slate-800/80 p-4 rounded-xl border border-slate-600 text-center'><div class='text-3xl mb-2 text-blue-400'>☑️</div><div class='font-bold'>现实主义题材可用性上升</div></div></div>",
    layout: LayoutType.SPLIT_WITH_BOTTOM
  },
  {
    id: 6,
    title: "灵芽：AIGC 社区与创作者生态",
    subtitle: "从技术探索到构建生态：构建 AIGC 影视的新生产网络",
    imageDesc: "LingYa Community Interface Screenshot",
    imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop", // Placeholder for screenshot
    leftColumn: "IMAGE_PLACEHOLDER_LEFT", // Logic to render image in SlideView
    rightColumn: "<ul class='space-y-8 text-lg'><li class='p-4 bg-slate-800/40 border-r-4 border-cyan-500 rounded-l'>• 构建下一代精品内容的行业孵化器，汇聚有创意、有内容审美、对AI热爱的个人/机构创作者</li><li class='p-4 bg-slate-800/40 border-r-4 border-blue-500 rounded-l'>• 统一的腾讯视频大赛品牌，灵活承载落地不同品类/IP/主题大赛</li></ul>",
    layout: LayoutType.TWO_COLUMN
  },
  {
    id: 5,
    title: "我们致力于构建<br/>AI影视的下一代生产范式",
    leftColumn: "<div class='flex flex-col gap-8 h-full justify-center'><h3 class='text-2xl font-bold border-b border-white/20 pb-4'>AI影视生产范式</h3><div class='flex gap-3 items-center'><span class='text-cyan-400'>📷</span> <span>技术积累：AI换脸、一致性、3D场景构造</span></div><div class='flex gap-3 items-center'><span class='text-cyan-400'>⚙️</span> <span>团队组织：混合制片、片场流程、人员组织方式</span></div><div class='flex gap-3 items-center'><span class='text-cyan-400'>🔗</span> <span>标准化能力：可重复、可规模化的制作链路</span></div></div>",
    middleColumn: "<div class='flex items-center justify-center h-full'><div class='w-48 h-32 border-4 border-cyan-500/50 rounded-[100%] rotate-45 animate-pulse shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center justify-center'><span class='text-4xl -rotate-45'>♾️</span></div></div>", // Symbolic representation of infinity loop
    rightColumn: "<div class='flex flex-col gap-8 h-full justify-center text-right'><h3 class='text-2xl font-bold border-b border-white/20 pb-4'>AIGC创作者生态</h3><div class='flex gap-3 items-center justify-end'><span>稳定创作者库 (2000+ 名活跃创作者)</span> <span class='text-orange-400'>👥</span></div><div class='flex gap-3 items-center justify-end'><span>分类大赛体系 (短片 / 短剧 / 动漫 / MV)</span> <span class='text-orange-400'>🏆</span></div><div class='flex gap-3 items-center justify-end'><span>持续内容供给链路 (作品展示、个人主页...)</span> <span class='text-orange-400'>☁️</span></div></div>",
    bottomSection: "AI + 影视的价值远不止降本，而在于重构内容生产的底层逻辑。<br/><span class='text-sm text-slate-400'>我们诚邀更多 AIGC 超创、学界与行业伙伴加入灵芽社区，共同打造未来十年的新型内容生产方式。</span>",
    layout: LayoutType.THREE_COLUMN
  }
];