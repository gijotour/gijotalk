import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { CategoryId, Phrase } from './types';
import { COUNTRIES, PHRASES, IS_STATIC_BUILD } from './config';
import {
  registerServiceWorker,
  getSavedBookmarkIds,
  saveBookmarkIds,
  toggleBookmarkId,
  isBrowserOnline,
  CUSTOM_PHRASES_STORAGE_KEY,
} from './utils/pwa';

import { Header } from './components/Header';
import { InstallBanner } from './components/InstallBanner';
import { OfflineAudioCard } from './components/OfflineAudioCard';
import { PrivacyNotice, PrivacyToggle } from './components/PrivacyToggle';
import { track } from './utils/analytics';
import { CategoryChips } from './components/CategoryChips';
import { PhraseCard } from './components/PhraseCard';
import { BillboardModal } from './components/BillboardModal';
import { AITranslateModal } from './components/AITranslateModal';
import { PhotoTranslateModal } from './components/PhotoTranslateModal';
import { PronunciationModal } from './components/PronunciationModal';
import { ItineraryTab } from './components/ItineraryTab';
import { hasItineraryLink } from './utils/itineraryLink';
import { isUnlocked } from './utils/appLock';
import { LockScreen } from './components/LockScreen';
import { BottomNav, TabType } from './components/BottomNav';

import { Search, Sparkles, Bookmark, ShieldAlert, Maximize2, Camera } from 'lucide-react';

export default function App() {
  // 잠금. 풀리기 전에는 앱의 어떤 화면도 그리지 않습니다.
  // 주소에 실린 일정표(#sheet=·#itin=)는 해시에 그대로 남아 있으므로,
  // 잠금을 푼 뒤 일정 탭이 열리면서 정상적으로 반영됩니다.
  const [unlocked, setUnlocked] = useState(() => isUnlocked());

  // Country & Filter States
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  // 카톡방의 일정표 링크를 누르고 들어온 사람은 회화가 아니라 일정을 보러 온 것입니다.
  const [activeTab, setActiveTab] = useState<TabType>(() =>
    hasItineraryLink() ? 'itinerary' : 'translate'
  );

  // Audio Settings
  const [speed, setSpeed] = useState<number>(1.0);

  // Bookmarks State
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [isOffline, setIsOffline] = useState<boolean>(!isBrowserOnline());

  // Modals
  const [billboardPhrase, setBillboardPhrase] = useState<Phrase | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState<boolean>(false);
  const [micPracticePhrase, setMicPracticePhrase] = useState<Phrase | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);

  // Custom AI-generated Phrases State
  const [customPhrases, setCustomPhrases] = useState<Phrase[]>(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_PHRASES_STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const persistCustomPhrases = (list: Phrase[]) => {
    try {
      localStorage.setItem(CUSTOM_PHRASES_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('AI 문장 저장 실패:', e);
    }
  };

  const handleAddCustomPhrase = (newPhrase: Phrase) => {
    setCustomPhrases((prev) => {
      // 같은 질문을 반복하면 내용이 같은 문장이 계속 쌓입니다.
      // id 는 생성 시각이라 매번 다르므로 원문 기준으로 중복을 막습니다.
      const isDuplicate = prev.some(
        (p) =>
          p.id === newPhrase.id ||
          (p.countryId === newPhrase.countryId && p.original === newPhrase.original)
      );
      if (isDuplicate) return prev;

      const updated = [newPhrase, ...prev];
      persistCustomPhrases(updated);
      return updated;
    });
  };

  /** AI 가 만든 문장인지 — 삭제 버튼 노출 여부를 결정합니다. */
  const isCustomPhrase = useCallback(
    (id: string) => customPhrases.some((p) => p.id === id),
    [customPhrases]
  );

  /** AI 가 만든 문장 삭제. 기본 제공 문장은 지울 수 없습니다. */
  const handleDeleteCustomPhrase = useCallback((phraseId: string) => {
    setCustomPhrases((prev) => {
      const updated = prev.filter((p) => p.id !== phraseId);
      persistCustomPhrases(updated);
      return updated;
    });
    // 지운 문장이 보관함에 남아 유령 항목이 되지 않게 함께 정리합니다.
    setBookmarkedIds((prev) => {
      if (!prev.includes(phraseId)) return prev;
      const updated = prev.filter((id) => id !== phraseId);
      saveBookmarkIds(updated);
      return updated;
    });
  }, []);


  // Register PWA Service Worker & Load Bookmarks on Mount
  useEffect(() => {
    registerServiceWorker();
    setBookmarkedIds(getSavedBookmarkIds());

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Bookmark Toggle Handler
  // localStorage 를 다시 읽지 않고 현재 상태를 넘깁니다.
  // 저장소를 재조회하면 화면 상태와 어긋난 값 위에 덮어쓰게 됩니다.
  const handleToggleBookmark = useCallback((id: string) => {
    setBookmarkedIds((prev) => toggleBookmarkId(id, prev));
  }, []);

  // 아래 파생값들은 매 렌더마다 새 배열을 만듭니다.
  // 메모이제이션하지 않으면 목록이 바뀔 때마다 카드가 전부 다시 그려집니다.
  const allPhrases = useMemo(() => [...PHRASES, ...customPhrases], [customPhrases]);

  const countryPhrases = useMemo(
    () => allPhrases.filter((p) => p.countryId === selectedCountry.id),
    [allPhrases, selectedCountry.id]
  );

  const filteredPhrases = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return countryPhrases.filter((p) => {
      const matchesCategory = selectedCategory === '전체' || p.category === selectedCategory;
      const matchesSearch =
        !query ||
        p.original.toLowerCase().includes(query) ||
        p.translation.toLowerCase().includes(query) ||
        p.pronunciation.toLowerCase().includes(query) ||
        (p.usageTip && p.usageTip.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [countryPhrases, selectedCategory, searchQuery]);

  // Calculate category item counts for current country (한 번만 순회)
  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryId, number> = {
      '전체': countryPhrases.length,
      '항공': 0,
      '호텔': 0,
      '교통': 0,
      '식당': 0,
      '음식': 0,
      '흥정': 0,
      '관광': 0,
      '마사지': 0,
      '미팅/사교': 0,
      '욕설/은어': 0,
      '비상': 0,
    };
    countryPhrases.forEach((p) => {
      if (p.category !== '전체') counts[p.category] += 1;
    });
    return counts;
  }, [countryPhrases]);

  const bookmarkedPhrases = useMemo(
    () => allPhrases.filter((p) => bookmarkedIds.includes(p.id)),
    [allPhrases, bookmarkedIds]
  );

  // 긴급 전광판용 목록.
  // 예전에는 '교통' 카테고리 전체를 넣어 긴급하지 않은 문장까지 섞였습니다.
  // 이제 명시적으로 긴급 표시된 문장과 '비상' 카테고리만 봅니다.
  const emergencyPhrases = useMemo(
    () => countryPhrases.filter((p) => p.isEmergency || p.category === '비상'),
    [countryPhrases]
  );

  // 긴급 목록을 두 덩어리로 나눕니다.
  //
  //   회화가 늘면서 긴급 탭이 26개가 됐습니다. "3초 긴급" 이 컨셉인데 도난·부상·미아
  //   같은 진짜 급한 것과 "아파요(마사지)" "구명조끼" 가 한 줄에 섞여 있으면
  //   정작 급할 때 못 찾습니다. 진짜 비상을 위로 올리고 나머지는 아래로 내립니다.
  const criticalPhrases = useMemo(
    () => emergencyPhrases.filter((p) => p.category === '비상'),
    [emergencyPhrases]
  );
  const situationalPhrases = useMemo(
    () => emergencyPhrases.filter((p) => p.category !== '비상'),
    [emergencyPhrases]
  );

  // 북마크한 문장은 다른 나라 것일 수 있으므로 문장 자신의 국가를 씁니다.
  const countryForPhrase = useCallback(
    (p: Phrase) => COUNTRIES.find((c) => c.id === p.countryId) || selectedCountry,
    [selectedCountry]
  );

  // "검색했는데 결과가 없었다" 기록.
  // 이 앱에서 가장 값진 데이터입니다 — 다음에 어떤 문장을 추가해야 하는지
  // 사용자가 직접 알려주는 셈이기 때문입니다.
  //
  // 타이핑 도중(ㄱ, 경, 경차…)마다 찍으면 노이즈가 되므로 멈춘 뒤에만 기록합니다.
  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2 || filteredPhrases.length > 0) return;

    const timer = setTimeout(() => {
      track('search_empty', {
        q: query.slice(0, 100),
        lang: selectedCountry.id,
        category: selectedCategory,
      });
    }, 1200);

    return () => clearTimeout(timer);
  }, [searchQuery, filteredPhrases.length, selectedCountry.id, selectedCategory]);


  if (!unlocked) return <LockScreen onUnlock={() => setUnlocked(true)} />;

  return (
    // 하단 여백은 고정 네비게이션 높이 + safe-area 만큼 확보합니다.
    <div
      className="min-h-screen bg-canvas text-ink flex flex-col font-['Inter']"
      style={{ paddingBottom: 'calc(5.5rem + env(safe-area-inset-bottom))' }}
    >
      {/* 설치 안내 · 인앱 브라우저 경고 · 오프라인 표시 */}
      <InstallBanner isOffline={isOffline} />

      {/* Top App Header */}
      <Header
        selectedCountry={selectedCountry}
        onSelectCountry={(c) => {
          setSelectedCountry(c);
          setSelectedCategory('전체');
        }}
        onOpenAIAssistant={() => setShowAIAssistant(true)}
        onOpenEmergencyModal={() => {
          if (emergencyPhrases.length > 0) {
            setBillboardPhrase(emergencyPhrases[0]);
          }
        }}
      />

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-screen-md mx-auto px-3 sm:px-6 py-4 space-y-4">
        {/* TAB 1: 회화 / 번역 메인 뷰 */}
        {activeTab === 'translate' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* 검색 + 액션.
                예전에는 검색줄 아래로 프로모 배너 2개가 화면을 채워서, 정작 회화 카드가
                첫 화면 아래로 밀려나 있었습니다. 배너를 아이콘 버튼으로 접었습니다. */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 min-w-0">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="회화 검색"
                  placeholder="원문 · 뜻 · 발음 검색"
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl pl-11 pr-16 py-3.5 text-xs text-ink placeholder-ink-mute focus:outline-none focus:border-brand-vivid shadow-xs"
                />
                <Search className="w-4 h-4 text-ink-mute absolute left-4 top-4.5" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-3 text-xs text-ink-soft hover:text-ink bg-slate-100 px-2.5 py-1.5 rounded-full font-bold"
                  >
                    지우기
                  </button>
                )}
              </div>


              {/* 사진 번역 · AI 모두 서버가 필요합니다. 정적 배포에서는 숨깁니다. */}
              {!IS_STATIC_BUILD && (
                <button
                  onClick={() => setShowPhotoModal(true)}
                  aria-label="사진 찍어 번역하기"
                  title="사진 번역"
                  className="w-13 h-13 shrink-0 flex items-center justify-center bg-ink hover:bg-black text-white rounded-2xl shadow-xs active:scale-95 transition-all"
                >
                  <Camera className="w-5 h-5" />
                </button>
              )}
              {!IS_STATIC_BUILD && (
                <button
                  onClick={() => setShowAIAssistant(true)}
                  aria-label="AI에게 맞춤 표현 질문하기"
                  title="AI 질문"
                  className="w-13 h-13 shrink-0 flex items-center justify-center bg-brand hover:bg-brand-hover text-white rounded-2xl shadow-xs active:scale-95 transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Category Chips */}
            <CategoryChips
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              categoryCounts={categoryCounts}
            />

            {/* Phrase Cards Feed */}
            {filteredPhrases.length > 0 ? (
              <div className="space-y-3">
                {filteredPhrases.map((phrase) => (
                  <PhraseCard
                    key={phrase.id}
                    phrase={phrase}
                    country={selectedCountry}
                    speed={speed}
                    onSetSpeed={setSpeed}
                    isBookmarked={bookmarkedIds.includes(phrase.id)}
                    onToggleBookmark={handleToggleBookmark}
                    onOpenBillboard={setBillboardPhrase}
                    onOpenMicPractice={setMicPracticePhrase}
                    onDelete={
                      isCustomPhrase(phrase.id) ? handleDeleteCustomPhrase : undefined
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border-2 border-slate-100 p-6 shadow-xs">
                <Search className="w-10 h-10 text-ink-mute mx-auto mb-2" />
                <h3 className="text-xs font-bold text-slate-700">
                  검색 조건에 일치하는 회화 문장이 없습니다.
                </h3>
                {IS_STATIC_BUILD ? (
                  <p className="text-xs text-ink-mute mt-1">
                    다른 검색어로 찾아보거나 카테고리를 바꿔보세요.
                  </p>
                ) : (
                  <>
                    <p className="text-xs text-ink-mute mt-1 mb-4">
                      AI 맞춤 질문으로 필요한 문장을 즉시 생성해보세요!
                    </p>
                    <button
                      onClick={() => setShowAIAssistant(true)}
                      className="px-4 py-2 bg-brand text-white text-xs font-bold rounded-xl shadow-xs"
                    >
                      AI 질문으로 생성하기
                    </button>
                  </>
                )}
              </div>
            )}

            {/* 오프라인 저장 — 목록 아래에 두어 먼저 회화가 보이게 합니다. */}
            <OfflineAudioCard country={selectedCountry} isOffline={isOffline} />

            {/* 사용 기록 첫 안내 — 정적 배포에서는 수집 자체를 하지 않습니다. */}
            {!IS_STATIC_BUILD && <PrivacyNotice />}
          </div>
        )}


        {/* TAB 2: 일정표 — 가이드가 보낸 .txt 파일을 올려서 오프라인으로 봅니다 */}
        {activeTab === 'itinerary' && (
          <ItineraryTab
            country={selectedCountry}
            onOpenBillboard={setBillboardPhrase}
            onJumpToCategory={(category) => {
              setSelectedCategory(category);
              setSearchQuery('');
              setActiveTab('translate');
            }}
          />
        )}

        {/* TAB 3: 저장됨 (북마크) */}
        {activeTab === 'bookmarks' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-accent fill-current" />
                  <span>내 보관함 ({bookmarkedPhrases.length})</span>
                </h2>
                <p className="text-xs text-slate-500 font-bold mt-0.5">
                  현지에서 인터넷 없이 가장 자주 쓰는 나만의 문장
                </p>
              </div>
            </div>

            {bookmarkedPhrases.length > 0 ? (
              <div className="space-y-4">
                {bookmarkedPhrases.map((phrase) => {
                  return (
                    <PhraseCard
                      key={`bm-${phrase.id}`}
                      phrase={phrase}
                      country={countryForPhrase(phrase)}
                      speed={speed}
                      onSetSpeed={setSpeed}
                      isBookmarked={true}
                      onToggleBookmark={handleToggleBookmark}
                      onOpenBillboard={setBillboardPhrase}
                      onOpenMicPractice={setMicPracticePhrase}
                      onDelete={
                        isCustomPhrase(phrase.id) ? handleDeleteCustomPhrase : undefined
                      }
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border-2 border-slate-100 p-6 shadow-xs">
                <Bookmark className="w-10 h-10 text-ink-mute mx-auto mb-2" />
                <h3 className="text-xs font-bold text-slate-700">
                  아직 저장된 문장이 없습니다.
                </h3>
                <p className="text-xs text-ink-mute mt-1 mb-4">
                  자주 쓰는 문장의 북마크(★)를 눌러 보관함에 추가하세요!
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: 긴급 전광판 핫 리스트 */}
        {activeTab === 'emergency' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="bg-accent/20 border-2 border-accent/60 p-4 rounded-2xl text-slate-900 shadow-xs">
              <div className="flex items-center gap-2 mb-1">
                <ShieldAlert className="w-5 h-5 text-alert" />
                <h2 className="font-extrabold text-sm text-slate-900">
                  3초 긴급 현장 외치기 전광판 모드
                </h2>
              </div>
              <p className="text-xs font-bold text-slate-700">
                운전기사나 현지 상인에게 휴대폰을 즉시 보여주고 큰 소리로 재생하세요!
              </p>
            </div>

            <h3 className="text-xs font-extrabold text-slate-900 px-1">
              진짜 비상 ({criticalPhrases.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {criticalPhrases.map((phrase) => (
                <div
                  key={`emerg-${phrase.id}`}
                  onClick={() => setBillboardPhrase(phrase)}
                  className="bg-white hover:border-brand-vivid p-5 rounded-2xl border-2 border-slate-100 cursor-pointer transition-all active:scale-95 shadow-xs group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2.5 py-0.5 bg-accent/30 text-alert text-xs font-bold rounded-xl">
                      {phrase.category} • 긴급
                    </span>
                    <Maximize2 className="w-4 h-4 text-brand group-hover:scale-110 transition-transform" />
                  </div>

                  <h3 className="text-xl font-black text-slate-900 font-['Montserrat'] tracking-tight italic">
                    {phrase.original}
                  </h3>
                  <p className="text-xs font-bold text-slate-700 mt-1">
                    {phrase.translation}
                  </p>
                  <p className="text-xs font-bold text-alert mt-0.5">
                    [{phrase.pronunciation}]
                  </p>

                  <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-brand font-bold">
                    <span>1초 만에 전광판 실행</span>
                    <span className="font-black">터치 ➔</span>
                  </div>
                </div>
              ))}
            </div>

            {situationalPhrases.length > 0 && (
              <>
                <h3 className="text-xs font-extrabold text-slate-900 px-1 pt-2">
                  상황별로 급한 말 ({situationalPhrases.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {situationalPhrases.map((phrase) => (
                    <div
                      key={`urgent-${phrase.id}`}
                      onClick={() => setBillboardPhrase(phrase)}
                      className="bg-white hover:border-brand-vivid p-4 rounded-2xl border-2 border-slate-100 cursor-pointer transition-all active:scale-95 shadow-xs"
                    >
                      <span className="px-2.5 py-0.5 bg-slate-100 text-ink-soft text-xs font-bold rounded-xl">
                        {phrase.category}
                      </span>
                      <h3 className="text-lg font-black text-slate-900 font-['Montserrat'] tracking-tight italic mt-2">
                        {phrase.original}
                      </h3>
                      <p className="text-xs font-bold text-slate-700 mt-1">{phrase.translation}</p>
                      <p className="text-xs font-bold text-alert mt-0.5">[{phrase.pronunciation}]</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="pt-8 pb-4">
          <div className="bg-white border-2 border-slate-100 py-3.5 px-6 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center justify-between w-full text-xs text-ink-soft font-bold gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isOffline ? 'bg-accent' : 'bg-emerald-500'
                }`}
              />
              <span>GIJO Tour(PH) · {isOffline ? '오프라인' : '온라인'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-ink">
              <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-xl border border-blue-200">
                지아이조 투어
              </span>
              <span>제공</span>
            </div>
            <span className="text-brand">{countryPhrases.length}개 현장회화 탑재</span>
          </div>

          {!IS_STATIC_BUILD && (
            <div className="mt-2 flex justify-center">
              <PrivacyToggle />
            </div>
          )}
        </footer>
      </main>

      {/* Bottom Fixed Navigation Bar */}

      <BottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        bookmarkCount={bookmarkedPhrases.length}
      />

      {/* MODAL 1: 3-Second Emergency Billboard */}
      {billboardPhrase && (
        <BillboardModal
          phrase={billboardPhrase}
          country={countryForPhrase(billboardPhrase)}
          onClose={() => setBillboardPhrase(null)}
        />
      )}

      {/* MODAL 2: Gemini AI Custom Phrase Translator */}
      {showAIAssistant && (
        <AITranslateModal
          country={selectedCountry}
          onClose={() => setShowAIAssistant(false)}
          onOpenBillboard={(p) => {
            setShowAIAssistant(false);
            setBillboardPhrase(p);
          }}
          onAddCustomPhrase={handleAddCustomPhrase}
        />
      )}

      {/* MODAL 3: Mic Speech Recognition Practice */}
      {micPracticePhrase && (
        <PronunciationModal
          phrase={micPracticePhrase}
          country={countryForPhrase(micPracticePhrase)}
          onClose={() => setMicPracticePhrase(null)}
        />
      )}


      {/* 사진 번역 — 메뉴판·표지판·약봉투 */}
      {showPhotoModal && (
        <PhotoTranslateModal country={selectedCountry} onClose={() => setShowPhotoModal(false)} />
      )}

    </div>
  );
}
