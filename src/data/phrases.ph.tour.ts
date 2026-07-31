import { Phrase } from '../types';

/**
 * 필리핀(타갈로그) — 관광 · 마사지.
 *
 * 일정표 기능을 붙이고 나서 생긴 구멍입니다. 일정의 "투어" "스파" 항목에서
 * 회화로 넘어가려 했는데 이어줄 카테고리가 없었습니다. 실제 가이드 일정표에서
 * 가장 많이 나온 두 종류이기도 합니다(6일 중 투어 4건·스파 3건).
 *
 * ── 문장을 고른 기준
 *   현장에서 "말이 막혀서 손해 보거나 불쾌해지는" 순간만 담았습니다.
 *   입장료·인원·집합시간(관광), 세기·통증·부위·팁(마사지).
 *
 * ── 필리핀 현실
 *   관광지·스파 직원 대부분이 영어를 합니다. 그래서 en 트랙이 실전에서 더
 *   자주 쓰일 수 있습니다. 다만 타갈로그로 한마디 건네면 대접이 눈에 띄게
 *   달라지는 곳이기도 해서, 짧고 정중한(po) 표현 위주로 골랐습니다.
 *   영어 단어를 섞는 것(entrance fee, picture, massage)은 어색한 게 아니라
 *   현지에서 실제로 그렇게 씁니다.
 *
 * ⚠️ 타갈로그 원문과 한글 발음은 출국 전 현지인 검수를 한 번 받으세요.
 */
export const PH_TOUR_PHRASES: Phrase[] = [
  // ==========================================
  // [관광]
  // ==========================================
  {
    id: 'ph-tur-01',
    countryId: 'ph',
    category: '관광',
    original: 'Magkano po ang entrance fee?',
    translation: '입장료가 얼마예요?',
    pronunciation: '[막카노 포 앙 엔트란스 피]',
    toneGuide: '정중한 질문 (po)',
    usageTip: '입장료는 현지인/외국인 가격이 다른 곳이 많습니다. 매표소 가격표를 같이 가리키며 물으면 확실합니다.',
  },
  {
    id: 'ph-tur-02',
    countryId: 'ph',
    category: '관광',
    original: 'Walo po kami.',
    translation: '저희 여덟 명이에요.',
    pronunciation: '[왈로 포 카미]',
    toneGuide: '인원 알리기',
    usageTip: '숫자만 바꾸면 됩니다 — dalawa(2) tatlo(3) apat(4) lima(5) anim(6) pito(7) walo(8).',
  },
  {
    id: 'ph-tur-03',
    countryId: 'ph',
    category: '관광',
    original: 'May bayad po ba ang bata?',
    translation: '아이도 요금을 내나요?',
    pronunciation: '[마이 바야드 포 바 앙 바타]',
    toneGuide: '요금 확인',
    usageTip: '아동 할인·무료 기준이 제각각입니다. 미리 물어야 매표소에서 실랑이가 없습니다.',
  },
  {
    id: 'ph-tur-04',
    countryId: 'ph',
    category: '관광',
    original: 'Pwede po bang mag-picture dito?',
    translation: '여기서 사진 찍어도 되나요?',
    pronunciation: '[푸웨데 포 방 막픽처 디토]',
    toneGuide: '허락 구하기',
    usageTip: '성당·박물관·부족 마을에서는 꼭 물어보세요. 촬영료를 따로 받는 곳도 있습니다.',
  },
  {
    id: 'ph-tur-05',
    countryId: 'ph',
    category: '관광',
    original: 'Pakikuhanan po kami ng picture.',
    translation: '저희 사진 좀 찍어주세요.',
    pronunciation: '[파키쿠하난 포 카미 낭 픽처]',
    toneGuide: '부탁 (paki- = ~해 주세요)',
    usageTip: '폰을 건네며 말하면 됩니다. 필리핀 사람들은 대개 흔쾌히 여러 장 찍어줍니다.',
  },
  {
    id: 'ph-tur-06',
    countryId: 'ph',
    category: '관광',
    original: 'Anong oras po tayo magkikita ulit?',
    translation: '몇 시에 다시 모여요?',
    pronunciation: '[아농 오라스 포 타요 막키키타 울릿]',
    toneGuide: '집합 시간 확인',
    usageTip: '자유시간을 받았을 때 가장 먼저 물어야 할 문장입니다. 시간을 손가락이나 폰 시계로 같이 확인하세요.',
  },
  {
    id: 'ph-tur-07',
    countryId: 'ph',
    category: '관광',
    original: 'Gaano po katagal ang tour?',
    translation: '투어가 얼마나 걸려요?',
    pronunciation: '[가아노 포 카타갈 앙 투어]',
    toneGuide: '소요 시간 질문',
    usageTip: '아이나 어르신이 있으면 반드시 확인하세요. 호핑·트래킹은 예상보다 길어지는 일이 흔합니다.',
  },
  {
    id: 'ph-tur-08',
    countryId: 'ph',
    category: '관광',
    original: 'Nasaan po ang CR?',
    translation: '화장실이 어디예요?',
    pronunciation: '[나사안 포 앙 씨알]',
    toneGuide: '위치 질문',
    usageTip: '필리핀에서 화장실은 CR(comfort room)입니다. toilet 이라고 하면 못 알아듣는 사람도 있습니다.',
  },
  {
    id: 'ph-tur-09',
    countryId: 'ph',
    category: '관광',
    original: 'Dahan-dahan lang po tayo.',
    translation: '조금만 천천히 가주세요.',
    pronunciation: '[다한다한 랑 포 타요]',
    toneGuide: '속도 조절 요청',
    usageTip: '일행에 아이나 어르신이 있을 때. 보트·계단·트래킹에서 그대로 쓸 수 있습니다.',
  },
  {
    id: 'ph-tur-10',
    countryId: 'ph',
    category: '관광',
    original: 'Dito po ako maghihintay.',
    translation: '여기서 기다릴게요.',
    pronunciation: '[디토 포 아코 막히힌타이]',
    toneGuide: '의사 전달',
    usageTip: '액티비티에 참여하지 않고 기다릴 때. 가이드에게 꼭 알려야 인원 점검에서 소동이 안 납니다.',
  },

  // ==========================================
  // [마사지] — 세기·통증·부위는 못 말하면 그냥 참게 됩니다.
  // ==========================================
  {
    id: 'ph-spa-01',
    countryId: 'ph',
    category: '마사지',
    original: 'May reservation po ako.',
    translation: '예약했어요.',
    pronunciation: '[마이 레저베이션 포 아코]',
    toneGuide: '접수',
    usageTip: '이름을 함께 보여주세요. 가이드가 단체로 예약한 경우 일행 이름으로 잡혀 있을 수 있습니다.',
  },
  {
    id: 'ph-spa-02',
    countryId: 'ph',
    category: '마사지',
    original: 'Magkano po ang isang oras?',
    translation: '한 시간에 얼마예요?',
    pronunciation: '[막카노 포 앙 이상 오라스]',
    toneGuide: '가격 질문',
    usageTip: '시간을 바꿔 물으려면 isang oras(1시간) → isa\'t kalahating oras(1시간 30분), dalawang oras(2시간).',
  },
  {
    id: 'ph-spa-03',
    countryId: 'ph',
    category: '마사지',
    original: 'Pakidiinan po nang konti.',
    translation: '조금 더 세게 해주세요.',
    pronunciation: '[파키디이난 포 낭 콘티]',
    toneGuide: '강도 요청',
    usageTip: '필리핀 마사지는 기본이 센 편이라 오히려 약하게를 더 자주 씁니다. 눌리는 순간 바로 말하세요.',
  },
  {
    id: 'ph-spa-04',
    countryId: 'ph',
    category: '마사지',
    original: 'Pakihinaan po nang konti.',
    translation: '조금 약하게 해주세요.',
    pronunciation: '[파키히나안 포 낭 콘티]',
    toneGuide: '강도 요청',
    usageTip: '참다가 멍이 드는 경우가 많습니다. 아프면 참지 말고 이 문장을 쓰세요.',
  },
  {
    id: 'ph-spa-05',
    countryId: 'ph',
    category: '마사지',
    original: 'Masakit po.',
    translation: '아파요.',
    pronunciation: '[마사킷 포]',
    toneGuide: '즉시 표현',
    usageTip: '두 단어면 충분합니다. 바로 힘을 빼줍니다.',
    isEmergency: true,
  },
  {
    id: 'ph-spa-06',
    countryId: 'ph',
    category: '마사지',
    original: 'Ang balikat ko po ang masakit.',
    translation: '어깨가 아파요. (거기를 봐주세요)',
    pronunciation: '[앙 발리캇 코 포 앙 마사킷]',
    toneGuide: '부위 지목',
    usageTip: 'balikat(어깨) 자리에 likod(등), binti(종아리), paa(발), leeg(목)을 넣으면 됩니다.',
  },
  {
    id: 'ph-spa-07',
    countryId: 'ph',
    category: '마사지',
    original: 'Wag po ninyong hawakan diyan.',
    translation: '거기는 만지지 마세요.',
    pronunciation: '[왁 포 니뇽 하와칸 디얀]',
    toneGuide: '단호한 거절 (정중형)',
    usageTip: '불편하면 바로 쓰세요. 참지 않아도 됩니다. 그래도 계속되면 나가서 프런트에 알리세요.',
    isEmergency: true,
  },
  {
    id: 'ph-spa-08',
    countryId: 'ph',
    category: '마사지',
    original: 'Walang oil po, dry massage lang.',
    translation: '오일 말고 드라이로 해주세요.',
    pronunciation: '[왈랑 오일 포, 드라이 마사지 랑]',
    toneGuide: '방식 요청',
    usageTip: '오일 알레르기가 있거나 바로 다음 일정이 있을 때. 반대로 오일을 원하면 "Oil massage po."',
  },
  {
    id: 'ph-spa-09',
    countryId: 'ph',
    category: '마사지',
    original: 'Gaano po katagal pa?',
    translation: '얼마나 남았어요?',
    pronunciation: '[가아노 포 카타갈 파]',
    toneGuide: '남은 시간 질문',
    usageTip: '다음 일정이 있을 때. 시작 전에 끝나는 시각을 미리 정해두는 게 더 확실합니다.',
  },
  {
    id: 'ph-spa-10',
    countryId: 'ph',
    category: '마사지',
    original: 'Magkano po ang tip na tama?',
    translation: '팁은 얼마가 적당해요?',
    pronunciation: '[막카노 포 앙 팁 나 타마]',
    toneGuide: '팁 문의',
    usageTip: '필리핀 스파는 팁이 관례입니다. 보통 1시간 기준 100~200페소 선이고, 마사지사에게 직접 건넵니다.',
  },
];
