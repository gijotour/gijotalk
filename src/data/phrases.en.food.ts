import { Phrase } from '../types';

/**
 * 영어 트랙 — 필리핀 음식 사전.
 *
 * ── 왜 따로 두는가 (복사가 아닙니다)
 *   필리핀 식당 메뉴는 대부분 영어입니다. 요리 이름은 타갈로그 그대로 적히지만
 *   그 옆에 영어 설명이 붙습니다 — "Sinigang (sour tamarind soup)".
 *   그래서 영어 트랙에는 그 영어 표현을 함께 넣었습니다. 메뉴판에서 눈으로
 *   대조할 수 있어야 실제로 쓸모가 있습니다.
 *
 *   요리 이름·한국어 뜻·팁은 필리핀 트랙과 같습니다. 두 벌로 갈라져
 *   어긋나지 않도록 phrases.ph.food.ts 에서 그대로 옮겼습니다.
 */
export const EN_FOOD_PHRASES: Phrase[] = [
  {
    id: 'en-fud-01',
    countryId: 'en',
    category: '음식',
    original: 'Lechon',
    translation: '레촌 — 통돼지 바비큐',
    pronunciation: '[레촌]',
    toneGuide: 'Roast whole pig',
    usageTip:
      '숯불에 통째로 돌려 구운 돼지. 껍질이 바삭한 부위(껍데기)가 별미입니다. 세부 레촌이 가장 유명하고, 보통 kg 단위로 팝니다.',
  },
  {
    id: 'en-fud-02',
    countryId: 'en',
    category: '음식',
    original: 'Crispy Pata',
    translation: '크리스피 빠따 — 돼지 족발 튀김',
    pronunciation: '[크리스피 빠따]',
    toneGuide: 'Deep-fried pork knuckle',
    usageTip:
      '족발을 삶았다가 통째로 튀깁니다. 겉은 과자처럼 바삭하고 속은 부드럽습니다. 양이 많아 3~4명이 나눠 먹기 좋습니다. 간장·식초 소스에 찍어 먹습니다.',
  },
  {
    id: 'en-fud-03',
    countryId: 'en',
    category: '음식',
    original: 'Kaldereta',
    translation: '칼데레타 — 토마토 소고기 스튜',
    pronunciation: '[칼데레타]',
    toneGuide: 'Tomato beef stew',
    usageTip:
      '토마토 소스에 소고기·감자·당근을 넣고 푹 끓입니다. 매운맛은 거의 없고 갈비찜과 비슷한 느낌이라 아이도 잘 먹습니다. 염소고기(kambing)로 만드는 집도 있으니 확인하세요.',
  },
  {
    id: 'en-fud-04',
    countryId: 'en',
    category: '음식',
    original: 'Dinuguan',
    translation: '디누구안 — 돼지 선지 스튜',
    pronunciation: '[디누구안]',
    toneGuide: 'Pork blood stew',
    usageTip:
      '돼지 피(선지)와 내장을 식초·고추와 끓인 검은색 스튜. 순대국 좋아하시면 잘 맞습니다. 모르고 시키면 색 때문에 놀라니 미리 아세요. 흰 떡(puto)과 함께 나옵니다.',
  },
  {
    id: 'en-fud-05',
    countryId: 'en',
    category: '음식',
    original: 'Sinigang',
    translation: '시니강 — 타마린드 신맛 국물',
    pronunciation: '[시니강]',
    toneGuide: 'Sour tamarind soup',
    usageTip:
      '타마린드로 신맛을 낸 맑은 국. 김치찌개처럼 매운 게 아니라 새콤합니다. 돼지(baboy)·새우(hipon)·생선(isda) 중에 고릅니다. 더울 때 해장으로 좋습니다.',
  },
  {
    id: 'en-fud-06',
    countryId: 'en',
    category: '음식',
    original: 'Bulalo',
    translation: '불랄로 — 소 사골 국물',
    pronunciation: '[불랄로]',
    toneGuide: 'Beef marrow soup',
    usageTip:
      '소 다리뼈를 오래 끓인 맑은 곰탕. 뼛속 골수를 빨아 먹습니다. 간이 거의 안 되어 있어 액젓(patis)이나 소금을 곁들입니다. 서늘한 따가이따이에서 특히 인기입니다.',
  },
  {
    id: 'en-fud-07',
    countryId: 'en',
    category: '음식',
    original: 'Adobo',
    translation: '아도보 — 간장 식초 조림',
    pronunciation: '[아도보]',
    toneGuide: 'Soy-vinegar braise',
    usageTip:
      '간장·식초·마늘·후추로 조린 요리. 닭(manok)이나 돼지(baboy)로 만듭니다. 짭짤새콤해서 밥과 잘 맞습니다. 무엇을 시킬지 모르겠으면 이걸 시키면 됩니다.',
  },
  {
    id: 'en-fud-08',
    countryId: 'en',
    category: '음식',
    original: 'Sisig',
    translation: '시식 — 다진 돼지머리 철판구이',
    pronunciation: '[시식]',
    toneGuide: 'Sizzling minced pork',
    usageTip:
      '돼지머리·귀를 잘게 다져 철판에 지글지글 내옵니다. 위에 계란을 얹기도 합니다. 매콤새콤하고 식감이 좋아 한국인에게 인기가 많습니다.',
  },
  {
    id: 'en-fud-09',
    countryId: 'en',
    category: '음식',
    original: 'Chicken Inasal',
    translation: '치킨 이나살 — 숯불 닭구이',
    pronunciation: '[치킨 이나살]',
    toneGuide: 'Charcoal-grilled chicken',
    usageTip:
      '레몬그라스·식초에 재워 숯불에 구운 닭. 매운맛이 없어 아이들이 잘 먹습니다. 마늘밥(garlic rice)과 함께 시키면 한 끼가 완성됩니다.',
  },
  {
    id: 'en-fud-10',
    countryId: 'en',
    category: '음식',
    original: 'Kare-kare',
    translation: '카레카레 — 땅콩 소스 스튜',
    pronunciation: '[카레카레]',
    toneGuide: 'Peanut stew — contains peanuts',
    usageTip:
      '이름과 달리 카레가 아닙니다. 땅콩 소스에 소꼬리·야채를 넣은 걸쭉한 스튜. 땅콩 알레르기가 있으면 절대 피하세요. 새우젓(bagoong)을 곁들여 간을 맞춥니다.',
  },
  {
    id: 'en-fud-11',
    countryId: 'en',
    category: '음식',
    original: 'Pancit',
    translation: '판싯 — 필리핀식 볶음국수',
    pronunciation: '[판싯]',
    toneGuide: 'Stir-fried noodles',
    usageTip:
      '잡채와 비슷한 볶음국수. Canton(굵은 면)·Bihon(가는 쌀국수)으로 나뉘고 섞은 것도 있습니다. 맵지 않아 아이도 먹습니다.',
  },
  {
    id: 'en-fud-12',
    countryId: 'en',
    category: '음식',
    original: 'Lumpia',
    translation: '룸피아 — 필리핀식 춘권',
    pronunciation: '[룸피아]',
    toneGuide: 'Spring rolls',
    usageTip:
      '얇게 튀긴 스프링롤. Shanghai 는 다진 고기를 넣은 작은 튀김, Sariwa 는 튀기지 않은 생춘권입니다. 단맛 소스에 찍어 먹습니다.',
  },
  {
    id: 'en-fud-13',
    countryId: 'en',
    category: '음식',
    original: 'Tapsilog',
    translation: '탑실록 — 소고기+계란+마늘밥 한 접시',
    pronunciation: '[탑실록]',
    toneGuide: 'Beef, egg & garlic rice',
    usageTip:
      'TAPa(절인 소고기)+SIlog(마늘밥+계란). 앞글자만 바꾸면 다른 메뉴가 됩니다 — Longsilog(소시지), Tocilog(단짠 돼지), Bangsilog(생선).',
  },
  {
    id: 'en-fud-14',
    countryId: 'en',
    category: '음식',
    original: 'Tinola',
    translation: '티놀라 — 생강 닭국',
    pronunciation: '[티놀라]',
    toneGuide: 'Ginger chicken soup',
    usageTip:
      '생강을 넣고 끓인 맑은 닭국. 파파야나 차요테가 들어갑니다. 삼계탕처럼 담백해서 배탈이나 감기 기운이 있을 때 좋습니다.',
  },
  {
    id: 'en-fud-15',
    countryId: 'en',
    category: '음식',
    original: 'Pinakbet',
    translation: '피나벳 — 새우젓 야채 볶음',
    pronunciation: '[피나벳]',
    toneGuide: 'Vegetables in shrimp paste',
    usageTip:
      '가지·오크라·여주 등을 새우젓(bagoong)으로 볶습니다. 여주(ampalaya)가 들어가 쌉싸름합니다. 새우 알레르기가 있으면 피하세요.',
  },
  {
    id: 'en-fud-16',
    countryId: 'en',
    category: '음식',
    original: 'Bicol Express',
    translation: '비콜 익스프레스 — 코코넛 매운 돼지',
    pronunciation: '[비콜 익스프레스]',
    toneGuide: 'Spicy pork in coconut milk',
    usageTip:
      '코코넛 밀크에 청양고추급 고추를 넣고 돼지고기를 조립니다. 필리핀 음식 중 가장 매운 축에 듭니다. 매운 걸 못 드시면 피하세요.',
  },
  {
    id: 'en-fud-17',
    countryId: 'en',
    category: '음식',
    original: 'Halo-halo',
    translation: '할로할로 — 필리핀식 빙수',
    pronunciation: '[할로할로]',
    toneGuide: 'Shaved ice dessert',
    usageTip:
      '"섞다"라는 뜻입니다. 간 얼음에 연유·젤리·콩·자색 얌 아이스크림을 얹어 나오면 숟가락으로 통째로 섞어 먹습니다. 안 섞으면 맛이 따로 놉니다.',
  },
  {
    id: 'en-fud-18',
    countryId: 'en',
    category: '음식',
    original: 'Leche Flan',
    translation: '레체 플란 — 커스터드 푸딩',
    pronunciation: '[레체 플란]',
    toneGuide: 'Caramel custard',
    usageTip:
      '달걀 노른자와 연유로 만든 진한 푸딩. 카라멜이 위에 얹혀 있습니다. 아주 달아서 여럿이 나눠 먹기 좋습니다.',
  },
  {
    id: 'en-fud-19',
    countryId: 'en',
    category: '음식',
    original: 'Buko Juice',
    translation: '부코 주스 — 생코코넛 주스',
    pronunciation: '[부코 주스]',
    toneGuide: 'Fresh coconut juice',
    usageTip:
      '어린 코코넛을 그 자리에서 따 주는 주스. 얼음을 넣지 말라고 하면(walang yelo) 배탈 위험이 줄어듭니다. 속살도 긁어 먹습니다.',
  },
  {
    id: 'en-fud-20',
    countryId: 'en',
    category: '음식',
    original: 'Balut',
    translation: '발룻 — 부화 직전 오리알',
    pronunciation: '[발룻]',
    toneGuide: 'Fertilized duck egg',
    usageTip:
      '부화가 진행된 오리알을 삶은 길거리 음식. 현지인에게는 흔한 야식이지만 형태 때문에 놀라는 분이 많습니다. 모르고 받지 않도록 이름을 기억해 두세요.',
  },
  {
    id: 'en-fud-21',
    countryId: 'en',
    category: '음식',
    original: 'Tortang Talong',
    translation: '똘땅 딸롱 — 구운 가지 오믈렛',
    pronunciation: '[또르땅 딸롱]',
    toneGuide: 'Grilled eggplant omelette',
    usageTip:
      '가지를 숯불에 구워 껍질을 벗기고 계란옷을 입혀 부칩니다. 담백하고 안 매워서 아이도 잘 먹습니다. 밥반찬으로 딱이고 가격도 쌉니다.',
  },
  {
    id: 'en-fud-22',
    countryId: 'en',
    category: '음식',
    original: 'Adobong Kangkong',
    translation: '아도봉 깡꽁 — 공심채(모닝글로리) 볶음',
    pronunciation: '[아도봉 깡꽁]',
    toneGuide: 'Sauteed water spinach',
    usageTip:
      '동남아에서 흔한 공심채를 간장·마늘·식초로 볶습니다. 아삭하고 기름진 고기 요리와 잘 맞습니다. 야채가 부족하다 싶을 때 이걸 하나 시키세요.',
  },
  {
    id: 'en-fud-23',
    countryId: 'en',
    category: '음식',
    original: 'Pancit Bihon',
    translation: '판싯 비혼 — 가는 쌀국수 볶음',
    pronunciation: '[판싯 비혼]',
    toneGuide: 'Thin rice noodles',
    usageTip:
      '판싯의 한 종류로 얇은 쌀국수를 씁니다. 굵은 밀국수는 Canton(칸톤), 둘을 섞으면 Bam-i(밤이). 메뉴에 여러 개 있으면 이 차이만 알면 됩니다.',
  },
  {
    id: 'en-fud-24',
    countryId: 'en',
    category: '음식',
    original: 'Toyomansi',
    translation: '또요만시 — 간장+칼라만시 찍먹 소스',
    pronunciation: '[또요만시]',
    toneGuide: 'Soy-calamansi dipping sauce',
    usageTip:
      'TOYO(간장)+kalaMANSI(필리핀 라임). 구이·튀김에 곁들이는 기본 소스입니다. 안 나왔으면 "Pahingi po ng toyomansi." 라고 하면 줍니다. 고추(sili)를 넣어 달라고도 할 수 있습니다.',
  },
  {
    id: 'en-fud-25',
    countryId: 'en',
    category: '음식',
    original: 'Humba',
    translation: '훔바 — 필리핀식 돼지 장조림',
    pronunciation: '[훔바]',
    toneGuide: 'Sweet braised pork belly',
    usageTip:
      '삼겹살을 간장·흑설탕·두시(발효 검은콩)로 달콤짭짤하게 푹 조립니다. 아도보보다 달고 부드러워 한국인 입맛에 아주 잘 맞습니다. 세부·보홀에서 특히 흔합니다. 한국인들이 "홍바" 로 적기도 하는데 현지 발음은 훔바입니다.',
  },
  {
    id: 'en-fud-26',
    countryId: 'en',
    category: '음식',
    original: 'Mang Inasal',
    translation: '망 이나살 — 숯불 닭구이 체인',
    pronunciation: '[망 이나살]',
    toneGuide: 'Grilled chicken chain (unli rice)',
    usageTip:
      '치킨 이나살 전문 체인. 밥이 무한리필(unli rice)이라 밥심이 필요한 한국인에게 딱입니다. "Unli rice po" 라고 하면 더 줍니다. 1인 200~300페소 선.',
  },
  {
    id: 'en-fud-27',
    countryId: 'en',
    category: '음식',
    original: 'Chowking',
    translation: '차우킹 — 중국식 필리핀 패스트푸드',
    pronunciation: '[차우킹]',
    toneGuide: 'Chinese-style fast food chain',
    usageTip:
      '완탕면·시오마이·볶음밥을 파는 체인. 기름진 현지식이 물릴 때 국물로 속을 달래기 좋습니다. 할로할로도 여기 것이 유명합니다.',
  },
  {
    id: 'en-fud-28',
    countryId: 'en',
    category: '음식',
    original: 'Jollibee',
    translation: '졸리비 — 필리핀 국민 패스트푸드',
    pronunciation: '[졸리비]',
    toneGuide: 'Filipino fast food chain',
    usageTip:
      '빨간 벌 마스코트. 대표 메뉴는 Chickenjoy(치킨)와 Jolly Spaghetti 인데, 스파게티가 아주 답니다 — 한국식 소스를 기대하면 놀랍니다. 아이들은 대개 좋아합니다.',
  },
  {
    id: 'en-fud-29',
    countryId: 'en',
    category: '음식',
    original: "Max's Restaurant",
    translation: '맥스 — 통닭 정찬 패밀리 레스토랑',
    pronunciation: '[맥스]',
    toneGuide: 'Fried chicken family restaurant',
    usageTip:
      '바삭한 통닭(fried chicken)이 간판. 자리가 넓고 에어컨이 세서 대가족 식사에 편합니다. 필리핀 가정식(카레카레·시니강)도 함께 팝니다.',
  },
  {
    id: 'en-fud-30',
    countryId: 'en',
    category: '음식',
    original: 'Goldilocks',
    translation: '골디락스 — 케이크·전통 디저트 체인',
    pronunciation: '[골디락스]',
    toneGuide: 'Bakery & Filipino desserts',
    usageTip:
      '필리핀 전통 과자(polvoron, yema)와 케이크를 파는 체인. 한국에 가져갈 선물을 공항 면세점보다 싸게 살 수 있습니다. 몰 안에 대부분 있습니다.',
  },
  {
    id: 'en-fud-31',
    countryId: 'en',
    category: '음식',
    original: 'Adobong Atay',
    translation: '아도봉 아따이 — 돼지 간 간장 조림',
    pronunciation: '[아도봉 아따이]',
    toneGuide: 'Braised pork liver',
    usageTip:
      'atay(아따이/이따이)가 타갈로그로 간입니다. 돼지 간을 아도보 방식(간장·식초·마늘)으로 조립니다. 순대 간을 좋아하시면 잘 맞습니다. 퍽퍽하니 밥과 함께 드세요. 닭 간이면 atay ng manok.',
  },
  {
    id: 'en-fud-32',
    countryId: 'en',
    category: '음식',
    original: 'Igado',
    translation: '이가도 — 일로카노식 돼지 간·살코기 볶음',
    pronunciation: '[이가도]',
    toneGuide: 'Ilocano pork & liver saute',
    usageTip:
      '돼지 간과 살코기를 길게 썰어 간장·식초에 볶고 피망·완두콩을 넣습니다. 아도봉 아따이보다 덜 짜고 야채가 들어가 먹기 편합니다. 이름이 비슷한 Igado 와 Adobo 를 헷갈리지 마세요.',
  },
  {
    id: 'en-fud-33',
    countryId: 'en',
    category: '음식',
    original: 'Atay (BBQ)',
    translation: '아따이 꼬치 — 길거리 간 바비큐',
    pronunciation: '[아따이]',
    toneGuide: 'Grilled liver skewers',
    usageTip:
      '닭·돼지 간을 꽂아 숯불에 굽는 길거리 꼬치. isaw(곱창), balunbalunan(모래주머니)과 함께 팝니다. 아주 싸지만 배탈 위험이 있으니 손님이 많아 회전이 빠른 집에서, 갓 구운 것만 드세요.',
  },
];
