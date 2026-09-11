// 필리핀 (타갈로그 + 영어 병기). 설계: docs/VOCAB_PLAN.md
//
// 마닐라·세부에서 실제로 쓰는 말로 골랐습니다. 관광객이 써야 할 자리에는 `po` 를
// 붙였고, 현지에서 영어 단어를 그대로 쓰는 것(CR, aircon, bill out)은 그대로 뒀습니다.
// 짧은 말의 `phraseId` 는 같은 문장이 이미 phrases*.ts 에 있을 때만 붙입니다
// — 오디오와 전광판을 그대로 재사용하기 위해서입니다.
import type { VocabWord, VocabExpression, VocabDialog } from '../../types';

export const PH_WORDS: VocabWord[] = [
  /* 1. 공항 ✈️ */
  { id: 'vw-ph-airport-01', countryId: 'ph', unitId: 'airport', emoji: '✈️', word: 'eroplano', wordEn: 'airplane', meaning: '비행기', pronunciation: '[에로플라노]', pronunciationEn: '[에어플레인]' },
  { id: 'vw-ph-airport-02', countryId: 'ph', unitId: 'airport', emoji: '🛂', word: 'pasaporte', wordEn: 'passport', meaning: '여권', pronunciation: '[파사포르테]', pronunciationEn: '[패스포트]' },
  { id: 'vw-ph-airport-03', countryId: 'ph', unitId: 'airport', emoji: '🎫', word: 'tiket', wordEn: 'ticket', meaning: '표', pronunciation: '[티켓]', pronunciationEn: '[티켓]' },
  { id: 'vw-ph-airport-04', countryId: 'ph', unitId: 'airport', emoji: '🧳', word: 'bagahe', wordEn: 'luggage', meaning: '짐', pronunciation: '[바가헤]', pronunciationEn: '[러기지]' },
  { id: 'vw-ph-airport-05', countryId: 'ph', unitId: 'airport', emoji: '💺', word: 'upuan', wordEn: 'seat', meaning: '자리', pronunciation: '[우푸안]', pronunciationEn: '[싯]' },
  { id: 'vw-ph-airport-06', countryId: 'ph', unitId: 'airport', emoji: '🪟', word: 'bintana', wordEn: 'window', meaning: '창문', pronunciation: '[빈타나]', pronunciationEn: '[윈도우]' },
  { id: 'vw-ph-airport-07', countryId: 'ph', unitId: 'airport', emoji: '🧍', word: 'pila', wordEn: 'line', meaning: '줄', pronunciation: '[필라]', pronunciationEn: '[라인]' },
  { id: 'vw-ph-airport-08', countryId: 'ph', unitId: 'airport', emoji: '🚻', word: 'CR', wordEn: 'restroom', meaning: '화장실', pronunciation: '[씨알]', pronunciationEn: '[레스트룸]', tip: '필리핀에서는 화장실을 CR 이라고 부릅니다.' },
  { id: 'vw-ph-airport-09', countryId: 'ph', unitId: 'airport', emoji: '⏰', word: 'oras', wordEn: 'time', meaning: '시간', pronunciation: '[오라스]', pronunciationEn: '[타임]' },
  { id: 'vw-ph-airport-10', countryId: 'ph', unitId: 'airport', emoji: '⏳', word: 'huli', wordEn: 'late', meaning: '늦다', pronunciation: '[훌리]', pronunciationEn: '[레이트]' },
  { id: 'vw-ph-airport-11', countryId: 'ph', unitId: 'airport', emoji: '🛫', word: 'alis', wordEn: 'departure', meaning: '출발', pronunciation: '[알리스]', pronunciationEn: '[디파처]' },
  { id: 'vw-ph-airport-12', countryId: 'ph', unitId: 'airport', emoji: '🛬', word: 'dating', wordEn: 'arrival', meaning: '도착', pronunciation: '[다팅]', pronunciationEn: '[어라이벌]' },

  /* 2. 호텔 🏨 */
  { id: 'vw-ph-hotel-01', countryId: 'ph', unitId: 'hotel', emoji: '🚪', word: 'kuwarto', wordEn: 'room', meaning: '방', pronunciation: '[쿠와르토]', pronunciationEn: '[룸]' },
  { id: 'vw-ph-hotel-02', countryId: 'ph', unitId: 'hotel', emoji: '🔑', word: 'susi', wordEn: 'key', meaning: '열쇠', pronunciation: '[수시]', pronunciationEn: '[키]' },
  { id: 'vw-ph-hotel-03', countryId: 'ph', unitId: 'hotel', emoji: '🛏️', word: 'kama', wordEn: 'bed', meaning: '침대', pronunciation: '[카마]', pronunciationEn: '[베드]' },
  { id: 'vw-ph-hotel-04', countryId: 'ph', unitId: 'hotel', emoji: '🚿', word: 'banyo', wordEn: 'bathroom', meaning: '욕실', pronunciation: '[바뇨]', pronunciationEn: '[배스룸]' },
  { id: 'vw-ph-hotel-05', countryId: 'ph', unitId: 'hotel', emoji: '🧻', word: 'tuwalya', wordEn: 'towel', meaning: '수건', pronunciation: '[투왈리야]', pronunciationEn: '[타월]' },
  { id: 'vw-ph-hotel-06', countryId: 'ph', unitId: 'hotel', emoji: '🧼', word: 'sabon', wordEn: 'soap', meaning: '비누', pronunciation: '[사본]', pronunciationEn: '[소프]' },
  { id: 'vw-ph-hotel-07', countryId: 'ph', unitId: 'hotel', emoji: '❄️', word: 'aircon', wordEn: 'aircon', meaning: '에어컨', pronunciation: '[에어콘]', pronunciationEn: '[에어컨]' },
  { id: 'vw-ph-hotel-08', countryId: 'ph', unitId: 'hotel', emoji: '📶', word: 'Wi-Fi', wordEn: 'Wi-Fi', meaning: '와이파이', pronunciation: '[와이파이]', pronunciationEn: '[와이파이]' },
  { id: 'vw-ph-hotel-09', countryId: 'ph', unitId: 'hotel', emoji: '🍳', word: 'almusal', wordEn: 'breakfast', meaning: '아침밥', pronunciation: '[알무살]', pronunciationEn: '[브렉퍼스트]' },
  { id: 'vw-ph-hotel-10', countryId: 'ph', unitId: 'hotel', emoji: '💡', word: 'ilaw', wordEn: 'light', meaning: '불', pronunciation: '[일라우]', pronunciationEn: '[라이트]' },
  { id: 'vw-ph-hotel-11', countryId: 'ph', unitId: 'hotel', emoji: '🛠️', word: 'sira', wordEn: 'broken', meaning: '고장', pronunciation: '[시라]', pronunciationEn: '[브로큰]' },
  { id: 'vw-ph-hotel-12', countryId: 'ph', unitId: 'hotel', emoji: '🥵', word: 'mainit', wordEn: 'hot', meaning: '덥다', pronunciation: '[마이닛]', pronunciationEn: '[핫]' },

  /* 3. 택시·이동 🚕 */
  { id: 'vw-ph-transport-01', countryId: 'ph', unitId: 'transport', emoji: '🚕', word: 'taxi', wordEn: 'taxi', meaning: '택시', pronunciation: '[탁시]', pronunciationEn: '[택시]' },
  { id: 'vw-ph-transport-02', countryId: 'ph', unitId: 'transport', emoji: '🛺', word: 'traysikel', wordEn: 'tricycle', meaning: '삼륜차', pronunciation: '[트라이시켈]', pronunciationEn: '[트라이시클]', tip: '가까운 거리는 트라이시클이 가장 쌉니다.' },
  { id: 'vw-ph-transport-03', countryId: 'ph', unitId: 'transport', emoji: '🚐', word: 'jeepney', wordEn: 'jeepney', meaning: '지프니', pronunciation: '[집니]', pronunciationEn: '[집니]', tip: '요금은 앞사람 손에 건네주면 기사까지 전달됩니다.' },
  { id: 'vw-ph-transport-04', countryId: 'ph', unitId: 'transport', emoji: '🛣️', word: 'daan', wordEn: 'road', meaning: '길', pronunciation: '[다안]', pronunciationEn: '[로드]' },
  { id: 'vw-ph-transport-05', countryId: 'ph', unitId: 'transport', emoji: '⬅️', word: 'kaliwa', wordEn: 'left', meaning: '왼쪽', pronunciation: '[칼리와]', pronunciationEn: '[레프트]' },
  { id: 'vw-ph-transport-06', countryId: 'ph', unitId: 'transport', emoji: '➡️', word: 'kanan', wordEn: 'right', meaning: '오른쪽', pronunciation: '[카난]', pronunciationEn: '[라이트]' },
  { id: 'vw-ph-transport-07', countryId: 'ph', unitId: 'transport', emoji: '⬆️', word: 'diretso', wordEn: 'straight', meaning: '직진', pronunciation: '[디렛소]', pronunciationEn: '[스트레이트]' },
  { id: 'vw-ph-transport-08', countryId: 'ph', unitId: 'transport', emoji: '🛑', word: 'para', wordEn: 'stop', meaning: '멈춰', pronunciation: '[파라]', pronunciationEn: '[스톱]', tip: '지프니에서 내릴 때 Para po! 하고 외칩니다.' },
  { id: 'vw-ph-transport-09', countryId: 'ph', unitId: 'transport', emoji: '📍', word: 'malapit', wordEn: 'near', meaning: '가깝다', pronunciation: '[말라핏]', pronunciationEn: '[니어]' },
  { id: 'vw-ph-transport-10', countryId: 'ph', unitId: 'transport', emoji: '🌄', word: 'malayo', wordEn: 'far', meaning: '멀다', pronunciation: '[말라요]', pronunciationEn: '[파]' },
  { id: 'vw-ph-transport-11', countryId: 'ph', unitId: 'transport', emoji: '💵', word: 'pamasahe', wordEn: 'fare', meaning: '요금', pronunciation: '[파마사헤]', pronunciationEn: '[페어]' },
  { id: 'vw-ph-transport-12', countryId: 'ph', unitId: 'transport', emoji: '👨‍✈️', word: 'drayber', wordEn: 'driver', meaning: '기사', pronunciation: '[드라이버]', pronunciationEn: '[드라이버]' },

  /* 4. 식당 🍽️ */
  { id: 'vw-ph-restaurant-01', countryId: 'ph', unitId: 'restaurant', emoji: '📋', word: 'menu', wordEn: 'menu', meaning: '메뉴', pronunciation: '[메뉴]', pronunciationEn: '[메뉴]' },
  { id: 'vw-ph-restaurant-02', countryId: 'ph', unitId: 'restaurant', emoji: '🪑', word: 'mesa', wordEn: 'table', meaning: '식탁', pronunciation: '[메사]', pronunciationEn: '[테이블]' },
  { id: 'vw-ph-restaurant-03', countryId: 'ph', unitId: 'restaurant', emoji: '🍽️', word: 'plato', wordEn: 'plate', meaning: '접시', pronunciation: '[플라토]', pronunciationEn: '[플레이트]' },
  { id: 'vw-ph-restaurant-04', countryId: 'ph', unitId: 'restaurant', emoji: '🥄', word: 'kutsara', wordEn: 'spoon', meaning: '숟가락', pronunciation: '[쿠차라]', pronunciationEn: '[스푼]' },
  { id: 'vw-ph-restaurant-05', countryId: 'ph', unitId: 'restaurant', emoji: '🍴', word: 'tinidor', wordEn: 'fork', meaning: '포크', pronunciation: '[티니도르]', pronunciationEn: '[포크]' },
  { id: 'vw-ph-restaurant-06', countryId: 'ph', unitId: 'restaurant', emoji: '🥤', word: 'baso', wordEn: 'glass', meaning: '컵', pronunciation: '[바소]', pronunciationEn: '[글라스]' },
  { id: 'vw-ph-restaurant-07', countryId: 'ph', unitId: 'restaurant', emoji: '🍚', word: 'kanin', wordEn: 'rice', meaning: '밥', pronunciation: '[카닌]', pronunciationEn: '[라이스]' },
  { id: 'vw-ph-restaurant-08', countryId: 'ph', unitId: 'restaurant', emoji: '🧾', word: 'bill', wordEn: 'bill', meaning: '계산서', pronunciation: '[빌]', pronunciationEn: '[빌]', tip: '식당에서는 Bill out po! 하면 계산서를 가져다 줍니다.' },
  { id: 'vw-ph-restaurant-09', countryId: 'ph', unitId: 'restaurant', emoji: '😋', word: 'masarap', wordEn: 'delicious', meaning: '맛있다', pronunciation: '[마사랍]', pronunciationEn: '[딜리셔스]' },
  { id: 'vw-ph-restaurant-10', countryId: 'ph', unitId: 'restaurant', emoji: '🌶️', word: 'maanghang', wordEn: 'spicy', meaning: '맵다', pronunciation: '[마앙항]', pronunciationEn: '[스파이시]' },
  { id: 'vw-ph-restaurant-11', countryId: 'ph', unitId: 'restaurant', emoji: '🥡', word: 'pabalot', wordEn: 'takeout', meaning: '포장', pronunciation: '[파발롯]', pronunciationEn: '[테이크아웃]' },
  { id: 'vw-ph-restaurant-12', countryId: 'ph', unitId: 'restaurant', emoji: '🧊', word: 'yelo', wordEn: 'ice', meaning: '얼음', pronunciation: '[예로]', pronunciationEn: '[아이스]' },

  /* 5. 음식·음료 🍜 */
  { id: 'vw-ph-food-01', countryId: 'ph', unitId: 'food', emoji: '💧', word: 'tubig', wordEn: 'water', meaning: '물', pronunciation: '[투빅]', pronunciationEn: '[워터]' },
  { id: 'vw-ph-food-02', countryId: 'ph', unitId: 'food', emoji: '☕', word: 'kape', wordEn: 'coffee', meaning: '커피', pronunciation: '[카페]', pronunciationEn: '[커피]' },
  { id: 'vw-ph-food-03', countryId: 'ph', unitId: 'food', emoji: '🍗', word: 'manok', wordEn: 'chicken', meaning: '닭고기', pronunciation: '[마녹]', pronunciationEn: '[치킨]' },
  { id: 'vw-ph-food-04', countryId: 'ph', unitId: 'food', emoji: '🥓', word: 'baboy', wordEn: 'pork', meaning: '돼지고기', pronunciation: '[바보이]', pronunciationEn: '[포크]' },
  { id: 'vw-ph-food-05', countryId: 'ph', unitId: 'food', emoji: '🐟', word: 'isda', wordEn: 'fish', meaning: '생선', pronunciation: '[이스다]', pronunciationEn: '[피시]' },
  { id: 'vw-ph-food-06', countryId: 'ph', unitId: 'food', emoji: '🥬', word: 'gulay', wordEn: 'vegetable', meaning: '채소', pronunciation: '[굴라이]', pronunciationEn: '[베지터블]' },
  { id: 'vw-ph-food-07', countryId: 'ph', unitId: 'food', emoji: '🍎', word: 'prutas', wordEn: 'fruit', meaning: '과일', pronunciation: '[프루타스]', pronunciationEn: '[프룻]' },
  { id: 'vw-ph-food-08', countryId: 'ph', unitId: 'food', emoji: '🥚', word: 'itlog', wordEn: 'egg', meaning: '계란', pronunciation: '[잇록]', pronunciationEn: '[에그]' },
  { id: 'vw-ph-food-09', countryId: 'ph', unitId: 'food', emoji: '🍞', word: 'tinapay', wordEn: 'bread', meaning: '빵', pronunciation: '[티나파이]', pronunciationEn: '[브레드]' },
  { id: 'vw-ph-food-10', countryId: 'ph', unitId: 'food', emoji: '🥛', word: 'gatas', wordEn: 'milk', meaning: '우유', pronunciation: '[가타스]', pronunciationEn: '[밀크]' },
  { id: 'vw-ph-food-11', countryId: 'ph', unitId: 'food', emoji: '🍺', word: 'serbesa', wordEn: 'beer', meaning: '맥주', pronunciation: '[세르베사]', pronunciationEn: '[비어]' },
  { id: 'vw-ph-food-12', countryId: 'ph', unitId: 'food', emoji: '🍧', word: 'halo-halo', wordEn: 'shaved ice', meaning: '빙수', pronunciation: '[할로할로]', pronunciationEn: '[셰이브드 아이스]' },

  /* 6. 시장·흥정 🛍️ */
  { id: 'vw-ph-market-01', countryId: 'ph', unitId: 'market', emoji: '💵', word: 'pera', wordEn: 'money', meaning: '돈', pronunciation: '[페라]', pronunciationEn: '[머니]' },
  { id: 'vw-ph-market-02', countryId: 'ph', unitId: 'market', emoji: '💰', word: 'magkano', wordEn: 'how much', meaning: '얼마', pronunciation: '[막카노]', pronunciationEn: '[하우 머치]' },
  { id: 'vw-ph-market-03', countryId: 'ph', unitId: 'market', emoji: '🏷️', word: 'presyo', wordEn: 'price', meaning: '가격', pronunciation: '[프레시오]', pronunciationEn: '[프라이스]' },
  { id: 'vw-ph-market-04', countryId: 'ph', unitId: 'market', emoji: '💸', word: 'mahal', wordEn: 'expensive', meaning: '비싸다', pronunciation: '[마할]', pronunciationEn: '[익스펜시브]' },
  { id: 'vw-ph-market-05', countryId: 'ph', unitId: 'market', emoji: '🉐', word: 'mura', wordEn: 'cheap', meaning: '싸다', pronunciation: '[무라]', pronunciationEn: '[칩]' },
  { id: 'vw-ph-market-06', countryId: 'ph', unitId: 'market', emoji: '💱', word: 'sukli', wordEn: 'change', meaning: '거스름돈', pronunciation: '[수클리]', pronunciationEn: '[체인지]' },
  { id: 'vw-ph-market-07', countryId: 'ph', unitId: 'market', emoji: '🪙', word: 'barya', wordEn: 'coins', meaning: '잔돈', pronunciation: '[바리야]', pronunciationEn: '[코인스]' },
  { id: 'vw-ph-market-08', countryId: 'ph', unitId: 'market', emoji: '📉', word: 'tawad', wordEn: 'discount', meaning: '깎기', pronunciation: '[타와드]', pronunciationEn: '[디스카운트]' },
  { id: 'vw-ph-market-09', countryId: 'ph', unitId: 'market', emoji: '🛒', word: 'bili', wordEn: 'buy', meaning: '사다', pronunciation: '[빌리]', pronunciationEn: '[바이]' },
  { id: 'vw-ph-market-10', countryId: 'ph', unitId: 'market', emoji: '👕', word: 'damit', wordEn: 'clothes', meaning: '옷', pronunciation: '[다밋]', pronunciationEn: '[클로즈]' },
  { id: 'vw-ph-market-11', countryId: 'ph', unitId: 'market', emoji: '👟', word: 'sapatos', wordEn: 'shoes', meaning: '신발', pronunciation: '[사파토스]', pronunciationEn: '[슈즈]' },
  { id: 'vw-ph-market-12', countryId: 'ph', unitId: 'market', emoji: '👜', word: 'bag', wordEn: 'bag', meaning: '가방', pronunciation: '[백]', pronunciationEn: '[백]' },

  /* 7. 관광 🏝️ */
  { id: 'vw-ph-sightseeing-01', countryId: 'ph', unitId: 'sightseeing', emoji: '🌊', word: 'dagat', wordEn: 'sea', meaning: '바다', pronunciation: '[다갓]', pronunciationEn: '[씨]' },
  { id: 'vw-ph-sightseeing-02', countryId: 'ph', unitId: 'sightseeing', emoji: '🏖️', word: 'buhangin', wordEn: 'sand', meaning: '모래', pronunciation: '[부항인]', pronunciationEn: '[샌드]' },
  { id: 'vw-ph-sightseeing-03', countryId: 'ph', unitId: 'sightseeing', emoji: '⛰️', word: 'bundok', wordEn: 'mountain', meaning: '산', pronunciation: '[분독]', pronunciationEn: '[마운틴]' },
  { id: 'vw-ph-sightseeing-04', countryId: 'ph', unitId: 'sightseeing', emoji: '⛪', word: 'simbahan', wordEn: 'church', meaning: '성당', pronunciation: '[심바한]', pronunciationEn: '[처치]' },
  { id: 'vw-ph-sightseeing-05', countryId: 'ph', unitId: 'sightseeing', emoji: '📷', word: 'litrato', wordEn: 'photo', meaning: '사진', pronunciation: '[리트라토]', pronunciationEn: '[포토]' },
  { id: 'vw-ph-sightseeing-06', countryId: 'ph', unitId: 'sightseeing', emoji: '🗺️', word: 'mapa', wordEn: 'map', meaning: '지도', pronunciation: '[마파]', pronunciationEn: '[맵]' },
  { id: 'vw-ph-sightseeing-07', countryId: 'ph', unitId: 'sightseeing', emoji: '🧑‍🏫', word: 'gabay', wordEn: 'guide', meaning: '안내인', pronunciation: '[가바이]', pronunciationEn: '[가이드]' },
  { id: 'vw-ph-sightseeing-08', countryId: 'ph', unitId: 'sightseeing', emoji: '🛶', word: 'bangka', wordEn: 'boat', meaning: '배', pronunciation: '[방카]', pronunciationEn: '[보트]' },
  { id: 'vw-ph-sightseeing-09', countryId: 'ph', unitId: 'sightseeing', emoji: '☀️', word: 'araw', wordEn: 'sun', meaning: '해', pronunciation: '[아라우]', pronunciationEn: '[썬]' },
  { id: 'vw-ph-sightseeing-10', countryId: 'ph', unitId: 'sightseeing', emoji: '🌧️', word: 'ulan', wordEn: 'rain', meaning: '비', pronunciation: '[울란]', pronunciationEn: '[레인]' },
  { id: 'vw-ph-sightseeing-11', countryId: 'ph', unitId: 'sightseeing', emoji: '😍', word: 'maganda', wordEn: 'pretty', meaning: '예쁘다', pronunciation: '[마간다]', pronunciationEn: '[프리티]' },
  { id: 'vw-ph-sightseeing-12', countryId: 'ph', unitId: 'sightseeing', emoji: '🏊', word: 'langoy', wordEn: 'swim', meaning: '수영', pronunciation: '[랑고이]', pronunciationEn: '[스윔]' },

  /* 8. 마사지·스파 💆 */
  { id: 'vw-ph-massage-01', countryId: 'ph', unitId: 'massage', emoji: '💆', word: 'masahe', wordEn: 'massage', meaning: '마사지', pronunciation: '[마사헤]', pronunciationEn: '[마사지]' },
  { id: 'vw-ph-massage-02', countryId: 'ph', unitId: 'massage', emoji: '🧠', word: 'ulo', wordEn: 'head', meaning: '머리', pronunciation: '[울로]', pronunciationEn: '[헤드]' },
  { id: 'vw-ph-massage-03', countryId: 'ph', unitId: 'massage', emoji: '💪', word: 'balikat', wordEn: 'shoulder', meaning: '어깨', pronunciation: '[발리캇]', pronunciationEn: '[숄더]' },
  { id: 'vw-ph-massage-04', countryId: 'ph', unitId: 'massage', emoji: '🧍', word: 'likod', wordEn: 'back', meaning: '등', pronunciation: '[리코드]', pronunciationEn: '[백]' },
  { id: 'vw-ph-massage-05', countryId: 'ph', unitId: 'massage', emoji: '🦵', word: 'binti', wordEn: 'leg', meaning: '다리', pronunciation: '[빈티]', pronunciationEn: '[레그]' },
  { id: 'vw-ph-massage-06', countryId: 'ph', unitId: 'massage', emoji: '🦶', word: 'paa', wordEn: 'foot', meaning: '발', pronunciation: '[파아]', pronunciationEn: '[풋]' },
  { id: 'vw-ph-massage-07', countryId: 'ph', unitId: 'massage', emoji: '🖐️', word: 'kamay', wordEn: 'hand', meaning: '손', pronunciation: '[카마이]', pronunciationEn: '[핸드]' },
  { id: 'vw-ph-massage-08', countryId: 'ph', unitId: 'massage', emoji: '😣', word: 'masakit', wordEn: 'painful', meaning: '아프다', pronunciation: '[마사킷]', pronunciationEn: '[페인풀]' },
  { id: 'vw-ph-massage-09', countryId: 'ph', unitId: 'massage', emoji: '✊', word: 'malakas', wordEn: 'strong', meaning: '세게', pronunciation: '[말라카스]', pronunciationEn: '[스트롱]' },
  { id: 'vw-ph-massage-10', countryId: 'ph', unitId: 'massage', emoji: '🪶', word: 'mahina', wordEn: 'soft', meaning: '약하게', pronunciation: '[마히나]', pronunciationEn: '[소프트]' },
  { id: 'vw-ph-massage-11', countryId: 'ph', unitId: 'massage', emoji: '🧴', word: 'langis', wordEn: 'oil', meaning: '오일', pronunciation: '[랑기스]', pronunciationEn: '[오일]' },
  { id: 'vw-ph-massage-12', countryId: 'ph', unitId: 'massage', emoji: '✅', word: 'tapos', wordEn: 'done', meaning: '끝', pronunciation: '[타포스]', pronunciationEn: '[던]' },

  /* 9. 친구 사귀기 🤝 */
  { id: 'vw-ph-friends-01', countryId: 'ph', unitId: 'friends', emoji: '👋', word: 'kumusta', wordEn: 'hello', meaning: '안녕', pronunciation: '[쿠무스타]', pronunciationEn: '[헬로]' },
  { id: 'vw-ph-friends-02', countryId: 'ph', unitId: 'friends', emoji: '🙏', word: 'salamat', wordEn: 'thank you', meaning: '고마워요', pronunciation: '[살라맛]', pronunciationEn: '[땡큐]', tip: '뒤에 po 를 붙이면 더 공손합니다.' },
  { id: 'vw-ph-friends-03', countryId: 'ph', unitId: 'friends', emoji: '🪪', word: 'pangalan', wordEn: 'name', meaning: '이름', pronunciation: '[팡알란]', pronunciationEn: '[네임]' },
  { id: 'vw-ph-friends-04', countryId: 'ph', unitId: 'friends', emoji: '👫', word: 'kaibigan', wordEn: 'friend', meaning: '친구', pronunciation: '[카이비간]', pronunciationEn: '[프렌드]' },
  { id: 'vw-ph-friends-05', countryId: 'ph', unitId: 'friends', emoji: '😊', word: 'masaya', wordEn: 'happy', meaning: '즐겁다', pronunciation: '[마사야]', pronunciationEn: '[해피]' },
  { id: 'vw-ph-friends-06', countryId: 'ph', unitId: 'friends', emoji: '🇰🇷', word: 'Koreano', wordEn: 'Korean', meaning: '한국 사람', pronunciation: '[코레아노]', pronunciationEn: '[코리안]' },
  { id: 'vw-ph-friends-07', countryId: 'ph', unitId: 'friends', emoji: '🧑', word: 'kuya', wordEn: 'big brother', meaning: '형·오빠', pronunciation: '[쿠야]', pronunciationEn: '[빅 브라더]', tip: '모르는 남자에게도 kuya 라고 부르면 친근합니다.' },
  { id: 'vw-ph-friends-08', countryId: 'ph', unitId: 'friends', emoji: '👩', word: 'ate', wordEn: 'big sister', meaning: '누나·언니', pronunciation: '[아테]', pronunciationEn: '[빅 시스터]' },
  { id: 'vw-ph-friends-09', countryId: 'ph', unitId: 'friends', emoji: '✅', word: 'oo', wordEn: 'yes', meaning: '네', pronunciation: '[오오]', pronunciationEn: '[예스]' },
  { id: 'vw-ph-friends-10', countryId: 'ph', unitId: 'friends', emoji: '❌', word: 'hindi', wordEn: 'no', meaning: '아니요', pronunciation: '[힌디]', pronunciationEn: '[노]' },
  { id: 'vw-ph-friends-11', countryId: 'ph', unitId: 'friends', emoji: '🫶', word: 'ingat', wordEn: 'take care', meaning: '조심히 가요', pronunciation: '[잉앗]', pronunciationEn: '[테이크 케어]' },
  { id: 'vw-ph-friends-12', countryId: 'ph', unitId: 'friends', emoji: '🤗', word: 'magkita', wordEn: 'meet', meaning: '만나다', pronunciation: '[막키타]', pronunciationEn: '[밋]' },

  /* 10. 비상 🆘 */
  { id: 'vw-ph-emergency-01', countryId: 'ph', unitId: 'emergency', emoji: '🆘', word: 'tulong', wordEn: 'help', meaning: '도움', pronunciation: '[툴롱]', pronunciationEn: '[헬프]' },
  { id: 'vw-ph-emergency-02', countryId: 'ph', unitId: 'emergency', emoji: '👮', word: 'pulis', wordEn: 'police', meaning: '경찰', pronunciation: '[풀리스]', pronunciationEn: '[폴리스]' },
  { id: 'vw-ph-emergency-03', countryId: 'ph', unitId: 'emergency', emoji: '🧑‍⚕️', word: 'doktor', wordEn: 'doctor', meaning: '의사', pronunciation: '[독토르]', pronunciationEn: '[닥터]' },
  { id: 'vw-ph-emergency-04', countryId: 'ph', unitId: 'emergency', emoji: '🏥', word: 'ospital', wordEn: 'hospital', meaning: '병원', pronunciation: '[오스피탈]', pronunciationEn: '[호스피탈]' },
  { id: 'vw-ph-emergency-05', countryId: 'ph', unitId: 'emergency', emoji: '🏪', word: 'botika', wordEn: 'pharmacy', meaning: '약국', pronunciation: '[보티카]', pronunciationEn: '[파머시]' },
  { id: 'vw-ph-emergency-06', countryId: 'ph', unitId: 'emergency', emoji: '💊', word: 'gamot', wordEn: 'medicine', meaning: '약', pronunciation: '[가못]', pronunciationEn: '[메디슨]' },
  { id: 'vw-ph-emergency-07', countryId: 'ph', unitId: 'emergency', emoji: '🤒', word: 'lagnat', wordEn: 'fever', meaning: '열', pronunciation: '[락낫]', pronunciationEn: '[피버]' },
  { id: 'vw-ph-emergency-08', countryId: 'ph', unitId: 'emergency', emoji: '🔍', word: 'nawala', wordEn: 'lost', meaning: '잃어버렸다', pronunciation: '[나왈라]', pronunciationEn: '[로스트]' },
  { id: 'vw-ph-emergency-09', countryId: 'ph', unitId: 'emergency', emoji: '👛', word: 'pitaka', wordEn: 'wallet', meaning: '지갑', pronunciation: '[피타카]', pronunciationEn: '[월렛]' },
  { id: 'vw-ph-emergency-10', countryId: 'ph', unitId: 'emergency', emoji: '🔥', word: 'sunog', wordEn: 'fire', meaning: '불', pronunciation: '[수녹]', pronunciationEn: '[파이어]' },
  { id: 'vw-ph-emergency-11', countryId: 'ph', unitId: 'emergency', emoji: '🚑', word: 'ambulansya', wordEn: 'ambulance', meaning: '구급차', pronunciation: '[암불란시야]', pronunciationEn: '[앰뷸런스]' },
  { id: 'vw-ph-emergency-12', countryId: 'ph', unitId: 'emergency', emoji: '🏛️', word: 'embahada', wordEn: 'embassy', meaning: '대사관', pronunciation: '[엠바하다]', pronunciationEn: '[엠버시]' },
];

export const PH_EXPRESSIONS: VocabExpression[] = [
  /* 1. 공항 */
  { id: 've-ph-airport-01', countryId: 'ph', unitId: 'airport', text: 'Nasaan po ang CR?', textEn: 'Where is the restroom?', meaning: '화장실이 어디예요?', pronunciation: '[나사안 포 앙 씨알?]', pronunciationEn: '[웨어 이즈 더 레스트룸?]', wordIds: ['vw-ph-airport-08'], phraseId: 'ph-tur-08' },
  { id: 've-ph-airport-02', countryId: 'ph', unitId: 'airport', text: 'Nawawala po ang bagahe ko.', textEn: 'My luggage is missing.', meaning: '짐이 없어졌어요.', pronunciation: '[나와와라 포 앙 바가헤 코]', pronunciationEn: '[마이 러기지 이즈 미싱]', wordIds: ['vw-ph-airport-04'], phraseId: 'ph-air-05' },
  { id: 've-ph-airport-03', countryId: 'ph', unitId: 'airport', text: 'Saan po ang upuan ko?', textEn: 'Where is my seat?', meaning: '제 자리가 어디예요?', pronunciation: '[사안 포 앙 우푸안 코?]', pronunciationEn: '[웨어 이즈 마이 싯?]', wordIds: ['vw-ph-airport-05'] },
  { id: 've-ph-airport-04', countryId: 'ph', unitId: 'airport', text: 'Huli na po ako.', textEn: 'I am late.', meaning: '저 늦었어요.', pronunciation: '[훌리 나 포 아코]', pronunciationEn: '[아이 앰 레이트]', wordIds: ['vw-ph-airport-10'] },
  { id: 've-ph-airport-05', countryId: 'ph', unitId: 'airport', text: 'Heto po ang pasaporte ko.', textEn: 'Here is my passport.', meaning: '여권 여기 있어요.', pronunciation: '[헤토 포 앙 파사포르테 코]', pronunciationEn: '[히어 이즈 마이 패스포트]', wordIds: ['vw-ph-airport-02'] },
  { id: 've-ph-airport-06', countryId: 'ph', unitId: 'airport', text: 'Anong oras po ang alis?', textEn: 'What time is departure?', meaning: '몇 시에 출발해요?', pronunciation: '[아농 오라스 포 앙 알리스?]', pronunciationEn: '[왓 타임 이즈 디파처?]', wordIds: ['vw-ph-airport-09', 'vw-ph-airport-11'] },

  /* 2. 호텔 */
  { id: 've-ph-hotel-01', countryId: 'ph', unitId: 'hotel', text: 'Pahingi po ng susi.', textEn: 'The key, please.', meaning: '열쇠 주세요.', pronunciation: '[파힝기 포 낭 수시]', pronunciationEn: '[더 키, 플리즈]', wordIds: ['vw-ph-hotel-02'] },
  { id: 've-ph-hotel-02', countryId: 'ph', unitId: 'hotel', text: 'Ano po ang Wi-Fi password?', textEn: 'What is the Wi-Fi password?', meaning: '와이파이 비밀번호가 뭐예요?', pronunciation: '[아노 포 앙 와이파이 패스워드?]', pronunciationEn: '[왓 이즈 더 와이파이 패스워드?]', wordIds: ['vw-ph-hotel-08'], phraseId: 'ph-hot-03' },
  { id: 've-ph-hotel-03', countryId: 'ph', unitId: 'hotel', text: 'Pahingi po ng karagdagang tuwalya.', textEn: 'More towels, please.', meaning: '수건 더 주세요.', pronunciation: '[파힝기 포 낭 카락다강 투왈리야]', pronunciationEn: '[모어 타월스, 플리즈]', wordIds: ['vw-ph-hotel-05'], phraseId: 'ph-hot-04' },
  { id: 've-ph-hotel-04', countryId: 'ph', unitId: 'hotel', text: 'Sira po ang aircon.', textEn: 'The aircon is broken.', meaning: '에어컨이 고장 났어요.', pronunciation: '[시라 포 앙 에어콘]', pronunciationEn: '[디 에어컨 이즈 브로큰]', wordIds: ['vw-ph-hotel-07', 'vw-ph-hotel-11'] },
  { id: 've-ph-hotel-05', countryId: 'ph', unitId: 'hotel', text: 'Anong oras po ang almusal?', textEn: 'What time is breakfast?', meaning: '아침밥 몇 시예요?', pronunciation: '[아농 오라스 포 앙 알무살?]', pronunciationEn: '[왓 타임 이즈 브렉퍼스트?]', wordIds: ['vw-ph-hotel-09'] },
  { id: 've-ph-hotel-06', countryId: 'ph', unitId: 'hotel', text: 'Mainit po sa kuwarto.', textEn: 'The room is hot.', meaning: '방이 더워요.', pronunciation: '[마이닛 포 사 쿠와르토]', pronunciationEn: '[더 룸 이즈 핫]', wordIds: ['vw-ph-hotel-01', 'vw-ph-hotel-12'] },

  /* 3. 택시·이동 */
  { id: 've-ph-transport-01', countryId: 'ph', unitId: 'transport', text: 'Para po!', textEn: 'Stop here, please!', meaning: '여기 세워주세요!', pronunciation: '[파라 포!]', pronunciationEn: '[스톱 히어, 플리즈!]', wordIds: ['vw-ph-transport-08'], phraseId: 'ph-01' },
  { id: 've-ph-transport-02', countryId: 'ph', unitId: 'transport', text: 'Sa kaliwa po tayo.', textEn: 'Turn left, please.', meaning: '왼쪽으로 가주세요.', pronunciation: '[사 칼리와 포 타요]', pronunciationEn: '[턴 레프트, 플리즈]', wordIds: ['vw-ph-transport-05'] },
  { id: 've-ph-transport-03', countryId: 'ph', unitId: 'transport', text: 'Diretso lang po.', textEn: 'Go straight, please.', meaning: '직진해 주세요.', pronunciation: '[디렛소 랑 포]', pronunciationEn: '[고 스트레이트, 플리즈]', wordIds: ['vw-ph-transport-07'], phraseId: 'ph-tra-04' },
  { id: 've-ph-transport-04', countryId: 'ph', unitId: 'transport', text: 'Magkano po ang pamasahe?', textEn: 'How much is the fare?', meaning: '요금이 얼마예요?', pronunciation: '[막카노 포 앙 파마사헤?]', pronunciationEn: '[하우 머치 이즈 더 페어?]', wordIds: ['vw-ph-transport-11'], phraseId: 'ph-tra-02' },
  { id: 've-ph-transport-05', countryId: 'ph', unitId: 'transport', text: 'Malayo po ba dito?', textEn: 'Is it far from here?', meaning: '여기서 멀어요?', pronunciation: '[말라요 포 바 디토?]', pronunciationEn: '[이즈 잇 파 프롬 히어?]', wordIds: ['vw-ph-transport-10'] },
  { id: 've-ph-transport-06', countryId: 'ph', unitId: 'transport', text: 'Kanan po sa kanto.', textEn: 'Right at the corner.', meaning: '모퉁이에서 오른쪽이요.', pronunciation: '[카난 포 사 칸토]', pronunciationEn: '[라이트 앳 더 코너]', wordIds: ['vw-ph-transport-06'] },

  /* 4. 식당 */
  { id: 've-ph-restaurant-01', countryId: 'ph', unitId: 'restaurant', text: 'Bill out po!', textEn: 'The bill, please!', meaning: '계산서 주세요!', pronunciation: '[빌 아웃 포!]', pronunciationEn: '[더 빌, 플리즈!]', wordIds: ['vw-ph-restaurant-08'], phraseId: 'ph-07' },
  { id: 've-ph-restaurant-02', countryId: 'ph', unitId: 'restaurant', text: 'Pahingi po ng kutsara.', textEn: 'A spoon, please.', meaning: '숟가락 주세요.', pronunciation: '[파힝기 포 낭 쿠차라]', pronunciationEn: '[어 스푼, 플리즈]', wordIds: ['vw-ph-restaurant-04'] },
  { id: 've-ph-restaurant-03', countryId: 'ph', unitId: 'restaurant', text: 'Huwag po maanghang.', textEn: 'Not spicy, please.', meaning: '맵지 않게 해주세요.', pronunciation: '[후왁 포 마앙항]', pronunciationEn: '[낫 스파이시, 플리즈]', wordIds: ['vw-ph-restaurant-10'], phraseId: 'ph-foo-01' },
  { id: 've-ph-restaurant-04', countryId: 'ph', unitId: 'restaurant', text: 'Walang yelo po.', textEn: 'No ice, please.', meaning: '얼음 빼주세요.', pronunciation: '[왈랑 예로 포]', pronunciationEn: '[노 아이스, 플리즈]', wordIds: ['vw-ph-restaurant-12'], phraseId: 'ph-foo-02' },
  { id: 've-ph-restaurant-05', countryId: 'ph', unitId: 'restaurant', text: 'Pabalot na lang po.', textEn: 'Takeout, please.', meaning: '포장해 주세요.', pronunciation: '[파발롯 나 랑 포]', pronunciationEn: '[테이크아웃, 플리즈]', wordIds: ['vw-ph-restaurant-11'], phraseId: 'ph-foo-03' },
  { id: 've-ph-restaurant-06', countryId: 'ph', unitId: 'restaurant', text: 'Masarap po ito!', textEn: 'This is delicious!', meaning: '이거 맛있어요!', pronunciation: '[마사랍 포 이토!]', pronunciationEn: '[디스 이즈 딜리셔스!]', wordIds: ['vw-ph-restaurant-09'] },

  /* 5. 음식·음료 */
  { id: 've-ph-food-01', countryId: 'ph', unitId: 'food', text: 'Pahingi po ng tubig.', textEn: 'Water, please.', meaning: '물 좀 주세요.', pronunciation: '[파힝기 포 낭 투빅]', pronunciationEn: '[워터, 플리즈]', wordIds: ['vw-ph-food-01'], phraseId: 'ph-06' },
  { id: 've-ph-food-02', countryId: 'ph', unitId: 'food', text: 'Isang kape po.', textEn: 'One coffee, please.', meaning: '커피 하나 주세요.', pronunciation: '[이상 카페 포]', pronunciationEn: '[원 커피, 플리즈]', wordIds: ['vw-ph-food-02'] },
  { id: 've-ph-food-03', countryId: 'ph', unitId: 'food', text: 'Walang baboy po.', textEn: 'No pork, please.', meaning: '돼지고기 빼주세요.', pronunciation: '[왈랑 바보이 포]', pronunciationEn: '[노 포크, 플리즈]', wordIds: ['vw-ph-food-04'] },
  { id: 've-ph-food-04', countryId: 'ph', unitId: 'food', text: 'Gusto ko po ng isda.', textEn: 'I want fish, please.', meaning: '생선으로 주세요.', pronunciation: '[구스토 코 포 낭 이스다]', pronunciationEn: '[아이 원트 피시, 플리즈]', wordIds: ['vw-ph-food-05'] },
  { id: 've-ph-food-05', countryId: 'ph', unitId: 'food', text: 'Isang serbesa po, pakiusap.', textEn: 'One beer, please.', meaning: '맥주 하나 주세요.', pronunciation: '[이상 세르베사 포, 파키우삽]', pronunciationEn: '[원 비어, 플리즈]', wordIds: ['vw-ph-food-11'] },
  { id: 've-ph-food-06', countryId: 'ph', unitId: 'food', text: 'Masarap po ang halo-halo.', textEn: 'The halo-halo is delicious.', meaning: '할로할로 맛있어요.', pronunciation: '[마사랍 포 앙 할로할로]', pronunciationEn: '[더 할로할로 이즈 딜리셔스]', wordIds: ['vw-ph-food-12'] },

  /* 6. 시장·흥정 */
  { id: 've-ph-market-01', countryId: 'ph', unitId: 'market', text: 'Magkano po ito?', textEn: 'How much is this?', meaning: '이거 얼마예요?', pronunciation: '[막카노 포 이토?]', pronunciationEn: '[하우 머치 이즈 디스?]', wordIds: ['vw-ph-market-02'], phraseId: 'ph-02' },
  { id: 've-ph-market-02', countryId: 'ph', unitId: 'market', text: 'Masyadong mahal po!', textEn: 'Too expensive!', meaning: '너무 비싸요!', pronunciation: '[마샤동 마할 포!]', pronunciationEn: '[투 익스펜시브!]', wordIds: ['vw-ph-market-04'] },
  { id: 've-ph-market-03', countryId: 'ph', unitId: 'market', text: 'Puwede po bang tawaran?', textEn: 'Can you give a discount?', meaning: '깎아주실 수 있나요?', pronunciation: '[푸웨데 퐁 방 타와란?]', pronunciationEn: '[캔 유 기브 어 디스카운트?]', wordIds: ['vw-ph-market-08'], phraseId: 'ph-bar-01' },
  { id: 've-ph-market-04', countryId: 'ph', unitId: 'market', text: 'Pakibigay po ang sukli.', textEn: 'My change, please.', meaning: '거스름돈 주세요.', pronunciation: '[파키비가이 포 앙 수클리]', pronunciationEn: '[마이 체인지, 플리즈]', wordIds: ['vw-ph-market-06'], phraseId: 'ph-bar-04' },
  { id: 've-ph-market-05', countryId: 'ph', unitId: 'market', text: 'Wala po akong barya.', textEn: 'I have no coins.', meaning: '잔돈이 없어요.', pronunciation: '[왈라 포 아콩 바리야]', pronunciationEn: '[아이 해브 노 코인스]', wordIds: ['vw-ph-market-07'], phraseId: 'ph-bar-03' },
  { id: 've-ph-market-06', countryId: 'ph', unitId: 'market', text: 'Bibili po ako nito.', textEn: 'I will buy this.', meaning: '이거 살게요.', pronunciation: '[비빌리 포 아코 니토]', pronunciationEn: '[아이 윌 바이 디스]', wordIds: ['vw-ph-market-09'] },

  /* 7. 관광 */
  { id: 've-ph-sightseeing-01', countryId: 'ph', unitId: 'sightseeing', text: 'Pakikuhanan po kami ng picture.', textEn: 'Please take our picture.', meaning: '저희 사진 좀 찍어주세요.', pronunciation: '[파키쿠하난 포 카미 낭 픽처]', pronunciationEn: '[플리즈 테이크 아워 픽처]', wordIds: ['vw-ph-sightseeing-05'], phraseId: 'ph-tur-05' },
  { id: 've-ph-sightseeing-02', countryId: 'ph', unitId: 'sightseeing', text: 'Ang ganda po dito!', textEn: 'It is beautiful here!', meaning: '여기 예뻐요!', pronunciation: '[앙 간다 포 디토!]', pronunciationEn: '[잇 이즈 뷰티풀 히어!]', wordIds: ['vw-ph-sightseeing-11'] },
  { id: 've-ph-sightseeing-03', countryId: 'ph', unitId: 'sightseeing', text: 'Punta tayo sa dagat.', textEn: 'Let us go to the sea.', meaning: '바다에 가요.', pronunciation: '[푼타 타요 사 다갓]', pronunciationEn: '[렛 어스 고 투 더 씨]', wordIds: ['vw-ph-sightseeing-01'] },
  { id: 've-ph-sightseeing-04', countryId: 'ph', unitId: 'sightseeing', text: 'Hindi po ako marunong lumangoy.', textEn: 'I cannot swim.', meaning: '저는 수영을 못해요.', pronunciation: '[힌디 포 아코 마루농 루망고이]', pronunciationEn: '[아이 캔낫 스윔]', wordIds: ['vw-ph-sightseeing-12'], phraseId: 'ph-hop-02' },
  { id: 've-ph-sightseeing-05', countryId: 'ph', unitId: 'sightseeing', text: 'Malalim po ba dito?', textEn: 'Is it deep here?', meaning: '여기 물이 깊어요?', pronunciation: '[말랄림 포 바 디토?]', pronunciationEn: '[이즈 잇 딥 히어?]', wordIds: ['vw-ph-sightseeing-01'], phraseId: 'ph-hop-07' },
  { id: 've-ph-sightseeing-06', countryId: 'ph', unitId: 'sightseeing', text: 'Umuulan po ba bukas?', textEn: 'Will it rain tomorrow?', meaning: '내일 비 와요?', pronunciation: '[우무울란 포 바 부카스?]', pronunciationEn: '[윌 잇 레인 투모로우?]', wordIds: ['vw-ph-sightseeing-10'] },

  /* 8. 마사지·스파 */
  { id: 've-ph-massage-01', countryId: 'ph', unitId: 'massage', text: 'Masakit po.', textEn: 'It hurts.', meaning: '아파요.', pronunciation: '[마사킷 포]', pronunciationEn: '[잇 허츠]', wordIds: ['vw-ph-massage-08'], phraseId: 'ph-spa-05' },
  { id: 've-ph-massage-02', countryId: 'ph', unitId: 'massage', text: 'Pakidiinan po nang konti.', textEn: 'A little stronger, please.', meaning: '조금 더 세게 해주세요.', pronunciation: '[파키디이난 포 낭 콘티]', pronunciationEn: '[어 리틀 스트롱거, 플리즈]', wordIds: ['vw-ph-massage-09'], phraseId: 'ph-spa-03' },
  { id: 've-ph-massage-03', countryId: 'ph', unitId: 'massage', text: 'Pakihinaan po nang konti.', textEn: 'A little softer, please.', meaning: '조금 약하게 해주세요.', pronunciation: '[파키히나안 포 낭 콘티]', pronunciationEn: '[어 리틀 소프터, 플리즈]', wordIds: ['vw-ph-massage-10'], phraseId: 'ph-spa-04' },
  { id: 've-ph-massage-04', countryId: 'ph', unitId: 'massage', text: 'Sa likod po, pakiusap.', textEn: 'On the back, please.', meaning: '등 좀 해주세요.', pronunciation: '[사 리코드 포, 파키우삽]', pronunciationEn: '[온 더 백, 플리즈]', wordIds: ['vw-ph-massage-04'] },
  { id: 've-ph-massage-05', countryId: 'ph', unitId: 'massage', text: 'Masakit ang balikat ko.', textEn: 'My shoulder hurts.', meaning: '어깨가 아파요.', pronunciation: '[마사킷 앙 발리캇 코]', pronunciationEn: '[마이 숄더 허츠]', wordIds: ['vw-ph-massage-03', 'vw-ph-massage-08'] },
  { id: 've-ph-massage-06', countryId: 'ph', unitId: 'massage', text: 'Tapos na po ba?', textEn: 'Are we done?', meaning: '끝났어요?', pronunciation: '[타포스 나 포 바?]', pronunciationEn: '[아 위 던?]', wordIds: ['vw-ph-massage-12'] },

  /* 9. 친구 사귀기 */
  { id: 've-ph-friends-01', countryId: 'ph', unitId: 'friends', text: 'Kumusta po kayo?', textEn: 'How are you?', meaning: '안녕하세요?', pronunciation: '[쿠무스타 포 카요?]', pronunciationEn: '[하우 아 유?]', wordIds: ['vw-ph-friends-01'], phraseId: 'ph-soc-01' },
  { id: 've-ph-friends-02', countryId: 'ph', unitId: 'friends', text: 'Ano po ang pangalan ninyo?', textEn: 'What is your name?', meaning: '이름이 뭐예요?', pronunciation: '[아노 포 앙 팡알란 니뇨?]', pronunciationEn: '[왓 이즈 유어 네임?]', wordIds: ['vw-ph-friends-03'] },
  { id: 've-ph-friends-03', countryId: 'ph', unitId: 'friends', text: 'Koreano po ako.', textEn: 'I am Korean.', meaning: '저는 한국 사람이에요.', pronunciation: '[코레아노 포 아코]', pronunciationEn: '[아이 앰 코리안]', wordIds: ['vw-ph-friends-06'] },
  { id: 've-ph-friends-04', countryId: 'ph', unitId: 'friends', text: 'Salamat po! Ang bait ninyo.', textEn: 'Thank you! You are kind.', meaning: '감사합니다! 정말 친절하시네요.', pronunciation: '[살라맛 포! 앙 바잇 니뇨]', pronunciationEn: '[땡큐! 유 아 카인드]', wordIds: ['vw-ph-friends-02'], phraseId: 'ph-soc-03' },
  { id: 've-ph-friends-05', countryId: 'ph', unitId: 'friends', text: 'Magkita tayo ulit ha?', textEn: 'See you again, okay?', meaning: '우리 또 만나요.', pronunciation: '[막키타 타요 우릿 하?]', pronunciationEn: '[씨 유 어게인, 오케이?]', wordIds: ['vw-ph-friends-12'], phraseId: 'ph-18' },
  { id: 've-ph-friends-06', countryId: 'ph', unitId: 'friends', text: 'Ingat ka pauwi ha?', textEn: 'Take care going home.', meaning: '집에 조심히 가세요.', pronunciation: '[잉앗 카 파우위 하?]', pronunciationEn: '[테이크 케어 고잉 홈]', wordIds: ['vw-ph-friends-11'], phraseId: 'ph-soc-14' },

  /* 10. 비상 */
  { id: 've-ph-emergency-01', countryId: 'ph', unitId: 'emergency', text: 'Tulungan po ninyo ako!', textEn: 'Please help me!', meaning: '저 좀 도와주세요!', pronunciation: '[툴룽안 포 니뇨 아코!]', pronunciationEn: '[플리즈 헬프 미!]', wordIds: ['vw-ph-emergency-01'], phraseId: 'ph-eme-01' },
  { id: 've-ph-emergency-02', countryId: 'ph', unitId: 'emergency', text: 'Pakitawag po ng pulis.', textEn: 'Please call the police.', meaning: '경찰을 불러주세요.', pronunciation: '[파키타왁 포 낭 풀리스]', pronunciationEn: '[플리즈 콜 더 폴리스]', wordIds: ['vw-ph-emergency-02'], phraseId: 'ph-eme-03' },
  { id: 've-ph-emergency-03', countryId: 'ph', unitId: 'emergency', text: 'Kailangan ko po ng doktor.', textEn: 'I need a doctor.', meaning: '의사가 필요해요.', pronunciation: '[카일랑안 코 포 낭 독토르]', pronunciationEn: '[아이 니드 어 닥터]', wordIds: ['vw-ph-emergency-03'], phraseId: 'ph-eme-04' },
  { id: 've-ph-emergency-04', countryId: 'ph', unitId: 'emergency', text: 'Saan po ang botika?', textEn: 'Where is the pharmacy?', meaning: '약국이 어디예요?', pronunciation: '[사안 포 앙 보티카?]', pronunciationEn: '[웨어 이즈 더 파머시?]', wordIds: ['vw-ph-emergency-05'], phraseId: 'ph-eme-06' },
  { id: 've-ph-emergency-05', countryId: 'ph', unitId: 'emergency', text: 'Ninakaw po ang wallet ko.', textEn: 'My wallet was stolen.', meaning: '지갑을 도둑맞았어요.', pronunciation: '[니나카우 포 앙 월렛 코]', pronunciationEn: '[마이 월렛 워즈 스톨른]', wordIds: ['vw-ph-emergency-09'], phraseId: 'ph-eme-02' },
  { id: 've-ph-emergency-06', countryId: 'ph', unitId: 'emergency', text: 'Pakitawag po ang Korean Embassy.', textEn: 'Please call the Korean Embassy.', meaning: '한국 대사관에 연락해 주세요.', pronunciation: '[파키타왁 포 앙 코리안 엠버시]', pronunciationEn: '[플리즈 콜 더 코리안 엠버시]', wordIds: ['vw-ph-emergency-12'], phraseId: 'ph-eme-10' },
];

export const PH_DIALOGS: VocabDialog[] = [
  {
    id: 'vd-ph-airport', countryId: 'ph', unitId: 'airport', title: '체크인 카운터 찾기',
    lines: [
      { speaker: 'me', text: 'Nasaan po ang check-in counter?', textEn: 'Where is the check-in counter?', meaning: '체크인 카운터가 어디예요?', pronunciation: '[나사안 포 앙 체크인 카운터?]', pronunciationEn: '[웨어 이즈 더 체크인 카운터?]', phraseId: 'ph-air-01' },
      { speaker: 'them', text: 'Sa kaliwa po, may pila.', textEn: 'On the left, there is a line.', meaning: '왼쪽에 있어요, 줄이 있어요.', pronunciation: '[사 칼리와 포, 마이 필라]', pronunciationEn: '[온 더 레프트, 데어 이즈 어 라인]' },
      { speaker: 'me', text: 'Salamat po. Huli na ako.', textEn: 'Thank you. I am late.', meaning: '감사합니다. 저 늦었어요.', pronunciation: '[살라맛 포. 훌리 나 아코]', pronunciationEn: '[땡큐. 아이 앰 레이트]' },
      { speaker: 'them', text: 'Bilisan mo po, sir.', textEn: 'Please hurry, sir.', meaning: '서두르세요, 손님.', pronunciation: '[빌리산 모 포, 서]', pronunciationEn: '[플리즈 허리, 서]' },
    ],
  },
  {
    id: 'vd-ph-hotel', countryId: 'ph', unitId: 'hotel', title: '체크인 하기',
    lines: [
      { speaker: 'me', text: 'Gusto ko po mag-check in.', textEn: 'I would like to check in.', meaning: '체크인할게요.', pronunciation: '[구스토 코 포 막-체크인]', pronunciationEn: '[아이 우드 라이크 투 체크인]', phraseId: 'ph-hot-01' },
      { speaker: 'them', text: 'Pangalan po ninyo?', textEn: 'Your name, please?', meaning: '성함이 어떻게 되세요?', pronunciation: '[팡알란 포 니뇨?]', pronunciationEn: '[유어 네임, 플리즈?]' },
      { speaker: 'me', text: 'Kim po. Dalawang gabi.', textEn: 'Kim. Two nights.', meaning: '김이에요. 두 밤이요.', pronunciation: '[킴 포. 달라왕 가비]', pronunciationEn: '[킴. 투 나이츠]' },
      { speaker: 'them', text: 'Heto po ang susi ninyo.', textEn: 'Here is your key.', meaning: '여기 열쇠입니다.', pronunciation: '[헤토 포 앙 수시 니뇨]', pronunciationEn: '[히어 이즈 유어 키]' },
    ],
  },
  {
    id: 'vd-ph-transport', countryId: 'ph', unitId: 'transport', title: '택시 타기',
    lines: [
      { speaker: 'me', text: 'Sa Mall of Asia po.', textEn: 'To Mall of Asia, please.', meaning: '몰 오브 아시아로 가주세요.', pronunciation: '[사 몰 오브 아시아 포]', pronunciationEn: '[투 몰 오브 아시아, 플리즈]' },
      { speaker: 'them', text: 'Sige po, tatlong daang piso.', textEn: 'Okay, three hundred pesos.', meaning: '네, 300페소요.', pronunciation: '[시게 포, 타틀롱 다앙 피소]', pronunciationEn: '[오케이, 쓰리 헌드레드 페소스]' },
      { speaker: 'me', text: 'Pakibuksan po ang metro.', textEn: 'Please turn on the meter.', meaning: '미터기 켜주세요.', pronunciation: '[파키북산 포 앙 메트로]', pronunciationEn: '[플리즈 턴 온 더 미터]', phraseId: 'ph-10' },
      { speaker: 'them', text: 'Opo. Diretso muna tayo.', textEn: 'Yes. Let us go straight first.', meaning: '네. 먼저 직진할게요.', pronunciation: '[오포. 디렛소 무나 타요]', pronunciationEn: '[예스. 렛 어스 고 스트레이트 퍼스트]' },
    ],
  },
  {
    id: 'vd-ph-restaurant', countryId: 'ph', unitId: 'restaurant', title: '주문하기',
    lines: [
      { speaker: 'me', text: 'Pahingi po ng menu.', textEn: 'The menu, please.', meaning: '메뉴 주세요.', pronunciation: '[파힝기 포 낭 메뉴]', pronunciationEn: '[더 메뉴, 플리즈]' },
      { speaker: 'them', text: 'Heto po. Ano pong order?', textEn: 'Here. What is your order?', meaning: '여기요. 뭐 드릴까요?', pronunciation: '[헤토 포. 아노 퐁 오더?]', pronunciationEn: '[히어. 왓 이즈 유어 오더?]' },
      { speaker: 'me', text: 'Isang adobo at kanin po.', textEn: 'One adobo and rice, please.', meaning: '아도보 하나랑 밥이요.', pronunciation: '[이상 아도보 앗 카닌 포]', pronunciationEn: '[원 아도보 앤 라이스, 플리즈]' },
      { speaker: 'them', text: 'Sige po, sandali lang.', textEn: 'Okay, just a moment.', meaning: '네, 잠시만요.', pronunciation: '[시게 포, 산달리 랑]', pronunciationEn: '[오케이, 저스트 어 모먼트]' },
    ],
  },
  {
    id: 'vd-ph-food', countryId: 'ph', unitId: 'food', title: '길거리 음식 사기',
    lines: [
      { speaker: 'me', text: 'Ano po ito?', textEn: 'What is this?', meaning: '이게 뭐예요?', pronunciation: '[아노 포 이토?]', pronunciationEn: '[왓 이즈 디스?]' },
      { speaker: 'them', text: 'Manok po, barbecue.', textEn: 'Chicken, barbecue.', meaning: '닭고기예요, 바비큐요.', pronunciation: '[마녹 포, 바비큐]', pronunciationEn: '[치킨, 바비큐]' },
      { speaker: 'me', text: 'Dalawa po, at tubig.', textEn: 'Two, and water please.', meaning: '두 개랑 물 주세요.', pronunciation: '[달라와 포, 앗 투빅]', pronunciationEn: '[투, 앤 워터 플리즈]' },
      { speaker: 'them', text: 'Singkuwenta pesos po lahat.', textEn: 'Fifty pesos for all.', meaning: '다 해서 50페소예요.', pronunciation: '[싱쿠웬타 페소스 포 라핫]', pronunciationEn: '[피프티 페소스 포 올]' },
    ],
  },
  {
    id: 'vd-ph-market', countryId: 'ph', unitId: 'market', title: '값 깎기',
    lines: [
      { speaker: 'me', text: 'Magkano po ang sapatos?', textEn: 'How much are the shoes?', meaning: '신발 얼마예요?', pronunciation: '[막카노 포 앙 사파토스?]', pronunciationEn: '[하우 머치 아 더 슈즈?]' },
      { speaker: 'them', text: 'Isang libong piso po.', textEn: 'One thousand pesos.', meaning: '1000페소예요.', pronunciation: '[이상 리봉 피소 포]', pronunciationEn: '[원 싸우전드 페소스]' },
      { speaker: 'me', text: 'Ang mahal! Tawad po.', textEn: 'Too expensive! A discount, please.', meaning: '비싸요! 깎아주세요.', pronunciation: '[앙 마할! 타와드 포]', pronunciationEn: '[투 익스펜시브! 어 디스카운트, 플리즈]' },
      { speaker: 'them', text: 'Sige, walong daan na lang.', textEn: 'Okay, eight hundred then.', meaning: '좋아요, 800페소요.', pronunciation: '[시게, 왈롱 다안 나 랑]', pronunciationEn: '[오케이, 에잇 헌드레드 덴]' },
    ],
  },
  {
    id: 'vd-ph-sightseeing', countryId: 'ph', unitId: 'sightseeing', title: '사진 부탁하기',
    lines: [
      { speaker: 'me', text: 'Pakikuhanan po kami ng picture.', textEn: 'Please take our picture.', meaning: '저희 사진 좀 찍어주세요.', pronunciation: '[파키쿠하난 포 카미 낭 픽처]', pronunciationEn: '[플리즈 테이크 아워 픽처]', phraseId: 'ph-tur-05' },
      { speaker: 'them', text: 'Sige po! Isa, dalawa, tatlo!', textEn: 'Okay! One, two, three!', meaning: '네! 하나, 둘, 셋!', pronunciation: '[시게 포! 이사, 달라와, 타틀로!]', pronunciationEn: '[오케이! 원, 투, 쓰리!]' },
      { speaker: 'me', text: 'Salamat po! Ang ganda!', textEn: 'Thank you! It is beautiful!', meaning: '감사합니다! 예뻐요!', pronunciation: '[살라맛 포! 앙 간다!]', pronunciationEn: '[땡큐! 잇 이즈 뷰티풀!]' },
      { speaker: 'them', text: 'Walang anuman po.', textEn: 'You are welcome.', meaning: '천만에요.', pronunciation: '[왈랑 아누만 포]', pronunciationEn: '[유 아 웰컴]' },
    ],
  },
  {
    id: 'vd-ph-massage', countryId: 'ph', unitId: 'massage', title: '마사지 받기',
    lines: [
      { speaker: 'me', text: 'Magkano po ang isang oras?', textEn: 'How much for one hour?', meaning: '한 시간에 얼마예요?', pronunciation: '[막카노 포 앙 이상 오라스]', pronunciationEn: '[하우 머치 포 원 아워?]', phraseId: 'ph-spa-02' },
      { speaker: 'them', text: 'Anim na raang piso po.', textEn: 'Six hundred pesos.', meaning: '600페소예요.', pronunciation: '[아님 나 라앙 피소 포]', pronunciationEn: '[식스 헌드레드 페소스]' },
      { speaker: 'me', text: 'Sige po. Sa likod.', textEn: 'Okay. On the back.', meaning: '좋아요. 등이요.', pronunciation: '[시게 포. 사 리코드]', pronunciationEn: '[오케이. 온 더 백]' },
      { speaker: 'them', text: 'Higa po kayo dito.', textEn: 'Please lie down here.', meaning: '여기 누우세요.', pronunciation: '[히가 포 카요 디토]', pronunciationEn: '[플리즈 라이 다운 히어]' },
    ],
  },
  {
    id: 'vd-ph-friends', countryId: 'ph', unitId: 'friends', title: '인사하고 친해지기',
    lines: [
      { speaker: 'me', text: 'Kumusta po! Koreano ako.', textEn: 'Hello! I am Korean.', meaning: '안녕하세요! 저는 한국 사람이에요.', pronunciation: '[쿠무스타 포! 코레아노 아코]', pronunciationEn: '[헬로! 아이 앰 코리안]' },
      { speaker: 'them', text: 'Ay, Korea! Ano pangalan mo?', textEn: 'Oh, Korea! What is your name?', meaning: '오, 한국! 이름이 뭐예요?', pronunciation: '[아이, 코리아! 아노 팡알란 모?]', pronunciationEn: '[오, 코리아! 왓 이즈 유어 네임?]' },
      { speaker: 'me', text: 'Minji po. Ikaw, kuya?', textEn: 'Minji. And you, kuya?', meaning: '민지예요. 형은요?', pronunciation: '[민지 포. 이카우, 쿠야?]', pronunciationEn: '[민지. 앤 유, 쿠야?]' },
      { speaker: 'them', text: 'Ako si Jun. Magkaibigan tayo!', textEn: 'I am Jun. Let us be friends!', meaning: '저는 준이에요. 우리 친구해요!', pronunciation: '[아코 시 준. 막카이비간 타요!]', pronunciationEn: '[아이 앰 준. 렛 어스 비 프렌즈!]' },
    ],
  },
  {
    id: 'vd-ph-emergency', countryId: 'ph', unitId: 'emergency', title: '도와달라고 하기',
    lines: [
      { speaker: 'me', text: 'Tulungan po ninyo ako!', textEn: 'Please help me!', meaning: '저 좀 도와주세요!', pronunciation: '[툴룽안 포 니뇨 아코!]', pronunciationEn: '[플리즈 헬프 미!]', phraseId: 'ph-eme-01' },
      { speaker: 'them', text: 'Ano pong nangyari?', textEn: 'What happened?', meaning: '무슨 일이에요?', pronunciation: '[아노 퐁 낭야리?]', pronunciationEn: '[왓 해펀드?]' },
      { speaker: 'me', text: 'Nawala po ang pitaka ko.', textEn: 'I lost my wallet.', meaning: '지갑을 잃어버렸어요.', pronunciation: '[나왈라 포 앙 피타카 코]', pronunciationEn: '[아이 로스트 마이 월렛]' },
      { speaker: 'them', text: 'Tatawag po ako ng pulis.', textEn: 'I will call the police.', meaning: '경찰을 부를게요.', pronunciation: '[타타왁 포 아코 낭 풀리스]', pronunciationEn: '[아이 윌 콜 더 폴리스]' },
    ],
  },
];
