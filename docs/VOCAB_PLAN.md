# 어휘 학습 모드 설계 (초등 수준 · 상황별 단원)

> 작성: Claude Fable 5.1 (설계) · 구현: Opus/Sonnet 에이전트 · 2026-09-11

## 1. 목표

"상황별 문장을 찾아 보여주는 앱"에서 **"상황 단원별로 쉬운 단어부터 차근차근 익히고, 필요한 것을 저장해 반복하는 앱"** 으로 바꿉니다.
초등학교 영어 교과서 방식입니다 — 한 단원 = 한 상황, 안에서 **단어 → 짧은 말 → 대화** 3단계.

바뀌지 않는 것: 긴급 전광판, 일정표, 파티/아케이드 게임, 기존 문장 데이터 파일(`src/data/phrases*.ts`), 기존 북마크 저장 키.

## 2. 단원 (10개, 여행 흐름 순)

| order | id | 제목 | 이모지 | 기존 카테고리 |
|---|---|---|---|---|
| 1 | airport | 공항 | ✈️ | 항공 |
| 2 | hotel | 호텔 | 🏨 | 호텔 |
| 3 | transport | 택시·이동 | 🚕 | 교통 |
| 4 | restaurant | 식당 | 🍽️ | 식당 |
| 5 | food | 음식·음료 | 🍜 | 음식 |
| 6 | market | 시장·흥정 | 🛍️ | 흥정 |
| 7 | sightseeing | 관광 | 🏝️ | 관광 |
| 8 | massage | 마사지·스파 | 💆 | 마사지 |
| 9 | friends | 친구 사귀기 | 🤝 | 미팅/사교 |
| 10 | emergency | 비상 | 🆘 | 비상 |

## 3. 초등 수준 원칙 (데이터·UI 공통)

- 단원당 **단어 12개**, 짧은 말 **6개**, 대화 **1개(4줄)**. 언어당 단어 120개. 많이가 아니라 "다 외울 수 있는 양".
- 모든 단어에 **이모지 1개**. 글자만 있는 카드 금지.
- 단어는 **1~2 단어**, 짧은 말은 **2~5 단어**, 대화 한 줄은 **6 단어 이하**.
- 한글 발음 `[ ]` 을 크게, 원문은 그 아래. 문법·성조·존댓말 설명은 `tip` 한 줄로만, UI 에선 접어둠.
- 필리핀(`ph`)은 **타갈로그 + 영어 병기**(`wordEn`/`textEn`). 현지에서 둘 다 통합니다. 영어 트랙(`en`) 화면에서는 같은 ph 데이터를 영어 우선으로 보여줍니다.
- 베트남(`vn`)은 베트남어만.
- 기존 문장 중 짧은 것은 `phraseId` 로 연결해 오디오·전광판을 재사용합니다.

## 4. 데이터 모델 (`src/types.ts` 에 추가됨 — 수정 금지, 필요하면 설계자에게)

```ts
VocabUnitId, VocabUnit, VocabWord, VocabExpression, VocabDialog, VocabDialogLine
```

- id 규칙: 단어 `vw-{country}-{unit}-{nn}`, 짧은 말 `ve-{country}-{unit}-{nn}`, 대화 `vd-{country}-{unit}`. nn 은 01 부터.
- `src/data/vocab/index.ts` 가 `VOCAB_UNITS`, `VOCAB_WORDS`, `VOCAB_EXPRESSIONS`, `VOCAB_DIALOGS` 를 내보냅니다. UI 는 여기서만 읽습니다.
- 오디오: id 가 그대로 `AUDIO_FILES` 키가 됩니다. ph 단어의 영어 발음은 `{id}-en` 키.

## 5. 저장 (모두 localStorage, 서버 없음)

| 키 | 내용 |
|---|---|
| `gijo_vocab_saved_v1` | 저장한 항목 id 배열 (단어·짧은 말·대화 공통) |
| `gijo_vocab_progress_v1` | `{ [id]: { seen, correct, wrong, lastAt } }` |
| `gijo_vocab_unit_done_v1` | 도장 찍은 단원 id 배열 (`{country}:{unit}`) |

기존 `quickpass_bookmarks_v1`(문장 북마크)는 건드리지 않습니다.

## 6. 화면

하단 탭 5개: **배우기(learn)** · 회화(translate) · 일정 · 보관함 · 긴급. 앱 첫 화면은 배우기.

### 배우기 탭
1. **단원 목록**: 카드 10개(이모지·제목·진행률 바·도장). 헤더의 나라 선택을 그대로 따릅니다.
2. **단원 화면**: 상단에 3단계 탭 `단어 · 짧은 말 · 대화`, 각 단계에 완료 체크.
   - **단어**: 한 화면에 한 장. 앞면 = 이모지(크게) + 발음 `[ ]` + 원문, 탭하면 뒷면 = 뜻 + tip. 재생 ▶, 저장 ★, 이전/다음. 진행 점(1/12).
   - **짧은 말**: 목록형 카드 6개. 재생·저장·전광판(기존 `BillboardModal` 재사용, `phraseId` 있으면 그 문장으로).
   - **대화**: 두 사람 말풍선 4줄. 줄마다 재생. "전체 듣기" 는 순서대로 재생.
3. 단계 3개를 다 보면 "다 배웠어요 🎉" 도장 + 단원 목록으로.

### 보관함 탭
- 위: **내 단어장**(저장한 단어·짧은 말·대화, 단원별 묶음, 최근순/단원순).
- **복습하기** 버튼 → 퀴즈 모드: (a) 이모지+소리 보고 뜻 4지선다, (b) 뜻 보고 발음 보기 → "알아요/몰라요". 몰라요 항목이 먼저 다시 나옴(`wrong` 큰 순). 10문제 한 세트, 끝나면 점수.
- 아래: 기존 문장 보관함 그대로.

### 오디오
- `utils/speech.playPhrase` 는 `Phrase` 를 받습니다. `utils/vocab.ts` 의 `vocabAsPhrase(item, primary: 'local'|'en')` 로 변환해 재사용합니다(`id`, `original`, `translation`, `pronunciation`, `countryId`, `category`).
- 오디오 파일이 없으면 브라우저 TTS 로 자동 폴백(기존 동작). 타갈로그는 브라우저 음성이 없으므로 Google TTS 로 파일을 생성해야 합니다 — `npm run audio -- --backend=google --vocab`.

## 7. 파일 소유 (병렬 작업 충돌 방지)

| 담당 | 파일 |
|---|---|
| 설계자(Fable) | `docs/VOCAB_PLAN.md`, `src/types.ts` 어휘 타입, `src/data/vocab/index.ts` 골격 |
| DATA 에이전트 | `src/data/vocab/**` (index.ts 포함, 골격의 export 이름 유지), `src/data/vocab/vocab.test.ts`, `scripts/generate-audio.ts` 의 `--vocab` 확장 |
| UI 에이전트 | `src/components/learn/**`, `src/components/BottomNav.tsx`, `src/App.tsx`, `src/utils/vocab.ts`(+test), 보관함 섹션, 관련 테스트 |

## 8. 완료 기준

- `npm run lint` 오류 0, `npm test` 전부 통과, `npm run build` 통과.
- 브라우저에서: 배우기 → 단원 → 단어 카드 뒤집기·저장 → 보관함에 표시 → 복습 퀴즈 10문제 완료.
- 어휘 데이터 테스트: id 중복 없음, 단원당 개수 정확, `phraseId`·`wordIds` 가 실제로 존재, 모든 단어에 이모지·발음 존재.
