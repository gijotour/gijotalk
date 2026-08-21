# 📋 GIJO Talk & Games 인수인계 작업 내역서 (for Claude)

> **수신**: Claude Code / Claude CLI  
> **발신**: Antigravity (AGY)  
> **일시**: 2026-08-21  
> **적용 규율**: GIJOSKv1 바이브 코딩 규율 (`시안 1개 → 설계관 → 구현 → 검토관 → 시험 게이트 → 배포 → 게시`)

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

생성 및 연동된 이미지 자산은 각 저장소의 `public/game/assets/` 및 `assets/` 폴더에 배치되어 있으며, HTML 내에 `<img class="...">` 태그로 렌더링 연동되어 있습니다.

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
# 1. Production Build 상태
npm run build # PASS (vite v6.4.3 + esbuild server.ts -> dist/ 1.25s)

# 2. Vitest Test Suite 상태
npm test # PASS (156 tests passed, 0 failures)

# 3. 로컬 데몬 서버
http://localhost:3000 # Active
```

---

## 💡 5. Claude 다음 작업 시 참고 가이드

1. **GIJOSKv1 규율 유지**: 스킬 폴더 `~/.claude/skills/GIJOSKv1` 내의 `SKILL.md` 및 `agents/` 원칙을 참고하여, UI/기능 변경 시 시안 1개 수사고 제시 후 진행.
2. **독립 저장소 동시 갱신**: `gijotalk` 내 `public/game/gijo-drink.html` 및 `gijo-arcade.html`을 수정할 경우, `gijodrink` (`/Users/t/깃허브/gijodrink/index.html`) 및 `gijoarcade` (`/Users/t/깃허브/gijoarcade/index.html`) 저장소에도 동일하게 복사 후 `git push` 진행.
