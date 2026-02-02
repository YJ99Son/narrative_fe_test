
export type ScenarioOption = {
    id: string
    name: string
    indexName: string
    indexValue: number
    change: number
    description: string
    children?: ScenarioOption[]
}

export const DEPTH_STEPS = ['MACRO', 'SECTOR', 'THEME', 'Stock (Anchor)', 'VALUE CHAIN (Suppliers)']

export const SCENARIO_DATA: ScenarioOption[] = [
    {
        id: 'macro_ai', name: 'AI 슈퍼사이클', indexName: 'NASDAQ 100', indexValue: 18542, change: 1.2, description: 'AI 주도 강세장 지속',
        children: [
            {
                id: 'sector_semi', name: '반도체 / HBM', indexName: 'SOX', indexValue: 4820, change: 2.5, description: '메모리 슈퍼사이클 진입',
                children: [
                    {
                        id: 'theme_hbm', name: 'HBM 밸류체인', indexName: 'Semi IDX', indexValue: 3200, change: 1.8, description: 'SK하이닉스 중심 생태계',
                        children: [
                            {
                                id: 'stock_sk', name: 'SK하이닉스', indexName: 'Price', indexValue: 138500, change: 2.8, description: 'HBM 시장 1위 지배력',
                                children: [
                                    { id: 'vc_sk_1', name: '한미반도체', indexName: 'Price', indexValue: 62000, change: 4.2, description: 'TC 본딩 장비 (1차 밴더)' },
                                    { id: 'vc_sk_2', name: 'ISC', indexName: 'Price', indexValue: 84000, change: 1.5, description: '테스트 소켓' },
                                    { id: 'vc_sk_3', name: '에스티아이', indexName: 'Price', indexValue: 28000, change: 2.1, description: '리플로우 장비' },
                                    { id: 'vc_sk_4', name: '오로스테크놀로지', indexName: 'Price', indexValue: 21000, change: 0.5, description: '오버레이 계측' },
                                    { id: 'vc_sk_5', name: '테크윙', indexName: 'Price', indexValue: 15000, change: 3.1, description: '핸들러 장비' }
                                ]
                            },
                            {
                                id: 'stock_ss', name: '삼성전자', indexName: 'Price', indexValue: 74200, change: 0.2, description: 'HBM 추격 본격화',
                                children: [
                                    { id: 'vc_ss_1', name: '솔브레인', indexName: 'Price', indexValue: 240000, change: 0.8, description: '식각액/세정액' },
                                    { id: 'vc_ss_2', name: '동진쎄미켐', indexName: 'Price', indexValue: 34000, change: 1.2, description: 'EUV PR' }
                                ]
                            }
                        ]
                    },
                    {
                        id: 'theme_ondevice', name: '온디바이스 AI', indexName: 'AI Device', indexValue: 150, change: 3.2, description: '모바일/PC AI 침투',
                        children: [
                            {
                                id: 'stock_jeju', name: '제주반도체', indexName: 'Price', indexValue: 18000, change: 5.4, description: 'LP-DDR 메모리',
                                children: [
                                    { id: 'vc_jeju_1', name: '오픈엣지', indexName: 'Price', indexValue: 22000, change: 2.1, description: 'IP 설계 자산' }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                id: 'sector_infra', name: '전력 / 인프라', indexName: 'XLU', indexValue: 68.2, change: -0.8, description: '데이터센터 전력난 수혜',
                children: [
                    {
                        id: 'theme_trans', name: '변압기 슈퍼사이클', indexName: 'Electric', indexValue: 340, change: 5.2, description: '북미 교체 수요 급증',
                        children: [
                            {
                                id: 'stock_hd', name: 'HD현대일렉트릭', indexName: 'Price', indexValue: 120000, change: 6.5, description: '수주 잔고 최고치 갱신',
                                children: [
                                    { id: 'vc_hd_1', name: '제룡전기', indexName: 'Price', indexValue: 24000, change: 3.2, description: '소형 변압기' },
                                    { id: 'vc_hd_2', name: '효성중공업', indexName: 'Price', indexValue: 180000, change: 1.5, description: '중전기기 경쟁력' },
                                    { id: 'vc_hd_3', name: 'LS ELECTRIC', indexName: 'Price', indexValue: 78000, change: 2.4, description: '배전반/송전' }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'macro_rate', name: '금리 인하', indexName: 'US 10Y', indexValue: 3.8, change: -2.1, description: '유동성 확대 및 성장주',
        children: [
            {
                id: 'sector_bio', name: '바이오 / 헬스케어', indexName: 'XLV', indexValue: 145, change: 1.1, description: '금리 인하 최대 수혜',
                children: [
                    {
                        id: 'theme_platform', name: '신약 플랫폼', indexName: 'Bio Tech', indexValue: 3400, change: 2.4, description: '기술 수출(L/O) 기대감',
                        children: [
                            {
                                id: 'stock_alt', name: '알테오젠', indexName: 'Price', indexValue: 180000, change: 5.1, description: 'SC 제형 변경 기술 독점',
                                children: [
                                    { id: 'vc_alt_1', name: '머크(MRK)', indexName: 'Price', indexValue: 120, change: 0.5, description: '주요 파트너사' },
                                    { id: 'vc_alt_2', name: '삼성바이오로직스', indexName: 'Price', indexValue: 820000, change: 0.2, description: '잠재적 CMO' }
                                ]
                            },
                            {
                                id: 'stock_lego', name: '레고켐바이오', indexName: 'Price', indexValue: 55000, change: 2.8, description: 'ADC 링커 플랫폼',
                                children: [
                                    { id: 'vc_lego_1', name: '오리온', indexName: 'Price', indexValue: 110000, change: -1.2, description: '최대주주 등극' }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
]
