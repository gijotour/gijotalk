import { Country, Phrase } from '../types';

export const COUNTRIES: Country[] = [
  {
    id: 'ph',
    name: '필리핀',
    flag: '🇵🇭',
    language: 'Tagalog',
    langCode: 'tl-PH',
    categories: ['전체', '항공', '호텔', '교통', '식당', '음식', '흥정', '관광', '마사지', '미팅/사교', '욕설/은어', '비상'],
    description: '마닐라, 세부, 보라카이, 팔라완 여행 필수 타갈로그어'
  },
  {
    id: 'vn',
    name: '베트남',
    flag: '🇻🇳',
    language: 'Vietnamese',
    langCode: 'vi-VN',
    categories: ['전체', '항공', '호텔', '교통', '식당', '음식', '흥정', '관광', '마사지', '미팅/사교', '욕설/은어', '비상'],
    description: '다낭, 하노이, 호치민, 나트랑 필수 베트남어'
  },
  {
    id: 'th',
    name: '태국',
    flag: '🇹🇭',
    language: 'Thai',
    langCode: 'th-TH',
    categories: ['전체', '항공', '호텔', '교통', '식당', '음식', '흥정', '관광', '마사지', '미팅/사교', '욕설/은어', '비상'],
    description: '방콕, 푸켓, 치앙마이 필수 태국어'
  },
  {
    id: 'id',
    name: '인도네시아',
    flag: '🇮🇩',
    language: 'Indonesian',
    langCode: 'id-ID',
    categories: ['전체', '항공', '호텔', '교통', '식당', '음식', '흥정', '관광', '마사지', '미팅/사교', '욕설/은어', '비상'],
    description: '발리, 자카르타, 롬복 필수 인도네시아어'
  },
  {
    id: 'la',
    name: '라오스',
    flag: '🇱🇦',
    language: 'Lao',
    langCode: 'lo-LA',
    categories: ['전체', '항공', '호텔', '교통', '식당', '음식', '흥정', '관광', '마사지', '미팅/사교', '욕설/은어', '비상'],
    description: '비엔티안, 방비엥, 루앙프라방 필수 라오어'
  }
];

export const PHRASES: Phrase[] = [
  // ==========================================
  // 🇵🇭 필리핀 (Tagalog)
  // ==========================================
  // [항공]
  {
    id: 'ph-air-01',
    countryId: 'ph',
    category: '항공',
    original: 'Nasaan po ang check-in counter?',
    translation: '체크인 카운터가 어디인가요?',
    pronunciation: '[나사안 포 앙 체크인 카운터?]',
    toneGuide: 'Polite inquiry',
    usageTip: '마닐라 니노이 아키노 또는 세부 막탄 공항 터미널 입장 후 물어보세요.'
  },
  {
    id: 'ph-air-02',
    countryId: 'ph',
    category: '항공',
    original: 'May I have a window seat, please?',
    translation: '창가 쪽 좌석으로 부탁드립니다.',
    pronunciation: '[메이 아이 해브 어 윈도우 시트, 플리즈?]',
    toneGuide: 'Seat preference',
    usageTip: '필리핀 항공 수속 시 영어/타갈로그 혼용 표현으로 전하면 유용합니다.'
  },
  {
    id: 'ph-air-03',
    countryId: 'ph',
    category: '항공',
    original: 'Pahingi po ng tubig.',
    translation: '물 한 잔 부탁드립니다.',
    pronunciation: '[파힝기 포 낭 투빅]',
    toneGuide: 'Polite request',
    usageTip: '기내나 공항 라운지에서 정중히 물을 청할 때 사용합니다.'
  },
  {
    id: 'ph-air-04',
    countryId: 'ph',
    category: '항공',
    original: 'Saan po ang baggage claim?',
    translation: '수하물 찾는 곳이 어디인가요?',
    pronunciation: '[사안 포 앙 배기지 클레임?]',
    toneGuide: 'Airport navigation',
    usageTip: '입국 심사를 마친 후 가방을 찾으러 갈 때 공항 직원에게 물어보세요.'
  },
  {
    id: 'ph-air-05',
    countryId: 'ph',
    category: '항공',
    original: 'Nawawala po ang bagahe ko.',
    translation: '제 수하물이 분실되었습니다.',
    pronunciation: '[나와와라 포 앙 바가헤 코]',
    toneGuide: 'Urgent assistance',
    usageTip: '수하물 벨트에서 가방이 나오지 않을 때 분실 신고소에 보여주세요.',
    isEmergency: true
  },
  {
    id: 'ph-air-06',
    countryId: 'ph',
    category: '항공',
    original: 'Pasyal at bakasyon lang po ang sadya ko.',
    translation: '관광 및 휴가 목적으로 방문했습니다.',
    pronunciation: '[파샬 앗 바카시온 랑 포 앙 사디아 코]',
    toneGuide: 'Immigration answer',
    usageTip: '필리핀 입국 심사관이 방문 목적을 물을 때 대답하세요.'
  },

  // [호텔]
  {
    id: 'ph-hot-01',
    countryId: 'ph',
    category: '호텔',
    original: 'Gusto ko po mag-check in.',
    translation: '체크인하려고 합니다.',
    pronunciation: '[구스토 코 포 막-체크인]',
    toneGuide: 'Hotel check-in',
    usageTip: '리셉션에 바우처와 여권을 제시하며 인사와 함께 말해보세요.'
  },
  {
    id: 'ph-hot-02',
    countryId: 'ph',
    category: '호텔',
    original: 'Puwede po ba mag-iwan ng bagahe?',
    translation: '체크인 전/후 짐을 맡길 수 있나요?',
    pronunciation: '[푸웨데 포 바 막-이완 낭 바가헤?]',
    toneGuide: 'Luggage storage',
    usageTip: '얼리 체크인이 안 될 때 짐만 로비에 보관하고 나갈 때 제격입니다.'
  },
  {
    id: 'ph-hot-03',
    countryId: 'ph',
    category: '호텔',
    original: 'Ano po ang Wi-Fi password?',
    translation: '와이파이 비밀번호가 무엇인가요?',
    pronunciation: '[아노 포 앙 와이파이 패스워드?]',
    toneGuide: 'Inquiry',
    usageTip: '객실 입실 후 인터넷 연결할 때 물어보세요.'
  },
  {
    id: 'ph-hot-04',
    countryId: 'ph',
    category: '호텔',
    original: 'Pahingi po ng karagdagang tuwalya.',
    translation: '수건 더 부탁드립니다.',
    pronunciation: '[파힝기 포 낭 카락다강 투왈리야]',
    toneGuide: 'Amenities request',
    usageTip: '수영 후 타월이 모자랄 때 룸서비스나 프런트에 요청하세요.'
  },
  {
    id: 'ph-hot-05',
    countryId: 'ph',
    category: '호텔',
    original: 'Hindi po gumagana ang aircon / mainit na tubig.',
    translation: '에어컨/온수가 작동하지 않아요.',
    pronunciation: '[힌디 포 구마가나 앙 에어콘 / 마이닛 나 투빅]',
    toneGuide: 'Room issue alert',
    usageTip: '동남아 리조트 특성상 에어컨 고장 시 즉시 프런트에 알려 방 변경을 요청하세요.',
    isEmergency: true
  },
  {
    id: 'ph-hot-06',
    countryId: 'ph',
    category: '호텔',
    original: 'Anong oras po ang breakfast?',
    translation: '조식 시간이 몇 시인가요?',
    pronunciation: '[아농 오라스 포 앙 브렉퍼스트?]',
    toneGuide: 'Breakfast info',
    usageTip: '아침 식사 제공 시간과 뷔페 위치를 파악할 때 물어보세요.'
  },
  {
    id: 'ph-hot-07',
    countryId: 'ph',
    category: '호텔',
    original: 'Puwede po ba mag-late check-out?',
    translation: '레이트 체크아웃 가능한가요?',
    pronunciation: '[푸웨데 포 바 막-레이트 체크아웃?]',
    toneGuide: 'Extension request',
    usageTip: '밤 비행기로 귀국할 때 오후까지 방을 사용할 수 있는지 문의하세요.'
  },

  // [교통]
  {
    id: 'ph-01',
    countryId: 'ph',
    category: '교통',
    original: 'Para po!',
    translation: '여기 세워주세요',
    pronunciation: '[파라 포!]',
    toneGuide: 'Standard (존칭 po 사용)',
    usageTip: '지프니나 트라이시클에서 내릴 때 운전기사에게 큰 소리로 외치세요.',
    isEmergency: true
  },
  {
    id: 'ph-04',
    countryId: 'ph',
    category: '교통',
    original: 'Bayad po.',
    translation: '요금 낼게요.',
    pronunciation: '[바야드 포]',
    toneGuide: 'Polite handover',
    usageTip: '지프니 안에서 승객들끼리 요금을 앞사람에게 전달해달라고 할 때 씁니다.'
  },
  {
    id: 'ph-10',
    countryId: 'ph',
    category: '교통',
    original: 'Pakibuksan po ang metro.',
    translation: '미터기 켜고 가주세요!',
    pronunciation: '[파키북산 포 앙 메트로]',
    toneGuide: 'Firm request',
    usageTip: '마닐라/세부 택시 탑승 시 출발 직후 미터기 작동을 요청하세요.'
  },
  {
    id: 'ph-11',
    countryId: 'ph',
    category: '교통',
    original: 'Sa airport po tayo.',
    translation: '공항으로 가주세요.',
    pronunciation: '[사 에어포트 포 타요]',
    toneGuide: 'Destination',
    usageTip: '터미널 번호(T1, T2, T3)를 함께 말해주시면 좋습니다.'
  },

  // [식당]
  {
    id: 'ph-03',
    countryId: 'ph',
    category: '식당',
    original: 'Masarap!',
    translation: '맛있어요!',
    pronunciation: '[마사랍!]',
    toneGuide: 'Enthusiastic',
    usageTip: '식당 직원이나 요리사에게 칭찬할 때 환한 미소와 함께 말해보세요.'
  },
  {
    id: 'ph-06',
    countryId: 'ph',
    category: '식당',
    original: 'Pahingi po ng tubig.',
    translation: '물 좀 부탁드립니다.',
    pronunciation: '[파힝기 포 낭 투빅]',
    toneGuide: 'Polite request',
    usageTip: '필리핀 식당에서는 물을 기본 제공 안 하는 곳도 있어 요청이 필요합니다.'
  },
  {
    id: 'ph-07',
    countryId: 'ph',
    category: '식당',
    original: 'Bill out po!',
    translation: '계산서 주세요!',
    pronunciation: '[빌 아웃 포!]',
    toneGuide: 'Asking bill',
    usageTip: '손가락으로 공중에 서명하는 흉내를 내며 외치면 바로 알아듣습니다.'
  },
  {
    id: 'ph-12',
    countryId: 'ph',
    category: '식당',
    original: 'Walang wansoy po.',
    translation: '고수 빼주세요!',
    pronunciation: '[왈랑 완소이 포]',
    toneGuide: 'Dietary restriction',
    usageTip: '향신료 알레르기가 있거나 고수를 못 드시는 분 필수 문장.'
  },

  // [흥정]
  {
    id: 'ph-02',
    countryId: 'ph',
    category: '흥정',
    original: 'Magkano po ito?',
    translation: '이거 얼마인가요?',
    pronunciation: '[막카노 포 이토?]',
    toneGuide: 'Asking price',
    usageTip: '야시장이나 야외 상점에서 물건을 가리키며 물어보세요.'
  },
  {
    id: 'ph-05',
    countryId: 'ph',
    category: '흥정',
    original: 'Masyadong mahal, bawas naman!',
    translation: '너무 비싸요, 조금만 깎아주세요!',
    pronunciation: '[마샤동 마할, 바와스 나만!]',
    toneGuide: 'Friendly bargaining',
    usageTip: '상인이 부른 가격에 웃으며 말하면 정감 있게 흥정할 수 있습니다.'
  },

  // [미팅/사교]
  {
    id: 'ph-13',
    countryId: 'ph',
    category: '미팅/사교',
    original: 'Ang ganda mo!',
    translation: '너무 예쁘세요!',
    pronunciation: '[앙 간다 모!]',
    toneGuide: 'Warm compliment',
    usageTip: '카페나 사교 자리, 데이트 시 자연스럽게 미소 지으며 칭찬하세요.'
  },
  {
    id: 'ph-14',
    countryId: 'ph',
    category: '미팅/사교',
    original: 'May boyfriend ka na ba?',
    translation: '혹시 남자친구 있으세요?',
    pronunciation: '[마이 보이프렌드 카 나 바?]',
    toneGuide: 'Asking status',
    usageTip: '상대방과의 대화 흐름 속에서 정중하게 물어볼 때 사용합니다.'
  },
  {
    id: 'ph-15',
    countryId: 'ph',
    category: '미팅/사교',
    original: 'Ano ang Instagram mo?',
    translation: '인스타그램 계정이 어떻게 되나요?',
    pronunciation: '[아노 앙 인스타그램 모?]',
    toneGuide: 'Social connect',
    usageTip: '필리핀에서는 인스타그램이나 Facebook 메신저 교환이 일반적입니다.'
  },
  {
    id: 'ph-16',
    countryId: 'ph',
    category: '미팅/사교',
    original: 'Gusto mo mag-coffee tayo?',
    translation: '같이 커피 한 잔 하실래요?',
    pronunciation: '[구스토 모 막-커피 타요?]',
    toneGuide: 'Friendly invite',
    usageTip: '부담 없는 커피 데이트 제안에 제격입니다.'
  },
  {
    id: 'ph-17',
    countryId: 'ph',
    category: '미팅/사교',
    original: 'Ang bait at sweet mo naman.',
    translation: '정말 친절하고 매력적이시네요.',
    pronunciation: '[앙 바이트 앗 스윗 모 나만]',
    toneGuide: 'Sweet praise',
    usageTip: '상대방의 다정한 태도나 행동에 감사와 칭찬을 건넬 때 쓰세요.'
  },
  {
    id: 'ph-18',
    countryId: 'ph',
    category: '미팅/사교',
    original: 'Magkita tayo ulit ha?',
    translation: '우리 다음에 꼭 또 만나요!',
    pronunciation: '[막키타 타요 우릿 하?]',
    toneGuide: 'Warm goodbye',
    usageTip: '헤어질 때 정감 있게 아쉬움을 표하는 호감 가득한 표현입니다.'
  },

  // [비상]
  {
    id: 'ph-08',
    countryId: 'ph',
    category: '비상',
    original: 'Saan ang banyo?',
    translation: '화장실이 어디인가요?',
    pronunciation: '[사안 앙 바뇨?]',
    toneGuide: 'Urgent',
    usageTip: '급할 때 근처 점원에게 화면을 보여주거나 외쳐보세요.',
    isEmergency: true
  },
  {
    id: 'ph-09',
    countryId: 'ph',
    category: '비상',
    original: 'Tulong! Paki-ingat!',
    translation: '도와주세요! 조심하세요!',
    pronunciation: '[툴롱! 파키-잉앗!]',
    toneGuide: 'Emergency alert',
    usageTip: '위급한 상황이나 소매치기 등 위험 발생 시 사용하세요.',
    isEmergency: true
  },


  // ==========================================
  // 🇻🇳 베트남 (Vietnamese)
  // ==========================================
  // [항공]
  {
    id: 'vn-air-01',
    countryId: 'vn',
    category: '항공',
    original: 'Quầy làm thủ tục ở đâu?',
    translation: '체크인 카운터가 어디예요?',
    pronunciation: '[꽈이 람 투 뚝 어 더우?]',
    toneGuide: 'Airport navigation',
    usageTip: '하노이 노이바이 또는 호치민 떤썬냛 공항 입국장에서 탑승 수속 카운터를 찾을 때 물어보세요.'
  },
  {
    id: 'vn-air-02',
    countryId: 'vn',
    category: '항공',
    original: 'Cho tôi chỗ ngồi cạnh cửa sổ.',
    translation: '창가 쪽 좌석으로 주세요.',
    pronunciation: '[찌어 토이 쪼 응오이 까인 꺼 소]',
    toneGuide: 'Seat selection',
    usageTip: '베트남항공 / 비엣젯 체크인 시 시원한 바깥 풍경을 보고 싶다면 요청하세요.'
  },
  {
    id: 'vn-air-03',
    countryId: 'vn',
    category: '항공',
    original: 'Nơi lấy hành lý ở đâu?',
    translation: '수하물 찾는 곳이 어디인가요?',
    pronunciation: '[너이 레이 행 리 어 더우?]',
    toneGuide: 'Baggage claim',
    usageTip: '입국 심사 후 수하물 벨트를 찾아갈 때 주변 직원에게 여쭤보세요.'
  },
  {
    id: 'vn-air-04',
    countryId: 'vn',
    category: '항공',
    original: 'Hành lý của tôi bị thất lạc.',
    translation: '제 수하물이 나오지 않았어요 / 분실되었습니다.',
    pronunciation: '[행 리 꿔 토이 비 텃 락]',
    toneGuide: 'Lost baggage alert',
    usageTip: '가방이 분실되었을 때 공항 안내소나 항공사 카운터에 빠르게 보여주세요.',
    isEmergency: true
  },
  {
    id: 'vn-air-05',
    countryId: 'vn',
    category: '항공',
    original: 'Tôi đến đây để du lịch.',
    translation: '관광/여행 목적으로 왔습니다.',
    pronunciation: '[토i 덴 데이 데 두 릭]',
    toneGuide: 'Immigration query',
    usageTip: '베트남 입국 심사관이 방문 목적을 물어볼 때 미소 지으며 대답하세요.'
  },
  {
    id: 'vn-air-06',
    countryId: 'vn',
    category: '항공',
    original: 'Cho tôi xin một cốc nước.',
    translation: '물 한 잔만 부탁드립니다.',
    pronunciation: '[찌어 토이 신 못 꼭 믁]',
    toneGuide: 'Water order',
    usageTip: '기내나 공항 라운지에서 물을 요청할 때 유용합니다.'
  },

  // [호텔]
  {
    id: 'vn-hot-01',
    countryId: 'vn',
    category: '호텔',
    original: 'Tôi muốn nhận phòng / Check-in.',
    translation: '체크인 하려고 합니다.',
    pronunciation: '[토이 무온 녛 퐁 / 체크인]',
    toneGuide: 'Hotel check-in',
    usageTip: '호텔 리셉션에서 예약 바우처와 여권을 제출하며 건네세요.'
  },
  {
    id: 'vn-hot-02',
    countryId: 'vn',
    category: '호텔',
    original: 'Tôi có thể gửi hành lý ở đây không?',
    translation: '짐을 잠시 맡길 수 있을까요?',
    pronunciation: '[토이 까 테 구이 행 리 어 데이 콤?]',
    toneGuide: 'Luggage storage',
    usageTip: '체크인 전이나 체크아웃 후 여행을 즐기기 위해 짐을 맡길 때 요청하세요.'
  },
  {
    id: 'vn-hot-03',
    countryId: 'vn',
    category: '호텔',
    original: 'Mật khẩu Wi-Fi là gì?',
    translation: '와이파이 비밀번호가 무엇인가요?',
    pronunciation: '[멋 껍 와이파이 라 지?]',
    toneGuide: 'Wi-Fi request',
    usageTip: '객실 입실 후 또는 호텔 로비 카페 이용 시 물어보세요.'
  },
  {
    id: 'vn-hot-04',
    countryId: 'vn',
    category: '호텔',
    original: 'Cho tôi xin thêm khăn tắm.',
    translation: '수건 좀 더 주실 수 있나요?',
    pronunciation: '[찌어 토이 신 템 깐 탐]',
    toneGuide: 'Towel request',
    usageTip: '물놀이 후 타월이 더 필요할 때 룸서비스로 요청해보세요.'
  },
  {
    id: 'vn-hot-05',
    countryId: 'vn',
    category: '호텔',
    original: 'Máy lạnh / Nước nóng bị hỏng.',
    translation: '에어컨/온수가 작동하지 않아요.',
    pronunciation: '[마이 라잉 / 믁 농 비 홍]',
    toneGuide: 'Room issue alert',
    usageTip: '덥거나 샤워 시 온수가 나오지 않을 때 프런트에 고장을 알리세요.',
    isEmergency: true
  },
  {
    id: 'vn-hot-06',
    countryId: 'vn',
    category: '호텔',
    original: 'Mấy giờ có ăn sáng?',
    translation: '조식 식사 시간이 몇 시인가요?',
    pronunciation: '[메이 지어 까 안 상?]',
    toneGuide: 'Breakfast hours',
    usageTip: '아침 조식 뷔페 시작/마감 시간을 확인할 때 질문하세요.'
  },
  {
    id: 'vn-hot-07',
    countryId: 'vn',
    category: '호텔',
    original: 'Giúp tôi gọi taxi được không?',
    translation: '택시 좀 불러주실 수 있나요?',
    pronunciation: '[줍 토이 고이 택시 뛐 콤?]',
    toneGuide: 'Taxi dispatch',
    usageTip: '공항으로 출발할 때 호텔 로비 직원에게 정중히 도움을 청하세요.'
  },

  // [교통]
  {
    id: 'vn-01',
    countryId: 'vn',
    category: '교통',
    original: 'Cho tôi dừng ở đây!',
    translation: '여기 세워주세요!',
    pronunciation: '[찌어 토이 쯩 어 데이!]',
    toneGuide: 'Clear & Direct',
    usageTip: '그랩(Grab) 차 안이나 시클로, 오토바이 탈 때 내릴 곳에 외치세요.',
    isEmergency: true
  },
  {
    id: 'vn-07',
    countryId: 'vn',
    category: '교통',
    original: 'Bật đồng hồ mét lên!',
    translation: '미터기 켜주세요!',
    pronunciation: '[밧 똥 호 메트 렌!]',
    toneGuide: 'Firm direction',
    usageTip: '일반 마이린(Mai Linh) 택시 승차 시 바가지 예방에 쓰입니다.'
  },
  {
    id: 'vn-11',
    countryId: 'vn',
    category: '교통',
    original: 'Đi sân bay.',
    translation: '공항으로 갑시다.',
    pronunciation: '[디 산 바이]',
    toneGuide: 'Navigation',
    usageTip: '하노이 노이바이, 호치민 떤썬냠, 다낭 공항 가기 전 사용하세요.'
  },

  // [식당]
  {
    id: 'vn-04',
    countryId: 'vn',
    category: '식당',
    original: 'Không cho rau mùi / Ngò rí!',
    translation: '고수(라우 무이) 넣지 마세요!',
    pronunciation: '[콤 찌어 라우 무이!]',
    toneGuide: 'Important restriction',
    usageTip: '쌀국수(Pho)나 반미(Banh Mi) 주문 시 필수 표현입니다.',
    isEmergency: true
  },
  {
    id: 'vn-05',
    countryId: 'vn',
    category: '식당',
    original: 'Ngon lắm!',
    translation: '정말 맛있어요!',
    pronunciation: '[응온 람!]',
    toneGuide: 'Warm compliment',
    usageTip: '베트남 로컬 식당 사장님이 들으면 아주 기뻐합니다.'
  },
  {
    id: 'vn-06',
    countryId: 'vn',
    category: '식당',
    original: 'Tính tiền!',
    translation: '계산해주세요!',
    pronunciation: '[띤 띠엔!]',
    toneGuide: 'Polite calling',
    usageTip: '손을 살짝 들고 "띤 띠엔 어이!" 하고 외치세요.'
  },
  {
    id: 'vn-10',
    countryId: 'vn',
    category: '식당',
    original: 'Cho tôi nước đá!',
    translation: '얼음물 주세용!',
    pronunciation: '[찌어 토이 믁 다!]',
    toneGuide: 'Beverage order',
    usageTip: '베트남 더운 날씨에 시원한 얼음물을 요청할 때 쓰입니다.'
  },

  // [흥정]
  {
    id: 'vn-02',
    countryId: 'vn',
    category: '흥정',
    original: 'Bao nhiêu tiền?',
    translation: '얼마예요?',
    pronunciation: '[바오 뇨 띠엔?]',
    toneGuide: 'Inquiry',
    usageTip: '벤탄 시장이나 하노이 야시장에서 물건 가리키며 질문하세요.'
  },
  {
    id: 'vn-03',
    countryId: 'vn',
    category: '흥정',
    original: 'Đắt quá, giảm giá đi!',
    translation: '너무 비싸요, 깎아주세요!',
    pronunciation: '[닥 까, 믐 자 디!]',
    toneGuide: 'Playful bargaining',
    usageTip: '처음 상인이 부른 값의 30~50% 정도 낮춰 부르기 전 사용해 보세요.'
  },
  {
    id: 'vn-12',
    countryId: 'vn',
    category: '흥정',
    original: 'Cảm ơn nhiều!',
    translation: '정말 감사합니다!',
    pronunciation: '[깝 으엉 뇨!]',
    toneGuide: 'Polite thanks',
    usageTip: '친절한 현지인이나 가이드에게 진심 어린 감사를 전해보세요.'
  },

  // [미팅/사교]
  //
  // ⚠️ 원래 이 6개는 "Em đẹp lắm!(너무 예뻐요)" 처럼 헌팅에 가까운 톤이었습니다.
  //    phrases.vn.social.ts 를 필리핀판과 같은 인사·스몰토크·정중한 거절 축으로
  //    새로 채우면서, 기존 카테고리와 톤이 어긋나지 않도록 이 6개도 같은 축—
  //    친구되기·연락처·가벼운 제안·호의·작별 — 으로 다시 썼습니다.
  {
    id: 'vn-13',
    countryId: 'vn',
    category: '미팅/사교',
    original: 'Chúng ta làm bạn nhé?',
    translation: '우리 친구 해도 될까요?',
    pronunciation: '[쭝 따 람 반 냬?]',
    toneGuide: '친근하게',
    usageTip: '베트남에서는 이 말이 어색하지 않습니다. 친구 사귀는 데 매우 개방적입니다.'
  },
  {
    id: 'vn-14',
    countryId: 'vn',
    category: '미팅/사교',
    original: 'Anh/Chị có dùng Zalo hoặc Instagram không?',
    translation: '잘로나 인스타 쓰세요?',
    pronunciation: '[아잉/찌 꼬 중 자로 호악 인스타그램 콤?]',
    toneGuide: '연락처 교환',
    usageTip: '베트남은 카카오톡 대신 Zalo를 국민 메신저로 씁니다. Zalo부터 물어보세요.'
  },
  {
    id: 'vn-15',
    countryId: 'vn',
    category: '미팅/사교',
    original: 'Khi nào rảnh, đi cà phê nhé?',
    translation: '시간 되실 때 커피 한잔 하실래요?',
    pronunciation: '[키 나오 자잉, 디 까 페 냬?]',
    toneGuide: '가벼운 제안',
    usageTip: '커피는 부담 없는 첫 제안입니다. 상대가 망설이면 더 밀지 마세요.'
  },
  {
    id: 'vn-16',
    countryId: 'vn',
    category: '미팅/사교',
    original: 'Để tôi trả tiền cho.',
    translation: '제가 살게요.',
    pronunciation: '[데 또이 짜 띠엔 쪼]',
    toneGuide: '호의 표시',
    usageTip: '초대한 쪽이 내는 문화입니다. 먼저 제안했다면 계산도 준비하세요.'
  },
  {
    id: 'vn-17',
    countryId: 'vn',
    category: '미팅/사교',
    original: 'Về nhà cẩn thận nhé.',
    translation: '집에 조심히 들어가세요.',
    pronunciation: '[베 냐 껀 턴 냬]',
    toneGuide: '헤어질 때',
    usageTip: '베트남에서 가장 따뜻하게 들리는 작별 인사 중 하나입니다.'
  },
  {
    id: 'vn-18',
    countryId: 'vn',
    category: '미팅/사교',
    original: 'Tiếc quá, mai tôi phải đi rồi. Hẹn gặp lại nhé!',
    translation: '아쉽네요, 내일 떠나요. 다음에 또 만나요!',
    pronunciation: '[띠엑 꽈, 마이 또이 파이 디 조이. 헨 갑 라이 냬!]',
    toneGuide: '작별',
    usageTip: '여행 마지막 날 새로 사귄 인연과 나누기 좋은 인사입니다.'
  },

  // [비상]
  {
    id: 'vn-08',
    countryId: 'vn',
    category: '비상',
    original: 'Nhà vệ sinh ở đâu?',
    translation: '화장실이 어디예요?',
    pronunciation: '[냐 웨 싱 어 더우?]',
    toneGuide: 'Urgent',
    usageTip: '카페나 식당에서 긴급할 때 물어보세요.',
    isEmergency: true
  },
  {
    id: 'vn-09',
    countryId: 'vn',
    category: '비상',
    original: 'Cứu tôi với!',
    translation: '도와주세요! 살려주세요!',
    pronunciation: '[끼우 토이 워이!]',
    toneGuide: 'Critical emergency',
    usageTip: '긴급한 상황 발생 시 화면 전광판 모드로 큰 소리로 내보내세요.',
    isEmergency: true
  },


  // ==========================================
  // 🇹🇭 태국 (Thai)
  // ==========================================
  // [항공]
  {
    id: 'th-air-01',
    countryId: 'th',
    category: '항공',
    original: 'เคาน์เตอร์เช็คอินอยู่ที่ไหนครับ?',
    translation: '체크인 카운터가 어디인가요?',
    pronunciation: '[카운터 체크인 유 티나이 캅?]',
    toneGuide: 'Airport navigation',
    usageTip: '방콕 수완나품 또는 돈므앙 공항 출국장에서 체크인 구역을 문의할 때 쓰세요.'
  },
  {
    id: 'th-air-02',
    countryId: 'th',
    category: '항공',
    original: 'ขอที่นั่งติดหน้าต่างครับ',
    translation: '창가 자리로 부탁합니다.',
    pronunciation: '[코 티낭 띳 나타앙 캅]',
    toneGuide: 'Seat preference',
    usageTip: '태국 항공사 수속 시 정중하게 선호하는 좌석을 요청하세요.'
  },
  {
    id: 'th-air-03',
    countryId: 'th',
    category: '항공',
    original: 'จุดรับกระเป๋าอยู่ที่ไหนครับ?',
    translation: '짐 찾는 곳(수하물 찾기)이 어디예요?',
    pronunciation: '[쭏 랍 까쁘라우 유 티나이 캅?]',
    toneGuide: 'Baggage claim',
    usageTip: '입국 후 내 수하물이 도착하는 벨트 위치를 물어보세요.'
  },
  {
    id: 'th-air-04',
    countryId: 'th',
    category: '항공',
    original: 'กระเป๋าเดินทางหายครับ',
    translation: '제 수하물이 분실되었습니다.',
    pronunciation: '[까쁘라우 듬ทาง 하이 캅]',
    toneGuide: 'Lost bag alert',
    usageTip: '가방이 수하물 레일에 나오지 않을 때 분실 수속 창구에 전하세요.',
    isEmergency: true
  },
  {
    id: 'th-air-05',
    countryId: 'th',
    category: '항공',
    original: 'มาเที่ยวครับ',
    translation: '관광/여행 목적으로 왔습니다.',
    pronunciation: '[마 티에우 캅]',
    toneGuide: 'Immigration response',
    usageTip: '태국 입국 심사관이 방문 목적을 물을 때 대답하세요.'
  },
  {
    id: 'th-air-06',
    countryId: 'th',
    category: '항공',
    original: 'ขอน้ำเปล่าแก้วหนึ่งครับ',
    translation: '물 한 잔 부탁드립니다.',
    pronunciation: '[코 남쁘라우 깨우 능 캅]',
    toneGuide: 'Water order',
    usageTip: '기내나 공항 식당에서 목이 마를 때 정중히 주문하세요.'
  },

  // [호텔]
  {
    id: 'th-hot-01',
    countryId: 'th',
    category: '호텔',
    original: 'เช็คอินครับ',
    translation: '체크인 하려고 합니다.',
    pronunciation: '[체크인 캅]',
    toneGuide: 'Hotel check-in',
    usageTip: '호텔 프런트 데스크 직원에게 바우처를 보여주며 밝게 대화하세요.'
  },
  {
    id: 'th-hot-02',
    countryId: 'th',
    category: '호텔',
    original: 'ฝากกระเป๋าไว้ก่อนได้ไหมครับ?',
    translation: '체크인 전 짐을 맡길 수 있나요?',
    pronunciation: '[팍 까쁘라우 와이 콘 다이마이 캅?]',
    toneGuide: 'Luggage storage',
    usageTip: '방콕/푸켓 호텔에 일찍 도착했을 때 캐리어를 안심하고 보관하세요.'
  },
  {
    id: 'th-hot-03',
    countryId: 'th',
    category: '호텔',
    original: 'รหัส Wi-Fi คืออะไรครับ?',
    translation: '와이파이 비밀번호가 무엇인가요?',
    pronunciation: '[라핫 와이파이 크 어라이 캅?]',
    toneGuide: 'Wi-Fi request',
    usageTip: '객실 입장 후 Wi-Fi 신호가 잡히면 비번을 확인할 때 쓰세요.'
  },
  {
    id: 'th-hot-04',
    countryId: 'th',
    category: '호텔',
    original: 'ขอผ้าเช็ดตัวเพิ่มครับ',
    translation: '수건 추가로 부탁드립니다.',
    pronunciation: '[코 파쳇똠 프엠 캅]',
    toneGuide: 'Towel request',
    usageTip: '수영장 이용이나 샤워 후 타월이 모자랄 때 요청하세요.'
  },
  {
    id: 'th-hot-05',
    countryId: 'th',
    category: '호텔',
    original: 'แอร์ / น้ำอุ่น ไม่ทำงานครับ',
    translation: '에어컨/온수가 안 돼요.',
    pronunciation: '[에어 / 남운 마이 탐간 캅]',
    toneGuide: 'Room issue alert',
    usageTip: '에어컨 작동이 정지되거나 수압/온수에 문제가 있을 때 카운터에 알려주세요.',
    isEmergency: true
  },
  {
    id: 'th-hot-06',
    countryId: 'th',
    category: '호텔',
    original: 'อาหารเช้ากี่โมงครับ?',
    translation: '조식 시간이 몇 시부터인가요?',
    pronunciation: '[아한차오 기몽 캅?]',
    toneGuide: 'Breakfast time',
    usageTip: '리조트 내 아침 식사 운영 시간을 문의할 때 말하세요.'
  },
  {
    id: 'th-hot-07',
    countryId: 'th',
    category: '호텔',
    original: 'ช่วยเรียกรถแท็กซี่ให้หน่อยครับ',
    translation: '택시 좀 불러주실 수 있나요?',
    pronunciation: '[쭈아이 리억 롯 택시 하이 노이 캅]',
    toneGuide: 'Taxi dispatch',
    usageTip: '공항이나 멀리 떨어진 야시장 이동 시 호텔에 택시 호출 요청에 유용합니다.'
  },

  // [교통]
  {
    id: 'th-01',
    countryId: 'th',
    category: '교통',
    original: 'จอดที่นี่ครับ / ค่ะ',
    translation: '여기 세워주세요!',
    pronunciation: '[똣 티니 캅!]',
    toneGuide: 'Polite (남성 캅 / 여성 카)',
    usageTip: '툭툭(TukTuk)이나 성태우, 썽태우 탑승 중 목적지 근처에서 사용하세요.',
    isEmergency: true
  },
  {
    id: 'th-06',
    countryId: 'th',
    category: '교통',
    original: 'เปิดมิเตอร์ด้วยครับ',
    translation: '미터기 켜고 가주세요',
    pronunciation: '[뻫 미터 두아이 캅]',
    toneGuide: 'Firm request',
    usageTip: '방콕 시내 택시 탈 때 "노 미터" 거부 시 정중하게 요구하세요.'
  },
  {
    id: 'th-11',
    countryId: 'th',
    category: '교통',
    original: 'ไปสนามบินครับ',
    translation: '공항으로 가주세요',
    pronunciation: '[빠이 사남빈 캅]',
    toneGuide: 'Airport travel',
    usageTip: '방콕 수완나품 또는 돈므앙 공항 구분을 꼭 해주는 것이 좋습니다.'
  },

  // [식당]
  {
    id: 'th-04',
    countryId: 'th',
    category: '식당',
    original: 'ไม่ใส่ผักชีครับ',
    translation: '팍치(고수) 빼주세요!',
    pronunciation: '[마이 싸이 팍치 캅!]',
    toneGuide: 'Crucial order tip',
    usageTip: '똠얌꿍이나 팟타이 주문 시 고수를 싫어한다면 반드시 외치세요!',
    isEmergency: true
  },
  {
    id: 'th-05',
    countryId: 'th',
    category: '식당',
    original: 'อร่อยมากครับ!',
    translation: '정말 맛있어요!',
    pronunciation: '[아로이 막 캅!]',
    toneGuide: 'Compliment',
    usageTip: '태국 유명 맛집에서 사장님께 엄지를 세우며 말씀해보세요.'
  },
  {
    id: 'th-07',
    countryId: 'th',
    category: '식당',
    original: 'เก็บเงินด้วยครับ',
    translation: '계산해주세요',
    pronunciation: '[멉 응언 두아이 캅]',
    toneGuide: 'Check please',
    usageTip: '식사를 마친 후 테이블에서 직원에게 말씀하세요.'
  },
  {
    id: 'th-10',
    countryId: 'th',
    category: '식당',
    original: 'ขอเผ็ดน้อยครับ',
    translation: '덜 맵게 해주세요',
    pronunciation: '[코 펫 노이 캅]',
    toneGuide: 'Spiciness adjustment',
    usageTip: '태국 음식은 꽤 매우므로 매운 걸 못 드시면 꼭 요청하세요.'
  },

  // [흥정]
  {
    id: 'th-02',
    countryId: 'th',
    category: '흥정',
    original: 'เท่าไหร่ครับ?',
    translation: '얼마인가요?',
    pronunciation: '[타오 라이 캅?]',
    toneGuide: 'Price check',
    usageTip: '짜뚜짝 주말시장이나 밤 야시장에서 물건을 가리키며 말해보세요.'
  },
  {
    id: 'th-03',
    countryId: 'th',
    category: '흥정',
    original: 'แพงไป ลดได้ไหม?',
    translation: '너무 비싸요, 깎아줄 수 있나요?',
    pronunciation: '[팽 빠이, 롯 다이 마이?]',
    toneGuide: 'Polite bargaining',
    usageTip: '태국 상인들은 애교 섞인 톤으로 말하면 예쁘게 깎아주곤 합니다.'
  },
  {
    id: 'th-12',
    countryId: 'th',
    category: '흥정',
    original: 'ขอบคุณครับ!',
    translation: '감사합니다!',
    pronunciation: '[컵 쿤 캅!]',
    toneGuide: 'Greeting/Thanks',
    usageTip: '두 손을 가슴 높이로 모으는 "와이(Wai)" 인사와 함께 말하세요.'
  },

  // [미팅/사교]
  {
    id: 'th-13',
    countryId: 'th',
    category: '미팅/사교',
    original: 'คุณสวยมากครับ / ค่ะ',
    translation: '너무 아름다우세요!',
    pronunciation: '[쿤 스아이 막 캅!]',
    toneGuide: 'Polite praise',
    usageTip: '태국에서 호감을 고백하거나 진심 어린 칭찬을 전달할 때 쓰입니다.'
  },
  {
    id: 'th-14',
    countryId: 'th',
    category: '미팅/사교',
    original: 'ขอ Line / Instagram หน่อยได้ไหมครับ?',
    translation: '라인이나 인스타 가르쳐 줄 수 있나요?',
    pronunciation: '[코 라인 / 인스타그램 노이 다이 마이 캅?]',
    toneGuide: 'Asking SNS',
    usageTip: '태국 국민 메신저는 Line이며 Instagram도 대중적입니다.'
  },
  {
    id: 'th-15',
    countryId: 'th',
    category: '미팅/사교',
    original: 'มีแฟนหรือยังครับ?',
    translation: '혹시 애인 있으신가요?',
    pronunciation: '[미 팬 르 양 캅?]',
    toneGuide: 'Relationship check',
    usageTip: '부드러운 억양과 정중한 캅(카)을 붙여 물어보세요.'
  },
  {
    id: 'th-16',
    countryId: 'th',
    category: '미팅/사교',
    original: 'ไปดื่มกาแฟด้วยกันไหมครับ?',
    translation: '같이 커피 마시러 갈래요?',
    pronunciation: '[빠이 듬 까패 두아이 간 마이 캅?]',
    toneGuide: 'Coffee date',
    usageTip: '방콕이나 치앙마이 핫플 카페 데이트 신청에 최적입니다.'
  },
  {
    id: 'th-17',
    countryId: 'th',
    category: '미팅/사교',
    original: 'คุณน่ารักมากครับ',
    translation: '당신 정말 귀여우시네요',
    pronunciation: '[쿤 나락 막 캅]',
    toneGuide: 'Affectionate praise',
    usageTip: '상대방의 귀여운 짓이나 밝은 웃음에 건네는 표현입니다.'
  },
  {
    id: 'th-18',
    countryId: 'th',
    category: '미팅/사교',
    original: 'แล้วเจอกันใหม่นะครับ!',
    translation: '우리 또 만나요!',
    pronunciation: '[래우 쩌간 마이 나캅!]',
    toneGuide: 'See you again',
    usageTip: '기분 좋게 데이트를 마무리하며 다음을 기약해 보세요.'
  },

  // [비상]
  {
    id: 'th-08',
    countryId: 'th',
    category: '비상',
    original: 'ห้องน้ำอยู่ไหนครับ?',
    translation: '화장실 어디인가요?',
    pronunciation: '[홍남 유나이 캅?]',
    toneGuide: 'Urgent query',
    usageTip: '급할 때 근처 상점이나 쇼핑몰 직원에게 화면 보여주세요.',
    isEmergency: true
  },
  {
    id: 'th-09',
    countryId: 'th',
    category: '비상',
    original: 'ช่วยด้วย!',
    translation: '도와주세요!',
    pronunciation: '[쭈아이 두아이!]',
    toneGuide: 'Emergency call',
    usageTip: '위기 상황에서 긴급 전광판과 함께 음성을 크게 틀어주세요.',
    isEmergency: true
  },


  // ==========================================
  // 🇮🇩 인도네시아 (Indonesian)
  // ==========================================
  // [항공]
  {
    id: 'id-air-01',
    countryId: 'id',
    category: '항공',
    original: 'Di mana counter check-in?',
    translation: '체크인 카운터가 어디인가요?',
    pronunciation: '[디 마나 카운터 체크인?]',
    toneGuide: 'Airport location',
    usageTip: '발리 덴파사르 또는 자카르타 수카르노 하타 공항에서 탑승 수속 위치를 물어보세요.'
  },
  {
    id: 'id-air-02',
    countryId: 'id',
    category: '항공',
    original: 'Boleh minta tempat duduk di dekat jendela?',
    translation: '창가 쪽 좌석으로 주시겠어요?',
    pronunciation: '[볼레 민타 똠빳 두둑 디 드깝 젠델라?]',
    toneGuide: 'Seat preference',
    usageTip: '가루다 인도네시아 항공 수속 시 정중하게 희망 좌석을 전하세요.'
  },
  {
    id: 'id-air-03',
    countryId: 'id',
    category: '항공',
    original: 'Di mana tempat pengambilan bagasi?',
    translation: '수하물 찾는 곳이 어디예요?',
    pronunciation: '[디 마나 똠빳 뼁앙빌란 바가시?]',
    toneGuide: 'Baggage claim',
    usageTip: '입국 후 가방 벨트를 찾아갈 때 공항 요원에게 보여주세요.'
  },
  {
    id: 'id-air-04',
    countryId: 'id',
    category: '항공',
    original: 'Bagasi saya hilang.',
    translation: '제 수하물이 분실되었습니다.',
    pronunciation: '[바가시 사야 히랑]',
    toneGuide: 'Lost bag alert',
    usageTip: '수하물이 나오지 않을 때 인포메이션 데스크에 빠르게 도움을 청하세요.',
    isEmergency: true
  },
  {
    id: 'id-air-05',
    countryId: 'id',
    category: '항공',
    original: 'Saya datang untuk liburan.',
    translation: '관광/휴가 목적으로 방문했습니다.',
    pronunciation: '[사야 다탕 웅툭 리부란]',
    toneGuide: 'Immigration answer',
    usageTip: '인도네시아 입국 심사 시 질문에 대한 대답입니다.'
  },
  {
    id: 'id-air-06',
    countryId: 'id',
    category: '항공',
    original: 'Minta air minum, tolong.',
    translation: '물 한 잔만 부탁드립니다.',
    pronunciation: '[민타 아아르 미눔, 톨롱]',
    toneGuide: 'Water order',
    usageTip: '기내에서 승무원에게 시원한 물을 요청할 때 사용하세요.'
  },

  // [호텔]
  {
    id: 'id-hot-01',
    countryId: 'id',
    category: '호텔',
    original: 'Saya mau check-in.',
    translation: '체크인 하려고 합니다.',
    pronunciation: '[사야 마우 체크인]',
    toneGuide: 'Hotel check-in',
    usageTip: '발리 풀빌라/리조트 카운터에 여권과 예약증을 건네며 말하세요.'
  },
  {
    id: 'id-hot-02',
    countryId: 'id',
    category: '호텔',
    original: 'Boleh titip bagasi di sini?',
    translation: '짐을 잠시 맡길 수 있나요?',
    pronunciation: '[볼레 티팁 바가시 디 시니?]',
    toneGuide: 'Luggage storage',
    usageTip: '체크인 전이나 체크아웃 후 해변이나 카페 탐방 전 보관에 이용하세요.'
  },
  {
    id: 'id-hot-03',
    countryId: 'id',
    category: '호텔',
    original: 'Apa kata sandi Wi-Fi?',
    translation: '와이파이 비밀번호가 어떻게 되나요?',
    pronunciation: '[아파 카타 산디 와이파이?]',
    toneGuide: 'Wi-Fi request',
    usageTip: '리조트 로비나 객실에서 와이파이 암호를 물어보세요.'
  },
  {
    id: 'id-hot-04',
    countryId: 'id',
    category: '호텔',
    original: 'Boleh minta handuk tambahan?',
    translation: '수건 더 부탁드립니다.',
    pronunciation: '[볼레 민타 한둑 탐바한?]',
    toneGuide: 'Towel request',
    usageTip: '비치나 수영장 다녀온 후 타월이 더 필요할 때 요구하세요.'
  },
  {
    id: 'id-hot-05',
    countryId: 'id',
    category: '호텔',
    original: 'AC / Air panas tidak menyala.',
    translation: '에어컨/온수가 안 나와요.',
    pronunciation: '[아세 / 아아르 파나스 티닥 머냐라]',
    toneGuide: 'Room issue alert',
    usageTip: '객실 시설에 오작동이 있을 때 바로 프런트에 문의하세요.',
    isEmergency: true
  },
  {
    id: 'id-hot-06',
    countryId: 'id',
    category: '호텔',
    original: 'Jam berapa sarapan pagi?',
    translation: '조식 식사 시간은 몇 시인가요?',
    pronunciation: '[잠 브라파 사라판 파기?]',
    toneGuide: 'Breakfast time',
    usageTip: '아침 조식 시간을 체크하고 식당으로 갈 때 질문하세요.'
  },
  {
    id: 'id-hot-07',
    countryId: 'id',
    category: '호텔',
    original: 'Bisa bantu panggilkan taksi?',
    translation: '택시 좀 불러주실 수 있나요?',
    pronunciation: '[비사 반투 팡길깐 탁시?]',
    toneGuide: 'Taxi call',
    usageTip: '블루버드 택시나 공항 이동 차량을 호텔을 통해 부를 때 제격입니다.'
  },

  // [교통]
  {
    id: 'id-01',
    countryId: 'id',
    category: '교통',
    original: 'Stop di sini, Bang!',
    translation: '여기 세워주세요!',
    pronunciation: '[스톱 디 시니, 방!]',
    toneGuide: 'Direct & Friendly',
    usageTip: '발리 오토바이 기사나 고젝(Gojek), 뚝뚝 탑승 시 하차 지점입니다.',
    isEmergency: true
  },
  {
    id: 'id-07',
    countryId: 'id',
    category: '교통',
    original: 'Pakai meteran, ya Pak.',
    translation: '미터기 켜주세요.',
    pronunciation: '[파카이 메테란, 야 팍]',
    toneGuide: 'Meter request',
    usageTip: '블루버드(Bluebird) 택시 이용 시 미터기 작동 확인하세요.'
  },
  {
    id: 'id-11',
    countryId: 'id',
    category: '교통',
    original: 'Ke bandara, ya.',
    translation: '공항으로 가주세요.',
    pronunciation: '[케 반다라, 야]',
    toneGuide: 'Airport heading',
    usageTip: '발리 덴파사르 응우라라이 공항 등으로 이동 시 말하세요.'
  },

  // [식당]
  {
    id: 'id-04',
    countryId: 'id',
    category: '식당',
    original: 'Enak sekali!',
    translation: '정말 맛있어요!',
    pronunciation: '[에낙 스칼리!]',
    toneGuide: 'High praise',
    usageTip: '나시고랭이나 미고랭을 먹고 직원에게 감탄사로 던져보세요.'
  },
  {
    id: 'id-05',
    countryId: 'id',
    category: '식당',
    original: 'Tidak pedas, ya!',
    translation: '맵지 않게 해주세요!',
    pronunciation: '[티닥 프다스, 야!]',
    toneGuide: 'Spice level request',
    usageTip: '인도네시아 삼발(Sambal) 소스가 매우 매우므로 매운 맛 조절용입니다.'
  },
  {
    id: 'id-06',
    countryId: 'id',
    category: '식당',
    original: 'Minta bon, Pak.',
    translation: '계산서 부탁드립니다.',
    pronunciation: '[민타 본, 팍]',
    toneGuide: 'Check please',
    usageTip: '식당에서 손을 들어 직원에게 정중히 요구합니다.'
  },
  {
    id: 'id-10',
    countryId: 'id',
    category: '식당',
    original: 'Minta air putih.',
    translation: '생수/물 좀 주세요.',
    pronunciation: '[민타 아아르 푸티]',
    toneGuide: 'Water order',
    usageTip: '일반 식당에서 탭워터 대신 병에 든 생수를 요청할 때 쓰입니다.'
  },

  // [흥정]
  {
    id: 'id-02',
    countryId: 'id',
    category: '흥정',
    original: 'Berapa harganya?',
    translation: '얼마인가요?',
    pronunciation: '[브라파 하르가냐?]',
    toneGuide: 'Asking price',
    usageTip: '스미냐크나 우붓 예술 시장에서 쇼핑할 때 질문하세요.'
  },
  {
    id: 'id-03',
    countryId: 'id',
    category: '흥정',
    original: 'Mahal sekali, boleh kurang?',
    translation: '너무 비싸요, 조금만 깎아줄 수 있나요?',
    pronunciation: '[마할 스칼리, 볼레 쿠랑?]',
    toneGuide: 'Polite bargaining',
    usageTip: '상인과 미소를 주고받으며 기분 좋게 가격 조율해보세요.'
  },
  {
    id: 'id-12',
    countryId: 'id',
    category: '흥정',
    original: 'Terima kasih banyak!',
    translation: '정말 감사합니다!',
    pronunciation: '[터리마 카시 바냑!]',
    toneGuide: 'Polite thanks',
    usageTip: '인도네시아 사람들이 가장 반가워하는 인사 표현입니다.'
  },

  // [미팅/사교]
  {
    id: 'id-13',
    countryId: 'id',
    category: '미팅/사교',
    original: 'Kamu cantik sekali!',
    translation: '당신 정말 예뻐요!',
    pronunciation: '[카무 찬틱 스칼리!]',
    toneGuide: 'Warm compliment',
    usageTip: '발리 비치클럽이나 카페에서 상대에게 미소를 지으며 건네보세요.'
  },
  {
    id: 'id-14',
    countryId: 'id',
    category: '미팅/사교',
    original: 'Boleh minta Instagram kamu?',
    translation: '인스타그램 계정 알려주실 수 있나요?',
    pronunciation: '[볼레 민타 인스타그램 카무?]',
    toneGuide: 'Social media ask',
    usageTip: '인도네시아에서는 인스타그램 팔로우로 친해지는 문화가 발달해 있습니다.'
  },
  {
    id: 'id-15',
    countryId: 'id',
    category: '미팅/사교',
    original: 'Sudah punya pacar?',
    translation: '혹시 남자친구 있으세요?',
    pronunciation: '[스다 푼야 파차르?]',
    toneGuide: 'Relationship check',
    usageTip: '자연스러운 대화 흐름 속에서 여쭤볼 때 쓰입니다.'
  },
  {
    id: 'id-16',
    countryId: 'id',
    category: '미팅/사교',
    original: 'Mau minum kopi bareng?',
    translation: '같이 커피 한 잔 할래요?',
    pronunciation: '[마우 미눔 코피 바렝?]',
    toneGuide: 'Casual invitation',
    usageTip: '편안한 대화나 카페 데이트 신청에 유용합니다.'
  },
  {
    id: 'id-17',
    countryId: 'id',
    category: '미팅/사교',
    original: 'Kamu manis dan ramah sekali.',
    translation: '정말 다정하고 미소가 예쁘네요.',
    pronunciation: '[카무 마니스 단 라마 스칼리]',
    toneGuide: 'Sweet praise',
    usageTip: '상대방의 다정한 행동과 웃는 얼굴에 감사를 겸해 칭찬하세요.'
  },
  {
    id: 'id-18',
    countryId: 'id',
    category: '미팅/사교',
    original: 'Sampai jumpa lagi!',
    translation: '다음에 또 만나요!',
    pronunciation: '[삼파이 줌파 라기!]',
    toneGuide: 'Friendly farewell',
    usageTip: '헤어질 때 아쉬운 마음을 남기며 작별 인사를 건네보세요.'
  },

  // [비상]
  {
    id: 'id-08',
    countryId: 'id',
    category: '비상',
    original: 'Di mana toilet?',
    translation: '화장실이 어디예요?',
    pronunciation: '[디 마나 토일렛?]',
    toneGuide: 'Urgent',
    usageTip: '비치 클럽이나 야외 시장에서 긴급 시 활용합니다.',
    isEmergency: true
  },
  {
    id: 'id-09',
    countryId: 'id',
    category: '비상',
    original: 'Tolong saya!',
    translation: '저 좀 도와주세요!',
    pronunciation: '[톨롱 사야!]',
    toneGuide: 'Help call',
    usageTip: '긴급 도난, 길 잃음 시 비상 전광판 모드로 작동하세요.',
    isEmergency: true
  },


  // ==========================================
  // 🇱🇦 라오스 (Lao)
  // ==========================================
  // [항공]
  {
    id: 'la-air-01',
    countryId: 'la',
    category: '항공',
    original: 'เคาน์เตอร์เช็คอินอยู่ใส?',
    translation: '체크인 카운터가 어디인가요?',
    pronunciation: '[카운터 체크인 유 싸이?]',
    toneGuide: 'Airport navigation',
    usageTip: '비엔티안 왓따이 국제공항에서 수속 카운터 위치를 문의하세요.'
  },
  {
    id: 'la-air-02',
    countryId: 'la',
    category: '항공',
    original: 'ขอบ่อนนั่งริมหน้าต่าง.',
    translation: '창가 자리로 부탁합니다.',
    pronunciation: '[코 본낭 림 나타앙]',
    toneGuide: 'Seat preference',
    usageTip: '라오항공 체크인 시 창가 쪽 자리를 선택할 때 표현하세요.'
  },
  {
    id: 'la-air-03',
    countryId: 'la',
    category: '항공',
    original: 'บ่อนรับเครื่องอยู่ใส?',
    translation: '수하물 찾는 곳이 어디예요?',
    pronunciation: '[본 랍 크엉 유 싸이?]',
    toneGuide: 'Baggage claim',
    usageTip: '입국 후 내 짐이 도착하는 장소를 직원에게 물어보세요.'
  },
  {
    id: 'la-air-04',
    countryId: 'la',
    category: '항공',
    original: 'กระเป๋าของข้อยเฮีย.',
    translation: '제 짐을 분실했습니다.',
    pronunciation: '[까쁘라우 콩 코이 히아]',
    toneGuide: 'Lost bag alert',
    usageTip: '짐이 벨트에 보이지 않을 때 분실 접수처에 안내해 주세요.',
    isEmergency: true
  },
  {
    id: 'la-air-05',
    countryId: 'la',
    category: '항공',
    original: 'ข้อยมาท่องเที่ยว.',
    translation: '관광하러 왔습니다.',
    pronunciation: '[코이 마 통티에우]',
    toneGuide: 'Immigration answer',
    usageTip: '라오스 입국 심사 시 방문 목적 질문 대답입니다.'
  },
  {
    id: 'la-air-06',
    countryId: 'la',
    category: '항공',
    original: 'ขอน้ำดื่มแก้วหนึ่ง.',
    translation: '물 한 잔만 부탁드립니다.',
    pronunciation: '[코 남듬 깨우 능]',
    toneGuide: 'Water order',
    usageTip: '기내나 라운지에서 정중히 물을 청해 드세요.'
  },

  // [호텔]
  {
    id: 'la-hot-01',
    countryId: 'la',
    category: '호텔',
    original: 'ข้อยอยากเช็คอิน.',
    translation: '체크인 하고 싶습니다.',
    pronunciation: '[코이 야악 체크인]',
    toneGuide: 'Hotel check-in',
    usageTip: '루앙프라방/방비엥 호텔 카운터에서 웃으며 전해보세요.'
  },
  {
    id: 'la-hot-02',
    countryId: 'la',
    category: '호텔',
    original: 'ฝากกระเป๋าไว้ได้บ่อ?',
    translation: '짐을 맡길 수 있나요?',
    pronunciation: '[팍 까쁘라우 와이 다이 보?]',
    toneGuide: 'Luggage storage',
    usageTip: '체크인 전 콰이강, 블루라군 등에 놀러가기 전 캐리어를 맡길 때 유용합니다.'
  },
  {
    id: 'la-hot-03',
    countryId: 'la',
    category: '호텔',
    original: 'รหัส Wi-Fi แม่นหยัง?',
    translation: '와이파이 비밀번호가 무엇인가요?',
    pronunciation: '[라핫 와이파이 맨 냥?]',
    toneGuide: 'Wi-Fi request',
    usageTip: '호텔 방에 들어가 무선 인터넷을 연결할 때 사용하세요.'
  },
  {
    id: 'la-hot-04',
    countryId: 'la',
    category: '호텔',
    original: 'ขอผ้าเช็ดตัวเพิ่ม.',
    translation: '수건 추가 부탁드립니다.',
    pronunciation: '[코 파쳇똠 프엠]',
    toneGuide: 'Towel request',
    usageTip: '액티비티나 수영 후 수건이 모자랄 때 요청하세요.'
  },
  {
    id: 'la-hot-05',
    countryId: 'la',
    category: '호텔',
    original: 'แอร์ / น้ำอุ่น บ่อทำงาน.',
    translation: '에어컨/온수가 안 나와요.',
    pronunciation: '[에어 / 남운 보 탐간]',
    toneGuide: 'Room issue alert',
    usageTip: '방 에어컨이나 샤워 시설 고장 시 프런트에 문의하세요.',
    isEmergency: true
  },
  {
    id: 'la-hot-06',
    countryId: 'la',
    category: '호텔',
    original: 'อาหารเช้าเริ่มกี่โมง?',
    translation: '조식 시작 시간이 몇 시인가요?',
    pronunciation: '[아한차오 름 기몽?]',
    toneGuide: 'Breakfast time',
    usageTip: '아침 조식 시간을 문의할 때 질문해 보세요.'
  },
  {
    id: 'la-hot-07',
    countryId: 'la',
    category: '호텔',
    original: 'ช่วยเรียกรถแท็กซี่ให้แน่.',
    translation: '택시 좀 불러주세요.',
    pronunciation: '[쭈아이 리억 롯 택시 하이 내]',
    toneGuide: 'Taxi dispatch',
    usageTip: '기차역이나 공항 이동 시 호텔 직원에게 차량 요청 시 씁니다.'
  },

  // [교통]
  {
    id: 'la-01',
    countryId: 'la',
    category: '교통',
    original: 'จอดอยู่นี!',
    translation: '여기 세워주세요!',
    pronunciation: '[쫌 유 니!]',
    toneGuide: 'Clear instruction',
    usageTip: '방비엥 뚝뚝이나 버기카, 스쿠터 이용 시 내릴 위치에서 외치세요.',
    isEmergency: true
  },
  {
    id: 'la-10',
    countryId: 'la',
    category: '교통',
    original: 'ไปสนามบิน.',
    translation: '공항으로 가주세요.',
    pronunciation: '[빠이 사남빈]',
    toneGuide: 'Airport direction',
    usageTip: '비엔티안 왓따이 국제공항 등으로 이동할 때 말하세요.'
  },

  // [식당]
  {
    id: 'la-04',
    countryId: 'la',
    category: '식당',
    original: 'แซ่บหลาย!',
    translation: '정말 맛있어요!',
    pronunciation: '[쌥 라이!]',
    toneGuide: 'Enthusiastic compliment',
    usageTip: '신달라(라오스식 BBQ)나 신선한 망고 쉐이크 먹은 후 해보세요.'
  },
  {
    id: 'la-05',
    countryId: 'la',
    category: '식당',
    original: 'บ่อใส่หอมเป!',
    translation: '고수 넣지 마세요!',
    pronunciation: '[보 싸이 홈빼!]',
    toneGuide: 'No cilantro',
    usageTip: '라오스 쌀국수(카오픽) 주문 시 고수를 빼고 싶다면 필수!',
    isEmergency: true
  },
  {
    id: 'la-06',
    countryId: 'la',
    category: '식당',
    original: 'คิดเงิน.',
    translation: '계산할게요.',
    pronunciation: '[킷 응언]',
    toneGuide: 'Ask for check',
    usageTip: '식당 계산 시 말하면 직원이 다가옵니다.'
  },
  {
    id: 'la-09',
    countryId: 'la',
    category: '식당',
    original: 'ขอน้ำดื่ม.',
    translation: '마실 물 부탁합니다.',
    pronunciation: '[코 남 듬]',
    toneGuide: 'Water order',
    usageTip: '시원한 식수를 주문할 때 사용합니다.'
  },

  // [흥정]
  {
    id: 'la-02',
    countryId: 'la',
    category: '흥정',
    original: 'เท่าได?',
    translation: '얼마인가요?',
    pronunciation: '[타오 다이?]',
    toneGuide: 'Inquiry',
    usageTip: '루앙프라방 야시장에서 코끼리 바지나 기념품 살 때 물어보세요.'
  },
  {
    id: 'la-03',
    countryId: 'la',
    category: '흥정',
    original: 'แพงหลาย, ลดได้บ่อ?',
    translation: '너무 비싸요, 깎아주실 수 있나요?',
    pronunciation: '[팽 라이, 롯 다이 보?]',
    toneGuide: 'Friendly bargaining',
    usageTip: '라오스 상인들에게 맑은 미소로 부탁해보세요.'
  },
  {
    id: 'la-11',
    countryId: 'la',
    category: '흥정',
    original: 'สบายดี!',
    translation: '안녕하세요!',
    pronunciation: '[사바이디!]',
    toneGuide: 'Warm greeting',
    usageTip: '라오스 어디서든 만나는 사람들에게 밝게 건네는 대표 인사입니다.'
  },
  {
    id: 'la-12',
    countryId: 'la',
    category: '흥정',
    original: 'ขอบใจหลายๆ!',
    translation: '정말 고맙습니다!',
    pronunciation: '[컵 짜이 라이 라이!]',
    toneGuide: 'Heartfelt thanks',
    usageTip: '도움을 받았을 때 손을 가슴에 대고 정중히 감사를 전하세요.'
  },

  // [미팅/사교]
  {
    id: 'la-13',
    countryId: 'la',
    category: '미팅/사교',
    original: 'เจ้างามหลาย!',
    translation: '당신 너무 예쁘네요!',
    pronunciation: '[짜오 งาม 라이!]',
    toneGuide: 'Compliment',
    usageTip: '루앙프라방이나 방비엥에서 호감을 정중하게 표현할 때 사용합니다.'
  },
  {
    id: 'la-14',
    countryId: 'la',
    category: '미팅/사교',
    original: 'ขอ WhatsApp / Instagram แน่ได้บ่อ?',
    translation: '왓츠앱이나 인스타 아이디 알려줄 수 있어요?',
    pronunciation: '[코 왓츠앱 / 인스타그램 내 다이 보?]',
    toneGuide: 'Contact exchange',
    usageTip: '라오스에서는 WhatsApp 및 Instagram을 주로 사용합니다.'
  },
  {
    id: 'la-15',
    countryId: 'la',
    category: '미팅/사교',
    original: 'มีแฟนแล้วบ่อ?',
    translation: '혹시 애인 있으세요?',
    pronunciation: '[미 팬 래우 보?]',
    toneGuide: 'Asking status',
    usageTip: '상대에게 호감이 있을 때 조심스레 밝은 표정으로 여쭤보세요.'
  },
  {
    id: 'la-16',
    countryId: 'la',
    category: '미팅/사교',
    original: 'ไปกินกาแฟนำกันบ่อ?',
    translation: '같이 커피 한 잔 마시러 갈래요?',
    pronunciation: '[빠이 긴 까패 남간 보?]',
    toneGuide: 'Coffee invite',
    usageTip: '메콩강 강변 풍경 예쁜 카페 데이트 제안에 정겨운 문장입니다.'
  },

  // [비상]
  {
    id: 'la-07',
    countryId: 'la',
    category: '비상',
    original: 'ห้องน้ำอยู่ใส?',
    translation: '화장실 어디인가요?',
    pronunciation: '[홍남 유 싸이?]',
    toneGuide: 'Urgent question',
    usageTip: '블루라군이나 야외 유원지에서 급할 때 사용합니다.',
    isEmergency: true
  },
  {
    id: 'la-08',
    countryId: 'la',
    category: '비상',
    original: 'ช่วยด้วย!',
    translation: '도와주세요!',
    pronunciation: '[쭈아이 두아이!]',
    toneGuide: 'Emergency alert',
    usageTip: '응급 및 사고 상황 시 전광판 모드와 함께 볼륨을 최대화하세요.',
    isEmergency: true
  }
];
