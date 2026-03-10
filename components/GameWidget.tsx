
import React, { useState } from 'react';
import { X, Trophy, AlertTriangle, TrendingUp, Users, Wallet, Target, ChevronRight, Play, Award, LogOut } from 'lucide-react';

interface GameMetrics {
  budget: number;
  morale: number;
  growth: number;
  accuracy: number;
}

interface GameEvent {
  id: string;
  title: string;
  description: string;
  options: {
    text: string;
    impact: Partial<GameMetrics>;
    result: string;
  }[];
}

const EVENTS: GameEvent[] = [
  {
    id: 'hallucination',
    title: "模型生成异常",
    description: "用户反馈模型在特定场景下产生非事实性内容（幻觉），影响了可信度。",
    options: [
      {
        text: "增加人工反馈强化学习 (RLHF)",
        impact: { growth: 10, accuracy: 20, budget: -15 },
        result: "模型准确率显著提升，但标注成本有所增加。"
      },
      {
        text: "快速上线免责声明与置信度提示",
        impact: { budget: 5, accuracy: 5, morale: -5 },
        result: "降低了合规风险，但用户体验受到一定影响。"
      }
    ]
  },
  {
    id: 'gpu_bill',
    title: "算力成本挑战",
    description: "随着用户量增长，推理成本超出预期 300%，需优化成本结构。",
    options: [
      {
        text: "引入模型蒸馏与量化技术",
        impact: { budget: 25, accuracy: -10, growth: -5 },
        result: "成功控制了成本，模型性能有轻微损耗但在可接受范围。"
      },
      {
        text: "申请追加预算，维持高性能体验",
        impact: { budget: -30, growth: 20, morale: 10 },
        result: "保证了最佳用户体验，但对后续的商业化变现提出了更高要求。"
      }
    ]
  },
  {
    id: 'competitor',
    title: "竞品发布类似功能",
    description: "主要竞品上线了同类功能，且目前处于免费推广期。",
    options: [
      {
        text: "差异化竞争，深耕垂直场景",
        impact: { growth: -10, budget: 10, accuracy: 15 },
        result: "避开了价格战，在垂直领域建立了更深的护城河。"
      },
      {
        text: "跟进补贴策略，抢占市场份额",
        impact: { budget: -35, growth: 25, morale: -10 },
        result: "保住了市场份额，但短期财务压力巨大。"
      }
    ]
  },
  {
    id: 'data_privacy',
    title: "数据合规审查",
    description: "随着监管趋严，需要对训练数据的合规性进行全面评估。",
    options: [
      {
        text: "建立严格的数据清洗与脱敏流程",
        impact: { budget: -20, morale: 10, accuracy: -5 },
        result: "通过了合规审查，建立了长期的品牌信任。"
      },
      {
        text: "更新隐私协议，明确数据使用权",
        impact: { budget: 10, growth: 5, morale: -15 },
        result: "短期规避了风险，但社区对隐私条款的变更表示担忧。"
      }
    ]
  },
  {
    id: 'prompt_injection',
    title: "提示词安全风险",
    description: "发现存在通过特定提示词绕过安全限制的风险（Jailbreak）。",
    options: [
      {
        text: "部署红队测试，全面加固护栏",
        impact: { budget: -20, accuracy: 10, morale: 5 },
        result: "安全性大幅提升，产品发布节奏略有延后。"
      },
      {
        text: "针对已知攻击模式进行规则拦截",
        impact: { accuracy: 5, growth: 5, morale: -5 },
        result: "快速解决了当前问题，但防御体系仍需系统性完善。"
      }
    ]
  },
  {
    id: 'agi_hype',
    title: "市场预期回归理性",
    description: "AI 行业热度趋于平稳，投资人更关注产品的实际落地与商业闭环。",
    options: [
      {
        text: "收缩探索性项目，聚焦核心业务",
        impact: { budget: 15, morale: -15, growth: -5 },
        result: "现金流更加健康，但部分创新项目被迫暂停。"
      },
      {
        text: "坚持长期主义，持续投入底层技术",
        impact: { budget: -25, growth: 15, morale: 15 },
        result: "保持了技术领先性，但需要更强的融资能力支撑。"
      }
    ]
  },
  {
    id: 'reorg',
    title: "组织架构调整",
    description: "为了提升研发效率，公司对产研团队进行了架构重组。",
    options: [
      {
        text: "积极配合，重新对齐业务目标",
        impact: { morale: -10, growth: 5, budget: 10 },
        result: "团队快速适应了新架构，资源协调更加顺畅。"
      },
      {
        text: "争取独立编制，保持敏捷迭代",
        impact: { morale: 10, budget: -10, growth: -5 },
        result: "保留了团队文化，但在跨部门协作上遇到了一些阻力。"
      }
    ]
  },
  {
    id: '360_review',
    title: "团队协作反馈",
    description: "研发团队反馈需求变更较为频繁，影响了开发节奏。",
    options: [
      {
        text: "优化需求评审流程，减少变更",
        impact: { morale: 15, budget: -5, growth: -5 },
        result: "研发满意度提升，交付质量更加稳定。"
      },
      {
        text: "强调敏捷迭代，适应市场变化",
        impact: { morale: -15, growth: 15, accuracy: 5 },
        result: "产品迭代速度加快，但团队工作压力较大。"
      }
    ]
  },
  {
    id: 'open_source',
    title: "开源模型生态冲击",
    description: "高性能开源模型的发布，降低了用户自建 AI 应用的门槛。",
    options: [
      {
        text: "优化服务稳定性与易用性",
        impact: { budget: -15, growth: 10, accuracy: 5 },
        result: "通过优质的工程化服务留住了企业客户。"
      },
      {
        text: "基于开源模型进行微调与适配",
        impact: { budget: 15, morale: 5, growth: -5 },
        result: "降低了研发成本，转型为应用层解决方案提供商。"
      }
    ]
  },
  {
    id: 'ceo_whim',
    title: "战略优先级调整",
    description: "管理层希望探索新的 AI 应用场景，需要调整当前迭代计划。",
    options: [
      {
        text: "快速构建 MVP 验证新场景",
        impact: { morale: -15, growth: 10, accuracy: -10 },
        result: "验证了新方向的可行性，但原计划受到一定影响。"
      },
      {
        text: "基于数据评估，建议稳步推进",
        impact: { morale: 10, budget: -5, growth: -5 },
        result: "保持了现有业务的专注度，避免了资源分散。"
      }
    ]
  },
  {
    id: 'talent_war',
    title: "核心人才保留",
    description: "行业头部公司向团队核心算法专家发出了邀请。",
    options: [
      {
        text: "提供更有竞争力的薪酬与期权",
        impact: { budget: -25, morale: 10, accuracy: 10 },
        result: "成功留住核心人才，保证了技术攻坚能力。"
      },
      {
        text: "完善人才梯队，培养内部骨干",
        impact: { morale: -5, accuracy: -15, budget: 10 },
        result: "控制了人力成本，但短期内研发进度有所放缓。"
      }
    ]
  },
  {
    id: 'user_feedback',
    title: "用户体验反馈",
    description: "用户反馈 AI 的回复语气过于生硬，缺乏亲和力。",
    options: [
      {
        text: "优化 System Prompt，调整语气风格",
        impact: { growth: 15, accuracy: -5, morale: 5 },
        result: "用户互动意愿提升，产品更具温度。"
      },
      {
        text: "维持专业严谨的回复风格",
        impact: { growth: -10, accuracy: 10, morale: -5 },
        result: "巩固了专业工具的定位，但可能流失部分C端用户。"
      }
    ]
  },
  {
    id: 'hardware_shortage',
    title: "算力资源紧缺",
    description: "受供应链影响，新一批 GPU 服务器交付延期。",
    options: [
      {
        text: "采购溢价现货，确保算力供应",
        impact: { budget: -35, growth: 15, morale: 5 },
        result: "保障了业务连续性，但增加了财务负担。"
      },
      {
        text: "优化推理调度，实施错峰限流",
        impact: { growth: -15, accuracy: 5, morale: -10 },
        result: "技术方案解决了燃眉之急，但用户体验受到影响。"
      }
    ]
  },
  {
    id: 'tech_debt',
    title: "技术债务治理",
    description: "前期快速迭代积累的技术债导致系统稳定性下降。",
    options: [
      {
        text: "暂停新需求，专项治理技术债",
        impact: { growth: -20, accuracy: 15, morale: 10 },
        result: "系统稳定性大幅提升，为后续扩展打下基础。"
      },
      {
        text: "在迭代中逐步重构核心模块",
        impact: { growth: 5, accuracy: -5, morale: -15 },
        result: "业务保持增长，但研发团队面临较大维护压力。"
      }
    ]
  },
  {
    id: 'security_breach',
    title: "数据安全风险",
    description: "安全团队监测到潜在的数据访问异常。",
    options: [
      {
        text: "立即启动应急响应，公开透明处理",
        impact: { growth: -15, morale: -5, accuracy: 5, budget: -10 },
        result: "虽然短期声誉受损，但展现了负责任的企业形象。"
      },
      {
        text: "紧急修复漏洞，加强内部监控",
        impact: { growth: 5, budget: 5, morale: -15, accuracy: -5 },
        result: "控制了事态范围，但内部安全管理机制亟待升级。"
      }
    ]
  },
  {
    id: 'viral_moment',
    title: "流量突增挑战",
    description: "KOL 推荐导致产品流量短时间内激增 10 倍。",
    options: [
      {
        text: "紧急扩容，全力承接流量",
        impact: { growth: 40, budget: -25, morale: -15 },
        result: "成功转化大量新用户，市场占有率显著提升。"
      },
      {
        text: "实施排队机制，保障核心体验",
        impact: { growth: 15, budget: 5, morale: 5 },
        result: "服务保持稳定，虽然流失了部分流量但口碑良好。"
      }
    ]
  },
  {
    id: 'acquisition',
    title: "并购意向接触",
    description: "行业巨头表达了战略投资或并购的意向。",
    options: [
      {
        text: "保持独立运营，追求长期愿景",
        impact: { morale: 20, budget: -15, growth: 10 },
        result: "团队凝聚力增强，继续在细分领域深耕。"
      },
      {
        text: "接受战略投资，获取资源支持",
        impact: { budget: 80, morale: -20, growth: -15 },
        result: "获得了充足资金，但需要在这个大厂生态中寻找新定位。"
      }
    ]
  },
  {
    id: 'internal_feud',
    title: "跨部门协作挑战",
    description: "产品与技术团队在需求优先级和实现方案上存在分歧。",
    options: [
      {
        text: "尊重技术评估，调整需求范围",
        impact: { accuracy: 15, morale: 5, growth: -10 },
        result: "技术实现更加稳健，但部分功能延期上线。"
      },
      {
        text: "坚持业务目标，推动方案落地",
        impact: { growth: 15, accuracy: -15, morale: -10 },
        result: "达成了业务指标，但需要关注团队情绪建设。"
      }
    ]
  },
  {
    id: 'model_bias',
    title: "算法公平性探讨",
    description: "社区反馈模型在处理特定群体数据时可能存在偏差。",
    options: [
      {
        text: "优化数据集分布，提升公平性",
        impact: { accuracy: 10, budget: -15, morale: 5 },
        result: "提升了模型的社会责任感与公信力。"
      },
      {
        text: "解释数据来源，强调统计学特征",
        impact: { growth: 5, budget: 5, morale: -15 },
        result: "维持了现有模型表现，但舆论风险依然存在。"
      }
    ]
  },
  {
    id: 'regulatory_crackdown',
    title: "应用商店合规",
    description: "应用商店更新了关于 AI 生成内容的审核规范。",
    options: [
      {
        text: "全面接入内容审核系统",
        impact: { budget: -20, growth: -15, accuracy: 10 },
        result: "确保了产品长期合规运营，虽然短期留存略有下降。"
      },
      {
        text: "拓展海外市场，分散风险",
        impact: { growth: 25, budget: -35, morale: 5 },
        result: "开拓了新的增长点，实现了业务全球化布局。"
      }
    ]
  },
  {
    id: 'tech_breakthrough',
    title: "技术突破机遇",
    description: "研发团队在模型架构优化上取得了重要进展。",
    options: [
      {
        text: "快速产品化，建立技术壁垒",
        impact: { growth: 35, budget: 15, accuracy: 5 },
        result: "确立了技术领先优势，市场反响热烈。"
      },
      {
        text: "申请专利保护，稳步推进",
        impact: { budget: 10, morale: 15, growth: 5 },
        result: "积累了知识产权资产，为长期竞争储备弹药。"
      }
    ]
  }
];

const pickRandomEvent = (excludeIds: Set<string>) => {
  const availableEvents = EVENTS.filter(e => !excludeIds.has(e.id));
  if (availableEvents.length === 0) {
    return EVENTS[Math.floor(Math.random() * EVENTS.length)];
  }
  return availableEvents[Math.floor(Math.random() * availableEvents.length)];
};

const GameWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [gameStatus, setGameStatus] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER' | 'VICTORY' | 'REVIEW'>('IDLE');
  const [sprint, setSprint] = useState(1);
  const [metrics, setMetrics] = useState<GameMetrics>({
    budget: 100,
    morale: 100,
    growth: 100,
    accuracy: 100
  });
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [usedEventIds, setUsedEventIds] = useState<Set<string>>(new Set());
  const [reviewGrade, setReviewGrade] = useState<string>("");
  
  // Modal state
  const [modalContent, setModalContent] = useState<{ title: string; text: string } | null>(null);

  const MAX_SPRINTS = 12;

  const startGame = () => {
    setMetrics({ budget: 100, morale: 100, growth: 100, accuracy: 100 });
    setSprint(1);
    setUsedEventIds(new Set());
    setGameStatus('PLAYING');
    const firstEvent = pickRandomEvent(new Set());
    setCurrentEvent(firstEvent);
    setUsedEventIds(new Set([firstEvent.id]));
  };

  const handleOption = (impact: Partial<GameMetrics>, result: string) => {
    const newMetrics = {
      budget: Math.max(0, metrics.budget + (impact.budget || 0)),
      morale: Math.max(0, metrics.morale + (impact.morale || 0)),
      growth: Math.max(0, metrics.growth + (impact.growth || 0)),
      accuracy: Math.max(0, metrics.accuracy + (impact.accuracy || 0)),
    };

    setMetrics(newMetrics);
    
    setModalContent({
      title: "执行结果",
      text: result
    });
  };

  const closeResultModal = () => {
    setModalContent(null);
    
    if (metrics.budget <= 0 || metrics.morale <= 0 || metrics.growth <= 0 || metrics.accuracy <= 0) {
      setGameStatus('GAMEOVER');
      return;
    }

    if (sprint % 4 === 0) {
      const avg = (metrics.budget + metrics.morale + metrics.growth + metrics.accuracy) / 4;
      if (avg > 90) setReviewGrade("S (卓越)");
      else if (avg > 75) setReviewGrade("A (优秀)");
      else if (avg > 50) setReviewGrade("B (合格)");
      else setReviewGrade("C (待改进)");
      setGameStatus('REVIEW');
      return;
    }

    nextStep();
  };

  const nextStep = () => {
    if (sprint >= MAX_SPRINTS) {
      setGameStatus('VICTORY');
      return;
    }
    setSprint(s => s + 1);
    setGameStatus('PLAYING');
    
    const nextEvent = pickRandomEvent(usedEventIds);
    setCurrentEvent(nextEvent);
    setUsedEventIds(prev => new Set([...prev, nextEvent.id]));
  };

  const getMetricColor = (val: number) => {
    if (val > 75) return 'text-emerald-600';
    if (val > 40) return 'text-amber-600';
    return 'text-rose-600';
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] select-none">
      
      {!isOpen && (
        <div className="relative group">
          <button 
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-white border-2 border-gray-900 shadow-[4px_4px_0_0_rgba(0,0,0,1)] rounded-2xl flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            <span className="text-2xl group-hover:animate-bounce">🤖</span>
            <span className="text-[9px] font-black mt-1 text-blue-600 uppercase tracking-tighter font-pixel">AI PM</span>
          </button>
        </div>
      )}

      {isOpen && (
        <div className="w-72 sm:w-80 bg-white border-2 border-gray-900 shadow-[8px_8px_0_0_rgba(0,0,0,1)] rounded-none flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-blue-600 px-3 py-2 flex justify-between items-center border-b-2 border-gray-900">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-white font-bold text-[10px] tracking-tight uppercase font-pixel">AI PM SIMULATOR</span>
            </div>
            <button 
              onClick={() => { setIsOpen(false); setGameStatus('IDLE'); }} 
              className="w-6 h-6 bg-white border-2 border-gray-900 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <X size={14} className="text-gray-900" />
            </button>
          </div>

          <div className="p-3 bg-white">
            {/* Metrics Bar */}
            <div className="grid grid-cols-4 gap-1 mb-3">
              {[
                { label: '预算', val: metrics.budget, icon: <Wallet size={10} /> },
                { label: '士气', val: metrics.morale, icon: <Users size={10} /> },
                { label: '增长', val: metrics.growth, icon: <TrendingUp size={10} /> },
                { label: '准确', val: metrics.accuracy, icon: <Target size={10} /> }
              ].map(m => (
                <div key={m.label} className="bg-gray-50 p-1.5 border border-gray-200 text-center">
                  <div className="flex items-center justify-center gap-1 text-[7px] text-gray-500 mb-0.5 uppercase font-bold tracking-tighter">
                    {m.icon} {m.label}
                  </div>
                  <div className={`text-[10px] font-black ${getMetricColor(m.val)}`}>{m.val}%</div>
                </div>
              ))}
            </div>

            <div className="h-[320px] bg-white border-2 border-gray-900 p-3 flex flex-col relative overflow-y-auto shadow-inner">
              {gameStatus === 'IDLE' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
                  <div className="w-12 h-12 bg-blue-50 border-2 border-blue-600 rounded-xl flex items-center justify-center mb-3">
                    <Play className="text-blue-600 fill-blue-600" size={24} />
                  </div>
                  <h1 className="text-lg text-gray-900 font-black mb-1 leading-tight uppercase font-pixel">AI 产品经理<br/>实战模拟</h1>
                  <p className="text-gray-500 text-[10px] mb-6 px-2 leading-relaxed font-bold italic">“完成 12 个关键迭代周期的决策挑战。”</p>
                  <div className="w-full flex flex-col gap-2">
                    <button 
                      onClick={startGame} 
                      className="w-full bg-blue-600 text-white py-2.5 border-2 border-gray-900 shadow-[4px_4px_0_0_rgba(0,0,0,1)] font-bold hover:bg-blue-700 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 group text-xs"
                    >
                      开始挑战 <ChevronRight size={16} />
                    </button>
                    <button 
                      onClick={() => setIsOpen(false)} 
                      className="w-full bg-white text-gray-900 py-2 border-2 border-gray-900 shadow-[2px_2px_0_0_rgba(0,0,0,1)] font-bold hover:bg-gray-50 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-xs"
                    >
                      退出游戏
                    </button>
                  </div>
                </div>
              )}

              {gameStatus === 'PLAYING' && currentEvent && (
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-blue-600 text-white text-[8px] font-bold px-1.5 py-0.5 border border-gray-900 uppercase">迭代 {sprint}/{MAX_SPRINTS}</span>
                    <span className="text-gray-400 text-[8px] flex items-center gap-1 font-bold"><AlertTriangle size={8} /> 风险: 中</span>
                  </div>
                  <h2 className="text-gray-900 text-sm font-black mb-1.5 leading-tight">{currentEvent.title}</h2>
                  <p className="text-gray-600 text-[10px] leading-relaxed mb-4 font-medium">{currentEvent.description}</p>
                  
                  <div className="mt-auto space-y-1.5">
                    {currentEvent.options.map((opt, i) => (
                      <button 
                        key={i}
                        onClick={() => handleOption(opt.impact, opt.result)}
                        className="w-full text-left bg-white hover:bg-gray-50 text-gray-900 p-2 text-[10px] border-2 border-gray-900 shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex justify-between items-center group font-bold"
                      >
                        <span className="flex-1 pr-2">{opt.text}</span>
                        <ChevronRight size={12} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {gameStatus === 'REVIEW' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-amber-50 border-2 border-amber-500 rounded-full flex items-center justify-center mb-3">
                    <Award className="text-amber-600" size={24} />
                  </div>
                  <h1 className="text-lg text-gray-900 font-black mb-1">季度绩效评估</h1>
                  <div className="bg-gray-50 p-3 border-2 border-gray-900 w-full mb-3 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                    <p className="text-gray-500 text-[8px] mb-0.5 uppercase font-bold tracking-wider">当前绩效等级</p>
                    <p className="text-2xl text-blue-600 font-black">{reviewGrade}</p>
                  </div>
                  <p className="text-gray-500 text-[10px] mb-6 italic font-bold">“保持当前的交付节奏，继续优化关键指标。”</p>
                  <button 
                    onClick={nextStep} 
                    className="w-full bg-blue-600 text-white py-2.5 border-2 border-gray-900 shadow-[4px_4px_0_0_rgba(0,0,0,1)] font-bold hover:bg-blue-700 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    确认 <ChevronRight size={16} />
                  </button>
                </div>
              )}

              {gameStatus === 'GAMEOVER' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-rose-50 border-2 border-rose-600 rounded-full flex items-center justify-center mb-3">
                    <LogOut className="text-rose-600" size={24} />
                  </div>
                  <h1 className="text-xl text-rose-600 font-black mb-1 uppercase tracking-tighter">项目中止</h1>
                  <p className="text-gray-500 text-[10px] mb-3 leading-relaxed font-bold">“由于关键指标未达标，项目已被叫停。”</p>
                  <div className="bg-rose-50 text-rose-700 text-[8px] font-bold px-3 py-1.5 border border-rose-200 mb-6">
                    原因: {metrics.budget <= 0 ? "预算耗尽" : metrics.morale <= 0 ? "团队士气过低" : metrics.growth <= 0 ? "业务增长停滞" : "模型可用性过低"}
                  </div>
                  <div className="w-full flex flex-col gap-2">
                    <button 
                      onClick={startGame} 
                      className="w-full bg-gray-900 text-white py-2.5 border-2 border-gray-900 shadow-[4px_4px_0_0_rgba(0,0,0,1)] font-bold hover:bg-black active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-xs"
                    >
                      复盘并重新开始
                    </button>
                    <button 
                      onClick={() => { setIsOpen(false); setGameStatus('IDLE'); }} 
                      className="w-full bg-white text-gray-900 py-2 border-2 border-gray-900 shadow-[2px_2px_0_0_rgba(0,0,0,1)] font-bold hover:bg-gray-50 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-xs"
                    >
                      退出游戏
                    </button>
                  </div>
                </div>
              )}

              {gameStatus === 'VICTORY' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-emerald-50 border-2 border-emerald-500 rounded-full flex items-center justify-center mb-3">
                    <Trophy className="text-emerald-600" size={24} />
                  </div>
                  <h1 className="text-xl text-emerald-600 font-black mb-1 uppercase tracking-tighter">项目成功发布</h1>
                  <p className="text-gray-600 text-[10px] mb-4 font-bold">你成功带领团队穿越周期，实现了业务目标。</p>
                  <div className="grid grid-cols-2 gap-2 mb-6 w-full">
                    <div className="bg-gray-50 p-2 border-2 border-gray-900 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                      <div className="text-[7px] text-gray-500 uppercase font-bold mb-0.5">最终得分</div>
                      <div className="text-base text-blue-600 font-black">{Math.floor((metrics.budget + metrics.morale + metrics.growth + metrics.accuracy) / 4)}</div>
                    </div>
                    <div className="bg-gray-50 p-2 border-2 border-gray-900 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                      <div className="text-[7px] text-gray-500 uppercase font-bold mb-0.5">职级评估</div>
                      <div className="text-base text-emerald-600 font-black">资深产品专家</div>
                    </div>
                  </div>
                  <div className="w-full flex flex-col gap-2">
                    <button 
                      onClick={startGame} 
                      className="w-full bg-blue-600 text-white py-2.5 border-2 border-gray-900 shadow-[4px_4px_0_0_rgba(0,0,0,1)] font-bold hover:bg-blue-700 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-xs"
                    >
                      开启新项目
                    </button>
                    <button 
                      onClick={() => { setIsOpen(false); setGameStatus('IDLE'); }} 
                      className="w-full bg-white text-gray-900 py-2 border-2 border-gray-900 shadow-[2px_2px_0_0_rgba(0,0,0,1)] font-bold hover:bg-gray-50 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-xs"
                    >
                      退出游戏
                    </button>
                  </div>
                </div>
              )}

              {/* Result Modal Overlay */}
              {modalContent && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-200">
                  <div className="bg-white border-2 border-gray-900 shadow-[6px_6px_0_0_rgba(0,0,0,1)] p-4 w-full max-w-[240px] text-center transform animate-in zoom-in-95 duration-200">
                    <div className="w-10 h-10 bg-blue-50 border-2 border-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="text-blue-600" size={20} />
                    </div>
                    <h3 className="text-gray-900 font-black text-xs mb-1.5 uppercase">{modalContent.title}</h3>
                    <p className="text-gray-600 text-[10px] leading-relaxed mb-4 font-bold">{modalContent.text}</p>
                    <button 
                      onClick={closeResultModal}
                      className="w-full bg-gray-900 text-white py-2 rounded-lg font-bold hover:bg-black transition-colors text-[10px] border-2 border-gray-900 shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                    >
                      继续迭代
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-100 px-3 py-1 text-[8px] text-gray-500 flex justify-between border-t-2 border-gray-900 font-bold font-mono">
            <div className="flex gap-2">
              <span>OS: PM-SIMULATOR v1.0</span>
              <button 
                onClick={() => { setIsOpen(false); setGameStatus('IDLE'); }}
                className="text-rose-600 hover:underline"
              >
                [退出]
              </button>
            </div>
            <span>USER: PRODUCT_MGR</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameWidget;
