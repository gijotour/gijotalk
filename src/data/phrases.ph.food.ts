import { Phrase } from '../types';

/**
 * 필리핀 음식 사전.
 *
 * ── 왜 회화집에 음식 이름을 넣는가
 *   메뉴판 앞에서 막히는 건 "말을 못 해서" 가 아니라 "이게 뭔지 몰라서" 입니다.
 *   Dinuguan 이 돼지 선지라는 걸 모르고 시켰다가 못 먹고 남기는 일,
 *   Kare-kare 에 땅콩이 들어간 걸 모르고 알레르기가 나는 일이 실제로 생깁니다.
 *   사진 번역(OCR)은 서버가 필요해 정적 배포에서는 꺼져 있으므로, 자주 나오는
 *   요리만이라도 오프라인 사전으로 들고 있는 편이 확실합니다.
 *
 * ── 쓰는 법
 *   · 메뉴에서 본 이름을 그대로 검색 (Sinigang, 시니강)
 *   · 한국어로도 찾아집니다 ("선지", "족발", "빙수", "땅콩")
 *   · 원문을 크게 띄워 종업원에게 보여주면 주문이 됩니다
 *
 * ── 팁에 꼭 적은 것
 *   알레르기(땅콩·새우젓·조개), 호불호가 갈리는 것(선지·발룻), 매운 정도.
 *   맛 설명보다 이쪽이 여행에서 훨씬 값집니다.
 *
 * ⚠️ 한글 발음과 설명은 지역·가게마다 조금씩 다릅니다. 현지 가이드에게 한 번
 *    확인받으면 더 좋습니다.
 */
export const PH_FOOD_PHRASES: Phrase[] = [
  // ==========================================
  // 대표 요리 — 관광객이 가장 먼저 만나는 것들
  // ==========================================
  {
    id: 'ph-fud-01',
    countryId: 'ph',
    category: '음식',
    original: 'Lechon',
    translation: '레촌 — 통돼지 바비큐',
    pronunciation: '[레촌]',
    toneGuide: '필리핀 잔치 음식의 상징',
    usageTip:
      '숯불에 통째로 돌려 구운 돼지. 껍질이 바삭한 부위(껍데기)가 별미입니다. 세부 레촌이 가장 유명하고, 보통 kg 단위로 팝니다.',
  },
  {
    id: 'ph-fud-02',
    countryId: 'ph',
    category: '음식',
    original: 'Crispy Pata',
    translation: '크리스피 빠따 — 돼지 족발 튀김',
    pronunciation: '[크리스피 빠따]',
    toneGuide: '술안주 · 단체 메뉴',
    usageTip:
      '족발을 삶았다가 통째로 튀깁니다. 겉은 과자처럼 바삭하고 속은 부드럽습니다. 양이 많아 3~4명이 나눠 먹기 좋습니다. 간장·식초 소스에 찍어 먹습니다.',
  },
  {
    id: 'ph-fud-03',
    countryId: 'ph',
    category: '음식',
    original: 'Kaldereta',
    translation: '칼데레타 — 토마토 소고기 스튜',
    pronunciation: '[칼데레타]',
    toneGuide: '한국인 입맛에 잘 맞음',
    usageTip:
      '토마토 소스에 소고기·감자·당근을 넣고 푹 끓입니다. 매운맛은 거의 없고 갈비찜과 비슷한 느낌이라 아이도 잘 먹습니다. 염소고기(kambing)로 만드는 집도 있으니 확인하세요.',
  },
  {
    id: 'ph-fud-04',
    countryId: 'ph',
    category: '음식',
    original: 'Dinuguan',
    translation: '디누구안 — 돼지 선지 스튜',
    pronunciation: '[디누구안]',
    toneGuide: '⚠️ 호불호가 갈립니다',
    usageTip:
      '돼지 피(선지)와 내장을 식초·고추와 끓인 검은색 스튜. 순대국 좋아하시면 잘 맞습니다. 모르고 시키면 색 때문에 놀라니 미리 아세요. 흰 떡(puto)과 함께 나옵니다.',
  },
  {
    id: 'ph-fud-05',
    countryId: 'ph',
    category: '음식',
    original: 'Sinigang',
    translation: '시니강 — 타마린드 신맛 국물',
    pronunciation: '[시니강]',
    toneGuide: '필리핀 국민 국물',
    usageTip:
      '타마린드로 신맛을 낸 맑은 국. 김치찌개처럼 매운 게 아니라 새콤합니다. 돼지(baboy)·새우(hipon)·생선(isda) 중에 고릅니다. 더울 때 해장으로 좋습니다.',
  },
  {
    id: 'ph-fud-06',
    countryId: 'ph',
    category: '음식',
    original: 'Bulalo',
    translation: '불랄로 — 소 사골 국물',
    pronunciation: '[불랄로]',
    toneGuide: '따가이따이 명물',
    usageTip:
      '소 다리뼈를 오래 끓인 맑은 곰탕. 뼛속 골수를 빨아 먹습니다. 간이 거의 안 되어 있어 액젓(patis)이나 소금을 곁들입니다. 서늘한 따가이따이에서 특히 인기입니다.',
  },
  {
    id: 'ph-fud-07',
    countryId: 'ph',
    category: '음식',
    original: 'Adobo',
    translation: '아도보 — 간장 식초 조림',
    pronunciation: '[아도보]',
    toneGuide: '실패 확률이 가장 낮은 메뉴',
    usageTip:
      '간장·식초·마늘·후추로 조린 요리. 닭(manok)이나 돼지(baboy)로 만듭니다. 짭짤새콤해서 밥과 잘 맞습니다. 무엇을 시킬지 모르겠으면 이걸 시키면 됩니다.',
  },
  {
    id: 'ph-fud-08',
    countryId: 'ph',
    category: '음식',
    original: 'Sisig',
    translation: '시식 — 다진 돼지머리 철판구이',
    pronunciation: '[시식]',
    toneGuide: '맥주 안주 1순위',
    usageTip:
      '돼지머리·귀를 잘게 다져 철판에 지글지글 내옵니다. 위에 계란을 얹기도 합니다. 매콤새콤하고 식감이 좋아 한국인에게 인기가 많습니다.',
  },
  {
    id: 'ph-fud-09',
    countryId: 'ph',
    category: '음식',
    original: 'Chicken Inasal',
    translation: '치킨 이나살 — 숯불 닭구이',
    pronunciation: '[치킨 이나살]',
    toneGuide: '아이 동반 가족에게 무난',
    usageTip:
      '레몬그라스·식초에 재워 숯불에 구운 닭. 매운맛이 없어 아이들이 잘 먹습니다. 마늘밥(garlic rice)과 함께 시키면 한 끼가 완성됩니다.',
  },
  {
    id: 'ph-fud-10',
    countryId: 'ph',
    category: '음식',
    original: 'Kare-kare',
    translation: '카레카레 — 땅콩 소스 스튜',
    pronunciation: '[카레카레]',
    toneGuide: '⚠️ 땅콩 알레르기 주의',
    usageTip:
      '이름과 달리 카레가 아닙니다. 땅콩 소스에 소꼬리·야채를 넣은 걸쭉한 스튜. 땅콩 알레르기가 있으면 절대 피하세요. 새우젓(bagoong)을 곁들여 간을 맞춥니다.',
  },

  // ==========================================
  // 국수 · 밥 · 곁들임
  // ==========================================
  {
    id: 'ph-fud-11',
    countryId: 'ph',
    category: '음식',
    original: 'Pancit',
    translation: '판싯 — 필리핀식 볶음국수',
    pronunciation: '[판싯]',
    toneGuide: '생일상 단골',
    usageTip:
      '잡채와 비슷한 볶음국수. Canton(굵은 면)·Bihon(가는 쌀국수)으로 나뉘고 섞은 것도 있습니다. 맵지 않아 아이도 먹습니다.',
  },
  {
    id: 'ph-fud-12',
    countryId: 'ph',
    category: '음식',
    original: 'Lumpia',
    translation: '룸피아 — 필리핀식 춘권',
    pronunciation: '[룸피아]',
    toneGuide: '아이들이 제일 잘 먹는 것',
    usageTip:
      '얇게 튀긴 스프링롤. Shanghai 는 다진 고기를 넣은 작은 튀김, Sariwa 는 튀기지 않은 생춘권입니다. 단맛 소스에 찍어 먹습니다.',
  },
  {
    id: 'ph-fud-13',
    countryId: 'ph',
    category: '음식',
    original: 'Tapsilog',
    translation: '탑실록 — 소고기+계란+마늘밥 한 접시',
    pronunciation: '[탑실록]',
    toneGuide: '아침 메뉴',
    usageTip:
      'TAPa(절인 소고기)+SIlog(마늘밥+계란). 앞글자만 바꾸면 다른 메뉴가 됩니다 — Longsilog(소시지), Tocilog(단짠 돼지), Bangsilog(생선).',
  },
  {
    id: 'ph-fud-14',
    countryId: 'ph',
    category: '음식',
    original: 'Tinola',
    translation: '티놀라 — 생강 닭국',
    pronunciation: '[티놀라]',
    toneGuide: '속이 편한 국물',
    usageTip:
      '생강을 넣고 끓인 맑은 닭국. 파파야나 차요테가 들어갑니다. 삼계탕처럼 담백해서 배탈이나 감기 기운이 있을 때 좋습니다.',
  },
  {
    id: 'ph-fud-15',
    countryId: 'ph',
    category: '음식',
    original: 'Pinakbet',
    translation: '피나벳 — 새우젓 야채 볶음',
    pronunciation: '[피나벳]',
    toneGuide: '⚠️ 새우 알레르기 주의',
    usageTip:
      '가지·오크라·여주 등을 새우젓(bagoong)으로 볶습니다. 여주(ampalaya)가 들어가 쌉싸름합니다. 새우 알레르기가 있으면 피하세요.',
  },
  {
    id: 'ph-fud-16',
    countryId: 'ph',
    category: '음식',
    original: 'Bicol Express',
    translation: '비콜 익스프레스 — 코코넛 매운 돼지',
    pronunciation: '[비콜 익스프레스]',
    toneGuide: '🌶 필리핀에서 드물게 매움',
    usageTip:
      '코코넛 밀크에 청양고추급 고추를 넣고 돼지고기를 조립니다. 필리핀 음식 중 가장 매운 축에 듭니다. 매운 걸 못 드시면 피하세요.',
  },

  // ==========================================
  // 후식 · 음료 · 도전 메뉴
  // ==========================================
  {
    id: 'ph-fud-17',
    countryId: 'ph',
    category: '음식',
    original: 'Halo-halo',
    translation: '할로할로 — 필리핀식 빙수',
    pronunciation: '[할로할로]',
    toneGuide: '더위 식히기',
    usageTip:
      '"섞다"라는 뜻입니다. 간 얼음에 연유·젤리·콩·자색 얌 아이스크림을 얹어 나오면 숟가락으로 통째로 섞어 먹습니다. 안 섞으면 맛이 따로 놉니다.',
  },
  {
    id: 'ph-fud-18',
    countryId: 'ph',
    category: '음식',
    original: 'Leche Flan',
    translation: '레체 플란 — 커스터드 푸딩',
    pronunciation: '[레체 플란]',
    toneGuide: '실패 없는 후식',
    usageTip:
      '달걀 노른자와 연유로 만든 진한 푸딩. 카라멜이 위에 얹혀 있습니다. 아주 달아서 여럿이 나눠 먹기 좋습니다.',
  },
  {
    id: 'ph-fud-19',
    countryId: 'ph',
    category: '음식',
    original: 'Buko Juice',
    translation: '부코 주스 — 생코코넛 주스',
    pronunciation: '[부코 주스]',
    toneGuide: '더울 때 수분 보충',
    usageTip:
      '어린 코코넛을 그 자리에서 따 주는 주스. 얼음을 넣지 말라고 하면(walang yelo) 배탈 위험이 줄어듭니다. 속살도 긁어 먹습니다.',
  },
  {
    id: 'ph-fud-20',
    countryId: 'ph',
    category: '음식',
    original: 'Balut',
    translation: '발룻 — 부화 직전 오리알',
    pronunciation: '[발룻]',
    toneGuide: '⚠️ 도전 메뉴',
    usageTip:
      '부화가 진행된 오리알을 삶은 길거리 음식. 현지인에게는 흔한 야식이지만 형태 때문에 놀라는 분이 많습니다. 모르고 받지 않도록 이름을 기억해 두세요.',
  },
  // ==========================================
  // 현지인이 실제로 시키는 것들 — 관광객 메뉴에는 잘 안 보이지만
  // 로컬 식당·카리에서 자주 만납니다.
  // ==========================================
  {
    id: 'ph-fud-21',
    countryId: 'ph',
    category: '음식',
    original: 'Tortang Talong',
    translation: '똘땅 딸롱 — 구운 가지 오믈렛',
    pronunciation: '[또르땅 딸롱]',
    toneGuide: '채식하시는 분께 안전한 선택',
    usageTip:
      '가지를 숯불에 구워 껍질을 벗기고 계란옷을 입혀 부칩니다. 담백하고 안 매워서 아이도 잘 먹습니다. 밥반찬으로 딱이고 가격도 쌉니다.',
  },
  {
    id: 'ph-fud-22',
    countryId: 'ph',
    category: '음식',
    original: 'Adobong Kangkong',
    translation: '아도봉 깡꽁 — 공심채(모닝글로리) 볶음',
    pronunciation: '[아도봉 깡꽁]',
    toneGuide: '고기 요리에 곁들이는 야채',
    usageTip:
      '동남아에서 흔한 공심채를 간장·마늘·식초로 볶습니다. 아삭하고 기름진 고기 요리와 잘 맞습니다. 야채가 부족하다 싶을 때 이걸 하나 시키세요.',
  },
  {
    id: 'ph-fud-23',
    countryId: 'ph',
    category: '음식',
    original: 'Pancit Bihon',
    translation: '판싯 비혼 — 가는 쌀국수 볶음',
    pronunciation: '[판싯 비혼]',
    toneGuide: '판싯 중 가장 흔한 것',
    usageTip:
      '판싯의 한 종류로 얇은 쌀국수를 씁니다. 굵은 밀국수는 Canton(칸톤), 둘을 섞으면 Bam-i(밤이). 메뉴에 여러 개 있으면 이 차이만 알면 됩니다.',
  },
  {
    id: 'ph-fud-24',
    countryId: 'ph',
    category: '음식',
    original: 'Toyomansi',
    translation: '또요만시 — 간장+칼라만시 찍먹 소스',
    pronunciation: '[또요만시]',
    toneGuide: '음식이 아니라 소스',
    usageTip:
      'TOYO(간장)+kalaMANSI(필리핀 라임). 구이·튀김에 곁들이는 기본 소스입니다. 안 나왔으면 "Pahingi po ng toyomansi." 라고 하면 줍니다. 고추(sili)를 넣어 달라고도 할 수 있습니다.',
  },
  {
    id: 'ph-fud-25',
    countryId: 'ph',
    category: '음식',
    original: 'Humba',
    translation: '홍바(훔바) — 필리핀식 돼지 장조림',
    pronunciation: '[훔바]',
    toneGuide: '비사야(세부) 지역 대표',
    usageTip:
      '삼겹살을 간장·흑설탕·두시(발효 검은콩)로 달콤짭짤하게 푹 조립니다. 아도보보다 달고 부드러워 한국인 입맛에 아주 잘 맞습니다. 세부·보홀에서 특히 흔합니다.',
  },
  // ==========================================
  // 체인점 — 요리 이름이 아니라 "어디서 먹지" 에 대한 답입니다.
  // 로컬 식당이 부담스러울 때, 아이가 있을 때, 늦은 시간일 때 안전한 선택지.
  // ==========================================
  {
    id: 'ph-fud-26',
    countryId: 'ph',
    category: '음식',
    original: 'Mang Inasal',
    translation: '망 이나살 — 숯불 닭구이 체인',
    pronunciation: '[망 이나살]',
    toneGuide: '밥 무한리필',
    usageTip:
      '치킨 이나살 전문 체인. 밥이 무한리필(unli rice)이라 밥심이 필요한 한국인에게 딱입니다. "Unli rice po" 라고 하면 더 줍니다. 1인 200~300페소 선.',
  },
  {
    id: 'ph-fud-27',
    countryId: 'ph',
    category: '음식',
    original: 'Chowking',
    translation: '차우킹 — 중국식 필리핀 패스트푸드',
    pronunciation: '[차우킹]',
    toneGuide: '국물이 당길 때',
    usageTip:
      '완탕면·시오마이·볶음밥을 파는 체인. 기름진 현지식이 물릴 때 국물로 속을 달래기 좋습니다. 할로할로도 여기 것이 유명합니다.',
  },
  {
    id: 'ph-fud-28',
    countryId: 'ph',
    category: '음식',
    original: 'Jollibee',
    translation: '졸리비 — 필리핀 국민 패스트푸드',
    pronunciation: '[졸리비]',
    toneGuide: '어디에나 있음',
    usageTip:
      '빨간 벌 마스코트. 대표 메뉴는 Chickenjoy(치킨)와 Jolly Spaghetti 인데, 스파게티가 아주 답니다 — 한국식 소스를 기대하면 놀랍니다. 아이들은 대개 좋아합니다.',
  },
  {
    id: 'ph-fud-29',
    countryId: 'ph',
    category: '음식',
    original: "Max's Restaurant",
    translation: '맥스 — 통닭 정찬 패밀리 레스토랑',
    pronunciation: '[맥스]',
    toneGuide: '단체 외식',
    usageTip:
      '바삭한 통닭(fried chicken)이 간판. 자리가 넓고 에어컨이 세서 대가족 식사에 편합니다. 필리핀 가정식(카레카레·시니강)도 함께 팝니다.',
  },
  {
    id: 'ph-fud-30',
    countryId: 'ph',
    category: '음식',
    original: 'Goldilocks',
    translation: '골디락스 — 케이크·전통 디저트 체인',
    pronunciation: '[골디락스]',
    toneGuide: '선물 사기 좋은 곳',
    usageTip:
      '필리핀 전통 과자(polvoron, yema)와 케이크를 파는 체인. 한국에 가져갈 선물을 공항 면세점보다 싸게 살 수 있습니다. 몰 안에 대부분 있습니다.',
  },
  // ==========================================
  // 내장 요리 — 간(Atay). 메뉴에서 자주 보이지만 뜻을 몰라 못 시키는 것들.
  // ==========================================
  {
    id: 'ph-fud-31',
    countryId: 'ph',
    category: '음식',
    original: 'Adobong Atay',
    translation: '아도봉 아따이 — 돼지 간 간장 조림',
    pronunciation: '[아도봉 아따이]',
    toneGuide: 'atay = 간(肝)',
    usageTip:
      'atay(아따이/이따이)가 타갈로그로 간입니다. 돼지 간을 아도보 방식(간장·식초·마늘)으로 조립니다. 순대 간을 좋아하시면 잘 맞습니다. 퍽퍽하니 밥과 함께 드세요. 닭 간이면 atay ng manok.',
  },
  {
    id: 'ph-fud-32',
    countryId: 'ph',
    category: '음식',
    original: 'Igado',
    translation: '이가도 — 일로카노식 돼지 간·살코기 볶음',
    pronunciation: '[이가도]',
    toneGuide: '북부 일로코스 지방 대표',
    usageTip:
      '돼지 간과 살코기를 길게 썰어 간장·식초에 볶고 피망·완두콩을 넣습니다. 아도봉 아따이보다 덜 짜고 야채가 들어가 먹기 편합니다. 이름이 비슷한 Igado 와 Adobo 를 헷갈리지 마세요.',
  },
  {
    id: 'ph-fud-33',
    countryId: 'ph',
    category: '음식',
    original: 'Atay (BBQ)',
    translation: '아따이 꼬치 — 길거리 간 바비큐',
    pronunciation: '[아따이]',
    toneGuide: '⚠️ 길거리 위생 주의',
    usageTip:
      '닭·돼지 간을 꽂아 숯불에 굽는 길거리 꼬치. isaw(곱창), balunbalunan(모래주머니)과 함께 팝니다. 아주 싸지만 배탈 위험이 있으니 손님이 많아 회전이 빠른 집에서, 갓 구운 것만 드세요.',
  },
];
