import type { CountryId, Phrase } from '../types';

export interface ScenarioLine {
  id: string;
  text: string;
  pronunciation: string;
  meaning: string;
}

export interface ScenarioChoice {
  id: string;
  text: string;
  pronunciation: string;
  meaning: string;
  /** 내가 고른 답에 대한 상대방의 자연스러운 반응 */
  partnerReply: ScenarioLine;
  tip?: string;
}

export interface ScenarioTurn {
  id: string;
  partner: ScenarioLine;
  choices: ScenarioChoice[];
}

export interface Scenario {
  id: string;
  countryId: CountryId;
  emoji: string;
  partnerName: string;
  partnerRole: string;
  title: string;
  description: string;
  turns: ScenarioTurn[];
}

export const SCENARIOS: Scenario[] = [
  /* ===================== 필리핀 (ph) ===================== */
  {
    id: 'sc-ph-cafe',
    countryId: 'ph',
    emoji: '☕',
    partnerName: '미아 (Mia)',
    partnerRole: '카페 옆자리 현지 친구',
    title: '카페에서 새 친구 만나기',
    description: '첫인사부터 여행 이야기, 연락처 교환까지',
    turns: [
      {
        id: 't1',
        partner: {
          id: 'sc-ph-cafe-p1',
          text: 'Hi! Are you traveling here?',
          pronunciation: '하이! 아 유 트래블링 히어?',
          meaning: '안녕하세요! 여기 여행 오셨어요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Yes! Nice to meet you.',
            pronunciation: '예스! 나이스 투 미트 유.',
            meaning: '네! 만나서 반가워요.',
            tip: '상대 인사에 웃으며 바로 받아치기 좋은 첫마디예요.',
            partnerReply: {
              id: 'sc-ph-cafe-r1a',
              text: 'Nice to meet you too! Where are you from?',
              pronunciation: '나이스 투 미트 유 투! 웨어 아 유 프롬?',
              meaning: '저도 반가워요! 어디서 오셨어요?',
            },
          },
          {
            id: 'c2',
            text: 'Hi! I came from Korea.',
            pronunciation: '하이! 아이 케임 프롬 코리아.',
            meaning: '안녕하세요! 한국에서 왔어요.',
            tip: '출신 나라를 먼저 말하면 대화가 금방 이어져요.',
            partnerReply: {
              id: 'sc-ph-cafe-r1b',
              text: 'Oh, Korea! I love Korean food!',
              pronunciation: '오, 코리아! 아이 러브 코리안 푸드!',
              meaning: '오, 한국이요! 한국 음식 진짜 좋아해요!',
            },
          },
        ],
      },
      {
        id: 't2',
        partner: {
          id: 'sc-ph-cafe-p2',
          text: 'How long are you staying?',
          pronunciation: '하우 롱 아 유 스테잉?',
          meaning: '여기 얼마나 머무르세요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Just four days. Any good places?',
            pronunciation: '저스트 포 데이즈. 애니 굿 플레이시즈?',
            meaning: '4일만요. 여기 좋은 곳 있어요?',
            tip: '현지인에게 맛집·명소를 자연스럽게 물어볼 수 있어요.',
            partnerReply: {
              id: 'sc-ph-cafe-r2a',
              text: 'Try the beach sunset bar nearby!',
              pronunciation: '트라이 더 비치 선셋 바 니어바이!',
              meaning: '근처 해변 선셋 바 꼭 가보세요!',
            },
          },
          {
            id: 'c2',
            text: 'This week! It is so nice here.',
            pronunciation: '디스 위크! 잇 이즈 소 나이스 히어.',
            meaning: '이번 주 내내요! 여기 정말 좋네요.',
            tip: '짧게 칭찬 한마디를 덧붙이면 분위기가 훨씬 부드러워져요.',
            partnerReply: {
              id: 'sc-ph-cafe-r2b',
              text: 'Thank you! Enjoy your trip!',
              pronunciation: '땡큐! 인조이 유어 트립!',
              meaning: '고마워요! 즐거운 여행 되세요!',
            },
          },
        ],
      },
      {
        id: 't3',
        partner: {
          id: 'sc-ph-cafe-p3',
          text: 'Let us stay in touch!',
          pronunciation: '렛츠 스테이 인 터치!',
          meaning: '우리 계속 연락하고 지내요!',
        },
        choices: [
          {
            id: 'c1',
            text: 'Sure! Can I get your Instagram?',
            pronunciation: '슈어! 캔 아이 겟 유어 인스타그램?',
            meaning: '좋아요! 인스타그램 알려줄 수 있어요?',
            tip: '부담 없이 SNS 아이디를 교환하는 가장 자연스러운 표현이에요.',
            partnerReply: {
              id: 'sc-ph-cafe-r3a',
              text: 'Of course! Type it here.',
              pronunciation: '오브 코스! 타입 잇 히어.',
              meaning: '물론이죠! 여기에 입력해요.',
            },
          },
          {
            id: 'c2',
            text: 'Thank you! See you around!',
            pronunciation: '땡큐! 씨 유 어라운드!',
            meaning: '고마워요! 또 만나요!',
            tip: '가볍고 예의 바르게 대화를 마무리할 때 써요.',
            partnerReply: {
              id: 'sc-ph-cafe-r3b',
              text: 'See you! Take care!',
              pronunciation: '씨 유! 테이크 케어!',
              meaning: '또 봐요! 잘 지내세요!',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'sc-ph-taxi',
    countryId: 'ph',
    emoji: '🚕',
    partnerName: '마크 (Mark)',
    partnerRole: '그랩·택시 기사님',
    title: '기사님과 목적지·하차 말하기',
    description: '반갑게 인사하고 안전하게 내리기',
    turns: [
      {
        id: 't1',
        partner: {
          id: 'sc-ph-taxi-p1',
          text: 'Good afternoon! Where are we going?',
          pronunciation: '굿 애프터눈! 웨어 아 위 고잉?',
          meaning: '안녕하세요! 어디로 갈까요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Hi! Please go to this address.',
            pronunciation: '하이! 플리즈 고 투 디스 어드레스.',
            meaning: '안녕하세요! 이 주소로 가주세요.',
            tip: '지도를 보여주면서 말하면 실수가 없어요.',
            partnerReply: {
              id: 'sc-ph-taxi-r1a',
              text: 'Got it! About fifteen minutes.',
              pronunciation: '갓 잇! 어바웃 피프틴 미니츠.',
              meaning: '알겠습니다! 15분 정도 걸려요.',
            },
          },
          {
            id: 'c2',
            text: 'To the night market, please.',
            pronunciation: '투 더 나이트 마켓, 플리즈.',
            meaning: '야시장으로 가주세요.',
            tip: '장소 이름 뒤에 please만 붙여도 깔끔해요.',
            partnerReply: {
              id: 'sc-ph-taxi-r1b',
              text: 'Sure, let us go!',
              pronunciation: '슈어, 렛츠 고!',
              meaning: '네, 출발합시다!',
            },
          },
        ],
      },
      {
        id: 't2',
        partner: {
          id: 'sc-ph-taxi-p2',
          text: 'Is the aircon okay for you?',
          pronunciation: '이즈 디 에어컨 오케이 포 유?',
          meaning: '에어컨 바람 괜찮으세요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Yes, it is perfect. Thank you!',
            pronunciation: '예스, 잇츠 퍼펙트. 땡큐!',
            meaning: '네, 딱 좋아요. 감사합니다!',
            partnerReply: {
              id: 'sc-ph-taxi-r2a',
              text: 'Great! Almost there now.',
              pronunciation: '그레이트! 올모스트 데어 나우.',
              meaning: '좋네요! 이제 거의 다 왔어요.',
            },
          },
          {
            id: 'c2',
            text: 'A little cold. Slightly down, please.',
            pronunciation: '어 리틀 콜드. 슬라이틀리 다운, 플리즈.',
            meaning: '조금 추워요. 조금만 약하게 해주세요.',
            partnerReply: {
              id: 'sc-ph-taxi-r2b',
              text: 'No problem, I turned it down.',
              pronunciation: '노 프라블럼, 아이 턴드 잇 다운.',
              meaning: '문제없어요, 줄여드렸어요.',
            },
          },
        ],
      },
      {
        id: 't3',
        partner: {
          id: 'sc-ph-taxi-p3',
          text: 'We are here. Right in front?',
          pronunciation: '위 아 히어. 라이트 인 프론트?',
          meaning: '다 왔습니다. 바로 앞에 세워드릴까요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Yes, right here is great. Salamat!',
            pronunciation: '예스, 라이트 히어 이즈 그레이트. 살라맛!',
            meaning: '네, 여기가 딱 좋아요. 감사합니다!',
            tip: '필리핀어 "살라맛(감사합니다)"을 섞으면 아주 반가워해요.',
            partnerReply: {
              id: 'sc-ph-taxi-r3a',
              text: 'Walang anuman! Have a great night!',
              pronunciation: '왈랑 아누만! 해브 어 그레이트 나이트!',
              meaning: '천만에요! 즐거운 밤 보내세요!',
            },
          },
          {
            id: 'c2',
            text: 'Keep the change. Thank you!',
            pronunciation: '킵 더 체인지. 땡큐!',
            meaning: '거스름돈은 가지세요. 감사합니다!',
            partnerReply: {
              id: 'sc-ph-taxi-r3b',
              text: 'Oh, thank you so much!',
              pronunciation: '오, 땡큐 쏘 머치!',
              meaning: '오, 정말 감사합니다!',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'sc-ph-restaurant',
    countryId: 'ph',
    emoji: '🍽️',
    partnerName: '조이 (Joy)',
    partnerRole: '현지 맛집 직원',
    title: '맛집에서 메뉴 추천받고 주문하기',
    description: '인기 메뉴 묻고 입맛에 맞게 주문하기',
    turns: [
      {
        id: 't1',
        partner: {
          id: 'sc-ph-rest-p1',
          text: 'Welcome! Table for how many?',
          pronunciation: '웰컴! 테이블 포 하우 매니?',
          meaning: '어서 오세요! 몇 분이세요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Two people, please.',
            pronunciation: '투 피플, 플리즈.',
            meaning: '두 명이요.',
            partnerReply: {
              id: 'sc-ph-rest-r1a',
              text: 'Right this way! Here is the menu.',
              pronunciation: '라이트 디스 웨이! 히어 이즈 더 메뉴.',
              meaning: '이쪽으로 오세요! 메뉴판 여기 있습니다.',
            },
          },
          {
            id: 'c2',
            text: 'Four people. Inside seat, please.',
            pronunciation: '포 피플. 인사이드 시트, 플리즈.',
            meaning: '네 명이요. 실내 자리로 부탁해요.',
            partnerReply: {
              id: 'sc-ph-rest-r1b',
              text: 'Sure, cool seats are ready inside.',
              pronunciation: '슈어, 쿨 시츠 아 레디 인사이드.',
              meaning: '네, 안에 시원한 자리 준비돼 있어요.',
            },
          },
        ],
      },
      {
        id: 't2',
        partner: {
          id: 'sc-ph-rest-p2',
          text: 'Are you ready to order?',
          pronunciation: '아 유 레디 투 오더?',
          meaning: '주문하시겠어요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'What is your best dish here?',
            pronunciation: '왓 이즈 유어 베스트 디시 히어?',
            meaning: '여기 제일 잘 나가는 메뉴가 뭐예요?',
            tip: '메뉴를 고르기 어려울 때 가장 확실한 한 마디예요.',
            partnerReply: {
              id: 'sc-ph-rest-r2a',
              text: 'Garlic shrimp and mango shake!',
              pronunciation: '갈릭 슈림프 앤 망고 셰이크!',
              meaning: '갈릭 슈림프랑 망고 셰이크가 최고예요!',
            },
          },
          {
            id: 'c2',
            text: 'This one, not too salty please.',
            pronunciation: '디스 원, 낫 투 솔티 플리즈.',
            meaning: '이걸로 주세요, 너무 짜지 않게 해주세요.',
            tip: '필리핀 음식은 짭짤한 편이라 미리 말하면 좋아요.',
            partnerReply: {
              id: 'sc-ph-rest-r2b',
              text: 'Noted! Less salt, coming right up.',
              pronunciation: '노티드! 레스 솔트, 커밍 라이트 업.',
              meaning: '알겠습니다! 덜 짜게 바로 준비할게요.',
            },
          },
        ],
      },
      {
        id: 't3',
        partner: {
          id: 'sc-ph-rest-p3',
          text: 'How was everything?',
          pronunciation: '하우 워즈 에브리띵?',
          meaning: '식사는 괜찮으셨나요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Masarap! Bill out, please.',
            pronunciation: '마사랍! 빌 아웃, 플리즈.',
            meaning: '정말 맛있어요! 계산서 주세요.',
            tip: '필리핀에서는 "Bill out, please"가 자연스러운 계산 요청이에요.',
            partnerReply: {
              id: 'sc-ph-rest-r3a',
              text: 'Thank you! Here is your bill.',
              pronunciation: '땡큐! 히어 이즈 유어 빌.',
              meaning: '감사합니다! 계산서 여기 있습니다.',
            },
          },
          {
            id: 'c2',
            text: 'Delicious! One more beer, please.',
            pronunciation: '딜리셔스! 원 모어 비어, 플리즈.',
            meaning: '맛있어요! 맥주 한 병만 더 주세요.',
            partnerReply: {
              id: 'sc-ph-rest-r3b',
              text: 'Coming right up with cold glass!',
              pronunciation: '커밍 라이트 업 위드 콜드 글래스!',
              meaning: '시원한 잔과 함께 바로 가져다드릴게요!',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'sc-ph-market',
    countryId: 'ph',
    emoji: '🛍️',
    partnerName: '리사 (Liza)',
    partnerRole: '야시장 상점 주인',
    title: '야시장에서 웃으며 가격 흥정하기',
    description: '가격 물어보고 기분 좋게 할인받기',
    turns: [
      {
        id: 't1',
        partner: {
          id: 'sc-ph-mkt-p1',
          text: 'Hello! Looking for souvenirs?',
          pronunciation: '헬로! 루킹 포 수베니어스?',
          meaning: '안녕하세요! 기념품 찾으시나요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Yes! How much is this one?',
            pronunciation: '예스! 하우 머치 이즈 디스 원?',
            meaning: '네! 이거 얼마예요?',
            partnerReply: {
              id: 'sc-ph-mkt-r1a',
              text: 'Only three hundred pesos for you!',
              pronunciation: '온리 쓰리 헌드레드 페소스 포 유!',
              meaning: '손님에겐 딱 300페소예요!',
            },
          },
          {
            id: 'c2',
            text: 'Just looking around. Very cute!',
            pronunciation: '저스트 루킹 어라운드. 베리 큐트!',
            meaning: '그냥 구경 중이에요. 엄청 귀엽네요!',
            partnerReply: {
              id: 'sc-ph-mkt-r1b',
              text: 'Feel free! Take your time.',
              pronunciation: '필 프리! 테이크 유어 타임.',
              meaning: '편하게 천천히 보세요!',
            },
          },
        ],
      },
      {
        id: 't2',
        partner: {
          id: 'sc-ph-mkt-p2',
          text: 'Good quality! Want to take it?',
          pronunciation: '굿 퀄리티! 원트 투 테이크 잇?',
          meaning: '품질 좋아요! 가져가실래요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Can you give me a discount?',
            pronunciation: '캔 유 기브 미 어 디스카운트?',
            meaning: '조금만 깎아주실 수 있어요?',
            tip: '미소 지으면서 말하면 잘 깎아줘요.',
            partnerReply: {
              id: 'sc-ph-mkt-r2a',
              text: 'Okay, two fifty last price!',
              pronunciation: '오케이, 투 피프티 라스트 프라이스!',
              meaning: '좋아요, 250페소가 마지막 가격이에요!',
            },
          },
          {
            id: 'c2',
            text: 'How much if I buy two?',
            pronunciation: '하우 머치 이프 아이 바이 투?',
            meaning: '두 개 사면 얼마예요?',
            partnerReply: {
              id: 'sc-ph-mkt-r2b',
              text: 'Four hundred fifty for both!',
              pronunciation: '포 헌드레드 피프티 포 보쓰!',
              meaning: '둘 다 합쳐서 450페소에 드릴게요!',
            },
          },
        ],
      },
      {
        id: 't3',
        partner: {
          id: 'sc-ph-mkt-p3',
          text: 'Deal! Cash or GCash?',
          pronunciation: '딜! 캐시 오어 지캐시?',
          meaning: '거래 성사! 현금으로 하실래요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Cash, please. Thank you!',
            pronunciation: '캐시, 플리즈. 땡큐!',
            meaning: '현금으로 낼게요. 감사합니다!',
            partnerReply: {
              id: 'sc-ph-mkt-r3a',
              text: 'Thank you! Enjoy the market!',
              pronunciation: '땡큐! 인조이 더 마켓!',
              meaning: '고마워요! 시장 구경 재밌게 하세요!',
            },
          },
          {
            id: 'c2',
            text: 'Here you go. Salamat!',
            pronunciation: '히어 유 고. 살라맛!',
            meaning: '여기 있습니다. 감사합니다!',
            partnerReply: {
              id: 'sc-ph-mkt-r3b',
              text: 'Salamat po! Come back again!',
              pronunciation: '살라맛 포! 컴 백 어게인!',
              meaning: '감사합니다! 또 오세요!',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'sc-ph-spa',
    countryId: 'ph',
    emoji: '💆',
    partnerName: '안나 (Anna)',
    partnerRole: '마사지 테라피스트',
    title: '스파에서 강도·부위 맞추기',
    description: '원하는 부위와 압력을 편하게 전달하기',
    turns: [
      {
        id: 't1',
        partner: {
          id: 'sc-ph-spa-p1',
          text: 'Hi! Which area should I focus on?',
          pronunciation: '하이! 위치 에어리어 슈드 아이 포커스 온?',
          meaning: '안녕하세요! 어디를 집중적으로 해드릴까요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Shoulders and back, please.',
            pronunciation: '숄더즈 앤 백, 플리즈.',
            meaning: '어깨랑 등 위주로 부탁해요.',
            partnerReply: {
              id: 'sc-ph-spa-r1a',
              text: 'Sure, I will focus there.',
              pronunciation: '슈어, 아이 윌 포커스 데어.',
              meaning: '네, 그쪽 집중해서 풀어드릴게요.',
            },
          },
          {
            id: 'c2',
            text: 'Legs and feet, I walked a lot.',
            pronunciation: '레그즈 앤 피트, 아이 워크트 어 랏.',
            meaning: '많이 걸어서 다리랑 발 부탁해요.',
            partnerReply: {
              id: 'sc-ph-spa-r1b',
              text: 'Got it! Let us relax your legs.',
              pronunciation: '갓 잇! 렛츠 릴랙스 유어 레그즈.',
              meaning: '알겠어요! 다리 피로 싹 풀어드릴게요.',
            },
          },
        ],
      },
      {
        id: 't2',
        partner: {
          id: 'sc-ph-spa-p2',
          text: 'How is the pressure?',
          pronunciation: '하우 이즈 더 프레셔?',
          meaning: '마사지 압력은 괜찮으신가요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Softer, please. It hurts a bit.',
            pronunciation: '소프터, 플리즈. 잇 허츠 어 빗.',
            meaning: '조금만 살살 해주세요. 살짝 아파요.',
            partnerReply: {
              id: 'sc-ph-spa-r2a',
              text: 'Sorry! Is this lighter touch better?',
              pronunciation: '쏘리! 이즈 디스 라이터 터치 베터?',
              meaning: '죄송해요! 이 정도 부드러운 압이 나으신가요?',
            },
          },
          {
            id: 'c2',
            text: 'Stronger, please. Feels great!',
            pronunciation: '스트롱거, 플리즈. 필즈 그레이트!',
            meaning: '조금 더 세게 해주세요. 시원해요!',
            partnerReply: {
              id: 'sc-ph-spa-r2b',
              text: 'Okay, deeper pressure coming!',
              pronunciation: '오케이, 디퍼 프레셔 커밍!',
              meaning: '네, 조금 더 깊게 눌러드릴게요!',
            },
          },
        ],
      },
      {
        id: 't3',
        partner: {
          id: 'sc-ph-spa-p3',
          text: 'All done! Here is warm tea.',
          pronunciation: '올 던! 히어 이즈 웜 티.',
          meaning: '다 끝났습니다! 따뜻한 차 드세요.',
        },
        choices: [
          {
            id: 'c1',
            text: 'It was amazing! Thank you!',
            pronunciation: '잇 워즈 어메이징! 땡큐!',
            meaning: '정말 최고였어요! 감사합니다!',
            partnerReply: {
              id: 'sc-ph-spa-r3a',
              text: 'Thank you! Have a restful trip!',
              pronunciation: '땡큐! 해브 어 레스트풀 트립!',
              meaning: '감사합니다! 편안한 여행 되세요!',
            },
          },
          {
            id: 'c2',
            text: 'Thank you! Here is a tip for you.',
            pronunciation: '땡큐! 히어 이즈 어 팁 포 유.',
            meaning: '감사합니다! 수고하셨어요 (팁).',
            partnerReply: {
              id: 'sc-ph-spa-r3b',
              text: 'Oh, thank you so much!',
              pronunciation: '오, 땡큐 쏘 머치!',
              meaning: '오, 정말 감사드립니다!',
            },
          },
        ],
      },
    ],
  },

  /* ===================== 베트남 (vn) ===================== */
  {
    id: 'sc-vn-cafe',
    countryId: 'vn',
    emoji: '☕',
    partnerName: '린 (Linh)',
    partnerRole: '카페에서 만난 현지 친구',
    title: '카페에서 새 친구 만나기',
    description: '반갑게 인사하고 여행 이야기 나누기',
    turns: [
      {
        id: 't1',
        partner: {
          id: 'sc-vn-cafe-p1',
          text: 'Xin chào! Bạn là người Hàn Quốc à?',
          pronunciation: '신 짜오! 반 라 응어이 한 꾸옥 아?',
          meaning: '안녕하세요! 한국 분이세요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Vâng, xin chào! Rất vui được gặp bạn.',
            pronunciation: '벙, 신 짜오! 젓 부이 드억 갑 반.',
            meaning: '네, 안녕하세요! 만나서 반가워요.',
            tip: '"신 짜오" 뒤에 "반가워요"를 붙이면 호감도가 확 올라가요.',
            partnerReply: {
              id: 'sc-vn-cafe-r1a',
              text: 'Mình cũng rất vui! Cà phê ngon không?',
              pronunciation: '민 꿍 젓 부이! 까페 응온 콩?',
              meaning: '저도 정말 반가워요! 커피 맛있나요?',
            },
          },
          {
            id: 'c2',
            text: 'Xin chào! Mình đi du lịch.',
            pronunciation: '신 짜오! 민 디 주 릭.',
            meaning: '안녕하세요! 여행 왔어요.',
            partnerReply: {
              id: 'sc-vn-cafe-r1b',
              text: 'Tuyệt quá! Bạn thích Việt Nam không?',
              pronunciation: '뚜옛 꽈! 반 틱 비엣 남 콩?',
              meaning: '좋네요! 베트남 마음에 드세요?',
            },
          },
        ],
      },
      {
        id: 't2',
        partner: {
          id: 'sc-vn-cafe-p2',
          text: 'Ở đây có chỗ nào đẹp không bạn?',
          pronunciation: '어 더이 꺼 쪼 나오 뎁 콩 반?',
          meaning: '이 근처에 예쁜 곳 있나요? / 어디 가실 계획이에요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Ở đây đẹp quá! Quán nào ngon?',
            pronunciation: '어 더이 뎁 꽈! 꽌 나오 응온?',
            meaning: '여기 정말 예뻐요! 맛있는 식당 어디예요?',
            tip: '"꽌 나오 응온?(어디가 맛있어요?)"은 현지인 추천을 부르는 만능 질문이에요.',
            partnerReply: {
              id: 'sc-vn-cafe-r2a',
              text: 'Quán phở gần đây ngon lắm!',
              pronunciation: '꽌 퍼 건 더이 응온 람!',
              meaning: '이 근처 쌀국수 집 진짜 맛있어요!',
            },
          },
          {
            id: 'c2',
            text: 'Mình thích biển và cà phê sữa đá.',
            pronunciation: '민 틱 비엔 바 까페 쓰어 다.',
            meaning: '바다랑 연유 아이스커피가 너무 좋아요.',
            partnerReply: {
              id: 'sc-vn-cafe-r2b',
              text: 'Cà phê Việt Nam là nhất rồi!',
              pronunciation: '까페 비엣 남 라 녓 조이!',
              meaning: '베트남 커피가 최고죠!',
            },
          },
        ],
      },
      {
        id: 't3',
        partner: {
          id: 'sc-vn-cafe-p3',
          text: 'Chụp ảnh cùng nhau nhé!',
          pronunciation: '쭙 아잉 꿍 냐우 녜!',
          meaning: '같이 사진 한 장 찍을까요!',
        },
        choices: [
          {
            id: 'c1',
            text: 'Vâng! Cảm ơn bạn nhiều.',
            pronunciation: '벙! 깜 언 반 니에우.',
            meaning: '좋아요! 정말 고마워요.',
            partnerReply: {
              id: 'sc-vn-cafe-r3a',
              text: 'Một, hai, ba… Cười lên nào!',
              pronunciation: '못, 하이, 바… 끄어이 렌 나오!',
              meaning: '하나, 둘, 셋… 활짝 웃어요!',
            },
          },
          {
            id: 'c2',
            text: 'Cho mình xin Instagram nhé!',
            pronunciation: '쪼 민 신 인스타그램 녜!',
            meaning: '인스타그램 알려주세요!',
            partnerReply: {
              id: 'sc-vn-cafe-r3b',
              text: 'Được luôn! Đây là nick của mình.',
              pronunciation: '드억 루온! 더이 라 닉 꾸어 민.',
              meaning: '물론이죠! 제 아이디 여기 있어요.',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'sc-vn-taxi',
    countryId: 'vn',
    emoji: '🚕',
    partnerName: '남 (Nam)',
    partnerRole: '그랩·택시 기사님',
    title: '기사님과 목적지·하차 말하기',
    description: '목적지 보여주고 내릴 곳 알리기',
    turns: [
      {
        id: 't1',
        partner: {
          id: 'sc-vn-taxi-p1',
          text: 'Chào anh chị! Mình đi đâu ạ?',
          pronunciation: '짜오 아잉 찌! 민 디 더우 아?',
          meaning: '안녕하세요! 어디로 갈까요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Cho tôi đến địa chỉ này.',
            pronunciation: '쪼 또이 덴 디아 찌 나이.',
            meaning: '이 주소로 가주세요.',
            partnerReply: {
              id: 'sc-vn-taxi-r1a',
              text: 'Vâng ạ, khoảng mười lăm phút nhé.',
              pronunciation: '벙 아, 코앙 므어이 람 풋 녜.',
              meaning: '네, 15분 정도 걸립니다.',
            },
          },
          {
            id: 'c2',
            text: 'Đi chợ đêm nhé anh.',
            pronunciation: '디 쩌 뎀 녜 아잉.',
            meaning: '야시장으로 가주세요.',
            partnerReply: {
              id: 'sc-vn-taxi-r1b',
              text: 'Ok, mình đi ngay đây!',
              pronunciation: '오케이, 민 디 응아이 더이!',
              meaning: '네, 바로 출발합니다!',
            },
          },
        ],
      },
      {
        id: 't2',
        partner: {
          id: 'sc-vn-taxi-p2',
          text: 'Điều hòa có lạnh quá không ạ?',
          pronunciation: '디에우 호아 꺼 라잉 꽈 콩 아?',
          meaning: '에어컨 너무 춥지 않으세요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Không ạ, mát lắm. Cảm ơn!',
            pronunciation: '콩 아, 맛 람. 깜 언!',
            meaning: '괜찮아요, 시원해요. 감사합니다!',
            partnerReply: {
              id: 'sc-vn-taxi-r2a',
              text: 'Tốt quá, sắp tới rồi ạ.',
              pronunciation: '똣 꽈, 삽 떠이 조이 아.',
              meaning: '다행이네요, 곧 도착합니다.',
            },
          },
          {
            id: 'c2',
            text: 'Hơi lạnh một chút ạ.',
            pronunciation: '허이 라잉 못 쭛 아.',
            meaning: '조금 추워요.',
            partnerReply: {
              id: 'sc-vn-taxi-r2b',
              text: 'Để tôi giảm điều hòa xuống nhé.',
              pronunciation: '데 또이 잠 디에우 호아 수옹 녜.',
              meaning: '에어컨 바람 줄여드릴게요.',
            },
          },
        ],
      },
      {
        id: 't3',
        partner: {
          id: 'sc-vn-taxi-p3',
          text: 'Tới nơi rồi ạ. Dừng ở đây nhé?',
          pronunciation: '떠이 너이 조이 아. 중 어 더이 녜?',
          meaning: '도착했습니다. 여기에 세울까요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Vâng, dừng ở đây! Cảm ơn anh.',
            pronunciation: '벙, 중 어 더이! 깜 언 아잉.',
            meaning: '네, 여기에 세워주세요! 감사합니다.',
            partnerReply: {
              id: 'sc-vn-taxi-r3a',
              text: 'Không có gì! Chúc đi chơi vui vẻ!',
              pronunciation: '콩 꺼 지! 쭉 디 쩌이 부이 베!',
              meaning: '별말씀을요! 즐거운 시간 보내세요!',
            },
          },
          {
            id: 'c2',
            text: 'Cảm ơn, không cần thối lại đâu.',
            pronunciation: '깜 언, 콩 껀 토이 라이 더우.',
            meaning: '감사합니다, 거스름돈은 안 주셔도 돼요.',
            partnerReply: {
              id: 'sc-vn-taxi-r3b',
              text: 'Ồ, cảm ơn bạn nhiều lắm!',
              pronunciation: '오, 깜 언 반 니에우 람!',
              meaning: '오, 정말 감사합니다!',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'sc-vn-restaurant',
    countryId: 'vn',
    emoji: '🍽️',
    partnerName: '화 (Hoa)',
    partnerRole: '현지 쌀국수집 직원',
    title: '로컬 식당에서 주문하고 계산하기',
    description: '고수 빼기·맵기 조절까지 편하게 말하기',
    turns: [
      {
        id: 't1',
        partner: {
          id: 'sc-vn-rest-p1',
          text: 'Chào bạn! Đi mấy người ạ?',
          pronunciation: '짜오 반! 디 머이 응어이 아?',
          meaning: '어서 오세요! 몇 분이세요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Hai người ạ.',
            pronunciation: '하이 응어이 아.',
            meaning: '두 명이요.',
            partnerReply: {
              id: 'sc-vn-rest-r1a',
              text: 'Mời ngồi bàn này nhé!',
              pronunciation: '머이 응오이 반 나이 녜!',
              meaning: '이 테이블에 앉으세요!',
            },
          },
          {
            id: 'c2',
            text: 'Bốn người, cho xem menu nhé.',
            pronunciation: '본 응어이, 쪼 셈 메누 녜.',
            meaning: '네 명이요, 메뉴판 보여주세요.',
            partnerReply: {
              id: 'sc-vn-rest-r1b',
              text: 'Đây ạ, món gì cũng ngon!',
              pronunciation: '더이 아, 몬 지 꿍 응온!',
              meaning: '여기 있어요, 모든 메뉴가 맛있어요!',
            },
          },
        ],
      },
      {
        id: 't2',
        partner: {
          id: 'sc-vn-rest-p2',
          text: 'Bạn muốn gọi món gì ạ?',
          pronunciation: '반 무온 고이 몬 지 아?',
          meaning: '어떤 메뉴 주문하시겠어요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Cho cái này, không rau mùi nhé.',
            pronunciation: '쪼 까이 나이, 콩 자우 무이 녜.',
            meaning: '이거 주세요, 고수는 빼주세요.',
            tip: '고수 못 드실 땐 "콩 자우 무이(남부는 콩 응어)" 꼭 기억하세요!',
            partnerReply: {
              id: 'sc-vn-rest-r2a',
              text: 'Vâng, không rau mùi ạ!',
              pronunciation: '벙, 콩 자우 무이 아!',
              meaning: '네, 고수 빼고 드릴게요!',
            },
          },
          {
            id: 'c2',
            text: 'Món nào ngon nhất ở đây?',
            pronunciation: '몬 나오 응온 녓 어 더이?',
            meaning: '여기 제일 맛있는 메뉴가 뭐예요?',
            partnerReply: {
              id: 'sc-vn-rest-r2b',
              text: 'Bún chả và nem rán ngon lắm!',
              pronunciation: '분 짜 바 넴 잔 응온 람!',
              meaning: '분짜랑 짜조가 제일 맛있어요!',
            },
          },
        ],
      },
      {
        id: 't3',
        partner: {
          id: 'sc-vn-rest-p3',
          text: 'Ăn có ngon miệng không bạn?',
          pronunciation: '안 꺼 응온 미엉 콩 반?',
          meaning: '식사 맛있게 하셨나요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Ngon lắm! Tính tiền giúp mình nhé.',
            pronunciation: '응온 람! 띤 띠엔 줍 민 녜.',
            meaning: '진짜 맛있어요! 계산 부탁해요.',
            tip: '"띤 띠엔"이 베트남 식당 계산 요청 한마디예요.',
            partnerReply: {
              id: 'sc-vn-rest-r3a',
              text: 'Cảm ơn nhiều! Hóa đơn đây ạ.',
              pronunciation: '깜 언 니에우! 호아 던 더이 아.',
              meaning: '감사합니다! 계산서 여기 있어요.',
            },
          },
          {
            id: 'c2',
            text: 'Tuyệt vời! Cho thêm một bia nhé.',
            pronunciation: '뚜옛 버이! 쪼 템 못 비아 녜.',
            meaning: '최고예요! 맥주 한 병만 더 주세요.',
            partnerReply: {
              id: 'sc-vn-rest-r3b',
              text: 'Có ngay bia lạnh đây!',
              pronunciation: '꺼 응아이 비아 라잉 더이!',
              meaning: '시원한 맥주 바로 드릴게요!',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'sc-vn-market',
    countryId: 'vn',
    emoji: '🛍️',
    partnerName: '뚱 (Tùng)',
    partnerRole: '야시장 상점 사장님',
    title: '야시장에서 웃으며 가격 흥정하기',
    description: '가격 묻고 센스 있게 깎아보기',
    turns: [
      {
        id: 't1',
        partner: {
          id: 'sc-vn-mkt-p1',
          text: 'Mua quà lưu niệm đi bạn ơi!',
          pronunciation: '무아 꽈 르우 니엠 디 반 어이!',
          meaning: '기념품 구경하고 가세요!',
        },
        choices: [
          {
            id: 'c1',
            text: 'Cái này bao nhiêu tiền?',
            pronunciation: '까이 나이 바오 니에우 띠엔?',
            meaning: '이거 얼마예요?',
            partnerReply: {
              id: 'sc-vn-mkt-r1a',
              text: 'Hai trăm nghìn đồng thôi!',
              pronunciation: '하이 짬 응인 동 토이!',
              meaning: '딱 20만 동이에요!',
            },
          },
          {
            id: 'c2',
            text: 'Đẹp quá! Cho mình xem nhé.',
            pronunciation: '뎁 꽈! 쪼 민 셈 녜.',
            meaning: '예쁘네요! 좀 볼게요.',
            partnerReply: {
              id: 'sc-vn-mkt-r1b',
              text: 'Xem thoải mái đi bạn!',
              pronunciation: '셈 토아이 마이 디 반!',
              meaning: '마음껏 편하게 보세요!',
            },
          },
        ],
      },
      {
        id: 't2',
        partner: {
          id: 'sc-vn-mkt-p2',
          text: 'Bạn lấy cái này không?',
          pronunciation: '반 러이 까이 나이 콩?',
          meaning: '이거 가져가실래요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Giảm giá chút đi!',
            pronunciation: '잠 자 쭛 디!',
            meaning: '조금만 깎아주세요!',
            tip: '웃으면서 "잠 자 쭛 디!" 하면 분위기가 좋아져요.',
            partnerReply: {
              id: 'sc-vn-mkt-r2a',
              text: 'Thôi được rồi, một trăm rưỡi nhé!',
              pronunciation: '토이 드억 조이, 못 짬 즈어이 녜!',
              meaning: '알겠어요, 15만 동에 드릴게요!',
            },
          },
          {
            id: 'c2',
            text: 'Mua hai cái thì bao nhiêu?',
            pronunciation: '무아 하이 까이 티 바오 니에우?',
            meaning: '두 개 사면 얼마예요?',
            partnerReply: {
              id: 'sc-vn-mkt-r2b',
              text: 'Hai cái hai trăm tám nhé!',
              pronunciation: '하이 까이 하이 짬 땀 녜!',
              meaning: '두 개에 28만 동 해드릴게요!',
            },
          },
        ],
      },
      {
        id: 't3',
        partner: {
          id: 'sc-vn-mkt-p3',
          text: 'Ok chốt đơn! Gói đẹp cho bạn nhé.',
          pronunciation: '오케이 쫏 던! 고이 뎁 쪼 반 녜.',
          meaning: '거래 성사! 예쁘게 담아드릴게요.',
        },
        choices: [
          {
            id: 'c1',
            text: 'Cảm ơn nhiều nhé!',
            pronunciation: '깜 언 니에우 녜!',
            meaning: '정말 감사합니다!',
            partnerReply: {
              id: 'sc-vn-mkt-r3a',
              text: 'Cảm ơn bạn, đi chơi vui nhé!',
              pronunciation: '깜 언 반, 디 쩌이 부이 녜!',
              meaning: '감사해요, 여행 즐겁게 하세요!',
            },
          },
          {
            id: 'c2',
            text: 'Tiền đây ạ. Tạm biệt!',
            pronunciation: '띠엔 더이 아. 땀 비엣!',
            meaning: '돈 여기 있어요. 안녕히 계세요!',
            partnerReply: {
              id: 'sc-vn-mkt-r3b',
              text: 'Tạm biệt! Hẹn gặp lại!',
              pronunciation: '땀 비엣! 헨 갑 라이!',
              meaning: '안녕히 가세요! 또 만나요!',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'sc-vn-spa',
    countryId: 'vn',
    emoji: '💆',
    partnerName: '타오 (Thảo)',
    partnerRole: '마사지 테라피스트',
    title: '스파에서 강도·부위 맞추기',
    description: '원하는 부위와 압력을 편하게 말하기',
    turns: [
      {
        id: 't1',
        partner: {
          id: 'sc-vn-spa-p1',
          text: 'Chào bạn! Hôm nay mỏi chỗ nào ạ?',
          pronunciation: '짜오 반! 홈 나이 머이 쪼 나오 아?',
          meaning: '안녕하세요! 오늘 어디가 뻐근하세요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Làm kỹ vai và lưng nhé.',
            pronunciation: '람 끼 바이 바 릉 녜.',
            meaning: '어깨랑 등 꼼꼼하게 해주세요.',
            partnerReply: {
              id: 'sc-vn-spa-r1a',
              text: 'Vâng, để mình bóp kỹ vai nhé.',
              pronunciation: '벙, 데 민 법 끼 바이 녜.',
              meaning: '네, 어깨 꼼꼼히 풀어드릴게요.',
            },
          },
          {
            id: 'c2',
            text: 'Làm chân cho mình nhé.',
            pronunciation: '람 쩐 쪼 민 녜.',
            meaning: '다리 위주로 해주세요.',
            partnerReply: {
              id: 'sc-vn-spa-r1b',
              text: 'Ok, thư giãn chân ngay đây.',
              pronunciation: '오케이, 트 잔 쩐 응아이 더이.',
              meaning: '네, 다리 피로 바로 풀어드릴게요.',
            },
          },
        ],
      },
      {
        id: 't2',
        partner: {
          id: 'sc-vn-spa-p2',
          text: 'Lực thế này vừa chưa bạn?',
          pronunciation: '륵 테 나이 브어 쯔어 반?',
          meaning: '압력은 이 정도면 괜찮으세요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Nhẹ một chút nhé.',
            pronunciation: '녜 못 쭛 녜.',
            meaning: '조금만 살살 해주세요.',
            partnerReply: {
              id: 'sc-vn-spa-r2a',
              text: 'Xin lỗi, mình làm nhẹ lại nhé.',
              pronunciation: '신 로이, 민 람 녜 라이 녜.',
              meaning: '죄송해요, 살살 해드릴게요.',
            },
          },
          {
            id: 'c2',
            text: 'Mạnh hơn một chút nhé!',
            pronunciation: '마잉 헌 못 쭛 녜!',
            meaning: '조금만 더 세게 해주세요!',
            partnerReply: {
              id: 'sc-vn-spa-r2b',
              text: 'Vâng, mình tăng lực lên nhé.',
              pronunciation: '벙, 민 땅 륵 렌 녜.',
              meaning: '네, 압력 조금 더 높일게요.',
            },
          },
        ],
      },
      {
        id: 't3',
        partner: {
          id: 'sc-vn-spa-p3',
          text: 'Xong rồi ạ! Mời uống trà ấm nhé.',
          pronunciation: '쏭 조이 아! 머이 우옹 짜 암 녜.',
          meaning: '다 끝났습니다! 따뜻한 차 드세요.',
        },
        choices: [
          {
            id: 'c1',
            text: 'Thoải mái quá! Cảm ơn bạn!',
            pronunciation: '토아이 마이 꽈! 깜 언 반!',
            meaning: '정말 시원했어요! 감사합니다!',
            partnerReply: {
              id: 'sc-vn-spa-r3a',
              text: 'Cảm ơn nhiều! Chúc ngủ ngon!',
              pronunciation: '깜 언 니에우! 쭉 응우 응온!',
              meaning: '감사합니다! 푹 쉬세요!',
            },
          },
          {
            id: 'c2',
            text: 'Cảm ơn, gửi bạn tiền tip nhé.',
            pronunciation: '깜 언, 그이 반 띠엔 팁 녜.',
            meaning: '수고하셨어요, 팁 여기 있습니다.',
            partnerReply: {
              id: 'sc-vn-spa-r3b',
              text: 'Ôi cảm ơn bạn rất nhiều!',
              pronunciation: '오이 깜 언 반 젓 니에우!',
              meaning: '어머, 정말 감사드려요!',
            },
          },
        ],
      },
    ],
  },
];

export function scenariosFor(countryId: CountryId): Scenario[] {
  const source: CountryId = countryId === 'en' ? 'ph' : countryId;
  const list = SCENARIOS.filter((s) => s.countryId === source);
  return list.length > 0 ? list : SCENARIOS.filter((s) => s.countryId === 'ph');
}

export function scenarioLineAsPhrase(line: ScenarioLine, countryId: CountryId): Phrase {
  const voiceCountryId: CountryId = countryId === 'vn' ? 'vn' : 'en';
  return {
    id: line.id,
    countryId: voiceCountryId,
    category: '미팅/사교',
    original: line.text,
    translation: line.meaning,
    pronunciation: `[${line.pronunciation}]`,
  };
}
