
export type ViewState = 'LANDING' | 'BUILDER' | 'MYSCENARIOS' | 'LOGIN' | 'DASHBOARD' | 'QUIZ' | 'PRESENTATION'
export type OptionType = 'MAIN' | 'ALTERNATIVE' | 'RISKY'

// Follow-Up View Types
export type ConversationSummary = {
    optionId: string
    optionTitle: string
    summary: string
    timestamp: number
    messageCount: number
}

export type NewsArticle = {
    id: string
    title: string
    source: string
    date: string
    url: string
    phase: string
    sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'
}

export type ScenarioTrack = {
    id: string
    path: string[]
    currentProbability: number
    probabilityHistory: { date: string; value: number }[]
    lastUpdated: number
}

export type ChartData = {
    label: string
    value: number
    color?: string
}

export type DisclosureInfo = {
    title: string
    date: string
    type: string
    keyMetric: string
    impact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'
}

export type AIAnalysis = {
    summary: string
    detail: string
    easyTerm: string
    disclosure?: DisclosureInfo
    chart?: ChartData[]
    trend?: { label: string, value: string, direction: 'UP' | 'DOWN' }
}

export type Option = {
    id: string
    type: OptionType
    badge: string
    title: string
    subtitle: string
    probability: number
    desc: string
    icon: string
    parentId?: string
    aiAnalysis: AIAnalysis
}

export type Step = {
    id: string
    title: string
    question: string
    options: Option[]
}

// --- 5-STEPS: 50+ ITEMS MEGA DATASET ---

// =================================================================================================
// STEP 1: MACRO TREND (3 Options)
// =================================================================================================
export const STEP1_OPTIONS: Option[] = [
    {
        id: 'ai_supercycle',
        type: 'MAIN',
        badge: '시대적 흐름',
        title: 'AI 슈퍼사이클',
        subtitle: 'The AI Supercycle',
        probability: 90,
        desc: '전 세계가 AI 인프라 구축 경쟁에 돌입했습니다. 데이터센터와 서버 투자가 폭발하는 대호황기입니다.',
        icon: 'public',
        aiAnalysis: {
            summary: '향후 5년간 데이터센터 투자 연평균 30% 성장. 엔비디아 중심의 생태계가 공고합니다.',
            detail: '빅테크 기업들의 CAPEX(설비투자)가 줄어들지 않고 있습니다. AI 학습을 넘어 추론 시장까지 확대되며 반도체 수요가 끊이지 않습니다.',
            easyTerm: '💡 슈퍼사이클: 몇 년 동안 물건이 없어서 못 파는 엄청난 호황',
            trend: { label: '시장 규모', value: '+35% YoY', direction: 'UP' },
            chart: [{ label: 'AI', value: 80, color: '#3b82f6' }, { label: 'Cloud', value: 60, color: '#64748b' }]
        },
    },
    {
        id: 'edge_computing',
        type: 'ALTERNATIVE',
        badge: '개인화 혁명',
        title: '온디바이스 AI',
        subtitle: 'On-Device AI',
        probability: 65,
        desc: '클라우드는 느리고 비쌉니다. 내 폰과 PC에서 직접 AI가 돌아가는 세상이 옵니다.',
        icon: 'devices',
        aiAnalysis: {
            summary: '2026년 신규 스마트폰의 85%가 NPU를 탑재할 전망입니다. 하드웨어 교체 주기가 도래했습니다.',
            detail: '보안과 비용 문제로 인해 서버 AI의 부하를 엣지 기기로 분산시키려는 움직임이 뚜렷합니다. 애플, 퀄컴이 주도합니다.',
            easyTerm: '💡 온디바이스: 인터넷 없이 내 기기에서 바로 AI가 작동하는 것',
            trend: { label: 'AI 탑재율', value: '48%', direction: 'UP' },
            chart: [{ label: 'Mobile', value: 90, color: '#f59e0b' }, { label: 'PC', value: 45, color: '#64748b' }]
        },
    },
    {
        id: 'geopolitics',
        type: 'RISKY',
        badge: '공급망 재편',
        title: '기술 패권 전쟁',
        subtitle: 'Tech Cold War',
        probability: 40,
        desc: '효율보다 안보가 중요합니다. 미국과 중국의 블록화로 공급망이 완전히 쪼개집니다.',
        icon: 'security',
        aiAnalysis: {
            summary: '반도체는 이제 전략 물자입니다. 미국 본토 생산(Foundry)과 중국의 레거시(Legacy) 자립이 충돌합니다.',
            detail: '보조금 정책과 관세 장벽이 기업의 이익을 좌우합니다. 정치적 줄타기를 잘하는 기업만이 살아남습니다.',
            easyTerm: '💡 블록화: 내 편끼리만 뭉치고 남을 배제하는 것',
            trend: { label: '무역 제재', value: 'MAX', direction: 'UP' }
        },
    }
]

// =================================================================================================
// STEP 2: KEY SECTOR (Expanded: 9 Options)
// =================================================================================================
export const STEP2_OPTIONS: Option[] = [
    // --- FROM: AI SUPERCYCLE ---
    {
        id: 'memory_sector',
        parentId: 'ai_supercycle',
        type: 'MAIN',
        badge: '병목 해결',
        title: 'HBM & 차세대 메모리',
        subtitle: 'Memory Sector',
        probability: 95,
        desc: 'AI 칩의 속도를 맞춰줄 수 있는 유일한 솔루션, HBM이 없으면 AI도 없습니다.',
        icon: 'memory',
        aiAnalysis: {
            summary: 'D램 업체들의 이익이 폭증합니다. HBM3E, HBM4로 이어지는 기술 로드맵이 핵심.',
            detail: '일반 D램 대비 5배 비싼 가격에도 주문이 밀려있습니다.',
            easyTerm: '💡 HBM: D램을 아파트처럼 높게 쌓아서 데이터 고속도로를 뚫어주는 것'
        }
    },
    {
        id: 'logic_sector',
        parentId: 'ai_supercycle',
        type: 'ALTERNATIVE',
        badge: '두뇌',
        title: 'AI 가속기 (GPU/ASIC)',
        subtitle: 'Compute Sector',
        probability: 85,
        desc: '실제 연산을 담당하는 AI 칩셋. 엔비디아 GPU와 빅테크의 자체 칩(ASIC) 경쟁.',
        icon: 'developer_board',
        aiAnalysis: {
            summary: '시장 규모가 가장 큽니다. 엔비디아 독주 속에 구글, 아마존의 독립 시도가 거셉니다.',
            detail: '특정 목적에 맞는 NPU/ASIC 시장이 매년 40%씩 성장하고 있습니다.',
            easyTerm: '💡 ASIC: 특정 작업만 엄청 잘하게 맞춤 제작한 칩'
        }
    },
    {
        id: 'cooling_power',
        parentId: 'ai_supercycle',
        type: 'ALTERNATIVE',
        badge: '인프라',
        title: '전력 및 냉각',
        subtitle: 'Power & Cooling',
        probability: 80,
        desc: '데이터센터는 전기 먹는 하마입니다. 열을 식히고 전기를 공급하는 기업이 필수.',
        icon: 'thunderstorm',
        aiAnalysis: {
            summary: '전력 부족이 AI 성장의 최대 걸림돌입니다. 변압기와 액침 냉각이 뜹니다.',
            detail: 'PUE(전력효율지수) 규제로 인해 공랭식에서 수랭/액침식으로 전환 중입니다.',
            easyTerm: '💡 액침냉각: 서버를 특수 기름에 담가서 식히는 기술'
        }
    },

    // --- FROM: ON-DEVICE AI ---
    {
        id: 'npu_ip',
        parentId: 'edge_computing',
        type: 'MAIN',
        badge: '설계 자산',
        title: 'IP & 디자인하우스',
        subtitle: 'Design IP',
        probability: 85,
        desc: '다양한 기기에 맞는 AI 칩을 그리기 위한 밑그림(설계도)을 파는 기업들.',
        icon: 'architecture',
        aiAnalysis: {
            summary: 'ARM 아키텍처와 RISC-V 수요 급증. 팹리스들의 필수 파트너.',
            detail: '직접 칩을 만들지 않아 재고 위험 없이 로열티 수익을 챙기는 꿀 비즈니스.',
            easyTerm: '💡 IP기업: 반도체 설계도 원본을 빌려주고 저작권료 받는 회사'
        }
    },
    {
        id: 'low_power_mem',
        parentId: 'edge_computing',
        type: 'ALTERNATIVE',
        badge: '저전력',
        title: 'LPDDR & PIM',
        subtitle: 'Low Power Memory',
        probability: 75,
        desc: '배터리로 돌아가는 기기는 전력을 적게 쓰는 메모리가 생명입니다.',
        icon: 'battery_saver',
        aiAnalysis: {
            summary: '모바일 및 노트북용 고성능 저전력 메모리(LPDDR5X) 수요 폭발.',
            detail: '메모리 내부에서 연산까지 해주는 PIM 기술도 상용화 단계입니다.',
            easyTerm: '💡 LPDDR: 전기를 아주 조금만 먹는 모바일용 D램'
        }
    },
    {
        id: 'on_device_sw',
        parentId: 'edge_computing',
        type: 'RISKY',
        badge: '소프트웨어',
        title: '경량화 모델 & OS',
        subtitle: 'sLLM / OS',
        probability: 60,
        desc: '하드웨어가 좋아도 결국 AI를 돌리는 건 OS와 소프트웨어입니다.',
        icon: 'terminal',
        aiAnalysis: {
            summary: '안드로이드, iOS의 AI 통합 경쟁. 온디바이스 최적화 LLM 기술이 핵심.',
            detail: '기기 제조사(OEM)가 아닌 플랫폼 기업이 주도권을 가져갈 수도 있습니다.',
            easyTerm: '💡 sLLM: 성능은 유지하되 크기를 확 줄인 미니 AI 모델'
        }
    },

    // --- FROM: GEOPOLITICS ---
    {
        id: 'foundry_usa',
        parentId: 'geopolitics',
        type: 'MAIN',
        badge: '미국 생산',
        title: '파운드리 (USA)',
        subtitle: 'US Manufacturing',
        probability: 70,
        desc: '미국 땅에서 칩을 만들어야 합니다. "Made in USA" 칩 제조사.',
        icon: 'factory',
        aiAnalysis: {
            summary: '칩스법(Chips Act) 보조금을 받는 인텔과 TSMC 애리조나 공장이 핵심.',
            detail: '수율 잡는 것이 과제이나, 미국 정부의 전폭적인 지원을 받습니다.',
            easyTerm: '💡 파운드리: 반도체를 위탁 생산해주는 공장'
        }
    },
    {
        id: 'legacy_china',
        parentId: 'geopolitics',
        type: 'RISKY',
        badge: '중국 자립',
        title: '레거시 반도체',
        subtitle: 'Legacy Logic',
        probability: 50,
        desc: '최첨단은 막혔지만, 구형(Legacy) 칩 시장은 중국이 싹슬이하려 합니다.',
        icon: 'domain_disabled',
        aiAnalysis: {
            summary: '전기차, 가전제품에 들어가는 필수 칩 시장에서 중국 점유율 급상승.',
            detail: '가격 경쟁력으로 무장한 중국 팹리스와 파운드리가 시장을 교란할 수 있습니다.',
            easyTerm: '💡 레거시공정: 최신 기술은 아니지만 가전, 차에 꼭 필요한 범용 기술'
        }
    },
    {
        id: 'sovereign_ai',
        parentId: 'geopolitics',
        type: 'ALTERNATIVE',
        badge: '국가 안보',
        title: '소버린(Sovereign) AI',
        subtitle: 'National AI',
        probability: 65,
        desc: '각 나라가 미국의 AI에 종속되지 않기 위해 자체 AI 데이터센터를 짓습니다.',
        icon: 'flag',
        aiAnalysis: {
            summary: '중동, 유럽, 아시아 각국 정부 주도의 AI 인프라 프로젝트.',
            detail: '데이터 주권을 지키기 위한 정부 예산이 투입되는 B2G 시장입니다.',
            easyTerm: '💡 소버린AI: 우리 국민 데이터는 우리 AI로 지키겠다는 기술 독립'
        }
    }
]

// =================================================================================================
// STEP 3: DOMINANT PLAYER (Expanded: 13 Options)
// =================================================================================================
export const STEP3_OPTIONS: Option[] = [
    // --- MEMORY ---
    {
        id: 'sk_hynix',
        parentId: 'memory_sector',
        type: 'MAIN',
        badge: 'HBM 제왕',
        title: 'SK하이닉스',
        subtitle: 'The King',
        probability: 93,
        desc: '엔비디아 파트너십이 굳건합니다. 당분간 HBM 시장의 절대 강자.',
        icon: 'emoji_events',
        aiAnalysis: {
            summary: 'MR-MUF 패키징 기술 격차로 경쟁사 진입을 허용하지 않고 있습니다.',
            detail: '이익률 40% 육박. 메모리 역사상 최고의 전성기.',
            easyTerm: '💡 MR-MUF: 칩 사이를 특수 물질로 채워 열을 잘 빼는 하이닉스만의 기술',
            trend: { label: '영업이익률', value: '38%', direction: 'UP' }
        }
    },
    {
        id: 'samsung_elec',
        parentId: 'memory_sector',
        type: 'ALTERNATIVE',
        badge: '절치부심',
        title: '삼성전자',
        subtitle: 'Giant Awakens',
        probability: 55,
        desc: 'HBM 실기(失機)를 만회하기 위해 전사적 역량을 집중하고 있습니다.',
        icon: 'restart_alt',
        aiAnalysis: {
            summary: 'HBM4 턴키 수주에 사활을 걸었습니다. PBR 1배 미만 저평가 매력.',
            detail: '레거시 D램에서의 현금 창출력(Cash Cow)은 여전히 압도적 1위.',
            easyTerm: '💡 PBR 1배 미만: 회사 가치가 가진 재산보다도 싸게 평가받는 상태'
        }
    },

    // --- LOGIC ---
    {
        id: 'nvidia',
        parentId: 'logic_sector',
        type: 'MAIN',
        badge: '생태계 포식자',
        title: '엔비디아',
        subtitle: 'NVDA',
        probability: 96,
        desc: 'AI 칩 시장 점유율 90%. CUDA 소프트웨어 해자는 더욱 깊어졌습니다.',
        icon: 'hub',
        aiAnalysis: {
            summary: 'Blackwell 칩 출시로 ASP(평균판매단가)가 또 상승했습니다.',
            detail: '단순 칩 회사가 아닌 AI 슈퍼컴퓨터 플랫폼 회사로 진화 중.',
            easyTerm: '💡 CUDA: 엔비디아 칩만 쓰게 만드는 마법의 소프트웨어 도구'
        }
    },
    {
        id: 'broadcom',
        parentId: 'logic_sector',
        type: 'ALTERNATIVE',
        badge: '숨은 강자',
        title: '브로드컴',
        subtitle: 'AVGO',
        probability: 82,
        desc: '구글, 메타의 AI 맞춤형 칩(ASIC)을 대신 설계해주는 1등 기업.',
        icon: 'router',
        aiAnalysis: {
            summary: '네트워킹 칩과 AI ASIC 매출이 동시에 폭발 중.',
            detail: '엔비디아 독점을 싫어하는 빅테크들의 피난처.',
            easyTerm: '💡 커스텀 칩: 기성복(GPU) 대신 맞춤 정장(ASIC)을 맞춰주는 재단사'
        }
    },

    // --- COOLING ---
    {
        id: 'vertiv',
        parentId: 'cooling_power',
        type: 'MAIN',
        badge: '열 관리 1위',
        title: '버티브',
        subtitle: 'VRT',
        probability: 88,
        desc: '데이터센터 냉각 솔루션 글로벌 대장주. 엔비디아 레퍼런스 파트너.',
        icon: 'ac_unit',
        aiAnalysis: {
            summary: '액체 냉각 시장 개화의 최대 수혜주.',
            detail: '수주 잔고가 계속 늘어나며 주가 리레이팅 지속.',
            easyTerm: '💡 리레이팅: 기업의 가치를 시장에서 다시 높게 평가해주는 것'
        }
    },
    {
        id: 'ls_electric',
        parentId: 'cooling_power',
        type: 'ALTERNATIVE',
        badge: '전력망',
        title: 'LS ELECTRIC',
        subtitle: 'K-Power',
        probability: 72,
        desc: '데이터센터가는 길목에 있는 변압기와 배전반을 만듭니다.',
        icon: 'bolt',
        aiAnalysis: {
            summary: '미국 초고압 변압기 쇼티지(부족) 낙수 효과.',
            detail: 'AI 데이터센터 전력 설비 수주가 급증하고 있습니다.',
            easyTerm: '💡 쇼티지: 물건이 너무 부족한 품귀 현상'
        }
    },

    // --- NPU IP (Edge) ---
    {
        id: 'arm_holdings',
        parentId: 'npu_ip',
        type: 'MAIN',
        badge: '설계의 뿌리',
        title: 'ARM',
        subtitle: 'ARM',
        probability: 90,
        desc: '전 세계 스마트폰 99%가 ARM 설계도 기반입니다. AI로 로열티 인상 중.',
        icon: 'account_tree',
        aiAnalysis: {
            summary: 'v9 아키텍처 전환으로 수취하는 로열티가 2배 증가.',
            detail: '모바일을 넘어 데이터센터와 PC까지 영역 확장 중.',
            easyTerm: '💡 로열티: 칩 하나 만들 때마다 꼬박꼬박 받는 저작권료'
        }
    },
    {
        id: 'qualcomm',
        parentId: 'npu_ip',
        type: 'ALTERNATIVE',
        badge: 'AI PC',
        title: '퀄컴',
        subtitle: 'QCOM',
        probability: 78,
        desc: '스냅드래곤으로 모바일 제왕. 이제 윈도우 PC 시장까지 넘봅니다.',
        icon: 'smartphone',
        aiAnalysis: {
            summary: '온디바이스 AI 성능이 경쟁사 대비 우위.',
            detail: '차량용 반도체 매출도 빠르게 성장하며 포트폴리오 다변화 성공.',
            easyTerm: '💡 스냅드래곤: 안드로이드 폰의 두뇌 역할을 하는 칩'
        }
    },

    // --- LPDDR (Edge) ---
    {
        id: 'micron_tech',
        parentId: 'low_power_mem',
        type: 'ALTERNATIVE',
        badge: '미국 메모리',
        title: '마이크론',
        subtitle: 'MU',
        probability: 65,
        desc: '미국 유일의 메모리 기업. LPDDR5X 기술력이 상당히 앞서 있습니다.',
        icon: 'memory_alt',
        aiAnalysis: {
            summary: 'HBM에서는 뒤처졌지만 모바일 메모리는 강점 보유.',
            detail: '미국 정부 지원금을 등에 업고 설비 투자 확대.',
            easyTerm: '💡 3위 기업: 1, 2등 싸움 사이에서 실속을 챙기는 전략'
        }
    },

    // --- USA FOUNDRY ---
    {
        id: 'intel_foundry',
        parentId: 'foundry_usa',
        type: 'RISKY',
        badge: '미국의 자존심',
        title: '인텔',
        subtitle: 'INTC',
        probability: 40,
        desc: '과거의 영광을 되찾으려 파운드리에 올인. 미국 정부가 밀어줍니다.',
        icon: 'precision_manufacturing',
        aiAnalysis: {
            summary: '1.8나노 공정 성공 여부가 생존을 결정.',
            detail: '적자가 심하지만 "대마불사(Too Big to Fail)" 논리가 작용할 수도.',
            easyTerm: '💡 대마불사: 너무 큰 기업은 망하게 두지 않는다는 믿음'
        }
    },
    {
        id: 'tsmc',
        parentId: 'foundry_usa',
        type: 'MAIN',
        badge: '절대 1위',
        title: 'TSMC',
        subtitle: 'TSM',
        probability: 95,
        desc: '대만 기업이지만 미국 공장을 지으며 지정학적 리스크를 헷지 중.',
        icon: 'language',
        aiAnalysis: {
            summary: '모든 AI 칩은 TSMC를 통해서만 세상에 나옵니다.',
            detail: '패키징(CoWoS) 생산 능력이 곧 AI 시장의 성장 속도입니다.',
            easyTerm: '💡 헷지: 위험을 분산해서 막는 보험 같은 전략'
        }
    },

    // --- LEGACY CHINA ---
    {
        id: 'smic',
        parentId: 'legacy_china',
        type: 'RISKY',
        badge: '중국 대장',
        title: 'SMIC',
        subtitle: '981.HK',
        probability: 45,
        desc: '중국 반도체 굴기의 선봉장. 정부의 무제한 지원을 받습니다.',
        icon: 'stars',
        aiAnalysis: {
            summary: '7나노 공정 자체 개발 성공 등 끈질긴 생명력.',
            detail: '미국 제재에도 불구하고 중국 내수 시장만으로도 생존 가능.',
            easyTerm: '💡 반도체 굴기: 반도체 산업을 일으켜 세우려는 중국의 야심'
        }
    },

    // --- SOVEREIGN AI ---
    {
        id: 'naver_cloud',
        parentId: 'sovereign_ai',
        type: 'MAIN',
        badge: '한국 AI',
        title: '네이버',
        subtitle: 'NAVER',
        probability: 60,
        desc: '사우디 등 중동 지역에 "소버린 AI"를 수출하는 성과를 냈습니다.',
        icon: 'cloud_circle',
        aiAnalysis: {
            summary: '자체 거대언어모델(HyperCLOVA X)을 보유한 몇 안 되는 기업.',
            detail: '커머스와 웹툰의 부진을 AI B2B 수출로 만회해야 합니다.',
            easyTerm: '💡 B2B: 기업이나 정부에게 물건을 파는 비즈니스'
        }
    }
]

// =================================================================================================
// STEP 4: VALUE CHAIN (Expanded: 15 Options)
// =================================================================================================
export const STEP4_OPTIONS: Option[] = [
    // --- SK HYNIX CHAIN ---
    {
        id: 'hanmi_semi_eq',
        parentId: 'sk_hynix',
        type: 'MAIN',
        badge: '필수 장비',
        title: '한미반도체',
        subtitle: 'Bonding',
        probability: 92,
        desc: 'TC본더 세계 1위. 마이크론 공급 계약으로 고객사 다변화 성공.',
        icon: 'precision_manufacturing',
        aiAnalysis: {
            summary: 'HBM 적층 단수가 높아질수록 본더 수요는 기하급수적 증가.',
            detail: '영업이익률 40%대의 독보적 장비 회사.',
            easyTerm: '💡 독점: 나 아니면 아무도 못 만드는 기술'
        }
    },
    {
        id: 'esti_eq',
        parentId: 'sk_hynix',
        type: 'ALTERNATIVE',
        badge: '후공정',
        title: '에스티아이',
        subtitle: 'Reflow',
        probability: 75,
        desc: 'HBM 칩을 붙일 때 열을 가해주는 "리플로우" 장비 강자.',
        icon: 'whatshot',
        aiAnalysis: {
            summary: 'SK하이닉스 핵심 협력사. HBM 수율 향상에 기여.',
            detail: '전통적인 반도체 약품 공급 장치(CCSS)도 안정적 매출.',
            easyTerm: '💡 리플로우: 납땜을 녹여서 부품을 기판에 딱 붙이는 오븐'
        }
    },

    // --- SAMSUNG CHAIN ---
    {
        id: 'hana_micron',
        parentId: 'samsung_elec',
        type: 'MAIN',
        badge: 'OSAT',
        title: '하나마이크론',
        subtitle: 'Packaging',
        probability: 65,
        desc: '삼성전자의 패키징 외주 물량을 받아내는 낙수효과 기대.',
        icon: 'inventory_2',
        aiAnalysis: {
            summary: '삼성전자가 HBM에 집중하면 레거시 패키징은 외주로 돕니다.',
            detail: '베트남 공장 가동률 상승이 주가 반등의 열쇠.',
            easyTerm: '💡 외주(OSAT): 대기업이 바빠서 맡기는 포장 전문 하청'
        }
    },
    {
        id: 'soulbrain',
        parentId: 'samsung_elec',
        type: 'ALTERNATIVE',
        badge: '소재',
        title: '솔브레인',
        subtitle: 'Materials',
        probability: 70,
        desc: '감산 종료! 공장이 돌아가면 화학 소재가 가장 먼저 팔립니다.',
        icon: 'science',
        aiAnalysis: {
            summary: '반도체 식각액 및 세정액 국산화 선두 기업.',
            detail: 'GAA 등 신공정 도입 시 고순도 소재 수요 증가.',
            easyTerm: '💡 식각: 화학 약품으로 웨이퍼 깎아내는 공정'
        }
    },

    // --- NVIDIA CHAIN ---
    {
        id: 'tsmc_value',
        parentId: 'nvidia',
        type: 'MAIN',
        badge: '파운드리',
        title: 'TSMC 밸류체인',
        subtitle: 'CoWoS Eco',
        probability: 95,
        desc: '대만 기업들이지만 엔비디아 칩 생산의 숨은 공신들.',
        icon: 'handshake',
        aiAnalysis: {
            summary: '패키징 기판, 테스트 소켓 등 대만 현지 소부장이 초호황.',
            detail: '국내 기업 중에서는 리노공업(테스트 소켓)이 관련주.',
            easyTerm: '💡 밸류체인: 제품 하나가 만들어지기 위해 연결된 모든 협력사들'
        }
    },
    {
        id: 'glass_substrate',
        parentId: 'nvidia',
        type: 'RISKY',
        badge: '게임체인저',
        title: '유리기판',
        subtitle: 'Glass Core',
        probability: 45,
        desc: '플라스틱 기판은 이제 한계. 꿈의 기판인 유리가 온다.',
        icon: 'grid_on',
        aiAnalysis: {
            summary: '앱솔릭스(SKC), 삼성전기가 개발 총력전.',
            detail: '아직 양산 전이지만 성공 시 패키징의 패러다임을 바꿉니다.',
            easyTerm: '💡 유리기판: 칩 받침대를 유리로 만들어서 더 미세하게 회로를 그리는 기술'
        }
    },

    // --- VERTIV CHAIN ---
    {
        id: 'sub_immersion',
        parentId: 'vertiv',
        type: 'MAIN',
        badge: '액침냉각',
        title: '액침 냉각유',
        subtitle: 'Coolant',
        probability: 70,
        desc: '서버를 풍덩 담글 특수 기름(Coolant)을 만드는 정유사.',
        icon: 'water_drop',
        aiAnalysis: {
            summary: 'SK이노베이션(엔무브), GS칼텍스가 개발 중.',
            detail: '데이터센터 열 관리는 이제 공기가 아니라 액체로 합니다.',
            easyTerm: '💡 쿨런트: 전기가 통하지 않는 특수한 냉각 기름'
        }
    },

    // --- ARM/IP CHAIN ---
    {
        id: 'design_house',
        parentId: 'arm_holdings',
        type: 'MAIN',
        badge: '디자인하우스',
        title: '디자인하우스',
        subtitle: 'DSP',
        probability: 80,
        desc: 'ARM 설계도를 바탕으로 칩을 실제 생산 가능하게 최적화해주는 가교.',
        icon: 'brush',
        aiAnalysis: {
            summary: '에이디테크놀로지, 가온칩스 등 삼성/TSMC 파트너사.',
            detail: '팹리스가 늘어날수록 일감이 넘쳐납니다.',
            easyTerm: '💡 디자인하우스: 건축가(팹리스)의 도면을 보고 시공(파운드리) 도면으로 바꿔주는 곳'
        }
    },
    {
        id: 'open_edge',
        parentId: 'arm_holdings',
        type: 'ALTERNATIVE',
        badge: '한국 IP',
        title: '오픈엣지테크놀로지',
        subtitle: 'Korean IP',
        probability: 60,
        desc: 'NPU와 메모리 사이 데이터를 빠르게 전달하는 IP 전문.',
        icon: 'speed',
        aiAnalysis: {
            summary: '온디바이스 AI 칩에는 저전력/고효율 IP가 필수.',
            detail: '라이선스 매출이 늘어나며 적자 탈출 시도 중.',
            easyTerm: '💡 IP라이선스: 기술 특허를 빌려주고 받는 돈'
        }
    },

    // --- LS ELECTRIC CHAIN ---
    {
        id: 'copper_wire',
        parentId: 'ls_electric',
        type: 'MAIN',
        badge: '구리',
        title: '구리/전선',
        subtitle: 'Copper',
        probability: 85,
        desc: '전력망을 깔려면 전선이 필요하고, 전선은 구리로 만듭니다.',
        icon: 'cable',
        aiAnalysis: {
            summary: 'LS전선, 풍산(구리 소재) 수혜.',
            detail: 'AI가 부른 전력난이 구리 가격 슈퍼사이클을 자극합니다.',
            easyTerm: '💡 닥터 코퍼: 경기를 미리 알려주는 구리 박사님'
        }
    },

    // --- INTEL CHAIN ---
    {
        id: 'eu_equip',
        parentId: 'intel_foundry',
        type: 'MAIN',
        badge: '슈퍼 을',
        title: 'ASML',
        subtitle: 'EUV',
        probability: 95,
        desc: '인텔이든 삼성이든 TSMC든, ASML 장비 없이는 아무것도 못 합니다.',
        icon: 'scanner',
        aiAnalysis: {
            summary: 'EUV 노광 장비 독점 기업.',
            detail: '미세 공정 경쟁이 치열해질수록 ASML은 웃습니다.',
            easyTerm: '💡 노광장비: 반도체 웨이퍼에 빛으로 회로를 그려주는 사진기'
        }
    },

    // --- NAVER CHAIN ---
    {
        id: 'ai_service',
        parentId: 'naver_cloud',
        type: 'ALTERNATIVE',
        badge: '서비스',
        title: '폴라리스오피스',
        subtitle: 'AI App',
        probability: 55,
        desc: '네이버 하이퍼클로바X를 활용해 오피스 문서 AI 기능을 팝니다.',
        icon: 'description',
        aiAnalysis: {
            summary: 'AI가 실제로 돈을 버는(Monetization) 소프트웨어 예시.',
            detail: '테마주 성격이 강하므로 실적 확인이 필수.',
            easyTerm: '💡 테마주: 유행 따라 주가가 급등락하는 종목'
        }
    },
    {
        id: 'security_sw',
        parentId: 'sovereign_ai',
        type: 'MAIN',
        badge: '보안',
        title: '샌즈랩/이글루',
        subtitle: 'Cyber Sec',
        probability: 60,
        desc: 'AI가 발전할수록 해킹 위협도 커집니다. AI 보안 관제.',
        icon: 'lock',
        aiAnalysis: {
            summary: '국가 주도 AI 프로젝트에는 보안솔루션이 패키지로 들어갑니다.',
            detail: '딥페이크 탐지 기술 등으로 영역 확장.',
            easyTerm: '💡 관제: 24시간 해킹 공격을 감시하는 것'
        }
    }
]

// =================================================================================================
// STEP 5: FINAL PORTFOLIO (Expanded: 15+ Options)
// =================================================================================================
export const STEP5_OPTIONS: Option[] = [
    // --- VIA HANMI SEMI ---
    {
        id: 'stock_hanmi',
        parentId: 'hanmi_semi_eq',
        type: 'MAIN',
        badge: 'TOP PICK',
        title: '한미반도체',
        subtitle: '042700.KS',
        probability: 92,
        desc: 'HBM 본더 독점적 지위. 조정 시마다 모아가야 할 1순위 종목.',
        icon: 'trending_up',
        aiAnalysis: {
            summary: '2년치 수주 잔고 확보. 실적 가시성이 매우 높음.',
            detail: '목표주가 괴리율이 여전히 큼. 자사주 소각 등 주주환원 우수.',
            easyTerm: '💡 Top Pick: 애널리스트가 뽑은 1등 추천주'
        }
    },
    // --- VIA ESTI ---
    {
        id: 'stock_sti',
        parentId: 'esti_eq',
        type: 'ALTERNATIVE',
        badge: '저평가',
        title: '에스티아이',
        subtitle: '039440.KQ',
        probability: 78,
        desc: '리플로우 장비 경쟁력 대비 시가총액이 저렴합니다.',
        icon: 'savings',
        aiAnalysis: {
            summary: 'PER 10배 수준의 밸류에이션 매력.',
            detail: '마이크론 향 매출 비중 확대 중.',
            easyTerm: '💡 PER: 주가를 순이익으로 나눈 것 (낮을수록 저평가 이지만 함정도 있음)'
        }
    },
    // --- VIA HANA MICRON ---
    {
        id: 'stock_hana',
        parentId: 'hana_micron',
        type: 'MAIN',
        badge: '외주 대장',
        title: '하나마이크론',
        subtitle: '067310.KQ',
        probability: 70,
        desc: '비메모리/메모리 패키징을 아우르는 국내 1위 OSAT.',
        icon: 'factory',
        aiAnalysis: {
            summary: '삼성전자 설비 임대 논의 등 협력 강화.',
            detail: '전환사채(CB) 오버행 이슈는 리스크 요인.',
            easyTerm: '💡 오버행: 언제든 시장에 쏟아질 수 있는 잠재적 매도 물량'
        }
    },
    // --- VIA SOULBRAIN ---
    {
        id: 'stock_soul',
        parentId: 'soulbrain',
        type: 'ALTERNATIVE',
        badge: '안정성',
        title: '솔브레인',
        subtitle: '357780.KQ',
        probability: 75,
        desc: '반도체 공장이 돌면 무조건 돈을 버는 안정적 비즈니스.',
        icon: 'balance',
        aiAnalysis: {
            summary: '재무구조 탄탄하고 현금 많음.',
            detail: '폭발적 성장은 없지만 하방 경직성이 강함 (잘 안 떨어짐).',
            easyTerm: '💡 하방경직성: 바닥이 단단해서 주가가 잘 안 빠지는 성질'
        }
    },
    // --- VIA GLASS SUB ---
    {
        id: 'stock_skc',
        parentId: 'glass_substrate',
        type: 'RISKY',
        badge: '한방',
        title: 'SKC',
        subtitle: '011790.KS',
        probability: 55,
        desc: '유리기판 성공 시 제2의 에코프로가 될 잠재력.',
        icon: 'rocket',
        aiAnalysis: {
            summary: '자회사 앱솔릭스 가치가 주가에 반영되기 시작.',
            detail: '화학 업황 부진을 신사업으로 얼마나 상쇄하느냐가 관건.',
            easyTerm: '💡 텐배거: 10배 오를 주식 (꿈의 수익률)'
        }
    },
    // --- VIA DESIGN HOUSE ---
    {
        id: 'stock_gaon',
        parentId: 'design_house',
        type: 'MAIN',
        badge: '성장성',
        title: '가온칩스',
        subtitle: '393500.KQ',
        probability: 82,
        desc: '삼성 파운드리 디자인하우스 중 기술력 1위 평가.',
        icon: 'moving',
        aiAnalysis: {
            summary: '일본 프리퍼드 네트웍스(PFN) 2나노 수주 등 해외 성과 가시화.',
            detail: '인력 확보가 곧 매출로 직결되는 구조.',
            easyTerm: '💡 수주: 일감을 따내는 것'
        }
    },
    // --- VIA OPEN EDGE ---
    {
        id: 'stock_openedge',
        parentId: 'open_edge',
        type: 'RISKY',
        badge: '흑자전환',
        title: '오픈엣지',
        subtitle: '394280.KQ',
        probability: 65,
        desc: '한국에서 보기 드문 순수 IP 기업. 적자 늪 탈출 임박.',
        icon: 'trending_flat',
        aiAnalysis: {
            summary: 'CXL 메모리 컨트롤러 IP 등 차세대 기술 보유.',
            detail: '유상증자 리스크 등 자금 사정은 체크 필요.',
            easyTerm: '💡 흑자전환: 돈을 까먹다가 드디어 벌기 시작하는 시점 (주가 급등 포인트)'
        }
    },
    // --- VIA LS ELECTRIC ---
    {
        id: 'stock_ls',
        parentId: 'copper_wire',
        type: 'MAIN',
        badge: '전력 대장',
        title: 'LS ELECTRIC',
        subtitle: '010120.KS',
        probability: 88,
        desc: '미국 배전반 수주 잭팟. AI 전력난의 확실한 해결사.',
        icon: 'bolt',
        aiAnalysis: {
            summary: '데이터센터향 매출 비중이 급격히 늘고 있음.',
            detail: '변압기(HD현대일렉트릭)와 함께 전력기기 슈퍼사이클 주도.',
            easyTerm: '💡 슈퍼사이클: 10년 만에 온 대호황'
        }
    },
    // --- VIA TSMC VALUE ---
    {
        id: 'stock_rino',
        parentId: 'tsmc_value',
        type: 'MAIN',
        badge: '알짜',
        title: '리노공업',
        subtitle: '058470.KQ',
        probability: 85,
        desc: '영업이익률 40%의 괴물. 누가 이기든 테스트 핀은 씁니다.',
        icon: 'diamond',
        aiAnalysis: {
            summary: '온디바이스 AI 출시로 테스트 소켓 수요 증가.',
            detail: '무차입 경영, 높은 배당 성향 등 재무가 너무 좋음.',
            easyTerm: '💡 무차입경영: 빚이 하나도 없이 장사한다는 뜻'
        }
    },
    // --- GENERIC ETF FALLBACK ---
    {
        id: 'etf_global',
        parentId: 'ai_supercycle',
        type: 'MAIN',
        badge: '종합',
        title: 'TIGER 미국필반',
        subtitle: 'ETF',
        probability: 98,
        desc: '엔비디아, 브로드컴, AMD, TSMC를 한번에 삽니다.',
        icon: 'pie_chart',
        aiAnalysis: {
            summary: 'SOXX 지수 추종. 개별 종목 고민할 필요가 없습니다.',
            detail: '수수료 최저, 연금 계좌에서 투자 가능.',
            easyTerm: '💡 필반: 필라델피아 반도체 지수 (반도체 시장 전체)'
        }
    },
    {
        id: 'etf_korea',
        parentId: 'memory_sector',
        type: 'ALTERNATIVE',
        badge: '국내 종합',
        title: 'KODEX 반도체',
        subtitle: 'ETF',
        probability: 90,
        desc: '삼성전자와 하이닉스 비중이 70% 이상입니다.',
        icon: 'pie_chart_outlined',
        aiAnalysis: {
            summary: '메모리 사이클에 배팅하고 싶다면 가장 쉬운 선택.',
            detail: '장비주들도 소량 포함되어 있어 분산 효과.',
            easyTerm: '💡 분산투자: 계란을 한 바구니에 담지 않는 것'
        }
    }
]

// MERGE INTO STEPS
export const ALL_STEPS: Step[] = [
    {
        id: 'step1',
        title: 'STEP 01. MACRO TREND',
        question: 'Q1. 미래 3년을 좌우할 거대한 물결은 무엇입니까?',
        options: STEP1_OPTIONS,
    },
    {
        id: 'step2',
        title: 'STEP 02. KEY SECTOR',
        question: 'Q2. 그 물결 속에서 가장 유망한 산업군은?',
        options: STEP2_OPTIONS,
    },
    {
        id: 'step3',
        title: 'STEP 03. DOMINANT PLAYER',
        question: 'Q3. 해당 섹터를 장악한 1등/주도 기업은?',
        options: STEP3_OPTIONS
    },
    {
        id: 'step4',
        title: 'STEP 04. VALUE CHAIN',
        question: 'Q4. 1등 기업과 함께 성장할 핵심 파트너는?',
        options: STEP4_OPTIONS
    },
    {
        id: 'step5',
        title: 'STEP 05. PORTFOLIO',
        question: 'Q5. 최종적으로 어떤 종목을 매수하시겠습니까?',
        options: STEP5_OPTIONS
    }
]
