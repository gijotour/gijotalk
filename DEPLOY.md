# GIJO Talk 배포 가이드

지인 배포용 체크리스트입니다. **HTTPS가 아니면 PWA 설치도, 서비스 워커도 동작하지 않습니다.**

---

## 1. 배포 전 확인

```bash
npm ci
npm run lint          # tsc --noEmit
npm test              # vitest — 57개 테스트
npm run audio:check   # 오디오와 문장 데이터 일치 확인
npm run build         # dist/ 생성
npm start             # NODE_ENV=production 으로 로컬 확인 → http://localhost:3000
```

### 테스트가 지키고 있는 것

`npm test` 는 과거에 실제로 났던 버그의 회귀를 막습니다. 배포 전에 반드시 통과시키세요.

| 파일 | 지키는 것 |
|---|---|
| `useListeningPlayer.test.tsx` | 연속 듣기가 한 문장 만에 멈추지 않을 것 (stale closure), 재생 중 설정 변경 반영, **플레이어를 닫아도 재생 지속** |
| `Modal.test.tsx` | ESC·포커스 트랩·배경 스크롤 잠금·포커스 복원 |
| `pwa.test.ts` | 북마크 저장/읽기 키 일치(Drive 복원 유실), 카톡 인앱 브라우저 감지 |
| `App.test.tsx` | 탭 3개, 미니 플레이어 인수인계, 모달 5개가 모두 dialog 로 열릴 것 |
| `analytics.test.ts` | 껐을 때 정말 안 보낼 것, 오프라인 기록이 유실되지 않을 것 |

### 오디오는 반드시 커밋되어 있어야 합니다

`public/audio/` 의 169개 파일은 **저장소에 커밋된 상태로 배포**됩니다.

생성 스크립트가 macOS의 `say` 명령을 쓰기 때문에 리눅스 컨테이너 안에서는 재생성할 수 없습니다.
Dockerfile도 `npm run build`만 실행하고 오디오는 만들지 않습니다.

```bash
npm run audio                          # macOS 내장 음성 (기본)
npm run audio -- --force               # 전부 다시 생성
npm run audio -- --backend=google      # 실제 필리핀어 음성 (GOOGLE_TTS_API_KEY 필요)
```

문장을 추가하거나 고쳤다면 `npm run audio`를 다시 돌리고 **커밋**하세요.

---

## 2. 배포 대상 두 가지

| | GitHub Pages | Cloud Run |
|---|---|---|
| 링크 | `https://gijotour.github.io/gijotlak/` | `https://gijo-talk-xxxx.a.run.app` |
| 배포 | **push 하면 자동** | `gcloud run deploy` 수동 |
| 회화·발음·오프라인·설치 | ✅ | ✅ |
| 전광판·연속듣기·북마크 | ✅ | ✅ |
| AI 맞춤 회화 | ❌ 서버 필요 | ✅ |
| 사용 기록 수집 | ❌ 서버 필요 | ✅ |
| 접근 코드 | ❌ 정적이라 무의미 | ✅ |
| Google Drive 백업 | ⚠️ Firebase 승인 도메인 추가 필요 | ✅ |

Pages 빌드는 `VITE_STATIC_BUILD=true` 로 나가서 **서버가 필요한 기능은 버튼째로 숨겨집니다.**
눌렀는데 매번 실패하는 것보다 아예 없는 편이 덜 헷갈리기 때문입니다.

> ⚠️ **Pages 링크는 아는 사람 누구나 접속할 수 있습니다.** 접근 코드가 동작하지 않습니다.
> 회화 데이터가 노출돼도 무해하고 Gemini 비용도 새지 않지만, 공개 게시판에 올리지는 마세요.

### GitHub Pages

`gijotour/클루드` 또는 `main` 에 push 하면 `.github/workflows/pages.yml` 이 자동 배포합니다.
수동 실행: Actions 탭 → Deploy to GitHub Pages → Run workflow

서브패스(`/gijotlak/`)로 서빙되므로 `BASE_PATH` 가 필요합니다. 로컬에서 같은 조건으로 확인하려면:

```bash
BASE_PATH=/gijotlak/ VITE_STATIC_BUILD=true npx vite build
mkdir -p /tmp/pages/gijotlak && cp -R dist/* /tmp/pages/gijotlak/
cd /tmp/pages && python3 -m http.server 4321
# → http://localhost:4321/gijotlak/
```

---

## 3. Cloud Run (전체 기능)

```bash
gcloud run deploy gijo-talk \
  --source . \
  --region asia-northeast3 \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production" \
  --set-secrets "GEMINI_API_KEY=gijo-gemini-key:latest,APP_ACCESS_CODE=gijo-access-code:latest"
```

- `--allow-unauthenticated` 는 필요합니다. Google 로그인 벽이 있으면 PWA 설치와 서비스 워커가 동작하지 않습니다. 접근 제어는 앱의 `APP_ACCESS_CODE` 로 합니다.
- `PORT` 는 Cloud Run이 자동 주입하고 `server.ts` 가 읽습니다.
- 지인 수십 명 규모면 무료 티어 안에서 끝납니다.

### 대안: Vercel / Railway / Fly.io

Express 서버가 필요하므로 정적 호스팅만 되는 곳은 쓸 수 없습니다.
Dockerfile 이 있으니 컨테이너를 받는 곳이면 어디든 됩니다.

---

## 3. 배포 후 반드시 확인할 것

| 확인 | 방법 | 통과 기준 |
|---|---|---|
| 헬스체크 | `curl https://주소/api/health` | `accessCodeRequired: true` |
| 접근코드 | 코드 없이 AI 질문 | 401 |
| 오디오 | `curl -I https://주소/audio/ph/ph-01.m4a` | 200, `immutable` |
| 서비스워커 | Chrome DevTools → Application → Service Workers | **activated and running** |
| Manifest | DevTools → Application → Manifest | 오류 0, 아이콘 3개 표시 |
| 설치 가능 | 안드로이드 Chrome | 주소창에 설치 아이콘 |

> ⚠️ 서비스 워커가 `redundant` 로 뜨면 프리캐시가 실패한 것입니다. Console 로그를 확인하세요.

---

## 4. 지인에게 링크 보내기

### 링크 형식

```
https://<앱주소>/?key=<APP_ACCESS_CODE 값>
```

앱이 첫 실행에 코드를 `localStorage` 에 저장하고 주소창에서 지웁니다.
홈 화면에 추가한 뒤에도 AI 기능이 계속 동작합니다.

### ⚠️ 카카오톡으로 보내지 마세요

카톡 인앱 브라우저에서는

- **"홈 화면에 추가" 메뉴가 없습니다** → 설치 불가
- Firebase 팝업 로그인이 차단됩니다 → Drive 백업 불가

앱이 인앱 브라우저를 감지해 빨간 경고와 "주소 복사" 버튼을 띄우긴 하지만,
**문자나 이메일로 보내는 게 훨씬 확실합니다.**

### 안내 문구 예시

> 필리핀 여행 회화 앱 만들었어. 인터넷 없이도 돼.
> 👉 (링크)
>
> **꼭 카톡 말고 Safari(아이폰)나 Chrome(안드로이드)으로 열어줘.**
> 열면 위에 "홈 화면에 추가" 안내 나오는데 그거 꼭 해줘. 안 하면 현지에서 안 열려.
> 추가하고 나서 "연속듣기" 탭에서 **"받기" 버튼 한 번 눌러줘** (발음 파일 저장, 1.5MB).
> 이거까지 해야 데이터 없이 완전히 돼.

---

## 5. 사용 기록 보기

앱은 5가지만 익명으로 기록합니다. 목적은 대시보드가 아니라 **"다음에 뭘 고칠지 아는 것"** 입니다.

| 이벤트 | 알려주는 것 |
|---|---|
| `search_empty` | 🥇 **검색했는데 결과 0** — 다음에 추가할 문장을 정확히 알려줍니다 |
| `ai_question` | 🥈 AI에 물어본 상황 — 자주 나오면 기본 문장으로 승격 |
| `phrase_play` | 🥉 문장별 재생 횟수 — 실전에서 쓰이는 문장 vs 채워넣은 문장 |
| `billboard_open` | 전광판 실행 — 앱의 핵심 컨셉이 실제로 쓰였는지 |
| `session` | 실행 + 오프라인 여부 + 설치 여부 — **현지에서 실제로 열었는지** |

### ⚠️ 파일이 아니라 stdout 으로 나갑니다

Cloud Run 의 파일시스템은 컨테이너가 재시작되면 사라집니다. 그래서 이벤트를
파일에 쓰지 않고 **stdout 으로 내보내고, Cloud Run 이 Cloud Logging 으로 실어줍니다.**

```bash
# 검색했는데 결과가 없던 쿼리 — 가장 값진 데이터
gcloud logging read \
  'resource.type="cloud_run_revision" AND jsonPayload.gijoEvent.name="search_empty"' \
  --limit 200 --format 'value(jsonPayload.gijoEvent.props.q)' | sort | uniq -c | sort -rn

# 가장 많이 재생된 문장
gcloud logging read 'jsonPayload.gijoEvent.name="phrase_play"' \
  --limit 500 --format 'value(jsonPayload.gijoEvent.props.id)' | sort | uniq -c | sort -rn | head -20

# 현지(오프라인)에서 실제로 쓴 세션
gcloud logging read \
  'jsonPayload.gijoEvent.name="session" AND jsonPayload.gijoEvent.offline=true' \
  --limit 100 --format json
```

로컬에서는 그냥 터미널에 찍힙니다.

### 성공 판정 기준 (미리 정해두세요)

| 단계 | 합격선 |
|---|---|
| 설치 | 링크 연 사람 중 홈화면 추가 **60%** |
| **현지 사용** | 설치자 중 출국 후 실행 **50%** ⭐ 진짜 성공 지표 |
| 실전 사용 | 현지 사용자 중 전광판/재생 3회+ **70%** |
| 데이터 충분성 | `search_empty` 비율 **15% 이하** |

**N=20 규모에서 정량은 보조입니다.** 귀국 3일 이내 5분 통화가 훨씬 정확합니다.
"안 좋았던 것 하나만 꼭 말해줘"라고 명시적으로 요청하세요 — 친구들은 나쁜 말을 안 합니다.

### 프라이버시

- 익명 기기 ID만. 계정·위치·연락처는 수집하지 않습니다.
- 첫 실행에 무엇을 모으는지 고지하고 **"도와줄게요 / 안 보낼래요"** 를 묻습니다.
- 푸터에 항상 켜고 끄는 스위치가 있고, 끄면 아직 안 보낸 기록도 함께 버립니다.
- 오프라인에서 쌓인 기록은 온라인 복귀 시 전송됩니다(현지 기록이 귀국 후 도착).

친구들에게 링크를 보낼 때 이 사실을 한 줄로 알려주세요.

---

## 6. 업데이트 배포

`public/sw.js` 의 `VERSION` 을 올리면 기존 사용자의 캐시가 자동 정리됩니다.

```js
const VERSION = 'v3';   // v2 → v3
```

`index.html` 과 `sw.js` 는 `no-cache` 헤더로 나가므로 새 배포가 바로 반영됩니다.

---

## 7. 나중에 나라 추가하기

`src/config.ts` 한 줄만 고치면 됩니다.

```ts
export const ENABLED_COUNTRY_IDS: CountryId[] = ['ph', 'en'];
// → ['ph', 'en', 'vn', 'th', 'id', 'la']
```

데이터·타입·UI 는 이미 6개 트랙을 전부 지원합니다.
새로 연 나라는 `npm run audio -- --lang=vn` 으로 오디오만 만들어 커밋하면 됩니다.
