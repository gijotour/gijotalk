import { Phrase } from '../types';

/**
 * 베트남 음식 사전.
 *
 * ── 왜 회화집에 음식 이름을 넣는가
 *   메뉴판 앞에서 막히는 건 "말을 못 해서"가 아니라 "이게 뭔지 몰라서"입니다.
 *   Bún đậu mắm tôm 이 새우젓 소스라는 걸 모르고 시켰다가 못 먹고 남기는 일,
 *   느억맘(피시소스)에 알레르기가 있는 줄 모르고 반응이 나는 일이 실제로 생깁니다.
 *   사진 번역(OCR)은 서버가 필요해 정적 배포에서는 꺼져 있으므로, 자주 나오는
 *   요리만이라도 오프라인 사전으로 들고 있는 편이 확실합니다.
 *
 * ── 쓰는 법
 *   · 메뉴에서 본 이름을 그대로 검색 (Phở, 퍼)
 *   · 한국어로도 찾아집니다 ("쌀국수", "월남쌈", "고수", "매운")
 *   · 원문을 크게 띄워 종업원에게 보여주면 주문이 됩니다
 *
 * ── 팁에 꼭 적은 것
 *   고수(호불호), 알레르기(땅콩·새우젓·해산물), 매운 정도, 지역 명물.
 *   맛 설명보다 이쪽이 여행에서 훨씬 값집니다.
 *
 * ⚠️ 한글 발음과 설명은 지역·가게마다 조금씩 다릅니다. 현지 가이드에게 한 번
 *    확인받으면 더 좋습니다.
 */
export const VN_FOOD_PHRASES: Phrase[] = [
  // ==========================================
  // 대표 요리 — 관광객이 가장 먼저 만나는 것들
  // ==========================================
  {
    id: 'vn-fud-01',
    countryId: 'vn',
    category: '음식',
    original: 'Phở (bò / gà)',
    translation: '퍼 — 베트남 쌀국수(소고기/닭고기)',
    pronunciation: '[퍼]',
    toneGuide: '베트남을 대표하는 국민 음식',
    usageTip:
      '맑은 육수에 넓적한 쌀국수. 소고기(bò)와 닭고기(gà) 중 고르며, 하노이식은 담백하고 남부식은 숙주·허브를 듬뿍 곁들입니다. 고수(rau mùi)를 빼려면 "không rau mùi"라고 하세요.',
  },
  {
    id: 'vn-fud-02',
    countryId: 'vn',
    category: '음식',
    original: 'Bún chả',
    translation: '분짜 — 숯불 돼지고기 쌀국수',
    pronunciation: '[분 짜]',
    toneGuide: '하노이 대표 메뉴',
    usageTip:
      '숯불에 구운 돼지고기 완자·삼겹살을 새콤달콤한 느억맘 소스에 찍어 쌀국수·허브와 함께 먹습니다. 오바마 전 미국 대통령이 먹은 식당으로 유명해진 메뉴이기도 합니다.',
  },
  {
    id: 'vn-fud-03',
    countryId: 'vn',
    category: '음식',
    original: 'Bún bò Huế',
    translation: '분보후에 — 후에식 매운 소고기 쌀국수',
    pronunciation: '[분 보 후에]',
    toneGuide: '⚠️ 매운맛 주의',
    usageTip:
      '레몬그라스와 고추기름이 들어가 퍼(Phở)보다 훨씬 맵고 진합니다. 매운 걸 못 먹으면 "không cay"(안 맵게)를 꼭 미리 말하세요.',
  },
  {
    id: 'vn-fud-04',
    countryId: 'vn',
    category: '음식',
    original: 'Gỏi cuốn',
    translation: '고이꾸온 — 월남쌈(생춘권)',
    pronunciation: '[고이 꾸온]',
    toneGuide: '가볍고 무난함',
    usageTip:
      '라이스페이퍼에 새우·돼지고기·쌀국수·허브를 말아 땅콩 소스에 찍어 먹습니다. 땅콩 알레르기가 있으면 소스를 반드시 확인하세요.',
  },
  {
    id: 'vn-fud-05',
    countryId: 'vn',
    category: '음식',
    original: 'Chả giò / Nem rán',
    translation: '짜조 / 넴잔 — 베트남식 튀김춘권',
    pronunciation: '[짜 조 / 넴 잔]',
    toneGuide: '남부(짜조)·북부(넴잔) 이름이 다름',
    usageTip:
      '돼지고기·당면·목이버섯을 라이스페이퍼로 싸서 튀깁니다. 같은 음식인데 남부는 chả giò, 북부는 nem rán이라 부릅니다.',
  },
  {
    id: 'vn-fud-06',
    countryId: 'vn',
    category: '음식',
    original: 'Bánh mì',
    translation: '반미 — 베트남식 바게트 샌드위치',
    pronunciation: '[반 미]',
    toneGuide: '길거리 대표 간식',
    usageTip:
      '프랑스 식민지 영향으로 생긴 바삭한 바게트에 파테·고기·야채·고수를 채웁니다. 고수를 빼려면 "không rau mùi"라고 하세요. 가볍게 한 끼로 충분합니다.',
  },
  {
    id: 'vn-fud-07',
    countryId: 'vn',
    category: '음식',
    original: 'Cơm tấm',
    translation: '껌땀 — 부서진 쌀밥과 숯불 돼지고기',
    pronunciation: '[껌 땀]',
    toneGuide: '호치민 서민 음식의 상징',
    usageTip:
      '원래 상품가치가 낮은 "깨진 쌀"로 만든 밥에 숯불 돼지갈비(sườn nướng)·계란찜·느억맘을 곁들입니다. 호치민에서 아침·점심으로 흔히 먹습니다.',
  },
  {
    id: 'vn-fud-08',
    countryId: 'vn',
    category: '음식',
    original: 'Bánh xèo',
    translation: '반쎄오 — 베트남식 부침개',
    pronunciation: '[반 쎄오]',
    toneGuide: '바삭한 식감',
    usageTip:
      '쌀가루 반죽에 새우·돼지고기·숙주를 넣고 튀기듯 부칩니다. 쌈채소에 싸서 땅콩 소스나 느억맘에 찍어 먹습니다. 새우·땅콩 알레르기 주의.',
  },
  {
    id: 'vn-fud-09',
    countryId: 'vn',
    category: '음식',
    original: 'Cao lầu',
    translation: '까오러우 — 호이안 명물 국수',
    pronunciation: '[까오 러우]',
    toneGuide: '호이안에서만 제맛',
    usageTip:
      '호이안 우물물로 반죽한 두꺼운 면에 숯불 돼지고기·튀긴 크루통·허브를 올립니다. 재료 특성상 호이안을 벗어나면 맛이 달라진다고 알려져 있습니다.',
  },
  {
    id: 'vn-fud-10',
    countryId: 'vn',
    category: '음식',
    original: 'Mì Quảng',
    translation: '미꽝 — 다낭·꽝남 지역 노란 면 요리',
    pronunciation: '[미 꽝]',
    toneGuide: '국물이 적은 비빔면 스타일',
    usageTip:
      '강황으로 노랗게 물들인 두꺼운 면에 국물을 살짝만 부어 비벼 먹습니다. 새우·돼지고기·땅콩·튀긴 라이스크래커가 올라갑니다.',
  },

  // ==========================================
  // 로컬 별미 — 호불호가 갈리지만 알아두면 좋은 것들
  // ==========================================
  {
    id: 'vn-fud-11',
    countryId: 'vn',
    category: '음식',
    original: 'Bún đậu mắm tôm',
    translation: '분더우맘똠 — 새우젓 소스 두부 쌀국수',
    pronunciation: '[분 더우 맘 똠]',
    toneGuide: '⚠️ 호불호가 갈립니다',
    usageTip:
      '삶은 쌀국수·튀긴 두부·삶은 고기를 진한 발효 새우젓(mắm tôm)에 찍어 먹습니다. 냄새가 강해 처음엔 호불호가 갈리지만 하노이 사람들에게는 소울푸드입니다.',
  },
  {
    id: 'vn-fud-12',
    countryId: 'vn',
    category: '음식',
    original: 'Chả cá Lã Vọng',
    translation: '짜까라봉 — 하노이식 강황 생선구이',
    pronunciation: '[짜 까 라 봉]',
    toneGuide: '하노이 대표 요리 중 하나',
    usageTip:
      '강황·딜(thì là)에 재운 생선을 즉석에서 볶듯 구워 땅콩·쌀국수와 함께 먹습니다. 딜 향이 독특해 처음 먹으면 낯설 수 있습니다.',
  },
  {
    id: 'vn-fud-13',
    countryId: 'vn',
    category: '음식',
    original: 'Nem chua',
    translation: '넴쭈어 — 발효 돼지고기 소시지',
    pronunciation: '[넴 쭈어]',
    toneGuide: '새콤한 맥주 안주',
    usageTip:
      '생돼지고기를 발효시켜 새콤한 맛을 낸 소시지로, 바나나잎에 싸서 냅니다. 발효식품이라 처음 먹는 분은 소량으로 시작하세요.',
  },
  {
    id: 'vn-fud-14',
    countryId: 'vn',
    category: '음식',
    original: 'Bún riêu',
    translation: '분지에우 — 게살 토마토 쌀국수',
    pronunciation: '[분 지에우]',
    toneGuide: '새콤한 토마토 베이스',
    usageTip:
      '민물게로 낸 육수에 토마토를 넣어 새콤합니다. 게 알레르기가 있으면 피하세요.',
  },
  {
    id: 'vn-fud-15',
    countryId: 'vn',
    category: '음식',
    original: 'Ốc',
    translation: '옥 — 베트남식 골뱅이·조개 요리',
    pronunciation: '[옥]',
    toneGuide: '저녁 술자리 단골 메뉴',
    usageTip:
      '골뱅이·소라·조개류를 레몬그라스·고추와 함께 찜하거나 볶습니다. "quán ốc"(옥 전문점)은 현지인들의 저녁 맥주 안주 명소입니다. 해산물 알레르기 주의.',
  },
  {
    id: 'vn-fud-16',
    countryId: 'vn',
    category: '음식',
    original: 'Lẩu',
    translation: '러우 — 베트남식 샤브샤브(핫팟)',
    pronunciation: '[러우]',
    toneGuide: '여럿이 나눠 먹기 좋음',
    usageTip:
      '해산물·소고기·버섯을 새콤한 육수에 익혀 먹습니다. lẩu Thái(태국식 똠얌 맛), lẩu mắm(젓갈 베이스) 등 종류가 다양하니 매운 정도를 미리 확인하세요.',
  },

  // ==========================================
  // 밥 · 면 · 만두류
  // ==========================================
  {
    id: 'vn-fud-17',
    countryId: 'vn',
    category: '음식',
    original: 'Hủ tiếu',
    translation: '후띠에우 — 남부식 쌀국수',
    pronunciation: '[후 띠에우]',
    toneGuide: '메콩델타·화교 영향',
    usageTip:
      '퍼(Phở)보다 국물이 맑고 가벼우며 돼지고기·새우가 함께 나옵니다. 국물(nước)형과 비빔(khô)형 중 고를 수 있습니다.',
  },
  {
    id: 'vn-fud-18',
    countryId: 'vn',
    category: '음식',
    original: 'Bánh cuốn',
    translation: '반꾸온 — 쌀가루로 찐 만두',
    pronunciation: '[반 꾸온]',
    toneGuide: '아침 식사로 인기',
    usageTip:
      '얇게 찐 쌀 반죽 안에 다진 돼지고기·목이버섯을 넣고 튀긴 샬롯을 뿌려 느억맘에 찍어 먹습니다. 부드러워 아침 식사로 즐겨 먹습니다.',
  },
  {
    id: 'vn-fud-19',
    countryId: 'vn',
    category: '음식',
    original: 'Cơm gà Hội An',
    translation: '껌가 호이안 — 호이안식 치킨라이스',
    pronunciation: '[껌 가 호이 안]',
    toneGuide: '호이안 3대 음식 중 하나',
    usageTip:
      '닭 육수로 지은 노란 밥에 찢은 닭고기·허브·양파 절임을 얹습니다. 하이난식 치킨라이스와 비슷하지만 향신료가 더 강합니다.',
  },
  {
    id: 'vn-fud-20',
    countryId: 'vn',
    category: '음식',
    original: 'Bánh bao',
    translation: '반바오 — 베트남식 왕만두',
    pronunciation: '[반 바오]',
    toneGuide: '간단한 간식·아침',
    usageTip:
      '중국식 찐빵의 베트남 버전. 편의점(빈마트 등)에서도 흔히 팔아 이동 중 간단한 끼니로 좋습니다.',
  },
  {
    id: 'vn-fud-21',
    countryId: 'vn',
    category: '음식',
    original: 'Xôi',
    translation: '쏘이 — 베트남식 찹쌀밥',
    pronunciation: '[쏘이]',
    toneGuide: '아침 대용 · 든든함',
    usageTip:
      '찹쌀에 녹두·닭고기·소시지 등을 얹어 파는 길거리 아침 메뉴입니다. 바나나잎에 포장해 들고 다니며 먹기 좋습니다.',
  },
  {
    id: 'vn-fud-22',
    countryId: 'vn',
    category: '음식',
    original: 'Rau muống xào tỏi',
    translation: '라우무옹싸오또이 — 마늘 볶은 모닝글로리',
    pronunciation: '[라우 무옹 싸오 또이]',
    toneGuide: '가장 흔한 채소 반찬',
    usageTip:
      '공심채(모닝글로리)를 마늘로 볶은 요리로, 어느 식당에나 있는 기본 채소 메뉴입니다. 고기 요리에 곁들이면 좋습니다.',
  },
  {
    id: 'vn-fud-23',
    countryId: 'vn',
    category: '음식',
    original: 'Gà nướng',
    translation: '가느엉 — 숯불 통닭구이',
    pronunciation: '[가 느엉]',
    toneGuide: '단체 회식 메뉴',
    usageTip:
      '레몬그라스·마늘에 재운 닭을 숯불에 통째로 굽습니다. 여러 명이 나눠 먹기 좋은 저녁 메뉴입니다.',
  },
  {
    id: 'vn-fud-24',
    countryId: 'vn',
    category: '음식',
    original: 'Bánh tráng trộn',
    translation: '반짱쫀 — 라이스페이퍼 무침 스낵',
    pronunciation: '[반 짱 쫀]',
    toneGuide: '학생들의 국민 간식',
    usageTip:
      '채 썬 라이스페이퍼에 육포·메추리알·땅콩·망고를 넣고 매콤하게 무칩니다. 길거리 노점 간식으로 인기가 많습니다.',
  },

  // ==========================================
  // 커피 · 음료 · 디저트
  // ==========================================
  {
    id: 'vn-fud-25',
    countryId: 'vn',
    category: '음식',
    original: 'Cà phê sữa đá',
    translation: '까페쓰어다 — 연유 아이스커피',
    pronunciation: '[까 페 쓰어 다]',
    toneGuide: '베트남 커피의 상징',
    usageTip:
      '진한 로부스타 커피에 연유를 넣어 답니다. 연유 없이 마시려면 "cà phê đen đá"(까페 덴 다, 블랙 아이스커피)를 주문하세요.',
  },
  {
    id: 'vn-fud-26',
    countryId: 'vn',
    category: '음식',
    original: 'Cà phê trứng',
    translation: '까페쯩 — 계란 커피',
    pronunciation: '[까 페 쯩]',
    toneGuide: '하노이 명물',
    usageTip:
      '계란 노른자와 연유를 크림처럼 휘핑해 커피 위에 올립니다. 디저트에 가까운 진한 단맛으로, 하노이 구시가지 카페들이 유명합니다.',
  },
  {
    id: 'vn-fud-27',
    countryId: 'vn',
    category: '음식',
    original: 'Trà đá',
    translation: '짜다 — 아이스 녹차',
    pronunciation: '[짜 다]',
    toneGuide: '거의 무료 수준으로 저렴함',
    usageTip:
      '연한 녹차를 얼음과 함께 냅니다. 길거리 식당에서는 물 대신 무료로 주기도 합니다. 정수 여부가 걱정되면 병입 음료를 고르세요.',
  },
  {
    id: 'vn-fud-28',
    countryId: 'vn',
    category: '음식',
    original: 'Nước mía',
    translation: '느억미아 — 사탕수수 주스',
    pronunciation: '[느억 미아]',
    toneGuide: '더위를 식히는 길거리 음료',
    usageTip:
      '사탕수수를 즉석에서 압착해 짜냅니다. 매우 답니다. 위생이 걱정되면 사람이 많고 회전이 빠른 노점을 고르세요.',
  },
  {
    id: 'vn-fud-29',
    countryId: 'vn',
    category: '음식',
    original: 'Sinh tố',
    translation: '신또 — 과일 스무디',
    pronunciation: '[신 또]',
    toneGuide: '열대과일을 한 번에',
    usageTip:
      '아보카도(bơ)·망고(xoài)·두리안(sầu riêng) 등 다양한 열대과일로 만듭니다. 연유가 기본으로 들어가 매우 단 편입니다.',
  },
  {
    id: 'vn-fud-30',
    countryId: 'vn',
    category: '음식',
    original: 'Chè',
    translation: '째 — 베트남식 디저트 음료',
    pronunciation: '[째]',
    toneGuide: '종류가 매우 다양함',
    usageTip:
      '녹두·연꽃씨·젤리·코코넛밀크 등을 섞은 차갑고 단 디저트입니다. 가게마다 종류가 수십 가지라 "chè gì ngon?"(뭐가 맛있어요?)이라고 물어보는 게 빠릅니다.',
  },
  {
    id: 'vn-fud-31',
    countryId: 'vn',
    category: '음식',
    original: 'Bánh flan',
    translation: '반플랑 — 베트남식 캐러멜 푸딩',
    pronunciation: '[반 플랑]',
    toneGuide: '프랑스 영향 디저트',
    usageTip:
      '한국의 계란 푸딩과 비슷합니다. 커피(cà phê)를 부어 함께 먹기도 합니다.',
  },
  {
    id: 'vn-fud-32',
    countryId: 'vn',
    category: '음식',
    original: 'Bia hơi',
    translation: '비어허이 — 거리 생맥주',
    pronunciation: '[비어 허이]',
    toneGuide: '하노이 명물 · 매우 저렴함',
    usageTip:
      '그날그날 만들어 그날 소비하는 신선한 저알콜 생맥주입니다. 하노이 "bia hơi 거리"의 낮은 플라스틱 의자 문화가 유명합니다.',
  },
  {
    id: 'vn-fud-33',
    countryId: 'vn',
    category: '음식',
    original: 'Nước dừa',
    translation: '느억즈아 — 코코넛 워터',
    pronunciation: '[느억 즈어]',
    toneGuide: '자연 그대로의 이온음료',
    usageTip:
      '즉석에서 코코넛을 잘라 빨대를 꽂아 줍니다. 메콩델타·벤쩨 지역이 특히 유명합니다. 다 마신 뒤 과육을 숟가락으로 긁어 먹을 수 있습니다.',
  },
];
