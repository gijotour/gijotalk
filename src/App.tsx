import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { CategoryId, Phrase } from './types';
import { COUNTRIES, PHRASES, IS_STATIC_BUILD } from './config';
import { syncAudioCache } from './utils/offlineAudio';
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
import { PrivacyNotice, PrivacyToggle } from './components/PrivacyToggle';
import { track } from './utils/analytics';
import { CategoryChips, PhraseFilterCategory } from './components/CategoryChips';
import { PhraseCard } from './components/PhraseCard';
import { BillboardModal } from './components/BillboardModal';
import { AITranslateModal } from './components/AITranslateModal';
import { PhotoTranslateModal } from './components/PhotoTranslateModal';
import { PronunciationModal } from './components/PronunciationModal';
import { ItineraryTab } from './components/ItineraryTab';
import { PartyGameModal } from './components/PartyGameModal';
import { ArcadeModal } from './components/ArcadeModal';
import { GameHubModal } from './components/GameHubModal';
import { EntryGuideModal } from './components/EntryGuideModal';
import { TravelCalculatorModal } from './components/TravelCalculatorModal';
import { TravelChecklistModal } from './components/TravelChecklistModal';
import { Top10Essentials } from './components/Top10Essentials';
import { AdBanner } from './components/AdBanner';
import { hasItineraryLink } from './utils/itineraryLink';
import { isUnlocked } from './utils/appLock';
import { LockScreen } from './components/LockScreen';
import { BottomNav, TabType } from './components/BottomNav';
import { LearnTab, LearnSubTab } from './components/learn/LearnTab';
import {
  getSavedVocabIds,
  toggleVocabId,
  getVocabProgress,
  recordSeen,
  recordAnswer,
  getUnitDoneIds,
  markUnitDone,
  type VocabProgressMap,
} from './utils/vocab';

import {
  Search,
  Sparkles,
  ShieldAlert,
  Maximize2,
  Camera,
  Languages,
} from 'lucide-react';

export default function App() {
  const [unlocked, setUnlocked] = useState(() => isUnlocked());

  // Country & Filter States
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [selectedCategory, setSelectedCategory] = useState<PhraseFilterCategory>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [learnSubTab, setLearnSubTab] = useState<LearnSubTab>(() => {
    if (typeof window !== 'undefined') {
      try {
        if (new URLSearchParams(window.location.search).get('tab') === 'bookmarks') {
          return 'bookshelf';
        }
      } catch {
        // Ignored
      }
    }
    return 'scenarios';
  });
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    if (typeof window !== 'undefined') {
      try {
        const param = new URLSearchParams(window.location.search).get('tab');
        if (param === 'bookmarks') return 'learn';
        if (param && ['learn', 'translate', 'itinerary', 'emergency'].includes(param)) {
          return param as TabType;
        }
      } catch {
        // Ignored
      }
    }
    return hasItineraryLink() ? 'itinerary' : 'learn';
  });

  // Audio Settings
  const [speed, setSpeed] = useState<number>(1.0);

  // Bookmarks State
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [isOffline, setIsOffline] = useState<boolean>(!isBrowserOnline());

  // 어휘 학습 상태 (저장·진행·도장). 문장 북마크와 저장 키가 다릅니다.
  const [savedVocabIds, setSavedVocabIds] = useState<string[]>([]);
  const [vocabProgress, setVocabProgress] = useState<VocabProgressMap>({});
  const [vocabUnitDone, setVocabUnitDone] = useState<string[]>([]);

  // Modals
  const [billboardPhrase, setBillboardPhrase] = useState<Phrase | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState<boolean>(false);
  const [micPracticePhrase, setMicPracticePhrase] = useState<Phrase | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);
  const [showPartyGame, setShowPartyGame] = useState<boolean>(false);
  const [showArcade, setShowArcade] = useState<boolean>(false);
  const [showGameHub, setShowGameHub] = useState<boolean>(false);
  const [showEntryGuide, setShowEntryGuide] = useState<boolean>(false);
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  const [showChecklist, setShowChecklist] = useState<boolean>(false);

  // 언어 변경 안내 토스트
  const [languageNotice, setLanguageNotice] = useState<string | null>(null);

  const handleSelectCountry = (country: typeof COUNTRIES[0]) => {
    setSelectedCountry(country);
    setSelectedCategory('전체');
    setLanguageNotice(`${country.flag} ${country.name} (${country.language}) 회화로 전환되었습니다.`);
    setTimeout(() => setLanguageNotice(null), 3500);
  };

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

  const isCustomPhrase = useCallback(
    (id: string) => customPhrases.some((p) => p.id === id),
    [customPhrases]
  );

  const handleDeleteCustomPhrase = useCallback((phraseId: string) => {
    setCustomPhrases((prev) => {
      const updated = prev.filter((p) => p.id !== phraseId);
      persistCustomPhrases(updated);
      return updated;
    });
    setBookmarkedIds((prev) => {
      if (!prev.includes(phraseId)) return prev;
      const updated = prev.filter((id) => id !== phraseId);
      saveBookmarkIds(updated);
      return updated;
    });
  }, []);

  useEffect(() => {
    registerServiceWorker();
    void syncAudioCache();
    setBookmarkedIds(getSavedBookmarkIds());
    setSavedVocabIds(getSavedVocabIds());
    setVocabProgress(getVocabProgress());
    setVocabUnitDone(getUnitDoneIds());

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleToggleBookmark = useCallback((id: string) => {
    setBookmarkedIds((prev) => toggleBookmarkId(id, prev));
  }, []);

  /* 어휘 학습 — 상태 갱신과 저장을 utils/vocab 한 곳에서만 합니다. */
  const handleToggleVocabSave = useCallback((id: string) => {
    setSavedVocabIds((prev) => toggleVocabId(id, prev));
  }, []);

  const handleVocabSeen = useCallback((id: string) => {
    setVocabProgress((prev) => recordSeen(id, prev));
  }, []);

  const handleVocabAnswer = useCallback((id: string, correct: boolean) => {
    setVocabProgress((prev) => recordAnswer(id, correct, prev));
  }, []);

  const handleUnitDone = useCallback((stamp: string) => {
    setVocabUnitDone((prev) => markUnitDone(stamp, prev));
  }, []);

  const allPhrases = useMemo(() => [...PHRASES, ...customPhrases], [customPhrases]);

  const countryPhrases = useMemo(
    () => allPhrases.filter((p) => p.countryId === selectedCountry.id),
    [allPhrases, selectedCountry.id]
  );

  const filteredPhrases = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const baseList =
      selectedCategory === '저장'
        ? allPhrases.filter((p) => bookmarkedIds.includes(p.id))
        : countryPhrases;

    return baseList.filter((p) => {
      const matchesCategory =
        selectedCategory === '저장' ||
        selectedCategory === '전체' ||
        selectedCategory === '10대 기본' ||
        p.category === selectedCategory;
      const matchesSearch =
        !query ||
        p.original.toLowerCase().includes(query) ||
        p.translation.toLowerCase().includes(query) ||
        p.pronunciation.toLowerCase().includes(query) ||
        (p.usageTip && p.usageTip.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [allPhrases, countryPhrases, bookmarkedIds, selectedCategory, searchQuery]);

  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryId, number> = {
      '10대 기본': 10,
      '전체': countryPhrases.length,
      '골프': 0,
      '호텔': 0,
      '교통': 0,
      '식당': 0,
      '음식': 0,
      '흥정': 0,
      '관광': 0,
      '마사지': 0,
      '항공': 0,
      '미팅/사교': 0,
      '욕설/은어': 0,
      '비상': 0,
    };
    countryPhrases.forEach((p) => {
      if (p.category !== '전체' && p.category in counts) {
        counts[p.category] += 1;
      }
    });
    return counts;
  }, [countryPhrases]);

  const bookmarkedPhrases = useMemo(
    () => allPhrases.filter((p) => bookmarkedIds.includes(p.id)),
    [allPhrases, bookmarkedIds]
  );

  const emergencyPhrases = useMemo(
    () => countryPhrases.filter((p) => p.isEmergency || p.category === '비상'),
    [countryPhrases]
  );

  const criticalPhrases = useMemo(
    () => emergencyPhrases.filter((p) => p.category === '비상'),
    [emergencyPhrases]
  );
  const situationalPhrases = useMemo(
    () => emergencyPhrases.filter((p) => p.category !== '비상'),
    [emergencyPhrases]
  );

  const countryForPhrase = useCallback(
    (p: Phrase) => COUNTRIES.find((c) => c.id === p.countryId) || selectedCountry,
    [selectedCountry]
  );

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
    <div
      className="min-h-screen bg-canvas text-ink flex flex-col font-['Inter']"
      style={{ paddingBottom: 'calc(5.5rem + env(safe-area-inset-bottom))' }}
    >
      {/* 설치 안내 · 인앱 브라우저 경고 · 오프라인 표시 */}
      <InstallBanner isOffline={isOffline} />

      {/* Top App Header */}
      <Header
        selectedCountry={selectedCountry}
        onSelectCountry={handleSelectCountry}
        onOpenAIAssistant={() => setShowAIAssistant(true)}
        onOpenGameHub={() => setShowGameHub(true)}
        onOpenEmergencyModal={() => {
          if (emergencyPhrases.length > 0) {
            setBillboardPhrase(emergencyPhrases[0]);
          }
        }}
        onOpenPartyGame={() => setShowPartyGame(true)}
        onOpenArcade={() => setShowArcade(true)}
        onOpenEntryGuide={() => setShowEntryGuide(true)}
        onOpenCalculator={() => setShowCalculator(true)}
        onOpenChecklist={() => setShowChecklist(true)}
      />

      {/* 언어 변경 가이드 플로팅 알림 */}
      {languageNotice && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-slate-900/95 text-white backdrop-blur-md px-4 py-2 rounded-full shadow-xl flex items-center gap-2 text-xs font-bold border border-white/20">
            <Languages className="w-4 h-4 text-brand" />
            <span>{languageNotice}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-screen-md mx-auto px-3 sm:px-6 py-4 space-y-4">
        {/* TAB 1: 배우기 (단원 학습 + 내 단어장 통합) */}
        {activeTab === 'learn' && (
          <LearnTab
            country={selectedCountry}
            speed={speed}
            savedIds={savedVocabIds}
            onToggleSave={handleToggleVocabSave}
            progress={vocabProgress}
            onMarkSeen={handleVocabSeen}
            onAnswer={handleVocabAnswer}
            unitDone={vocabUnitDone}
            onUnitDone={handleUnitDone}
            onOpenBillboard={setBillboardPhrase}
            onOpenPractice={setMicPracticePhrase}
            isOffline={isOffline}
            subTab={learnSubTab}
            onChangeSubTab={setLearnSubTab}
          />
        )}

        {/* TAB 2: 회화 / 검색 / 저장된 문장 */}
        {activeTab === 'translate' && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            {/* 심플 검색 바 */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 min-w-0">
                <input
                  type="search"
                  enterKeyHint="search"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="회화 검색"
                  placeholder="원문 · 뜻 · 발음 검색"
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-16 py-3 text-base sm:text-xs text-ink placeholder-ink-mute focus:outline-none focus:border-ink font-medium"
                />
                <Search className="w-4 h-4 text-ink-mute absolute left-3.5 top-3.5" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-xs text-ink-soft hover:text-ink bg-slate-100 px-2.5 py-1 rounded-full font-bold"
                  >
                    지우기
                  </button>
                )}
              </div>

              {/* 사진 번역 · AI 질문 (서버 모드) */}
              {!IS_STATIC_BUILD && (
                <button
                  onClick={() => setShowPhotoModal(true)}
                  aria-label="사진 찍어 번역하기"
                  title="사진 번역"
                  className="w-11 h-11 shrink-0 flex items-center justify-center bg-white hover:bg-slate-50 border border-slate-200 text-ink rounded-2xl active:scale-95 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
              {!IS_STATIC_BUILD && (
                <button
                  onClick={() => setShowAIAssistant(true)}
                  aria-label="AI에게 맞춤 표현 질문하기"
                  title="AI 질문"
                  className="w-11 h-11 shrink-0 flex items-center justify-center bg-brand hover:bg-brand-hover text-white rounded-2xl active:scale-95 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* 1줄 가로 스크롤 카테고리 + 저장 칩 */}
            <CategoryChips
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              categoryCounts={categoryCounts}
              savedCount={bookmarkedPhrases.length}
            />

            {/* 필수 10대 기본 표현 */}
            {(selectedCategory === '전체' || selectedCategory === '10대 기본') && !searchQuery && (
              <>
                <Top10Essentials
                  country={selectedCountry}
                  phrases={countryPhrases}
                  onOpenBillboard={setBillboardPhrase}
                  speed={speed}
                  onSetSpeed={setSpeed}
                  isBookmarked={(id) => bookmarkedIds.includes(id)}
                  onToggleBookmark={handleToggleBookmark}
                  onOpenMicPractice={setMicPracticePhrase}
                />
                <AdBanner slotId="ad-slot-top-banner" format="banner" className="my-1" />
              </>
            )}

            {/* 회화 목록 */}
            {(selectedCategory !== '10대 기본' || Boolean(searchQuery)) && (
              <>
                {filteredPhrases.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1 pt-1">
                      <span className="text-xs font-black text-ink">
                        {Boolean(searchQuery)
                          ? `검색 결과 (${filteredPhrases.length})`
                          : `${selectedCategory} (${filteredPhrases.length})`}
                      </span>
                      <span className="text-[11px] text-ink-mute font-medium">
                        터치하면 자세히 보기
                      </span>
                    </div>

                    {filteredPhrases.map((phrase, idx) => (
                      <React.Fragment key={phrase.id}>
                        <PhraseCard
                          phrase={phrase}
                          country={selectedCategory === '저장' ? countryForPhrase(phrase) : selectedCountry}
                          speed={speed}
                          onSetSpeed={setSpeed}
                          isBookmarked={bookmarkedIds.includes(phrase.id)}
                          onToggleBookmark={handleToggleBookmark}
                          onOpenBillboard={setBillboardPhrase}
                          onOpenMicPractice={setMicPracticePhrase}
                          onDelete={
                            isCustomPhrase(phrase.id) ? handleDeleteCustomPhrase : undefined
                          }
                          index={idx}
                          defaultExpanded={idx === 0 && selectedCategory !== '전체'}
                        />
                        {idx === 7 && (
                          <AdBanner slotId="ad-slot-infeed-middle" format="banner" className="my-2" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                ) : selectedCategory === '저장' && !searchQuery ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
                    <h3 className="text-xs font-bold text-ink">
                      아직 저장된 문장이 없습니다.
                    </h3>
                    <p className="text-xs text-ink-mute mt-1">
                      자주 쓰는 문장을 눌러 저장하면 여기에 모입니다.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
                    <Search className="w-8 h-8 text-ink-mute mx-auto mb-2" />
                    <h3 className="text-xs font-bold text-ink">
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
                          className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
                        >
                          AI 질문으로 생성하기
                        </button>
                      </>
                    )}
                  </div>
                )}
              </>
            )}

            {!IS_STATIC_BUILD && <PrivacyNotice />}
          </div>
        )}

        {/* TAB 3: 일정표 */}
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

        {/* TAB 4: 긴급 전광판 핫 리스트 */}
        {activeTab === 'emergency' && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            <div className="bg-white border border-red-200 p-4 rounded-2xl flex items-start gap-3">
              <span className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <div>
                <h2 className="font-black text-sm text-ink">
                  3초 긴급 현장 외치기 전광판 모드
                </h2>
                <p className="text-xs font-medium text-ink-mute mt-0.5">
                  카드를 누르면 화면 가득 큰 글씨로 바로 띄웁니다.
                </p>
              </div>
            </div>

            <h3 className="text-xs font-bold text-ink-mute px-1">
              긴급 상황 ({criticalPhrases.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {criticalPhrases.map((phrase) => (
                <button
                  type="button"
                  key={`emerg-${phrase.id}`}
                  onClick={() => setBillboardPhrase(phrase)}
                  className="text-left bg-white hover:border-red-300 p-4 rounded-2xl border border-slate-200 transition-colors active:scale-[0.98] group"
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[11px] font-bold text-red-600">
                      긴급 전광판
                    </span>
                    <Maximize2 className="w-4 h-4 text-slate-400 group-hover:text-brand transition-colors" />
                  </div>

                  <h3 className="text-lg font-black text-ink font-display tracking-tight">
                    {phrase.original}
                  </h3>
                  <p className="text-xs font-bold text-ink-soft mt-1">
                    {phrase.translation}
                  </p>
                  <p className="text-xs font-medium text-brand mt-0.5">
                    [{phrase.pronunciation}]
                  </p>
                </button>
              ))}
            </div>

            {situationalPhrases.length > 0 && (
              <>
                <h3 className="text-xs font-bold text-ink-mute px-1 pt-2">
                  자주 쓰는 급한 표현 ({situationalPhrases.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {situationalPhrases.map((phrase) => (
                    <button
                      type="button"
                      key={`urgent-${phrase.id}`}
                      onClick={() => setBillboardPhrase(phrase)}
                      className="text-left bg-white hover:border-slate-300 p-4 rounded-2xl border border-slate-200 transition-colors active:scale-[0.98]"
                    >
                      <span className="text-[11px] text-ink-mute font-bold">
                        {phrase.category}
                      </span>
                      <h3 className="text-base font-black text-ink font-display tracking-tight mt-1">
                        {phrase.original}
                      </h3>
                      <p className="text-xs font-bold text-ink-soft mt-1">{phrase.translation}</p>
                      <p className="text-xs font-medium text-brand mt-0.5">[{phrase.pronunciation}]</p>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* 심플 Footer */}
        <footer className="pt-6 pb-4 text-center space-y-2">
          <p className="text-xs text-ink-mute font-medium flex items-center justify-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isOffline ? 'bg-accent' : 'bg-emerald-500'
                }`}
              />
              GIJO Tour · {isOffline ? '오프라인' : '온라인'}
            </span>
            <span>·</span>
            <span>{countryPhrases.length}개 현장회화</span>
          </p>

          {!IS_STATIC_BUILD && (
            <div className="flex justify-center">
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
        vocabSavedCount={savedVocabIds.length}
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

      {/* MODAL 4: 입국심사 및 필수 서류 가이드 */}
      {showEntryGuide && (
        <EntryGuideModal
          country={selectedCountry}
          onClose={() => setShowEntryGuide(false)}
        />
      )}

      {/* MODAL 4.5: 동남아 실전 1초 환율 & 팁·더치페이 계산기 */}
      <TravelCalculatorModal
        isOpen={showCalculator}
        country={selectedCountry}
        onClose={() => setShowCalculator(false)}
      />

      {/* MODAL 4.6: 출국 전 1분 오프라인 준비 체크리스트 */}
      {showChecklist && (
        <TravelChecklistModal
          country={selectedCountry}
          isOffline={isOffline}
          onClose={() => setShowChecklist(false)}
          onOpenEntryGuide={() => setShowEntryGuide(true)}
        />
      )}

      {/* 사진 번역 */}
      {showPhotoModal && (
        <PhotoTranslateModal country={selectedCountry} onClose={() => setShowPhotoModal(false)} />
      )}

      {/* MODAL 5: GIJO 게임 & 놀거리 라운지 허브 */}
      <GameHubModal
        isOpen={showGameHub}
        onClose={() => setShowGameHub(false)}
        onOpenPartyGame={() => setShowPartyGame(true)}
        onOpenArcade={() => setShowArcade(true)}
      />

      {/* 파티 게임 & 아케이드 */}
      {showPartyGame && <PartyGameModal onClose={() => setShowPartyGame(false)} />}
      {showArcade && <ArcadeModal onClose={() => setShowArcade(false)} />}
    </div>
  );
}
