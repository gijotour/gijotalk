// 베트남 (베트남어만). 설계: docs/VOCAB_PLAN.md
//
// 한글 발음은 기존 phrases.vn*.ts 의 표기 방식을 그대로 따릅니다
// (cho → 쪼, không → 콤, ở đâu → 어 더우, giảm giá → 잠 자 …).
// 단어는 다낭·호치민에서 쓰는 남부 어휘를 우선했고, 북부와 다른 것은 tip 한 줄로 적었습니다.
// 짧은 말의 `phraseId` 는 같은 문장이 이미 phrases*.ts 에 있을 때만 붙입니다
// — 오디오와 전광판을 그대로 재사용하기 위해서입니다.
import type { VocabWord, VocabExpression, VocabDialog } from '../../types';

export const VN_WORDS: VocabWord[] = [
  /* 1. 공항 ✈️ */
  { id: 'vw-vn-airport-01', countryId: 'vn', unitId: 'airport', emoji: '✈️', word: 'máy bay', meaning: '비행기', pronunciation: '[마이 바이]' },
  { id: 'vw-vn-airport-02', countryId: 'vn', unitId: 'airport', emoji: '🛂', word: 'hộ chiếu', meaning: '여권', pronunciation: '[호 찌에우]' },
  { id: 'vw-vn-airport-03', countryId: 'vn', unitId: 'airport', emoji: '🎫', word: 'vé', meaning: '표', pronunciation: '[베]' },
  { id: 'vw-vn-airport-04', countryId: 'vn', unitId: 'airport', emoji: '🧳', word: 'hành lý', meaning: '짐', pronunciation: '[행 리]' },
  { id: 'vw-vn-airport-05', countryId: 'vn', unitId: 'airport', emoji: '💺', word: 'chỗ ngồi', meaning: '자리', pronunciation: '[쪼 응오이]' },
  { id: 'vw-vn-airport-06', countryId: 'vn', unitId: 'airport', emoji: '🪟', word: 'cửa sổ', meaning: '창문', pronunciation: '[끄어 쏘]' },
  { id: 'vw-vn-airport-07', countryId: 'vn', unitId: 'airport', emoji: '🧍', word: 'xếp hàng', meaning: '줄 서기', pronunciation: '[셉 항]' },
  { id: 'vw-vn-airport-08', countryId: 'vn', unitId: 'airport', emoji: '🚻', word: 'toilet', meaning: '화장실', pronunciation: '[또일렛]', tip: '간판에는 nhà vệ sinh 이라고 써 있습니다.' },
  { id: 'vw-vn-airport-09', countryId: 'vn', unitId: 'airport', emoji: '⏰', word: 'giờ', meaning: '시간', pronunciation: '[지어]' },
  { id: 'vw-vn-airport-10', countryId: 'vn', unitId: 'airport', emoji: '⏳', word: 'trễ', meaning: '늦다', pronunciation: '[쩨]', tip: '북부에서는 muộn 이라고 합니다.' },
  { id: 'vw-vn-airport-11', countryId: 'vn', unitId: 'airport', emoji: '🛫', word: 'khởi hành', meaning: '출발', pronunciation: '[커이 하잉]' },
  { id: 'vw-vn-airport-12', countryId: 'vn', unitId: 'airport', emoji: '🛬', word: 'đến', meaning: '도착', pronunciation: '[덴]' },

  /* 2. 호텔 🏨 */
  { id: 'vw-vn-hotel-01', countryId: 'vn', unitId: 'hotel', emoji: '🚪', word: 'phòng', meaning: '방', pronunciation: '[퐁]' },
  { id: 'vw-vn-hotel-02', countryId: 'vn', unitId: 'hotel', emoji: '🔑', word: 'chìa khóa', meaning: '열쇠', pronunciation: '[찌아 코아]' },
  { id: 'vw-vn-hotel-03', countryId: 'vn', unitId: 'hotel', emoji: '🛏️', word: 'giường', meaning: '침대', pronunciation: '[즈엉]' },
  { id: 'vw-vn-hotel-04', countryId: 'vn', unitId: 'hotel', emoji: '🚿', word: 'nhà tắm', meaning: '욕실', pronunciation: '[냐 땀]' },
  { id: 'vw-vn-hotel-05', countryId: 'vn', unitId: 'hotel', emoji: '🧻', word: 'khăn tắm', meaning: '수건', pronunciation: '[칸 땀]' },
  { id: 'vw-vn-hotel-06', countryId: 'vn', unitId: 'hotel', emoji: '🧼', word: 'xà phòng', meaning: '비누', pronunciation: '[사 퐁]' },
  { id: 'vw-vn-hotel-07', countryId: 'vn', unitId: 'hotel', emoji: '❄️', word: 'máy lạnh', meaning: '에어컨', pronunciation: '[마이 라잉]', tip: '북부에서는 điều hòa 라고 합니다.' },
  { id: 'vw-vn-hotel-08', countryId: 'vn', unitId: 'hotel', emoji: '📶', word: 'Wi-Fi', meaning: '와이파이', pronunciation: '[와이파이]' },
  { id: 'vw-vn-hotel-09', countryId: 'vn', unitId: 'hotel', emoji: '🍳', word: 'ăn sáng', meaning: '아침밥', pronunciation: '[안 상]' },
  { id: 'vw-vn-hotel-10', countryId: 'vn', unitId: 'hotel', emoji: '💡', word: 'đèn', meaning: '불', pronunciation: '[댄]' },
  { id: 'vw-vn-hotel-11', countryId: 'vn', unitId: 'hotel', emoji: '🛠️', word: 'hư', meaning: '고장', pronunciation: '[흐]', tip: '북부에서는 hỏng 이라고 합니다.' },
  { id: 'vw-vn-hotel-12', countryId: 'vn', unitId: 'hotel', emoji: '🥵', word: 'nóng', meaning: '덥다', pronunciation: '[농]' },

  /* 3. 택시·이동 🚕 */
  { id: 'vw-vn-transport-01', countryId: 'vn', unitId: 'transport', emoji: '🚕', word: 'taxi', meaning: '택시', pronunciation: '[택시]' },
  { id: 'vw-vn-transport-02', countryId: 'vn', unitId: 'transport', emoji: '🛵', word: 'xe máy', meaning: '오토바이', pronunciation: '[쎄 마이]' },
  { id: 'vw-vn-transport-03', countryId: 'vn', unitId: 'transport', emoji: '🚌', word: 'xe buýt', meaning: '버스', pronunciation: '[쎄 부잇]' },
  { id: 'vw-vn-transport-04', countryId: 'vn', unitId: 'transport', emoji: '🛣️', word: 'đường', meaning: '길', pronunciation: '[드엉]' },
  { id: 'vw-vn-transport-05', countryId: 'vn', unitId: 'transport', emoji: '⬅️', word: 'trái', meaning: '왼쪽', pronunciation: '[짜이]' },
  { id: 'vw-vn-transport-06', countryId: 'vn', unitId: 'transport', emoji: '➡️', word: 'phải', meaning: '오른쪽', pronunciation: '[파이]' },
  { id: 'vw-vn-transport-07', countryId: 'vn', unitId: 'transport', emoji: '⬆️', word: 'thẳng', meaning: '직진', pronunciation: '[탕]' },
  { id: 'vw-vn-transport-08', countryId: 'vn', unitId: 'transport', emoji: '🛑', word: 'dừng', meaning: '멈추다', pronunciation: '[등]' },
  { id: 'vw-vn-transport-09', countryId: 'vn', unitId: 'transport', emoji: '📍', word: 'gần', meaning: '가깝다', pronunciation: '[건]' },
  { id: 'vw-vn-transport-10', countryId: 'vn', unitId: 'transport', emoji: '🌄', word: 'xa', meaning: '멀다', pronunciation: '[사]' },
  { id: 'vw-vn-transport-11', countryId: 'vn', unitId: 'transport', emoji: '⏲️', word: 'đồng hồ', meaning: '미터기', pronunciation: '[동 호]', tip: '택시를 타면 đồng hồ 부터 켜달라고 합니다.' },
  { id: 'vw-vn-transport-12', countryId: 'vn', unitId: 'transport', emoji: '👨‍✈️', word: 'tài xế', meaning: '기사', pronunciation: '[따이 쎄]' },

  /* 4. 식당 🍽️ */
  { id: 'vw-vn-restaurant-01', countryId: 'vn', unitId: 'restaurant', emoji: '📋', word: 'thực đơn', meaning: '메뉴', pronunciation: '[특 던]' },
  { id: 'vw-vn-restaurant-02', countryId: 'vn', unitId: 'restaurant', emoji: '🪑', word: 'bàn', meaning: '식탁', pronunciation: '[반]' },
  { id: 'vw-vn-restaurant-03', countryId: 'vn', unitId: 'restaurant', emoji: '🍽️', word: 'đĩa', meaning: '접시', pronunciation: '[디아]' },
  { id: 'vw-vn-restaurant-04', countryId: 'vn', unitId: 'restaurant', emoji: '🥄', word: 'muỗng', meaning: '숟가락', pronunciation: '[무옹]', tip: '북부에서는 thìa 라고 합니다.' },
  { id: 'vw-vn-restaurant-05', countryId: 'vn', unitId: 'restaurant', emoji: '🍴', word: 'nĩa', meaning: '포크', pronunciation: '[니아]' },
  { id: 'vw-vn-restaurant-06', countryId: 'vn', unitId: 'restaurant', emoji: '🥤', word: 'ly', meaning: '컵', pronunciation: '[리]', tip: '북부에서는 cốc 이라고 합니다.' },
  { id: 'vw-vn-restaurant-07', countryId: 'vn', unitId: 'restaurant', emoji: '🍚', word: 'cơm', meaning: '밥', pronunciation: '[껌]' },
  { id: 'vw-vn-restaurant-08', countryId: 'vn', unitId: 'restaurant', emoji: '🧾', word: 'tính tiền', meaning: '계산', pronunciation: '[띤 띠엔]' },
  { id: 'vw-vn-restaurant-09', countryId: 'vn', unitId: 'restaurant', emoji: '😋', word: 'ngon', meaning: '맛있다', pronunciation: '[응온]' },
  { id: 'vw-vn-restaurant-10', countryId: 'vn', unitId: 'restaurant', emoji: '🌶️', word: 'cay', meaning: '맵다', pronunciation: '[까이]' },
  { id: 'vw-vn-restaurant-11', countryId: 'vn', unitId: 'restaurant', emoji: '🥡', word: 'mang về', meaning: '포장', pronunciation: '[망 베]' },
  { id: 'vw-vn-restaurant-12', countryId: 'vn', unitId: 'restaurant', emoji: '🧊', word: 'đá', meaning: '얼음', pronunciation: '[다]' },

  /* 5. 음식·음료 🍜 */
  { id: 'vw-vn-food-01', countryId: 'vn', unitId: 'food', emoji: '💧', word: 'nước', meaning: '물', pronunciation: '[느억]' },
  { id: 'vw-vn-food-02', countryId: 'vn', unitId: 'food', emoji: '☕', word: 'cà phê', meaning: '커피', pronunciation: '[까 페]' },
  { id: 'vw-vn-food-03', countryId: 'vn', unitId: 'food', emoji: '🍗', word: 'thịt gà', meaning: '닭고기', pronunciation: '[팃 가]' },
  { id: 'vw-vn-food-04', countryId: 'vn', unitId: 'food', emoji: '🥓', word: 'thịt heo', meaning: '돼지고기', pronunciation: '[팃 헤오]', tip: '북부에서는 thịt lợn 이라고 합니다.' },
  { id: 'vw-vn-food-05', countryId: 'vn', unitId: 'food', emoji: '🐟', word: 'cá', meaning: '생선', pronunciation: '[까]' },
  { id: 'vw-vn-food-06', countryId: 'vn', unitId: 'food', emoji: '🥬', word: 'rau', meaning: '채소', pronunciation: '[라우]' },
  { id: 'vw-vn-food-07', countryId: 'vn', unitId: 'food', emoji: '🍎', word: 'trái cây', meaning: '과일', pronunciation: '[짜이 꺼이]', tip: '북부에서는 hoa quả 라고 합니다.' },
  { id: 'vw-vn-food-08', countryId: 'vn', unitId: 'food', emoji: '🥚', word: 'trứng', meaning: '계란', pronunciation: '[쯩]' },
  { id: 'vw-vn-food-09', countryId: 'vn', unitId: 'food', emoji: '🍞', word: 'bánh mì', meaning: '빵', pronunciation: '[반 미]' },
  { id: 'vw-vn-food-10', countryId: 'vn', unitId: 'food', emoji: '🥛', word: 'sữa', meaning: '우유', pronunciation: '[쓰어]' },
  { id: 'vw-vn-food-11', countryId: 'vn', unitId: 'food', emoji: '🍺', word: 'bia', meaning: '맥주', pronunciation: '[비어]' },
  { id: 'vw-vn-food-12', countryId: 'vn', unitId: 'food', emoji: '🍧', word: 'chè', meaning: '단팥 빙수', pronunciation: '[째]' },

  /* 6. 시장·흥정 🛍️ */
  { id: 'vw-vn-market-01', countryId: 'vn', unitId: 'market', emoji: '💵', word: 'tiền', meaning: '돈', pronunciation: '[띠엔]' },
  { id: 'vw-vn-market-02', countryId: 'vn', unitId: 'market', emoji: '💰', word: 'bao nhiêu', meaning: '얼마', pronunciation: '[바오 니에우]' },
  { id: 'vw-vn-market-03', countryId: 'vn', unitId: 'market', emoji: '🏷️', word: 'giá', meaning: '가격', pronunciation: '[자]' },
  { id: 'vw-vn-market-04', countryId: 'vn', unitId: 'market', emoji: '💸', word: 'đắt', meaning: '비싸다', pronunciation: '[닷]', tip: '남부에서는 mắc 이라고도 합니다.' },
  { id: 'vw-vn-market-05', countryId: 'vn', unitId: 'market', emoji: '🉐', word: 'rẻ', meaning: '싸다', pronunciation: '[제]' },
  { id: 'vw-vn-market-06', countryId: 'vn', unitId: 'market', emoji: '💱', word: 'tiền thừa', meaning: '거스름돈', pronunciation: '[띠엔 트어]', tip: '남부에서는 tiền thối 라고도 합니다.' },
  { id: 'vw-vn-market-07', countryId: 'vn', unitId: 'market', emoji: '📉', word: 'giảm giá', meaning: '깎기', pronunciation: '[잠 자]' },
  { id: 'vw-vn-market-08', countryId: 'vn', unitId: 'market', emoji: '🛒', word: 'mua', meaning: '사다', pronunciation: '[무어]' },
  { id: 'vw-vn-market-09', countryId: 'vn', unitId: 'market', emoji: '👕', word: 'áo', meaning: '옷', pronunciation: '[아오]' },
  { id: 'vw-vn-market-10', countryId: 'vn', unitId: 'market', emoji: '👟', word: 'giày', meaning: '신발', pronunciation: '[자이]' },
  { id: 'vw-vn-market-11', countryId: 'vn', unitId: 'market', emoji: '👜', word: 'túi', meaning: '가방', pronunciation: '[뚜이]' },
  { id: 'vw-vn-market-12', countryId: 'vn', unitId: 'market', emoji: '👉', word: 'cái này', meaning: '이것', pronunciation: '[까이 나이]' },

  /* 7. 관광 🏝️ */
  { id: 'vw-vn-sightseeing-01', countryId: 'vn', unitId: 'sightseeing', emoji: '🌊', word: 'biển', meaning: '바다', pronunciation: '[비엔]' },
  { id: 'vw-vn-sightseeing-02', countryId: 'vn', unitId: 'sightseeing', emoji: '🏖️', word: 'cát', meaning: '모래', pronunciation: '[깟]' },
  { id: 'vw-vn-sightseeing-03', countryId: 'vn', unitId: 'sightseeing', emoji: '⛰️', word: 'núi', meaning: '산', pronunciation: '[누이]' },
  { id: 'vw-vn-sightseeing-04', countryId: 'vn', unitId: 'sightseeing', emoji: '🛕', word: 'chùa', meaning: '절', pronunciation: '[쭈어]' },
  { id: 'vw-vn-sightseeing-05', countryId: 'vn', unitId: 'sightseeing', emoji: '📷', word: 'ảnh', meaning: '사진', pronunciation: '[아잉]' },
  { id: 'vw-vn-sightseeing-06', countryId: 'vn', unitId: 'sightseeing', emoji: '🗺️', word: 'bản đồ', meaning: '지도', pronunciation: '[반 도]' },
  { id: 'vw-vn-sightseeing-07', countryId: 'vn', unitId: 'sightseeing', emoji: '🧑‍🏫', word: 'hướng dẫn', meaning: '안내', pronunciation: '[흐엉 전]' },
  { id: 'vw-vn-sightseeing-08', countryId: 'vn', unitId: 'sightseeing', emoji: '🛶', word: 'thuyền', meaning: '배', pronunciation: '[투옌]' },
  { id: 'vw-vn-sightseeing-09', countryId: 'vn', unitId: 'sightseeing', emoji: '☀️', word: 'nắng', meaning: '햇볕', pronunciation: '[낭]' },
  { id: 'vw-vn-sightseeing-10', countryId: 'vn', unitId: 'sightseeing', emoji: '🌧️', word: 'mưa', meaning: '비', pronunciation: '[므어]' },
  { id: 'vw-vn-sightseeing-11', countryId: 'vn', unitId: 'sightseeing', emoji: '😍', word: 'đẹp', meaning: '예쁘다', pronunciation: '[뎁]' },
  { id: 'vw-vn-sightseeing-12', countryId: 'vn', unitId: 'sightseeing', emoji: '🏊', word: 'bơi', meaning: '수영', pronunciation: '[버이]' },

  /* 8. 마사지·스파 💆 */
  { id: 'vw-vn-massage-01', countryId: 'vn', unitId: 'massage', emoji: '💆', word: 'mát xa', meaning: '마사지', pronunciation: '[맛 사]' },
  { id: 'vw-vn-massage-02', countryId: 'vn', unitId: 'massage', emoji: '🧠', word: 'đầu', meaning: '머리', pronunciation: '[더우]' },
  { id: 'vw-vn-massage-03', countryId: 'vn', unitId: 'massage', emoji: '💪', word: 'vai', meaning: '어깨', pronunciation: '[바이]' },
  { id: 'vw-vn-massage-04', countryId: 'vn', unitId: 'massage', emoji: '🧍', word: 'lưng', meaning: '등', pronunciation: '[릉]' },
  { id: 'vw-vn-massage-05', countryId: 'vn', unitId: 'massage', emoji: '🦵', word: 'chân', meaning: '다리', pronunciation: '[쩐]' },
  { id: 'vw-vn-massage-06', countryId: 'vn', unitId: 'massage', emoji: '🦶', word: 'bàn chân', meaning: '발', pronunciation: '[반 쩐]' },
  { id: 'vw-vn-massage-07', countryId: 'vn', unitId: 'massage', emoji: '🖐️', word: 'tay', meaning: '손', pronunciation: '[따이]' },
  { id: 'vw-vn-massage-08', countryId: 'vn', unitId: 'massage', emoji: '😣', word: 'đau', meaning: '아프다', pronunciation: '[다우]' },
  { id: 'vw-vn-massage-09', countryId: 'vn', unitId: 'massage', emoji: '✊', word: 'mạnh', meaning: '세게', pronunciation: '[마잉]' },
  { id: 'vw-vn-massage-10', countryId: 'vn', unitId: 'massage', emoji: '🪶', word: 'nhẹ', meaning: '약하게', pronunciation: '[녜]' },
  { id: 'vw-vn-massage-11', countryId: 'vn', unitId: 'massage', emoji: '🧴', word: 'dầu', meaning: '오일', pronunciation: '[저우]' },
  { id: 'vw-vn-massage-12', countryId: 'vn', unitId: 'massage', emoji: '✅', word: 'xong', meaning: '끝', pronunciation: '[송]' },

  /* 9. 친구 사귀기 🤝 */
  { id: 'vw-vn-friends-01', countryId: 'vn', unitId: 'friends', emoji: '👋', word: 'xin chào', meaning: '안녕', pronunciation: '[씬 짜오]' },
  { id: 'vw-vn-friends-02', countryId: 'vn', unitId: 'friends', emoji: '🙏', word: 'cảm ơn', meaning: '고마워요', pronunciation: '[깜 언]' },
  { id: 'vw-vn-friends-03', countryId: 'vn', unitId: 'friends', emoji: '🪪', word: 'tên', meaning: '이름', pronunciation: '[뗀]' },
  { id: 'vw-vn-friends-04', countryId: 'vn', unitId: 'friends', emoji: '👫', word: 'bạn', meaning: '친구', pronunciation: '[반]' },
  { id: 'vw-vn-friends-05', countryId: 'vn', unitId: 'friends', emoji: '😊', word: 'vui', meaning: '기쁘다', pronunciation: '[부이]' },
  { id: 'vw-vn-friends-06', countryId: 'vn', unitId: 'friends', emoji: '🇰🇷', word: 'Hàn Quốc', meaning: '한국', pronunciation: '[한 꾸옥]' },
  { id: 'vw-vn-friends-07', countryId: 'vn', unitId: 'friends', emoji: '🧑', word: 'anh', meaning: '형·오빠', pronunciation: '[아잉]', tip: '나보다 나이 많은 남자를 anh 이라고 부릅니다.' },
  { id: 'vw-vn-friends-08', countryId: 'vn', unitId: 'friends', emoji: '👩', word: 'chị', meaning: '누나·언니', pronunciation: '[찌]' },
  { id: 'vw-vn-friends-09', countryId: 'vn', unitId: 'friends', emoji: '✅', word: 'vâng', meaning: '네', pronunciation: '[벙]', tip: '남부에서는 dạ 라고 합니다.' },
  { id: 'vw-vn-friends-10', countryId: 'vn', unitId: 'friends', emoji: '❌', word: 'không', meaning: '아니요', pronunciation: '[콤]' },
  { id: 'vw-vn-friends-11', countryId: 'vn', unitId: 'friends', emoji: '🫶', word: 'tạm biệt', meaning: '잘 가요', pronunciation: '[땀 비엣]' },
  { id: 'vw-vn-friends-12', countryId: 'vn', unitId: 'friends', emoji: '🤗', word: 'gặp lại', meaning: '다시 만나다', pronunciation: '[갑 라이]' },

  /* 10. 비상 🆘 */
  { id: 'vw-vn-emergency-01', countryId: 'vn', unitId: 'emergency', emoji: '🆘', word: 'cứu', meaning: '구해주세요', pronunciation: '[끄우]' },
  { id: 'vw-vn-emergency-02', countryId: 'vn', unitId: 'emergency', emoji: '👮', word: 'cảnh sát', meaning: '경찰', pronunciation: '[까잉 삿]' },
  { id: 'vw-vn-emergency-03', countryId: 'vn', unitId: 'emergency', emoji: '🧑‍⚕️', word: 'bác sĩ', meaning: '의사', pronunciation: '[박 시]' },
  { id: 'vw-vn-emergency-04', countryId: 'vn', unitId: 'emergency', emoji: '🏥', word: 'bệnh viện', meaning: '병원', pronunciation: '[벤 비엔]' },
  { id: 'vw-vn-emergency-05', countryId: 'vn', unitId: 'emergency', emoji: '🏪', word: 'nhà thuốc', meaning: '약국', pronunciation: '[냐 투옥]' },
  { id: 'vw-vn-emergency-06', countryId: 'vn', unitId: 'emergency', emoji: '💊', word: 'thuốc', meaning: '약', pronunciation: '[투옥]' },
  { id: 'vw-vn-emergency-07', countryId: 'vn', unitId: 'emergency', emoji: '🤒', word: 'sốt', meaning: '열', pronunciation: '[솟]' },
  { id: 'vw-vn-emergency-08', countryId: 'vn', unitId: 'emergency', emoji: '🔍', word: 'mất', meaning: '잃어버리다', pronunciation: '[멋]' },
  { id: 'vw-vn-emergency-09', countryId: 'vn', unitId: 'emergency', emoji: '👛', word: 'ví', meaning: '지갑', pronunciation: '[비]' },
  { id: 'vw-vn-emergency-10', countryId: 'vn', unitId: 'emergency', emoji: '🔥', word: 'cháy', meaning: '불', pronunciation: '[짜이]' },
  { id: 'vw-vn-emergency-11', countryId: 'vn', unitId: 'emergency', emoji: '🚑', word: 'cấp cứu', meaning: '응급', pronunciation: '[껍 끄우]' },
  { id: 'vw-vn-emergency-12', countryId: 'vn', unitId: 'emergency', emoji: '🏛️', word: 'sứ quán', meaning: '대사관', pronunciation: '[스 꽌]' },
];

export const VN_EXPRESSIONS: VocabExpression[] = [
  /* 1. 공항 */
  { id: 've-vn-airport-01', countryId: 'vn', unitId: 'airport', text: 'Nhà vệ sinh ở đâu?', meaning: '화장실이 어디예요?', pronunciation: '[냐 베 신 어 더우?]', wordIds: ['vw-vn-airport-08'], phraseId: 'vn-08' },
  { id: 've-vn-airport-02', countryId: 'vn', unitId: 'airport', text: 'Hành lý của tôi đâu?', meaning: '제 짐이 어디 있어요?', pronunciation: '[행 리 꾸어 또이 더우?]', wordIds: ['vw-vn-airport-04'] },
  { id: 've-vn-airport-03', countryId: 'vn', unitId: 'airport', text: 'Chỗ ngồi của tôi đâu?', meaning: '제 자리가 어디예요?', pronunciation: '[쪼 응오이 꾸어 또이 더우?]', wordIds: ['vw-vn-airport-05'] },
  { id: 've-vn-airport-04', countryId: 'vn', unitId: 'airport', text: 'Đây là hộ chiếu tôi.', meaning: '여권 여기 있어요.', pronunciation: '[더이 라 호 찌에우 또이]', wordIds: ['vw-vn-airport-02'] },
  { id: 've-vn-airport-05', countryId: 'vn', unitId: 'airport', text: 'Tôi bị trễ rồi.', meaning: '저 늦었어요.', pronunciation: '[또이 비 쩨 조이]', wordIds: ['vw-vn-airport-10'] },
  { id: 've-vn-airport-06', countryId: 'vn', unitId: 'airport', text: 'Mấy giờ khởi hành?', meaning: '몇 시에 출발해요?', pronunciation: '[머이 지어 커이 하잉?]', wordIds: ['vw-vn-airport-09', 'vw-vn-airport-11'] },

  /* 2. 호텔 */
  { id: 've-vn-hotel-01', countryId: 'vn', unitId: 'hotel', text: 'Cho tôi chìa khóa.', meaning: '열쇠 주세요.', pronunciation: '[쪼 또이 찌아 코아]', wordIds: ['vw-vn-hotel-02'] },
  { id: 've-vn-hotel-02', countryId: 'vn', unitId: 'hotel', text: 'Mật khẩu Wi-Fi là gì?', meaning: '와이파이 비밀번호가 뭐예요?', pronunciation: '[맛 커우 와이파이 라 지?]', wordIds: ['vw-vn-hotel-08'], phraseId: 'vn-hot-03' },
  { id: 've-vn-hotel-03', countryId: 'vn', unitId: 'hotel', text: 'Cho tôi thêm khăn tắm.', meaning: '수건 더 주세요.', pronunciation: '[쪼 또이 템 칸 땀]', wordIds: ['vw-vn-hotel-05'] },
  { id: 've-vn-hotel-04', countryId: 'vn', unitId: 'hotel', text: 'Máy lạnh bị hư rồi.', meaning: '에어컨이 고장 났어요.', pronunciation: '[마이 라잉 비 흐 조이]', wordIds: ['vw-vn-hotel-07', 'vw-vn-hotel-11'] },
  { id: 've-vn-hotel-05', countryId: 'vn', unitId: 'hotel', text: 'Mấy giờ có ăn sáng?', meaning: '아침밥 몇 시예요?', pronunciation: '[메이 지어 꼬 안 상?]', wordIds: ['vw-vn-hotel-09'], phraseId: 'vn-hot-06' },
  { id: 've-vn-hotel-06', countryId: 'vn', unitId: 'hotel', text: 'Phòng tôi nóng quá.', meaning: '방이 너무 더워요.', pronunciation: '[퐁 또이 농 꽈]', wordIds: ['vw-vn-hotel-01', 'vw-vn-hotel-12'] },

  /* 3. 택시·이동 */
  { id: 've-vn-transport-01', countryId: 'vn', unitId: 'transport', text: 'Cho tôi dừng ở đây!', meaning: '여기 세워주세요!', pronunciation: '[쪼 또이 등 어 데이!]', wordIds: ['vw-vn-transport-08'], phraseId: 'vn-01' },
  { id: 've-vn-transport-02', countryId: 'vn', unitId: 'transport', text: 'Rẽ trái ở đây.', meaning: '여기서 왼쪽이요.', pronunciation: '[제 짜이 어 더이]', wordIds: ['vw-vn-transport-05'] },
  { id: 've-vn-transport-03', countryId: 'vn', unitId: 'transport', text: 'Đi thẳng.', meaning: '직진해 주세요.', pronunciation: '[디 탕]', wordIds: ['vw-vn-transport-07'], phraseId: 'vn-tra-03' },
  { id: 've-vn-transport-04', countryId: 'vn', unitId: 'transport', text: 'Đi mất bao lâu?', meaning: '얼마나 걸려요?', pronunciation: '[디 멋 바오 러우?]', wordIds: ['vw-vn-transport-10'], phraseId: 'vn-tra-05' },
  { id: 've-vn-transport-05', countryId: 'vn', unitId: 'transport', text: 'Bật đồng hồ lên!', meaning: '미터기 켜주세요!', pronunciation: '[밧 동 호 렌!]', wordIds: ['vw-vn-transport-11'] },
  { id: 've-vn-transport-06', countryId: 'vn', unitId: 'transport', text: 'Ở đây có gần không?', meaning: '여기서 가까워요?', pronunciation: '[어 더이 꼬 건 콤?]', wordIds: ['vw-vn-transport-09'] },

  /* 4. 식당 */
  { id: 've-vn-restaurant-01', countryId: 'vn', unitId: 'restaurant', text: 'Tính tiền!', meaning: '계산해 주세요!', pronunciation: '[띤 띠엔!]', wordIds: ['vw-vn-restaurant-08'], phraseId: 'vn-06' },
  { id: 've-vn-restaurant-02', countryId: 'vn', unitId: 'restaurant', text: 'Cho tôi cái muỗng.', meaning: '숟가락 주세요.', pronunciation: '[쪼 또이 까이 무옹]', wordIds: ['vw-vn-restaurant-04'] },
  { id: 've-vn-restaurant-03', countryId: 'vn', unitId: 'restaurant', text: 'Không cay nhé.', meaning: '맵지 않게 해주세요.', pronunciation: '[콤 까이 냬]', wordIds: ['vw-vn-restaurant-10'], phraseId: 'vn-foo-01' },
  { id: 've-vn-restaurant-04', countryId: 'vn', unitId: 'restaurant', text: 'Cho tôi mang về.', meaning: '포장해 주세요.', pronunciation: '[쪼 또이 망 베]', wordIds: ['vw-vn-restaurant-11'], phraseId: 'vn-foo-02' },
  { id: 've-vn-restaurant-05', countryId: 'vn', unitId: 'restaurant', text: 'Cho tôi thêm cơm.', meaning: '밥 더 주세요.', pronunciation: '[쪼 또이 템 껌]', wordIds: ['vw-vn-restaurant-07'] },
  { id: 've-vn-restaurant-06', countryId: 'vn', unitId: 'restaurant', text: 'Ngon lắm!', meaning: '정말 맛있어요!', pronunciation: '[응온 람!]', wordIds: ['vw-vn-restaurant-09'], phraseId: 'vn-05' },

  /* 5. 음식·음료 */
  { id: 've-vn-food-01', countryId: 'vn', unitId: 'food', text: 'Cho tôi xin nước.', meaning: '물 좀 주세요.', pronunciation: '[쪼 또이 신 느억]', wordIds: ['vw-vn-food-01'], phraseId: 'vn-trk-05' },
  { id: 've-vn-food-02', countryId: 'vn', unitId: 'food', text: 'Một cà phê sữa đá.', meaning: '연유 아이스커피 하나요.', pronunciation: '[못 까 페 쓰어 다]', wordIds: ['vw-vn-food-02', 'vw-vn-food-10'] },
  { id: 've-vn-food-03', countryId: 'vn', unitId: 'food', text: 'Tôi không ăn thịt heo.', meaning: '돼지고기는 안 먹어요.', pronunciation: '[또이 콤 안 팃 헤오]', wordIds: ['vw-vn-food-04'] },
  { id: 've-vn-food-04', countryId: 'vn', unitId: 'food', text: 'Cho tôi một bánh mì.', meaning: '반미 하나 주세요.', pronunciation: '[쪼 또이 못 반 미]', wordIds: ['vw-vn-food-09'] },
  { id: 've-vn-food-05', countryId: 'vn', unitId: 'food', text: 'Cho tôi hai bia.', meaning: '맥주 두 병 주세요.', pronunciation: '[쪼 또이 하이 비어]', wordIds: ['vw-vn-food-11'] },
  { id: 've-vn-food-06', countryId: 'vn', unitId: 'food', text: 'Trái cây này ngon không?', meaning: '이 과일 맛있어요?', pronunciation: '[짜이 꺼이 나이 응온 콤?]', wordIds: ['vw-vn-food-07'] },

  /* 6. 시장·흥정 */
  { id: 've-vn-market-01', countryId: 'vn', unitId: 'market', text: 'Bao nhiêu tiền?', meaning: '얼마예요?', pronunciation: '[바오 니에우 띠엔?]', wordIds: ['vw-vn-market-01', 'vw-vn-market-02'], phraseId: 'vn-02' },
  { id: 've-vn-market-02', countryId: 'vn', unitId: 'market', text: 'Đắt quá, giảm giá đi!', meaning: '너무 비싸요, 깎아주세요!', pronunciation: '[닷 꽈, 잠 자 디!]', wordIds: ['vw-vn-market-04', 'vw-vn-market-07'], phraseId: 'vn-03' },
  { id: 've-vn-market-03', countryId: 'vn', unitId: 'market', text: 'Giảm giá được không?', meaning: '깎아주실 수 있나요?', pronunciation: '[잠 자 드억 콤?]', wordIds: ['vw-vn-market-07'], phraseId: 'vn-bar-01' },
  { id: 've-vn-market-04', countryId: 'vn', unitId: 'market', text: 'Tôi không có tiền lẻ.', meaning: '잔돈이 없어요.', pronunciation: '[또이 콤 꼬 띠엔 레]', wordIds: ['vw-vn-market-01'], phraseId: 'vn-bar-03' },
  { id: 've-vn-market-05', countryId: 'vn', unitId: 'market', text: 'Tôi mua cái này.', meaning: '이거 살게요.', pronunciation: '[또이 무어 까이 나이]', wordIds: ['vw-vn-market-08', 'vw-vn-market-12'] },
  { id: 've-vn-market-06', countryId: 'vn', unitId: 'market', text: 'Cho tôi xin tiền thừa.', meaning: '거스름돈 주세요.', pronunciation: '[쪼 또이 신 띠엔 트어]', wordIds: ['vw-vn-market-06'] },

  /* 7. 관광 */
  { id: 've-vn-sightseeing-01', countryId: 'vn', unitId: 'sightseeing', text: 'Chụp ảnh giúp tôi với.', meaning: '사진 좀 찍어주세요.', pronunciation: '[쭙 아잉 줍 또이 버이]', wordIds: ['vw-vn-sightseeing-05'] },
  { id: 've-vn-sightseeing-02', countryId: 'vn', unitId: 'sightseeing', text: 'Ở đây đẹp quá!', meaning: '여기 정말 예뻐요!', pronunciation: '[어 더이 뎁 꽈!]', wordIds: ['vw-vn-sightseeing-11'], phraseId: 'vn-soc-05' },
  { id: 've-vn-sightseeing-03', countryId: 'vn', unitId: 'sightseeing', text: 'Tôi không biết bơi.', meaning: '저는 수영을 못해요.', pronunciation: '[또이 콤 비엣 버이]', wordIds: ['vw-vn-sightseeing-12'], phraseId: 'vn-boa-02' },
  { id: 've-vn-sightseeing-04', countryId: 'vn', unitId: 'sightseeing', text: 'Chúng ta đi biển nhé.', meaning: '바다에 가요.', pronunciation: '[쭝 따 디 비엔 냬]', wordIds: ['vw-vn-sightseeing-01'] },
  { id: 've-vn-sightseeing-05', countryId: 'vn', unitId: 'sightseeing', text: 'Ngày mai có mưa không?', meaning: '내일 비 와요?', pronunciation: '[응아이 마이 꼬 므어 콤?]', wordIds: ['vw-vn-sightseeing-10'] },
  { id: 've-vn-sightseeing-06', countryId: 'vn', unitId: 'sightseeing', text: 'Cho tôi xin bản đồ.', meaning: '지도 주세요.', pronunciation: '[쪼 또이 신 반 도]', wordIds: ['vw-vn-sightseeing-06'] },

  /* 8. 마사지·스파 */
  { id: 've-vn-massage-01', countryId: 'vn', unitId: 'massage', text: 'Đau quá.', meaning: '아파요.', pronunciation: '[다우 꽈]', wordIds: ['vw-vn-massage-08'], phraseId: 'vn-spa-05' },
  { id: 've-vn-massage-02', countryId: 'vn', unitId: 'massage', text: 'Làm mạnh hơn chút.', meaning: '조금 더 세게 해주세요.', pronunciation: '[람 마잉 헌 쭛]', wordIds: ['vw-vn-massage-09'] },
  { id: 've-vn-massage-03', countryId: 'vn', unitId: 'massage', text: 'Làm nhẹ hơn chút.', meaning: '조금 약하게 해주세요.', pronunciation: '[람 녜 헌 쭛]', wordIds: ['vw-vn-massage-10'] },
  { id: 've-vn-massage-04', countryId: 'vn', unitId: 'massage', text: 'Vai tôi đau.', meaning: '어깨가 아파요.', pronunciation: '[바이 또이 다우]', wordIds: ['vw-vn-massage-03', 'vw-vn-massage-08'], phraseId: 'vn-spa-06' },
  { id: 've-vn-massage-05', countryId: 'vn', unitId: 'massage', text: 'Xong chưa ạ?', meaning: '끝났어요?', pronunciation: '[송 쯔어 아?]', wordIds: ['vw-vn-massage-12'] },
  { id: 've-vn-massage-06', countryId: 'vn', unitId: 'massage', text: 'Mát xa lưng nhé.', meaning: '등 마사지해 주세요.', pronunciation: '[맛 사 릉 냬]', wordIds: ['vw-vn-massage-01', 'vw-vn-massage-04'] },

  /* 9. 친구 사귀기 */
  { id: 've-vn-friends-01', countryId: 'vn', unitId: 'friends', text: 'Xin chào!', meaning: '안녕하세요!', pronunciation: '[씬 짜오!]', wordIds: ['vw-vn-friends-01'], phraseId: 'vn-soc-01' },
  { id: 've-vn-friends-02', countryId: 'vn', unitId: 'friends', text: 'Bạn tên là gì?', meaning: '이름이 뭐예요?', pronunciation: '[반 뗀 라 지?]', wordIds: ['vw-vn-friends-03', 'vw-vn-friends-04'] },
  { id: 've-vn-friends-03', countryId: 'vn', unitId: 'friends', text: 'Tôi là người Hàn Quốc.', meaning: '저는 한국 사람이에요.', pronunciation: '[또이 라 응어이 한 꾸옥]', wordIds: ['vw-vn-friends-06'] },
  { id: 've-vn-friends-04', countryId: 'vn', unitId: 'friends', text: 'Chúng ta làm bạn nhé?', meaning: '우리 친구 해요.', pronunciation: '[쭝 따 람 반 냬?]', wordIds: ['vw-vn-friends-04'], phraseId: 'vn-13' },
  { id: 've-vn-friends-05', countryId: 'vn', unitId: 'friends', text: 'Cảm ơn nhiều!', meaning: '정말 감사합니다!', pronunciation: '[깜 언 니에우!]', wordIds: ['vw-vn-friends-02'], phraseId: 'vn-12' },
  { id: 've-vn-friends-06', countryId: 'vn', unitId: 'friends', text: 'Hẹn gặp lại nhé!', meaning: '또 만나요!', pronunciation: '[헨 갑 라이 냬!]', wordIds: ['vw-vn-friends-12'] },

  /* 10. 비상 */
  { id: 've-vn-emergency-01', countryId: 'vn', unitId: 'emergency', text: 'Cứu tôi với!', meaning: '도와주세요!', pronunciation: '[끄우 또이 버이!]', wordIds: ['vw-vn-emergency-01'], phraseId: 'vn-09' },
  { id: 've-vn-emergency-02', countryId: 'vn', unitId: 'emergency', text: 'Gọi cảnh sát giúp tôi.', meaning: '경찰 좀 불러주세요.', pronunciation: '[고이 까잉 삿 줍 또이]', wordIds: ['vw-vn-emergency-02'] },
  { id: 've-vn-emergency-03', countryId: 'vn', unitId: 'emergency', text: 'Tôi cần gặp bác sĩ.', meaning: '의사가 필요해요.', pronunciation: '[또이 껀 갑 박 시]', wordIds: ['vw-vn-emergency-03'], phraseId: 'vn-eme-03' },
  { id: 've-vn-emergency-04', countryId: 'vn', unitId: 'emergency', text: 'Nhà thuốc ở đâu?', meaning: '약국이 어디예요?', pronunciation: '[냐 투옥 어 더우?]', wordIds: ['vw-vn-emergency-05'], phraseId: 'vn-eme-05' },
  { id: 've-vn-emergency-05', countryId: 'vn', unitId: 'emergency', text: 'Ví của tôi bị mất.', meaning: '지갑을 잃어버렸어요.', pronunciation: '[비 꾸어 또이 비 멋]', wordIds: ['vw-vn-emergency-08', 'vw-vn-emergency-09'] },
  { id: 've-vn-emergency-06', countryId: 'vn', unitId: 'emergency', text: 'Tôi bị sốt cao.', meaning: '열이 많이 나요.', pronunciation: '[또이 비 솟 까오]', wordIds: ['vw-vn-emergency-07'] },
];

export const VN_DIALOGS: VocabDialog[] = [
  {
    id: 'vd-vn-airport', countryId: 'vn', unitId: 'airport', title: '체크인 카운터 찾기',
    lines: [
      { speaker: 'me', text: 'Quầy làm thủ tục ở đâu?', meaning: '체크인 카운터가 어디예요?', pronunciation: '[꽈이 람 투 뚝 어 더우?]', phraseId: 'vn-air-01' },
      { speaker: 'them', text: 'Đi thẳng rồi rẽ trái.', meaning: '직진하다가 왼쪽이요.', pronunciation: '[디 탕 조이 제 짜이]' },
      { speaker: 'me', text: 'Cảm ơn. Tôi bị trễ.', meaning: '감사합니다. 저 늦었어요.', pronunciation: '[깜 언. 또이 비 쩨]' },
      { speaker: 'them', text: 'Nhanh lên nhé, anh.', meaning: '서두르세요.', pronunciation: '[냐잉 렌 냬, 아잉]' },
    ],
  },
  {
    id: 'vd-vn-hotel', countryId: 'vn', unitId: 'hotel', title: '체크인 하기',
    lines: [
      { speaker: 'me', text: 'Tôi muốn nhận phòng.', meaning: '체크인할게요.', pronunciation: '[또이 무온 년 퐁]' },
      { speaker: 'them', text: 'Cho tôi xem hộ chiếu.', meaning: '여권 보여주세요.', pronunciation: '[쪼 또이 셈 호 찌에우]' },
      { speaker: 'me', text: 'Đây ạ. Hai đêm.', meaning: '여기요. 두 밤이요.', pronunciation: '[더이 아. 하이 뎀]' },
      { speaker: 'them', text: 'Chìa khóa phòng của anh.', meaning: '방 열쇠입니다.', pronunciation: '[찌아 코아 퐁 꾸어 아잉]' },
    ],
  },
  {
    id: 'vd-vn-transport', countryId: 'vn', unitId: 'transport', title: '택시 타기',
    lines: [
      { speaker: 'me', text: 'Cho tôi đến chợ Hàn.', meaning: '한 시장으로 가주세요.', pronunciation: '[쪼 또이 덴 쩌 한]' },
      { speaker: 'them', text: 'Vâng, hai mươi ngàn.', meaning: '네, 2만 동이요.', pronunciation: '[벙, 하이 므어이 응안]' },
      { speaker: 'me', text: 'Bật đồng hồ mét lên!', meaning: '미터기 켜주세요!', pronunciation: '[밧 동 호 멧 렌!]', phraseId: 'vn-07' },
      { speaker: 'them', text: 'Rồi ạ. Đi thẳng nhé.', meaning: '네. 직진할게요.', pronunciation: '[조이 아. 디 탕 냬]' },
    ],
  },
  {
    id: 'vd-vn-restaurant', countryId: 'vn', unitId: 'restaurant', title: '주문하기',
    lines: [
      { speaker: 'me', text: 'Cho tôi xem thực đơn.', meaning: '메뉴 보여주세요.', pronunciation: '[쪼 또이 셈 특 던]' },
      { speaker: 'them', text: 'Đây ạ. Anh dùng gì?', meaning: '여기요. 뭐 드릴까요?', pronunciation: '[더이 아. 아잉 줌 지?]' },
      { speaker: 'me', text: 'Một phở bò, không cay.', meaning: '소고기 쌀국수 하나, 안 맵게요.', pronunciation: '[못 퍼 보, 콤 까이]' },
      { speaker: 'them', text: 'Vâng, đợi một chút ạ.', meaning: '네, 잠시만요.', pronunciation: '[벙, 더이 못 쭛 아]' },
    ],
  },
  {
    id: 'vd-vn-food', countryId: 'vn', unitId: 'food', title: '길거리 음식 사기',
    lines: [
      { speaker: 'me', text: 'Cái này là gì vậy?', meaning: '이게 뭐예요?', pronunciation: '[까이 나이 라 지 버이?]' },
      { speaker: 'them', text: 'Bánh mì thịt, ngon lắm.', meaning: '반미예요, 정말 맛있어요.', pronunciation: '[반 미 팃, 응온 람]' },
      { speaker: 'me', text: 'Cho tôi hai cái.', meaning: '두 개 주세요.', pronunciation: '[쪼 또이 하이 까이]' },
      { speaker: 'them', text: 'Bốn mươi ngàn đồng ạ.', meaning: '4만 동이에요.', pronunciation: '[본 므어이 응안 동 아]' },
    ],
  },
  {
    id: 'vd-vn-market', countryId: 'vn', unitId: 'market', title: '값 깎기',
    lines: [
      { speaker: 'me', text: 'Đôi giày này bao nhiêu?', meaning: '이 신발 얼마예요?', pronunciation: '[도이 자이 나이 바오 니에우?]' },
      { speaker: 'them', text: 'Năm trăm ngàn đồng.', meaning: '50만 동이요.', pronunciation: '[남 짬 응안 동]' },
      { speaker: 'me', text: 'Đắt quá! Giảm giá đi.', meaning: '너무 비싸요! 깎아주세요.', pronunciation: '[닷 꽈! 잠 자 디]' },
      { speaker: 'them', text: 'Bốn trăm, được không?', meaning: '40만, 어때요?', pronunciation: '[본 짬, 드억 콤?]' },
    ],
  },
  {
    id: 'vd-vn-sightseeing', countryId: 'vn', unitId: 'sightseeing', title: '사진 부탁하기',
    lines: [
      { speaker: 'me', text: 'Chụp ảnh giúp tôi với.', meaning: '사진 좀 찍어주세요.', pronunciation: '[쭙 아잉 줍 또이 버이]' },
      { speaker: 'them', text: 'Được. Một, hai, ba!', meaning: '네. 하나, 둘, 셋!', pronunciation: '[드억. 못, 하이, 바!]' },
      { speaker: 'me', text: 'Cảm ơn! Ở đây đẹp quá!', meaning: '감사합니다! 여기 예뻐요!', pronunciation: '[깜 언! 어 더이 뎁 꽈!]' },
      { speaker: 'them', text: 'Vâng, biển Đà Nẵng đẹp lắm.', meaning: '네, 다낭 바다가 예뻐요.', pronunciation: '[벙, 비엔 다 낭 뎁 람]' },
    ],
  },
  {
    id: 'vd-vn-massage', countryId: 'vn', unitId: 'massage', title: '마사지 받기',
    lines: [
      { speaker: 'me', text: 'Một tiếng bao nhiêu tiền?', meaning: '한 시간에 얼마예요?', pronunciation: '[못 띠엥 바오 뇨 띠엔?]', phraseId: 'vn-spa-02' },
      { speaker: 'them', text: 'Ba trăm ngàn một tiếng.', meaning: '한 시간에 30만 동이요.', pronunciation: '[바 짬 응안 못 띠엥]' },
      { speaker: 'me', text: 'Được. Mát xa lưng nhé.', meaning: '좋아요. 등 마사지요.', pronunciation: '[드억. 맛 사 릉 냬]' },
      { speaker: 'them', text: 'Anh nằm xuống đây ạ.', meaning: '여기 누우세요.', pronunciation: '[아잉 남 수옹 더이 아]' },
    ],
  },
  {
    id: 'vd-vn-friends', countryId: 'vn', unitId: 'friends', title: '인사하고 친해지기',
    lines: [
      { speaker: 'me', text: 'Xin chào! Tôi là Minji.', meaning: '안녕하세요! 저는 민지예요.', pronunciation: '[씬 짜오! 또이 라 민지]' },
      { speaker: 'them', text: 'Chào bạn! Bạn từ đâu?', meaning: '안녕하세요! 어디서 왔어요?', pronunciation: '[짜오 반! 반 뜨 더우?]' },
      { speaker: 'me', text: 'Tôi đến từ Hàn Quốc.', meaning: '한국에서 왔어요.', pronunciation: '[또이 덴 뜨 한 꾸옥]' },
      { speaker: 'them', text: 'Rất vui được gặp bạn.', meaning: '만나서 반가워요.', pronunciation: '[젓 부이 드억 갑 반]' },
    ],
  },
  {
    id: 'vd-vn-emergency', countryId: 'vn', unitId: 'emergency', title: '도와달라고 하기',
    lines: [
      { speaker: 'me', text: 'Cứu tôi với!', meaning: '도와주세요!', pronunciation: '[끄우 또이 버이!]', phraseId: 'vn-09' },
      { speaker: 'them', text: 'Có chuyện gì vậy?', meaning: '무슨 일이에요?', pronunciation: '[꼬 쭈옌 지 버이?]' },
      { speaker: 'me', text: 'Ví của tôi bị mất.', meaning: '지갑을 잃어버렸어요.', pronunciation: '[비 꾸어 또이 비 멋]' },
      { speaker: 'them', text: 'Tôi gọi cảnh sát nhé.', meaning: '경찰 부를게요.', pronunciation: '[또이 고이 까잉 삿 냬]' },
    ],
  },
];
