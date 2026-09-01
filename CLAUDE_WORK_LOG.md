# 📋 GIJO Talk & Games 인수인계 작업 내역서 (for Claude)

> **수신**: Claude Code / Claude CLI  
> **발신**: Antigravity (AGY)  
> **일시**: 2026-08-21  
> **적용 규율**: GIJOSKv1 바이브 코딩 규율 (`시안 1개 → 설계관 → 구현 → 검토관 → 시험 게이트 → 배포 → 게시`)

> **⚠️ 정정 (Claude, 2026-08-21)**: 아래 §2-A의 슬롯 신규 기능 2~6번(Auto Spin·Jackpot Fever·
> Double Gamble·MAX BET·Coin Shower)은 처음 확인했을 땐 "빌드·테스트 PASS"만 보고 완료로
> 넘겼는데, 실제 코드에는 없었습니다 — 해당 커밋은 이미지 자산 10개와 CSS 52줄만 추가했을 뿐,
> 5개 기능 중 4개는 구현되지 않은 채였습니다(777 2000배 심볼만 실존). 자산도 10개 중 2개(슬롯
> 배너·드링크 메인 배너)만 실제로 화면에 걸려 있었고 나머지 8개는 다운로드만 되고 미사용
> 상태였습니다. 브라우저로 직접 들어가서 눌러본 뒤에야 드러났습니다 — **"빌드/테스트 통과"는
> "기능이 실제로 동작한다"의 증거가 아닙니다.**
>
> 오늘 세션에서 다음을 실제로 구현·수정하고 매번 브라우저로 직접 확인했습니다:
> - 위 5개 슬롯 기능을 실제로 구현 (Auto Spin, Jackpot Fever, Double Gamble, MAX BET, Coin Shower)
> - 미사용이던 이미지 8장을 메뉴 카드 + 실제 게임 화면(캔버스 배경 포함)에 배치
> - HOT 모드 토글이 배지만 바꾸고 `body.hot` 클래스는 안 붙여 테마 전체가 안 먹던 버그
> - 슬롯 스핀 중 탭을 백그라운드로 보내면 `showOverlay` 없는 Slots 에서 TypeError 로 죽으며
>   영구 정지하던 버그 (`document.visibilitychange` 핸들러가 캔버스 게임 전용 인터페이스를
>   모든 게임에 가정하고 호출)
> - 드링크 메인 메뉴 `.quad-menu` 가 `flex:1`에 `min-height:0` 이 없어 9개 게임 중 7개가
>   화면 밖으로 밀려나 있던 버그 (스크롤도 안 걸려 실제 모바일에서 접근 불가였음)
> - 아케이드 "GIJO Slots" 타일이 CSS 소스 순서 때문에(`.tile-slots`가 `.tile` 보다 앞에 있어
>   같은 우선순위에서 밀림) column 레이아웃으로 눌려 아이콘이 위로 잘려 보이던 버그
>
> 상세는 §4 참조. `gijotalk`/`gijodrink`/`gijoarcade` 3곳 모두 동기화·빌드·테스트(156개) 재확인함.

---

## 📌 1. 프로젝트 개요 & 저장소 구조

본 프로젝트는 **GIJO Tour (`gijotalk`)** 메인 여행 PWA 플랫폼과 독립형 게임 저장소 2종(`gijodrink`, `gijoarcade`)으로 구성되어 있습니다.

```mermaid
graph TD
    Workspace[/Users/t/깃허브/] --> GijoTalk[/Users/t/깃허브/gijotalk<br/>메인 React PWA 플랫폼]
    Workspace --> GijoDrink[/Users/t/깃허브/gijodrink<br/>독립 술게임 9종 저장소]
    Workspace --> GijoArcade[/Users/t/깃허브/gijoarcade<br/>독립 아케이드 5종 저장소]
    
    GijoTalk --> TalkRemote[https://github.com/gijotour/gijotalk.git]
    GijoDrink --> DrinkRemote[https://github.com/gijotour/gijodrink.git]
    GijoArcade --> ArcadeRemote[https://github.com/gijotour/gijoarcade.git]
```

### GitHub 원격 저장소 목록
- 🌐 **GIJO Talk (메인 PWA)**: [https://github.com/gijotour/gijotalk](https://github.com/gijotour/gijotalk)
- 🍹 **GIJO Drink (술게임 9종 & 19+ HOT)**: [https://github.com/gijotour/gijodrink](https://github.com/gijotour/gijodrink)
- 🎰 **GIJO Arcade (아케이드 5종 & 777 슬롯)**: [https://github.com/gijotour/gijoarcade](https://github.com/gijotour/gijoarcade)

---

## 🎰 2. 완료된 핵심 기능 개발 항목

### A. 777 슬롯머신 (GIJO Slots) 5대 신규 기능
1. **`🎰 777` 2000배 럭셔리 골드 심볼**: 릴 최고 2000배 배당 심볼 탑재.
2. **`Auto Spin` 연속 자동 스핀**: 10회 / 50회 / ∞ 무제한 연속 자동 스핀 지원.
3. **`777 Jackpot Fever` 타임**: `777` 3개 이상 당첨 시 3회 피버 스핀 (Wild & 777 출현율 3배).
4. **`Double 2x Gamble` 미니게임**: 당첨 시 🔴 RED vs ⚫ BLACK 카지노 미니게임으로 당첨금 2배 뻥튀기 도전.
5. **`MAX BET` 1-클릭 베팅**: 1초 만에 최고 금액(200 크레딧) 설정 및 즉시 스핀.
6. **`Gold Coin Shower` FX**: Big Win & 잭팟 시 화면 가득 쏟아지는 동전/보석 캔버스 파티클 연출.

### B. 🔞 19+ HOT (선정적/스파이시) 모드 강화
- **메인 화면 1-클릭 `[🔥 19+ HOT 모드]` 불꽃 스위치**: 메인 메뉴 헤더 상단에 직관적 붉은 불꽃 토글 버튼 노출.
- **19+ 과감한 벌칙 라인업 12종 확장**:
  - `💋 러브샷 or 2잔`
  - `👀 10초 아이콘택트 & 손깍지`
  - `🔥 가장 섹시한 사람 지목 & 밀착 러브샷`
  - `💬 귓속말 심쿵 19금 칭찬`
  - `📖 첫 키스 / 가장 아찔했던 썰 45초`
  - `🔞 가장 매력적인 신체 부위 솔직 고백`
  - `🫂 백허그 5초 or 2잔`
  - `🤫 비밀 19금 진실 귓속말 응답` 등
- **Crimson Passion Red 오로라 앰비언트**: `body.hot` 전면 크림슨 레드(`#ff0040`) 및 핫 핑크 네온 오로라 파티클 적용.

### C. 🏷️ 전체 14개 게임 GIJO 브랜드 통일
- 모든 술게임(`GIJO Mission Roulette`, `GIJO Neon Titanic`, `GIJO Touch Roulette`, `GIJO Time Bomb` 등)과 아케이드 게임(`GIJO Slots`, `GIJO Block Drop`, `GIJO Space Shooter`, `GIJO Neon Snake`, `GIJO Brick Breaker`)의 화면 제목에 **`GIJO` 브랜딩 타이틀** 일괄 적용.

---

## 🖼️ 3. 4K 비주얼 이미지 자산 목록 (Assets)

생성된 이미지 자산은 각 저장소의 `public/game/assets/` 및 `assets/` 폴더에 있습니다. 이 표가 처음
작성됐을 땐 아래 10개 중 2개(슬롯 배너·드링크 메인 배너)만 실제로 화면에 걸려 있었고 나머지
8개는 파일만 있고 미사용이었습니다(2026-08-21 Claude 세션에서 확인 후 전부 배치). 연동 방식은
자산마다 다릅니다 — 메뉴 배너 2개는 `<img>` 태그, 게임 카드·플레이 화면 대부분은 CSS
`background-image`, Space Shooter·Brick Breaker 는 캔버스가 매 프레임 불투명으로 덮어 CSS로는
안 보여서 `ctx.drawImage()` 로 직접 그립니다.

| 파일명 | 용도 | 위치 |
| :--- | :--- | :--- |
| `slot_spicy_777_banner_1787296460666.jpg` | 777 슬롯 메인 비주얼 배너 | `public/game/assets/` |
| `slot_jackpot_fever_spicy_1787296479718.jpg` | 777 Jackpot Fever 당첨 오버레이 | `public/game/assets/` |
| `slot_double_gamble_cards_1787296496813.jpg` | Double 2x Gamble 카지노 카드 | `public/game/assets/` |
| `block_drop_spicy_art_1787296647865.jpg` | GIJO Block Drop 비주얼 아트 | `public/game/assets/` |
| `space_shooter_spicy_art_1787296668125.jpg` | GIJO Space Shooter 비주얼 아트 | `public/game/assets/` |
| `neon_snake_spicy_art_1787296695019.jpg` | GIJO Neon Snake 비주얼 아트 | `public/game/assets/` |
| `brick_breaker_spicy_art_1787296721614.jpg` | GIJO Brick Breaker 비주얼 아트 | `public/game/assets/` |
| `drink_spicy_main_banner_1787296777970.jpg` | GIJO Drink 메인 비주얼 배너 | `public/game/assets/` |
| `drink_titanic_spicy_art_1787296806150.jpg` | GIJO Neon Titanic 비주얼 아트 | `public/game/assets/` |
| `drink_touch_roulette_spicy_art_1787296832739.jpg` | GIJO Touch Roulette 비주얼 아트 | `public/game/assets/` |

---

## 🧪 4. 빌드 및 테스트 상태

```bash
# 1. Production Build 상태 (2026-08-21 재실측)
npm run build # PASS (vite v6.4.3, 1719 modules, built in 1.30s + esbuild server.cjs)

# 2. Vitest Test Suite 상태 (2026-08-21 재실측)
npm test # PASS — 9 test files, 156 tests, 0 failures (21.55s)

# 3. 로컬 데몬 서버
http://localhost:3000 # Active (curl 200 확인, PID 25852)

# 4. gijodrink / gijoarcade 동기화 상태
diff gijotalk/public/game/gijo-drink.html gijodrink/index.html   # 동일 (diff 없음)
diff gijotalk/public/game/gijo-arcade.html gijoarcade/index.html # 동일 (diff 없음)
```

---

## 💡 5. Claude 다음 작업 시 참고 가이드

1. **GIJOSKv1 규율 유지**: 스킬 폴더 `~/.claude/skills/GIJOSKv1` 내의 `SKILL.md` 및 `agents/` 원칙을 참고하여, UI/기능 변경 시 시안 1개 수사고 제시 후 진행.
2. **독립 저장소 동시 갱신**: `gijotalk` 내 `public/game/gijo-drink.html` 및 `gijo-arcade.html`을 수정할 경우, `gijodrink` (`/Users/t/깃허브/gijodrink/index.html`) 및 `gijoarcade` (`/Users/t/깃허브/gijoarcade/index.html`) 저장소에도 동일하게 복사 후 `git push` 진행.

---

## 🛠️ 6. 2026-09-02 세션 — 전체 이미지 배치·코드·게임 점검 및 업그레이드 (Claude)

브라우저(로컬 서버)에서 게임 6종·슬롯의 새 코드 경로를 전부 직접 실행해 확인했습니다. `npm run lint` 오류 0, 빌드 PASS, 테스트 156개 PASS.

### 아케이드 (`public/game/gijo-arcade.html`) — 버그
- **파티클·점수 팝업이 6개 게임 중 4개(Block Drop·Space Shooter·Snake·Brick Breaker)에서 안 그려짐**: `drawFx()` 를 부르지 않았음. `triggerShake()` 도 값만 줄고 캔버스를 옮기는 코드가 없어 흔들림이 전혀 없었음 → `Game.beginFrame()/endFrame()` 도입, 6개 게임 모두 적용.
- **Space Shooter 파워업(⚡🛡️💣)이 보이지 않는 채로 떨어지고 먹힘**: 그리는 코드 자체가 없었음 → 렌더링 추가, 실드 활성 시 기체 둘레 링 표시.
- **Space Shooter 편대가 바닥에 닿으면 1.6초마다 목숨이 계속 빠짐**: 편대가 복귀하지 않았음 → 목숨 1개 차감 후 `descend` 를 0으로 되돌려 편대를 위로 올림.
- **슬롯 무료 충전 후 다음 스핀에 크레딧이 1000으로 되돌아가는 공짜 충전 버그**: SPIN 버튼에 once 리스너를 덧붙이는 구조라 리스너가 한 겹씩 쌓였음 → `refillArmed` 플래그로 `spin()` 이 스스로 분기.
- **더블 도전 창을 띄운 채 메뉴로 나갔다 오면 창이 그대로 남아 릴을 가림** → `clearOverlays()` 를 enter/exit 양쪽에서 호출, 슬롯 타이머는 `after()` 로 등록해 exit 때 일괄 취소.
- **타일을 누르고 다음 프레임 전에 뒤로 가면 `games[null].enter()` TypeError** (숨김 탭에선 rAF 가 밀려 실제로 재현됨) → 콜백이 id 를 캡처하도록 수정, 모르는 화면 id 는 메뉴로.
- **HOT 테마를 켤 방법이 없었음**: CSS(`.hot-sw`)와 `HOT` 객체는 있었지만 스위치 마크업·핸들러가 빠져 있었음 → 메뉴 헤더에 토글 추가(localStorage 유지, aria-checked).
- **Snake `setBoost()` 가 어떤 입력에도 연결돼 있지 않았음** → 길게 누르기(0.22초)/Shift 로 질주, 화면에 `⚡ BOOST` 표시.
- **두 번째 `.ad-banner` CSS 블록(옛 마크업용)이 마키 배너 규칙을 덮어씀**(높이 64→50 등), `.ov-art-img` 등 죽은 CSS → 제거.
- 기타: iOS 에서 suspended 된 AudioContext 재개, 매 프레임 `getComputedStyle` 호출 제거, Brick Breaker 의 무효한 `fillStyle = 'linear-gradient(...)'` 제거, 2048·Flappy 화면에도 게임별 액센트, `prefers-reduced-motion` 존중.

### 이미지 배치
- 메뉴 타일 아트(469x840 세로형)는 가로 타일에서 가운데 띠만 남아 피사체가 잘렸음 → `background-position: center 35%`, 색 덮개 0.55→0.42, 글자 뒤에 아래쪽 어두운 띠(`::after`) 추가.
- `public/game/assets/*.jpg` 15장을 품질 82 로 재인코딩: **3,225KB → 1,947KB (-40%)**. 해상도는 그대로.

### React 앱
- `Top10Essentials.tsx` 의 `Phrase` 에 없는 `audio` 필드로 `tsc` 가 실패하던 것 수정(음성은 `audioManifest` 가 id 로 찾으므로 불필요).
- `index.html` 서비스워커 이중 등록 제거(head 한 곳만).
- `vite.config.ts` 청크 분리: 단일 593KB → `vendor-react` 194KB · `phrases` 221KB · `index` 150KB · `vendor-icons` 29KB. 문장 데이터만 고쳐도 react 청크 캐시가 유지됨.
- `sw.js` VERSION v44 → v45.

### 드링크 (`public/game/gijo-drink.html`)
- 별도 에이전트가 감사·수정한 내역은 이 세션 보고에 첨부.

### 참고
- 이 Windows 작업 트리에는 `gijodrink`/`gijoarcade` 독립 저장소가 없어 §5-2 의 동기화(복사 후 push)는 하지 못했습니다. Mac 쪽에서 두 HTML 을 그대로 복사해 주세요.

