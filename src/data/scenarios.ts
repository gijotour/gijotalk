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
  /* ===================== 필리핀 타갈로그 (ph) ===================== */
  {
    id: 'sc-ph-cafe',
    countryId: 'ph',
    emoji: '☕',
    partnerName: '미아 (Mia)',
    partnerRole: '카페 현지 친구',
    title: '카페에서 새 친구 만나기',
    description: '짧은 타갈로그 한두 마디로 인사하기',
    turns: [
      {
        id: 't1',
        partner: {
          id: 'sc-ph-cafe-p1',
          text: 'Kumusta po!',
          pronunciation: '쿠무스타 포!',
          meaning: '안녕하세요!',
        },
        choices: [
          {
            id: 'c1',
            text: 'Kumusta! Taga-Korea.',
            pronunciation: '쿠무스타! 타가-코리아.',
            meaning: '안녕! 한국인이야.',
            tip: '"타가-코리아"만 붙여도 금방 친해져요.',
            partnerReply: {
              id: 'sc-ph-cafe-r1a',
              text: 'Oh, Korea! Welcome!',
              pronunciation: '오, 코리아! 웰컴!',
              meaning: '오 한국! 환영해요!',
            },
          },
          {
            id: 'c2',
            text: 'Salamat! Ganda dito!',
            pronunciation: '살라맛! 간다 디토!',
            meaning: '고마워요! 여기 예뻐요!',
            tip: '장소를 칭찬하면 분위기가 확 풀려요.',
            partnerReply: {
              id: 'sc-ph-cafe-r1b',
              text: 'Salamat! Enjoy!',
              pronunciation: '살라맛! 인조이!',
              meaning: '고마워요! 즐겁게 놀아요!',
            },
          },
        ],
      },
      {
        id: 't2',
        partner: {
          id: 'sc-ph-cafe-p2',
          text: 'Masarap ang kape?',
          pronunciation: '마사랍 앙 카페?',
          meaning: '커피 맛있어요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Oo, masarap po!',
            pronunciation: '오오, 마사랍 포!',
            meaning: '네, 맛있어요!',
            tip: '식당·카페 어디서나 쓰는 최고 칭찬.',
            partnerReply: {
              id: 'sc-ph-cafe-r2a',
              text: 'Sige! Kain tayo.',
              pronunciation: '시게! 카인 타요.',
              meaning: '좋아요! 같이 먹어요.',
            },
          },
          {
            id: 'c2',
            text: 'Ano masarap dito?',
            pronunciation: '아노 마사랍 디토?',
            meaning: '여기 뭐가 맛있어요?',
            tip: '현지인 추천을 부르는 가장 짧은 질문.',
            partnerReply: {
              id: 'sc-ph-cafe-r2b',
              text: 'Halo-halo! Try mo.',
              pronunciation: '할로할로! 트라이 모.',
              meaning: '할로할로! 먹어봐요.',
            },
          },
        ],
      },
      {
        id: 't3',
        partner: {
          id: 'sc-ph-cafe-p3',
          text: 'Picture tayo!',
          pronunciation: '픽처 타요!',
          meaning: '사진 찍어요!',
        },
        choices: [
          {
            id: 'c1',
            text: 'Oo, tara!',
            pronunciation: '오오, 타라!',
            meaning: '네, 좋아요!',
            tip: '"타라!"는 "좋아, 가자!"라는 친근한 말.',
            partnerReply: {
              id: 'sc-ph-cafe-r3a',
              text: 'Ingat ka!',
              pronunciation: '잉갓 카!',
              meaning: '조심히 가요!',
            },
          },
          {
            id: 'c2',
            text: 'Ano FB mo?',
            pronunciation: '아노 페북 모?',
            meaning: '페이스북 뭐예요?',
            tip: '필리핀 친구들은 페북(FB)을 가장 많이 써요.',
            partnerReply: {
              id: 'sc-ph-cafe-r3b',
              text: 'Ito! Kitakits!',
              pronunciation: '이토! 키타키츠!',
              meaning: '여기요! 또 봐요!',
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
    partnerRole: '기사님',
    title: '택시·지프니 타고 내리기',
    description: '목적지 보여주고 한마디로 세우기',
    turns: [
      {
        id: 't1',
        partner: {
          id: 'sc-ph-taxi-p1',
          text: 'Saan po tayo?',
          pronunciation: '사안 포 타요?',
          meaning: '어디로 갈까요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Dito po.',
            pronunciation: '디토 포.',
            meaning: '여기로요. (지도 보며)',
            tip: '지도 앱을 보여주며 딱 두 마디면 충분해요.',
            partnerReply: {
              id: 'sc-ph-taxi-r1a',
              text: 'Sige po!',
              pronunciation: '시게 포!',
              meaning: '네 알겠습니다!',
            },
          },
          {
            id: 'c2',
            text: 'Night market po.',
            pronunciation: '나이트 마켓 포.',
            meaning: '야시장으로요.',
            partnerReply: {
              id: 'sc-ph-taxi-r1b',
              text: 'Malapit lang.',
              pronunciation: '말라핏 랑.',
              meaning: '금방 가요.',
            },
          },
        ],
      },
      {
        id: 't2',
        partner: {
          id: 'sc-ph-taxi-p2',
          text: 'Malamig po ba?',
          pronunciation: '말라믹 포 바?',
          meaning: '에어컨 추우세요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Ok lang po.',
            pronunciation: '오케이 랑 포.',
            meaning: '괜찮아요.',
            partnerReply: {
              id: 'sc-ph-taxi-r2a',
              text: 'Mabuti po.',
              pronunciation: '마부티 포.',
              meaning: '다행이네요.',
            },
          },
          {
            id: 'c2',
            text: 'Malamig po.',
            pronunciation: '말라믹 포.',
            meaning: '추워요.',
            partnerReply: {
              id: 'sc-ph-taxi-r2b',
              text: 'Hinaan ko po.',
              pronunciation: '히나안 코 포.',
              meaning: '바람 줄여드릴게요.',
            },
          },
        ],
      },
      {
        id: 't3',
        partner: {
          id: 'sc-ph-taxi-p3',
          text: 'Dito na po.',
          pronunciation: '디토 나 포.',
          meaning: '다 왔습니다.',
        },
        choices: [
          {
            id: 'c1',
            text: 'Para po!',
            pronunciation: '파라 포!',
            meaning: '여기에 세워주세요!',
            tip: '필리핀 여행 필수 1순위 단어 "파라 포!".',
            partnerReply: {
              id: 'sc-ph-taxi-r3a',
              text: 'Ingat po!',
              pronunciation: '잉갓 포!',
              meaning: '조심히 가세요!',
            },
          },
          {
            id: 'c2',
            text: 'Salamat po!',
            pronunciation: '살라맛 포!',
            meaning: '감사합니다!',
            partnerReply: {
              id: 'sc-ph-taxi-r3b',
              text: 'Walang anuman!',
              pronunciation: '왈랑 아누만!',
              meaning: '천만에요!',
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
    partnerRole: '식당 직원',
    title: '식당에서 주문·계산하기',
    description: '인원수, 추천, 계산까지 짧게 말하기',
    turns: [
      {
        id: 't1',
        partner: {
          id: 'sc-ph-rest-p1',
          text: 'Ilan po kayo?',
          pronunciation: '일란 포 카요?',
          meaning: '몇 분이세요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Dalawa po.',
            pronunciation: '달라와 포.',
            meaning: '두 명이요.',
            partnerReply: {
              id: 'sc-ph-rest-r1a',
              text: 'Pasok po!',
              pronunciation: '파속 포!',
              meaning: '들어오세요!',
            },
          },
          {
            id: 'c2',
            text: 'Apat po.',
            pronunciation: '아팟 포.',
            meaning: '네 명이요.',
            partnerReply: {
              id: 'sc-ph-rest-r1b',
              text: 'Dito po kayo.',
              pronunciation: '디토 포 카요.',
              meaning: '이쪽 자리예요.',
            },
          },
        ],
      },
      {
        id: 't2',
        partner: {
          id: 'sc-ph-rest-p2',
          text: 'Order po?',
          pronunciation: '오더 포?',
          meaning: '주문하시겠어요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Ano masarap?',
            pronunciation: '아노 마사랍?',
            meaning: '뭐가 맛있어요?',
            tip: '메뉴판 앞에서 "아노 마사랍?" 한마디면 끝.',
            partnerReply: {
              id: 'sc-ph-rest-r2a',
              text: 'Sisig po!',
              pronunciation: '시식 포!',
              meaning: '시식 추천해요!',
            },
          },
          {
            id: 'c2',
            text: 'Ito po. Tubig.',
            pronunciation: '이토 포. 투빅.',
            meaning: '이거랑 물 주세요.',
            partnerReply: {
              id: 'sc-ph-rest-r2b',
              text: 'Sige, wait lang.',
              pronunciation: '시게, 웨잇 랑.',
              meaning: '네, 잠시만요.',
            },
          },
        ],
      },
      {
        id: 't3',
        partner: {
          id: 'sc-ph-rest-p3',
          text: 'Masarap po ba?',
          pronunciation: '마사랍 포 바?',
          meaning: '맛있으셨나요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Masarap! Bill out.',
            pronunciation: '마사랍! 빌 아웃.',
            meaning: '맛있어요! 계산서요.',
            tip: '필리핀에서는 "Bill out!" 하면 계산서를 줘요.',
            partnerReply: {
              id: 'sc-ph-rest-r3a',
              text: 'Salamat po!',
              pronunciation: '살라맛 포!',
              meaning: '감사합니다!',
            },
          },
          {
            id: 'c2',
            text: 'Isa pang serbesa.',
            pronunciation: '이사 팡 세르베사.',
            meaning: '맥주 하나 더요.',
            partnerReply: {
              id: 'sc-ph-rest-r3b',
              text: 'Darating na!',
              pronunciation: '다라팅 나!',
              meaning: '바로 가져다드릴게요!',
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
    partnerRole: '야시장 상인',
    title: '야시장에서 가격 묻고 깎기',
    description: '두 단어 흥정으로 기분 좋게 쇼핑하기',
    turns: [
      {
        id: 't1',
        partner: {
          id: 'sc-ph-mkt-p1',
          text: 'Ano hanap ninyo?',
          pronunciation: '아노 하납 니뇨?',
          meaning: '뭐 찾으세요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Magkano po ito?',
            pronunciation: '막카노 포 이토?',
            meaning: '이거 얼마예요?',
            tip: '가격 물은 땐 무조건 "막카노?"',
            partnerReply: {
              id: 'sc-ph-mkt-r1a',
              text: 'Three hundred po.',
              pronunciation: '쓰리 헌드레드 포.',
              meaning: '300페소예요.',
            },
          },
          {
            id: 'c2',
            text: 'Tingin lang po.',
            pronunciation: '팅인 랑 포.',
            meaning: '그냥 구경해요.',
            partnerReply: {
              id: 'sc-ph-mkt-r1b',
              text: 'Sige lang!',
              pronunciation: '시게 랑!',
              meaning: '편히 보세요!',
            },
          },
        ],
      },
      {
        id: 't2',
        partner: {
          id: 'sc-ph-mkt-p2',
          text: 'Kuha na po!',
          pronunciation: '쿠하 나 포!',
          meaning: '가져가세요!',
        },
        choices: [
          {
            id: 'c1',
            text: 'Mahal! Tawad po.',
            pronunciation: '마할! 타와드 포.',
            meaning: '비싸요! 깎아주세요.',
            tip: '웃으면서 "타와드 포~" 하면 잘 깎아줘요.',
            partnerReply: {
              id: 'sc-ph-mkt-r2a',
              text: 'Two fifty, last.',
              pronunciation: '투 피프티, 라스트.',
              meaning: '250페소가 마지막이에요.',
            },
          },
          {
            id: 'c2',
            text: 'Dalawa, magkano?',
            pronunciation: '달라와, 막카노?',
            meaning: '두 개 얼마예요?',
            partnerReply: {
              id: 'sc-ph-mkt-r2b',
              text: 'Four fifty po.',
              pronunciation: '포 피프티 포.',
              meaning: '450페소예요.',
            },
          },
        ],
      },
      {
        id: 't3',
        partner: {
          id: 'sc-ph-mkt-p3',
          text: 'Deal na po?',
          pronunciation: '딜 나 포?',
          meaning: '이 가격에 하실래요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Oo, deal!',
            pronunciation: '오오, 딜!',
            meaning: '네, 살게요!',
            partnerReply: {
              id: 'sc-ph-mkt-r3a',
              text: 'Salamat po!',
              pronunciation: '살라맛 포!',
              meaning: '감사합니다!',
            },
          },
          {
            id: 'c2',
            text: 'Cash po.',
            pronunciation: '캐시 포.',
            meaning: '현금으로 낼게요.',
            partnerReply: {
              id: 'sc-ph-mkt-r3b',
              text: 'Salamat! Ingat!',
              pronunciation: '살라맛! 잉갓!',
              meaning: '고마워요! 조심히 가요!',
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
    partnerRole: '스파 직원',
    title: '스파에서 부위·강도 말하기',
    description: '짧게 아픈 곳과 압력 조절 전달하기',
    turns: [
      {
        id: 't1',
        partner: {
          id: 'sc-ph-spa-p1',
          text: 'Saan masakit?',
          pronunciation: '사안 마사킷?',
          meaning: '어디가 아프세요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Balikat po.',
            pronunciation: '발리캇 포.',
            meaning: '어깨요.',
            partnerReply: {
              id: 'sc-ph-spa-r1a',
              text: 'Sige po.',
              pronunciation: '시게 포.',
              meaning: '알겠어요.',
            },
          },
          {
            id: 'c2',
            text: 'Paa po.',
            pronunciation: '파아 포.',
            meaning: '발·다리요.',
            partnerReply: {
              id: 'sc-ph-spa-r1b',
              text: 'Ok, relax lang.',
              pronunciation: '오케이, 릴랙스 랑.',
              meaning: '네, 편히 계세요.',
            },
          },
        ],
      },
      {
        id: 't2',
        partner: {
          id: 'sc-ph-spa-p2',
          text: 'Okay lang po?',
          pronunciation: '오케이 랑 포?',
          meaning: '강도 괜찮으세요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Dahan-dahan po.',
            pronunciation: '다한-다한 포.',
            meaning: '살살 해주세요.',
            tip: '"다한-다한" = 천천히/약하게.',
            partnerReply: {
              id: 'sc-ph-spa-r2a',
              text: 'Sorry, mahina na.',
              pronunciation: '쏘리, 마히나 나.',
              meaning: '죄송해요, 약하게 할게요.',
            },
          },
          {
            id: 'c2',
            text: 'Lakasan pa po.',
            pronunciation: '라카산 파 포.',
            meaning: '조금 더 세게 해주세요.',
            partnerReply: {
              id: 'sc-ph-spa-r2b',
              text: 'Sige, mas malakas.',
              pronunciation: '시게, 마스 말라카스.',
              meaning: '네, 더 세게 할게요.',
            },
          },
        ],
      },
      {
        id: 't3',
        partner: {
          id: 'sc-ph-spa-p3',
          text: 'Tapos na po.',
          pronunciation: '타포스 나 포.',
          meaning: '다 끝났습니다.',
        },
        choices: [
          {
            id: 'c1',
            text: 'Galing! Salamat!',
            pronunciation: '갈링! 살라맛!',
            meaning: '최고예요! 감사합니다!',
            partnerReply: {
              id: 'sc-ph-spa-r3a',
              text: 'Walang anuman!',
              pronunciation: '왈랑 아누만!',
              meaning: '천만에요!',
            },
          },
          {
            id: 'c2',
            text: 'Tip po. Salamat.',
            pronunciation: '팁 포. 살라맛.',
            meaning: '팁이에요. 고마워요.',
            partnerReply: {
              id: 'sc-ph-spa-r3b',
              text: 'Salamat po!',
              pronunciation: '살라맛 포!',
              meaning: '감사합니다!',
            },
          },
        ],
      },
    ],
  },

  /* ===================== 쉬운 영어 (en) ===================== */
  {
    id: 'sc-en-cafe',
    countryId: 'en',
    emoji: '☕',
    partnerName: 'Mia',
    partnerRole: '카페 새 친구',
    title: '카페에서 새 친구 만나기',
    description: '2~3단어 영어로 가볍게 말 걸기',
    turns: [
      {
        id: 't1',
        partner: {
          id: 'sc-en-cafe-p1',
          text: 'Hi! Traveler?',
          pronunciation: '하이! 트래블러?',
          meaning: '안녕! 여행자세요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Yes! From Korea.',
            pronunciation: '예스! 프롬 코리아.',
            meaning: '네! 한국에서 왔어요.',
            tip: '문장 없이 "From Korea."만 말해도 다 알아들어요.',
            partnerReply: {
              id: 'sc-en-cafe-r1a',
              text: 'Nice! Welcome!',
              pronunciation: '나이스! 웰컴!',
              meaning: '좋네요! 환영해요!',
            },
          },
          {
            id: 'c2',
            text: 'Nice to meet you!',
            pronunciation: '나이스 투 미트 유!',
            meaning: '만나서 반가워요!',
            partnerReply: {
              id: 'sc-en-cafe-r1b',
              text: 'Me too! Enjoy!',
              pronunciation: '미 투! 인조이!',
              meaning: '저도요! 즐거운 여행 돼요!',
            },
          },
        ],
      },
      {
        id: 't2',
        partner: {
          id: 'sc-en-cafe-p2',
          text: 'How is coffee?',
          pronunciation: '하우 이즈 커피?',
          meaning: '커피 어때요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'So good!',
            pronunciation: '쏘 굿!',
            meaning: '정말 맛있어요!',
            partnerReply: {
              id: 'sc-en-cafe-r2a',
              text: 'Right? Try cake!',
              pronunciation: '라잇? 트라이 케이크!',
              meaning: '그쵸? 케이크도 드셔봐요!',
            },
          },
          {
            id: 'c2',
            text: 'Any good food?',
            pronunciation: '애니 굿 푸드?',
            meaning: '맛있는 거 있어요?',
            partnerReply: {
              id: 'sc-en-cafe-r2b',
              text: 'Mango shake!',
              pronunciation: '망고 셰이크!',
              meaning: '망고 셰이크 추천해요!',
            },
          },
        ],
      },
      {
        id: 't3',
        partner: {
          id: 'sc-en-cafe-p3',
          text: 'Photo together?',
          pronunciation: '포토 투게더?',
          meaning: '사진 같이 찍을까요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Sure! Smile!',
            pronunciation: '슈어! 스마일!',
            meaning: '좋아요! 스마일!',
            partnerReply: {
              id: 'sc-en-cafe-r3a',
              text: 'See you!',
              pronunciation: '씨 유!',
              meaning: '또 만나요!',
            },
          },
          {
            id: 'c2',
            text: 'Your Insta?',
            pronunciation: '유어 인스타?',
            meaning: '인스타 뭐예요?',
            partnerReply: {
              id: 'sc-en-cafe-r3b',
              text: 'Here! Follow me!',
              pronunciation: '히어! 팔로우 미!',
              meaning: '여기요! 팔로우해요!',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'sc-en-taxi',
    countryId: 'en',
    emoji: '🚕',
    partnerName: 'Mark',
    partnerRole: '기사님',
    title: '기사님과 목적지·하차 말하기',
    description: '짧은 키워드로 목적지와 정차 전달하기',
    turns: [
      {
        id: 't1',
        partner: {
          id: 'sc-en-taxi-p1',
          text: 'Where to?',
          pronunciation: '웨어 투?',
          meaning: '어디로 갈까요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Here, please.',
            pronunciation: '히어, 플리즈.',
            meaning: '여기로요. (지도 보며)',
            partnerReply: {
              id: 'sc-en-taxi-r1a',
              text: 'Got it!',
              pronunciation: '갓 잇!',
              meaning: '알겠습니다!',
            },
          },
          {
            id: 'c2',
            text: 'Night market, please.',
            pronunciation: '나이트 마켓, 플리즈.',
            meaning: '야시장으로요.',
            partnerReply: {
              id: 'sc-en-taxi-r1b',
              text: 'Okay! Fifteen minutes.',
              pronunciation: '오케이! 피프틴 미니츠.',
              meaning: '네! 15분 걸려요.',
            },
          },
        ],
      },
      {
        id: 't2',
        partner: {
          id: 'sc-en-taxi-p2',
          text: 'Aircon okay?',
          pronunciation: '에어컨 오케이?',
          meaning: '에어컨 괜찮아요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Perfect! Thanks.',
            pronunciation: '퍼펙트! 땡스.',
            meaning: '딱 좋아요! 고마워요.',
            partnerReply: {
              id: 'sc-en-taxi-r2a',
              text: 'Almost there.',
              pronunciation: '올모스트 데어.',
              meaning: '거의 다 왔어요.',
            },
          },
          {
            id: 'c2',
            text: 'Too cold.',
            pronunciation: '투 콜드.',
            meaning: '너무 추워요.',
            partnerReply: {
              id: 'sc-en-taxi-r2b',
              text: 'Turning down!',
              pronunciation: '터닝 다운!',
              meaning: '줄여드릴게요!',
            },
          },
        ],
      },
      {
        id: 't3',
        partner: {
          id: 'sc-en-taxi-p3',
          text: 'Right here?',
          pronunciation: '라이트 히어?',
          meaning: '바로 여기요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Stop here!',
            pronunciation: '스톱 히어!',
            meaning: '여기에 세워주세요!',
            partnerReply: {
              id: 'sc-en-taxi-r3a',
              text: 'Have fun!',
              pronunciation: '해브 펀!',
              meaning: '재밌게 노세요!',
            },
          },
          {
            id: 'c2',
            text: 'Keep change. Thanks!',
            pronunciation: '킵 체인지. 땡스!',
            meaning: '잔돈은 가지세요. 감사해요!',
            partnerReply: {
              id: 'sc-en-taxi-r3b',
              text: 'Thank you!',
              pronunciation: '땡큐!',
              meaning: '감사합니다!',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'sc-en-restaurant',
    countryId: 'en',
    emoji: '🍽️',
    partnerName: 'Joy',
    partnerRole: '식당 직원',
    title: '식당에서 주문·계산하기',
    description: '2단어로 추천받고 계산하기',
    turns: [
      {
        id: 't1',
        partner: {
          id: 'sc-en-rest-p1',
          text: 'How many?',
          pronunciation: '하우 매니?',
          meaning: '몇 분이세요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Two, please.',
            pronunciation: '투, 플리즈.',
            meaning: '두 명이요.',
            partnerReply: {
              id: 'sc-en-rest-r1a',
              text: 'This way!',
              pronunciation: '디스 웨이!',
              meaning: '이쪽이에요!',
            },
          },
          {
            id: 'c2',
            text: 'Four, inside.',
            pronunciation: '포, 인사이드.',
            meaning: '네 명, 실내 자리요.',
            partnerReply: {
              id: 'sc-en-rest-r1b',
              text: 'Sure! Follow me.',
              pronunciation: '슈어! 팔로우 미.',
              meaning: '네! 따라오세요.',
            },
          },
        ],
      },
      {
        id: 't2',
        partner: {
          id: 'sc-en-rest-p2',
          text: 'Ready to order?',
          pronunciation: '레디 투 오더?',
          meaning: '주문하실래요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Best menu?',
            pronunciation: '베스트 메뉴?',
            meaning: '추천 메뉴 뭐예요?',
            partnerReply: {
              id: 'sc-en-rest-r2a',
              text: 'Garlic shrimp!',
              pronunciation: '갈릭 슈림프!',
              meaning: '갈릭 슈림프요!',
            },
          },
          {
            id: 'c2',
            text: 'Less salty, please.',
            pronunciation: '레스 솔티, 플리즈.',
            meaning: '덜 짜게 해주세요.',
            partnerReply: {
              id: 'sc-en-rest-r2b',
              text: 'Okay, less salt!',
              pronunciation: '오케이, 레스 솔트!',
              meaning: '네, 덜 짜게 해드릴게요!',
            },
          },
        ],
      },
      {
        id: 't3',
        partner: {
          id: 'sc-en-rest-p3',
          text: 'Everything good?',
          pronunciation: '에브리띵 굿?',
          meaning: '다 괜찮았나요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Delicious! Bill, please.',
            pronunciation: '딜리셔스! 빌, 플리즈.',
            meaning: '맛있어요! 계산서 주세요.',
            partnerReply: {
              id: 'sc-en-rest-r3a',
              text: 'Here you go!',
              pronunciation: '히어 유 고!',
              meaning: '여기 있습니다!',
            },
          },
          {
            id: 'c2',
            text: 'One more beer.',
            pronunciation: '원 모어 비어.',
            meaning: '맥주 하나 더요.',
            partnerReply: {
              id: 'sc-en-rest-r3b',
              text: 'Coming right up!',
              pronunciation: '커밍 라이트 업!',
              meaning: '바로 가져올게요!',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'sc-en-market',
    countryId: 'en',
    emoji: '🛍️',
    partnerName: 'Liza',
    partnerRole: '야시장 상인',
    title: '야시장에서 흥정하기',
    description: '짧게 가격 묻고 할인 요청하기',
    turns: [
      {
        id: 't1',
        partner: {
          id: 'sc-en-mkt-p1',
          text: 'Any souvenirs?',
          pronunciation: '애니 수베니어스?',
          meaning: '기념품 보세요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'How much?',
            pronunciation: '하우 머치?',
            meaning: '얼마예요?',
            partnerReply: {
              id: 'sc-en-mkt-r1a',
              text: 'Three hundred.',
              pronunciation: '쓰리 헌드레드.',
              meaning: '300이에요.',
            },
          },
          {
            id: 'c2',
            text: 'Just looking.',
            pronunciation: '저스트 루킹.',
            meaning: '그냥 구경해요.',
            partnerReply: {
              id: 'sc-en-mkt-r1b',
              text: 'Take your time!',
              pronunciation: '테이크 유어 타임!',
              meaning: '천천히 보세요!',
            },
          },
        ],
      },
      {
        id: 't2',
        partner: {
          id: 'sc-en-mkt-p2',
          text: 'Like it?',
          pronunciation: '라익 잇?',
          meaning: '마음에 들어요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Discount, please.',
            pronunciation: '디스카운트, 플리즈.',
            meaning: '조금 깎아주세요.',
            partnerReply: {
              id: 'sc-en-mkt-r2a',
              text: 'Okay, two fifty.',
              pronunciation: '오케이, 투 피프티.',
              meaning: '좋아요, 250에 드릴게요.',
            },
          },
          {
            id: 'c2',
            text: 'Two, how much?',
            pronunciation: '투, 하우 머치?',
            meaning: '두 개 얼마예요?',
            partnerReply: {
              id: 'sc-en-mkt-r2b',
              text: 'Four fifty!',
              pronunciation: '포 피프티!',
              meaning: '둘 다 450이에요!',
            },
          },
        ],
      },
      {
        id: 't3',
        partner: {
          id: 'sc-en-mkt-p3',
          text: 'Cash or card?',
          pronunciation: '캐시 오어 카드?',
          meaning: '현금이나 카드요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Cash, please.',
            pronunciation: '캐시, 플리즈.',
            meaning: '현금이요.',
            partnerReply: {
              id: 'sc-en-mkt-r3a',
              text: 'Thanks! Bye!',
              pronunciation: '땡스! 바이!',
              meaning: '감사해요! 안녕!',
            },
          },
          {
            id: 'c2',
            text: 'Card, please.',
            pronunciation: '카드, 플리즈.',
            meaning: '카드요.',
            partnerReply: {
              id: 'sc-en-mkt-r3b',
              text: 'Tap here!',
              pronunciation: '탭 히어!',
              meaning: '여기 대주세요!',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'sc-en-spa',
    countryId: 'en',
    emoji: '💆',
    partnerName: 'Anna',
    partnerRole: '마사지 직원',
    title: '스파에서 강도 맞추기',
    description: '짧은 단어로 부위·세기 말하기',
    turns: [
      {
        id: 't1',
        partner: {
          id: 'sc-en-spa-p1',
          text: 'Which area?',
          pronunciation: '위치 에어리어?',
          meaning: '어디 해드릴까요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Shoulders, please.',
            pronunciation: '숄더즈, 플리즈.',
            meaning: '어깨 해주세요.',
            partnerReply: {
              id: 'sc-en-spa-r1a',
              text: 'Got it.',
              pronunciation: '갓 잇.',
              meaning: '알겠어요.',
            },
          },
          {
            id: 'c2',
            text: 'Legs and feet.',
            pronunciation: '레그즈 앤 피트.',
            meaning: '다리랑 발이요.',
            partnerReply: {
              id: 'sc-en-spa-r1b',
              text: 'Relax!',
              pronunciation: '릴랙스!',
              meaning: '편히 쉬세요!',
            },
          },
        ],
      },
      {
        id: 't2',
        partner: {
          id: 'sc-en-spa-p2',
          text: 'Pressure okay?',
          pronunciation: '프레셔 오케이?',
          meaning: '압력 괜찮아요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Softer, please.',
            pronunciation: '소프터, 플리즈.',
            meaning: '살살 해주세요.',
            partnerReply: {
              id: 'sc-en-spa-r2a',
              text: 'Sorry! Better?',
              pronunciation: '쏘리! 베터?',
              meaning: '죄송해요! 좀 낫나요?',
            },
          },
          {
            id: 'c2',
            text: 'Stronger, please.',
            pronunciation: '스트롱거, 플리즈.',
            meaning: '더 세게 해주세요.',
            partnerReply: {
              id: 'sc-en-spa-r2b',
              text: 'Sure!',
              pronunciation: '슈어!',
              meaning: '네!',
            },
          },
        ],
      },
      {
        id: 't3',
        partner: {
          id: 'sc-en-spa-p3',
          text: 'All done!',
          pronunciation: '올 던!',
          meaning: '다 끝났습니다!',
        },
        choices: [
          {
            id: 'c1',
            text: 'Amazing! Thank you!',
            pronunciation: '어메이징! 땡큐!',
            meaning: '최고예요! 감사합니다!',
            partnerReply: {
              id: 'sc-en-spa-r3a',
              text: 'You are welcome!',
              pronunciation: '유 아 웰컴!',
              meaning: '천만에요!',
            },
          },
          {
            id: 'c2',
            text: 'Tip for you.',
            pronunciation: '팁 포 유.',
            meaning: '팁 받으세요.',
            partnerReply: {
              id: 'sc-en-spa-r3b',
              text: 'Thank you!',
              pronunciation: '땡큐!',
              meaning: '감사합니다!',
            },
          },
        ],
      },
    ],
  },

  /* ===================== 베트남어 최소 단어 (vn) ===================== */
  {
    id: 'sc-vn-cafe',
    countryId: 'vn',
    emoji: '☕',
    partnerName: '린 (Linh)',
    partnerRole: '카페 현지 친구',
    title: '카페에서 새 친구 만나기',
    description: '짧은 베트남어 2~3단어로 인사하기',
    turns: [
      {
        id: 't1',
        partner: {
          id: 'sc-vn-cafe-p1',
          text: 'Xin chào!',
          pronunciation: '신 짜오!',
          meaning: '안녕하세요!',
        },
        choices: [
          {
            id: 'c1',
            text: 'Xin chào! Người Hàn.',
            pronunciation: '신 짜오! 응어이 한.',
            meaning: '안녕! 한국인이에요.',
            tip: '"응어이 한(한국인)" 한마디면 미소로 반겨줘요.',
            partnerReply: {
              id: 'sc-vn-cafe-r1a',
              text: 'Tuyệt! Cà phê ngon?',
              pronunciation: '뚜옛! 까페 응온?',
              meaning: '좋아요! 커피 맛있어요?',
            },
          },
          {
            id: 'c2',
            text: 'Rất vui gặp bạn.',
            pronunciation: '젓 부이 갑 반.',
            meaning: '만나서 반가워요.',
            partnerReply: {
              id: 'sc-vn-cafe-r1b',
              text: 'Mình cũng vui!',
              pronunciation: '민 꿍 부이!',
              meaning: '저도 반가워요!',
            },
          },
        ],
      },
      {
        id: 't2',
        partner: {
          id: 'sc-vn-cafe-p2',
          text: 'Việt Nam đẹp?',
          pronunciation: '비엣 남 뎁?',
          meaning: '베트남 예쁘죠?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Đẹp quá! Quán ngon?',
            pronunciation: '뎁 꽈! 꽌 응온?',
            meaning: '예뻐요! 맛집 어디예요?',
            tip: '"꽌 응온?(맛있는 식당?)" 2단어면 추천이 쏟아져요.',
            partnerReply: {
              id: 'sc-vn-cafe-r2a',
              text: 'Quán phở kia!',
              pronunciation: '꽌 퍼 키아!',
              meaning: '저기 쌀국수집이요!',
            },
          },
          {
            id: 'c2',
            text: 'Thích cà phê!',
            pronunciation: '틱 까페!',
            meaning: '커피 너무 좋아요!',
            partnerReply: {
              id: 'sc-vn-cafe-r2b',
              text: 'Cà phê số một!',
              pronunciation: '까페 소 못!',
              meaning: '커피 최고죠!',
            },
          },
        ],
      },
      {
        id: 't3',
        partner: {
          id: 'sc-vn-cafe-p3',
          text: 'Chụp ảnh nhé?',
          pronunciation: '쭙 아잉 녜?',
          meaning: '사진 찍을까요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Ok! Cảm ơn!',
            pronunciation: '오케이! 깜 언!',
            meaning: '좋아요! 고마워요!',
            partnerReply: {
              id: 'sc-vn-cafe-r3a',
              text: 'Cười lên!',
              pronunciation: '끄어이 렌!',
              meaning: '활짝 웃어요!',
            },
          },
          {
            id: 'c2',
            text: 'Xin Instagram nhé!',
            pronunciation: '신 인스타그램 녜!',
            meaning: '인스타 알려주세요!',
            partnerReply: {
              id: 'sc-vn-cafe-r3b',
              text: 'Đây nhé!',
              pronunciation: '더이 녜!',
              meaning: '여기 있어요!',
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
    partnerRole: '기사님',
    title: '택시·그랩 목적지·하차 말하기',
    description: '짧은 단어로 가고 내리기',
    turns: [
      {
        id: 't1',
        partner: {
          id: 'sc-vn-taxi-p1',
          text: 'Đi đâu ạ?',
          pronunciation: '디 더우 아?',
          meaning: '어디로 갈까요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Đến đây ạ.',
            pronunciation: '덴 더이 아.',
            meaning: '여기로 가주세요.',
            partnerReply: {
              id: 'sc-vn-taxi-r1a',
              text: 'Ok! Mười lăm phút.',
              pronunciation: '오케이! 므어이 람 풋.',
              meaning: '네! 15분 걸려요.',
            },
          },
          {
            id: 'c2',
            text: 'Đi chợ đêm.',
            pronunciation: '디 쩌 뎀.',
            meaning: '야시장으로 가요.',
            partnerReply: {
              id: 'sc-vn-taxi-r1b',
              text: 'Vâng, đi ngay!',
              pronunciation: '벙, 디 응아이!',
              meaning: '네, 바로 갑니다!',
            },
          },
        ],
      },
      {
        id: 't2',
        partner: {
          id: 'sc-vn-taxi-p2',
          text: 'Lạnh quá không?',
          pronunciation: '라잉 꽈 콩?',
          meaning: '에어컨 추우세요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Mát lắm! Cảm ơn!',
            pronunciation: '맛 람! 깜 언!',
            meaning: '시원해요! 감사해요!',
            partnerReply: {
              id: 'sc-vn-taxi-r2a',
              text: 'Tốt rồi!',
              pronunciation: '똣 조이!',
              meaning: '다행이네요!',
            },
          },
          {
            id: 'c2',
            text: 'Hơi lạnh ạ.',
            pronunciation: '허이 라잉 아.',
            meaning: '조금 추워요.',
            partnerReply: {
              id: 'sc-vn-taxi-r2b',
              text: 'Giảm xuống nhé!',
              pronunciation: '잠 수옹 녜!',
              meaning: '줄여드릴게요!',
            },
          },
        ],
      },
      {
        id: 't3',
        partner: {
          id: 'sc-vn-taxi-p3',
          text: 'Tới nơi rồi!',
          pronunciation: '떠이 너이 조이!',
          meaning: '도착했습니다!',
        },
        choices: [
          {
            id: 'c1',
            text: 'Dừng đây! Cảm ơn.',
            pronunciation: '중 더이! 깜 언.',
            meaning: '여기 세워주세요! 감사해요.',
            partnerReply: {
              id: 'sc-vn-taxi-r3a',
              text: 'Đi chơi vui!',
              pronunciation: '디 쩌이 부이!',
              meaning: '즐겁게 노세요!',
            },
          },
          {
            id: 'c2',
            text: 'Không cần thối!',
            pronunciation: '콩 껀 토이!',
            meaning: '잔돈 괜찮아요!',
            partnerReply: {
              id: 'sc-vn-taxi-r3b',
              text: 'Cảm ơn nhiều!',
              pronunciation: '깜 언 니에우!',
              meaning: '정말 감사해요!',
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
    partnerRole: '식당 직원',
    title: '식당에서 주문·계산하기',
    description: '고수 빼기·계산까지 3단어 회화',
    turns: [
      {
        id: 't1',
        partner: {
          id: 'sc-vn-rest-p1',
          text: 'Mấy người ạ?',
          pronunciation: '머이 응어이 아?',
          meaning: '몇 분이세요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Hai người.',
            pronunciation: '하이 응어이.',
            meaning: '두 명이요.',
            partnerReply: {
              id: 'sc-vn-rest-r1a',
              text: 'Mời ngồi đây!',
              pronunciation: '머이 응오이 더이!',
              meaning: '여기 앉으세요!',
            },
          },
          {
            id: 'c2',
            text: 'Bốn người. Menu?',
            pronunciation: '본 응어이. 메누?',
            meaning: '네 명, 메뉴판요?',
            partnerReply: {
              id: 'sc-vn-rest-r1b',
              text: 'Đây ạ!',
              pronunciation: '더이 아!',
              meaning: '여기 있어요!',
            },
          },
        ],
      },
      {
        id: 't2',
        partner: {
          id: 'sc-vn-rest-p2',
          text: 'Gọi món gì?',
          pronunciation: '고이 몬 지?',
          meaning: '뭐 주문할까요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Không rau mùi!',
            pronunciation: '콩 자우 무이!',
            meaning: '고수 빼주세요!',
            tip: '메뉴 짚으며 "콩 자우 무이!" 한마디면 충분해요.',
            partnerReply: {
              id: 'sc-vn-rest-r2a',
              text: 'Ok! Không rau mùi.',
              pronunciation: '오케이! 콩 자우 무이.',
              meaning: '네! 고수 뺄게요.',
            },
          },
          {
            id: 'c2',
            text: 'Món nào ngon?',
            pronunciation: '몬 나오 응온?',
            meaning: '뭐가 맛있어요?',
            partnerReply: {
              id: 'sc-vn-rest-r2b',
              text: 'Bún chả ngon!',
              pronunciation: '분 짜 응온!',
              meaning: '분짜 맛있어요!',
            },
          },
        ],
      },
      {
        id: 't3',
        partner: {
          id: 'sc-vn-rest-p3',
          text: 'Ngon không bạn?',
          pronunciation: '응온 콩 반?',
          meaning: '맛있었나요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Ngon! Tính tiền.',
            pronunciation: '응온! 띤 띠엔.',
            meaning: '맛있어요! 계산요.',
            tip: '"띤 띠엔(계산)" 두 단어면 계산서가 나와요.',
            partnerReply: {
              id: 'sc-vn-rest-r3a',
              text: 'Hóa đơn đây!',
              pronunciation: '호아 던 더이!',
              meaning: '계산서 여기요!',
            },
          },
          {
            id: 'c2',
            text: 'Thêm một bia!',
            pronunciation: '템 못 비아!',
            meaning: '맥주 하나 더요!',
            partnerReply: {
              id: 'sc-vn-rest-r3b',
              text: 'Có ngay!',
              pronunciation: '꺼 응아이!',
              meaning: '바로 드려요!',
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
    partnerRole: '야시장 상인',
    title: '야시장에서 가격 묻고 깎기',
    description: '2단어로 물어보고 흥정하기',
    turns: [
      {
        id: 't1',
        partner: {
          id: 'sc-vn-mkt-p1',
          text: 'Mua quà nhé!',
          pronunciation: '무아 꽈 녜!',
          meaning: '기념품 보세요!',
        },
        choices: [
          {
            id: 'c1',
            text: 'Bao nhiêu tiền?',
            pronunciation: '바오 니에우 띠엔?',
            meaning: '얼마예요?',
            partnerReply: {
              id: 'sc-vn-mkt-r1a',
              text: 'Hai trăm nghìn.',
              pronunciation: '하이 짬 응인.',
              meaning: '20만 동이에요.',
            },
          },
          {
            id: 'c2',
            text: 'Xem một chút!',
            pronunciation: '셈 못 쭛!',
            meaning: '잠깐 구경할게요!',
            partnerReply: {
              id: 'sc-vn-mkt-r1b',
              text: 'Thoải mái!',
              pronunciation: '토아이 마이!',
              meaning: '편하게 보세요!',
            },
          },
        ],
      },
      {
        id: 't2',
        partner: {
          id: 'sc-vn-mkt-p2',
          text: 'Lấy cái này?',
          pronunciation: '러이 까이 나이?',
          meaning: '이거 살래요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Giảm chút đi!',
            pronunciation: '잠 쭛 디!',
            meaning: '조금만 깎아주세요!',
            tip: '웃으면서 "잠 쭛 디!" 하면 바로 통용돼요.',
            partnerReply: {
              id: 'sc-vn-mkt-r2a',
              text: 'Một trăm rưỡi!',
              pronunciation: '못 짬 즈어이!',
              meaning: '15만 동에 드릴게요!',
            },
          },
          {
            id: 'c2',
            text: 'Hai cái bao nhiêu?',
            pronunciation: '하이 까이 바오 니에우?',
            meaning: '두 개 얼마예요?',
            partnerReply: {
              id: 'sc-vn-mkt-r2b',
              text: 'Hai trăm tám!',
              pronunciation: '하이 짬 땀!',
              meaning: '28만 동이에요!',
            },
          },
        ],
      },
      {
        id: 't3',
        partner: {
          id: 'sc-vn-mkt-p3',
          text: 'Ok chốt nhé!',
          pronunciation: '오케이 쫏 녜!',
          meaning: '거래 성사!',
        },
        choices: [
          {
            id: 'c1',
            text: 'Cảm ơn nhiều!',
            pronunciation: '깜 언 니에우!',
            meaning: '정말 감사해요!',
            partnerReply: {
              id: 'sc-vn-mkt-r3a',
              text: 'Đi chơi vui!',
              pronunciation: '디 쩌이 부이!',
              meaning: '재밌게 놀아요!',
            },
          },
          {
            id: 'c2',
            text: 'Tiền đây. Chào!',
            pronunciation: '띠엔 더이. 짜오!',
            meaning: '돈 여기요. 안녕!',
            partnerReply: {
              id: 'sc-vn-mkt-r3b',
              text: 'Tạm biệt!',
              pronunciation: '땀 비엣!',
              meaning: '안녕히 가세요!',
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
    partnerRole: '마사지 직원',
    title: '스파에서 부위·강도 말하기',
    description: '짧은 단어로 세기 조절하기',
    turns: [
      {
        id: 't1',
        partner: {
          id: 'sc-vn-spa-p1',
          text: 'Mỏi chỗ nào?',
          pronunciation: '머이 쪼 나오?',
          meaning: '어디가 뻐근해요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Vai và lưng.',
            pronunciation: '바이 바 릉.',
            meaning: '어깨랑 등요.',
            partnerReply: {
              id: 'sc-vn-spa-r1a',
              text: 'Vâng, làm kỹ!',
              pronunciation: '벙, 람 끼!',
              meaning: '네, 꼼꼼히 해드릴게요!',
            },
          },
          {
            id: 'c2',
            text: 'Chân nhé.',
            pronunciation: '쩐 녜.',
            meaning: '다리 해주세요.',
            partnerReply: {
              id: 'sc-vn-spa-r1b',
              text: 'Ok ngay!',
              pronunciation: '오케이 응아이!',
              meaning: '네 바로요!',
            },
          },
        ],
      },
      {
        id: 't2',
        partner: {
          id: 'sc-vn-spa-p2',
          text: 'Vừa chưa bạn?',
          pronunciation: '브어 쯔어 반?',
          meaning: '압력 괜찮나요?',
        },
        choices: [
          {
            id: 'c1',
            text: 'Nhẹ chút nhé.',
            pronunciation: '녜 쭛 녜.',
            meaning: '조금 살살 해주세요.',
            partnerReply: {
              id: 'sc-vn-spa-r2a',
              text: 'Xin lỗi! Nhẹ hơn.',
              pronunciation: '신 로이! 녜 헌.',
              meaning: '죄송해요! 약하게 할게요.',
            },
          },
          {
            id: 'c2',
            text: 'Mạnh hơn chút!',
            pronunciation: '마잉 헌 쭛!',
            meaning: '조금 더 세게요!',
            partnerReply: {
              id: 'sc-vn-spa-r2b',
              text: 'Vâng, mạnh hơn!',
              pronunciation: '벙, 마잉 헌!',
              meaning: '네, 더 세게 할게요!',
            },
          },
        ],
      },
      {
        id: 't3',
        partner: {
          id: 'sc-vn-spa-p3',
          text: 'Xong rồi ạ!',
          pronunciation: '쏭 조이 아!',
          meaning: '다 끝났습니다!',
        },
        choices: [
          {
            id: 'c1',
            text: 'Thoải mái! Cảm ơn!',
            pronunciation: '토아이 마이! 깜 언!',
            meaning: '시원해요! 감사해요!',
            partnerReply: {
              id: 'sc-vn-spa-r3a',
              text: 'Ngủ ngon nhé!',
              pronunciation: '응우 응온 녜!',
              meaning: '푹 쉬세요!',
            },
          },
          {
            id: 'c2',
            text: 'Tiền tip nhé.',
            pronunciation: '띠엔 팁 녜.',
            meaning: '팁 받으세요.',
            partnerReply: {
              id: 'sc-vn-spa-r3b',
              text: 'Cảm ơn nhiều!',
              pronunciation: '깜 언 니에우!',
              meaning: '정말 감사해요!',
            },
          },
        ],
      },
    ],
  },
];

export function scenariosFor(countryId: CountryId): Scenario[] {
  const list = SCENARIOS.filter((s) => s.countryId === countryId);
  return list.length > 0 ? list : SCENARIOS.filter((s) => s.countryId === 'en');
}

export function scenarioLineAsPhrase(line: ScenarioLine, countryId: CountryId): Phrase {
  const voiceCountryId: CountryId =
    countryId === 'vn' ? 'vn' : countryId === 'ph' ? 'ph' : 'en';
  return {
    id: line.id,
    countryId: voiceCountryId,
    category: '미팅/사교',
    original: line.text,
    translation: line.meaning,
    pronunciation: `[${line.pronunciation}]`,
  };
}
