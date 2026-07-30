import React, { useState, useEffect } from 'react';
import { Country, CategoryId, Phrase } from './types';
import { COUNTRIES, PHRASES } from './data/phrases';
import { noiseEngine } from './utils/audio';
import {
  registerServiceWorker,
  getSavedBookmarkIds,
  toggleBookmarkId,
  isBrowserOnline,
} from './utils/pwa';

import { Header } from './components/Header';
import { PWABanner } from './components/PWABanner';
import { CategoryChips } from './components/CategoryChips';
import { PhraseCard } from './components/PhraseCard';
import { BillboardModal } from './components/BillboardModal';
import { AITranslateModal } from './components/AITranslateModal';
import { PronunciationModal } from './components/PronunciationModal';
import { DriveModal } from './components/DriveModal';
import { ListeningModal } from './components/ListeningModal';
import { BottomNav, TabType } from './components/BottomNav';

import {
  Search,
  Sparkles,
  Bookmark,
  Bus,
  Utensils,
  Tag,
  AlertTriangle,
  ShieldAlert,
  Volume2,
  Maximize2,
  Check,
  Globe,
  Headphones,
} from 'lucide-react';

export default function App() {
  // Country & Filter States
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('translate');

  // Audio Settings
  const [speed, setSpeed] = useState<number>(1.0);

  // Bookmarks State
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [isOffline, setIsOffline] = useState<boolean>(!isBrowserOnline());

  // Modals
  const [billboardPhrase, setBillboardPhrase] = useState<Phrase | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState<boolean>(false);
  const [micPracticePhrase, setMicPracticePhrase] = useState<Phrase | null>(null);
  const [showDriveModal, setShowDriveModal] = useState<boolean>(false);
  const [showListeningModal, setShowListeningModal] = useState<boolean>(false);

  // Custom AI-generated Phrases State
  const [customPhrases, setCustomPhrases] = useState<Phrase[]>(() => {
    try {
      const saved = localStorage.getItem('quickpass_custom_phrases');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleAddCustomPhrase = (newPhrase: Phrase) => {
    setCustomPhrases((prev) => {
      if (prev.some((p) => p.id === newPhrase.id)) return prev;
      const updated = [newPhrase, ...prev];
      try {
        localStorage.setItem('quickpass_custom_phrases', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleRestoreData = (savedIds: string[], restoredCustom: Phrase[]) => {
    setBookmarkedIds(savedIds);
    try {
      localStorage.setItem('quickpass_bookmarks', JSON.stringify(savedIds));
    } catch {}

    if (Array.isArray(restoredCustom) && restoredCustom.length > 0) {
      setCustomPhrases((prev) => {
        const combinedMap = new Map<string, Phrase>();
        prev.forEach((p) => combinedMap.set(p.id, p));
        restoredCustom.forEach((p) => combinedMap.set(p.id, p));
        const combined = Array.from(combinedMap.values());
        try {
          localStorage.setItem('quickpass_custom_phrases', JSON.stringify(combined));
        } catch {}
        return combined;
      });
    }
  };

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
  const handleToggleBookmark = (id: string) => {
    const updated = toggleBookmarkId(id);
    setBookmarkedIds(updated);
  };

  // Combine default preset phrases and user custom AI phrases
  const allPhrases = [...PHRASES, ...customPhrases];

  // Filter Phrases by Country, Category, and Search Query
  const countryPhrases = allPhrases.filter(
    (p) => p.countryId === selectedCountry.id
  );

  const filteredPhrases = countryPhrases.filter((p) => {
    const matchesCategory =
      selectedCategory === '전체' || p.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      p.original.toLowerCase().includes(query) ||
      p.translation.toLowerCase().includes(query) ||
      p.pronunciation.toLowerCase().includes(query) ||
      (p.usageTip && p.usageTip.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  // Calculate category item counts for current country
  const categoryCounts: Record<CategoryId, number> = {
    '전체': countryPhrases.length,
    '항공': countryPhrases.filter((p) => p.category === '항공').length,
    '호텔': countryPhrases.filter((p) => p.category === '호텔').length,
    '교통': countryPhrases.filter((p) => p.category === '교통').length,
    '식당': countryPhrases.filter((p) => p.category === '식당').length,
    '흥정': countryPhrases.filter((p) => p.category === '흥정').length,
    '미팅/사교': countryPhrases.filter((p) => p.category === '미팅/사교').length,
    '비상': countryPhrases.filter((p) => p.category === '비상').length,
  };

  // Bookmarked Phrases Filter
  const bookmarkedPhrases = allPhrases.filter((p) =>
    bookmarkedIds.includes(p.id)
  );

  // Emergency Phrases Filter
  const emergencyPhrases = countryPhrases.filter(
    (p) => p.isEmergency || p.category === '비상' || p.category === '교통'
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 flex flex-col font-['Inter'] pb-28">
      {/* PWA Install Banner & Offline Alert */}
      <PWABanner isOffline={isOffline} />

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
        onOpenDriveModal={() => setShowDriveModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-screen-md mx-auto px-4 sm:px-6 py-5 space-y-5">
        {/* TAB 1: 회화 / 번역 메인 뷰 */}
        {activeTab === 'translate' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            {/* Search Input Bar */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`${selectedCountry.flag} ${selectedCountry.name} 원문, 한국어 뜻, 발음기호 [파라 포!] 검색...`}
                className="w-full bg-white border-2 border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#FF6B4A] shadow-xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-xs text-slate-500 hover:text-slate-900 bg-slate-100 px-2.5 py-1 rounded-full font-bold"
                >
                  지우기
                </button>
              )}
            </div>

            {/* Category Chips */}
            <CategoryChips
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              categoryCounts={categoryCounts}
            />

            {/* Continuous Listening Mode Quick Banner */}
            <div className="bg-gradient-to-r from-pink-50 via-orange-50 to-amber-50 p-3.5 rounded-2xl border border-pink-200/80 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#FF6B4A] text-white rounded-xl shadow-xs">
                  <Headphones className="w-4 h-4 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    무한 연속 오디오 듣기 모드
                    <span className="text-[10px] font-bold text-pink-600 bg-pink-100 px-1.5 py-0.2 rounded-full">
                      👩 현지 여성 음성
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-600 font-medium">
                    [{selectedCategory}] 카테고리 {filteredPhrases.length}개 회화 연속 반복 재생
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowListeningModal(true)}
                className="px-3 py-2 bg-slate-900 hover:bg-black text-white text-xs font-extrabold rounded-xl shadow-xs shrink-0 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Headphones className="w-3.5 h-3.5" />
                듣기 시작
              </button>
            </div>

            {/* AI Assistant Quick Call Banner */}
            <div className="bg-white p-4 rounded-2xl border-2 border-orange-100 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#FF6B4A] text-white rounded-xl shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">
                    원하는 특수 상황 표현이 없으신가요?
                  </h4>
                  <p className="text-[11px] text-slate-500 font-bold">
                    Gemini AI가 {selectedCountry.name}어 맞춤 표현과 [발음기호]를 실시간 생성해 드립니다.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAIAssistant(true)}
                className="px-3.5 py-2 bg-[#FF6B4A] hover:bg-[#ff5a36] text-white text-xs font-extrabold rounded-xl shadow-xs shrink-0 active:scale-95 transition-all"
              >
                AI 질문하기
              </button>
            </div>

            {/* Phrase Cards Feed */}
            {filteredPhrases.length > 0 ? (
              <div className="space-y-4">
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
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border-2 border-slate-100 p-6 shadow-xs">
                <Search className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-700">
                  검색 조건에 일치하는 회화 문장이 없습니다.
                </h3>
                <p className="text-xs text-slate-400 mt-1 mb-4">
                  AI 맞춤 질문으로 필요한 문장을 즉시 생성해보세요!
                </p>
                <button
                  onClick={() => setShowAIAssistant(true)}
                  className="px-4 py-2 bg-[#FF6B4A] text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  AI 질문으로 생성하기
                </button>
              </div>
            )}

            {/* Bento Quick-Access Grid */}
            <div className="pt-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[#FF6B4A]" />
                <span>{selectedCountry.flag} {selectedCountry.name} 초스피드 대표 회화</span>
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {countryPhrases.slice(0, 4).map((p) => (
                  <div
                    key={`bento-${p.id}`}
                    onClick={() => setBillboardPhrase(p)}
                    className="bg-white hover:border-[#FF6B4A] p-4 rounded-2xl border-2 border-slate-100 flex flex-col justify-between aspect-[4/3] cursor-pointer transition-all active:scale-95 group shadow-xs"
                  >
                    <div className="flex justify-between items-start">
                      <span className="px-2 py-0.5 bg-orange-100 text-[#FF6B4A] text-[10px] font-black rounded-md">
                        {p.category}
                      </span>
                      <Maximize2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FF6B4A] transition-colors" />
                    </div>

                    <div>
                      <p className="text-xl font-black text-slate-900 font-['Montserrat'] italic line-clamp-1">
                        {p.original}
                      </p>
                      <p className="text-xs font-bold text-slate-700 mt-0.5">
                        {p.translation}
                      </p>
                      <p className="text-[10px] text-[#D97706] font-extrabold mt-0.5">
                        [{p.pronunciation}]
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 카테고리 별 가이드 */}
        {activeTab === 'categories' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-xs">
              <h2 className="text-base font-black text-slate-900">
                {selectedCountry.flag} {selectedCountry.name} 카테고리별 필수 회화
              </h2>
              <p className="text-xs text-slate-500 font-bold mt-0.5">
                현장 상황에 맞는 문장들을 빠르게 탐색하세요.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(['교통', '식당', '흥정', '비상'] as CategoryId[]).map((cat) => {
                const catPhrases = countryPhrases.filter(
                  (p) => p.category === cat
                );
                return (
                  <div
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setActiveTab('translate');
                    }}
                    className="bg-white hover:border-[#FF6B4A] p-5 rounded-2xl border-2 border-slate-100 cursor-pointer transition-all active:scale-95 shadow-xs flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {cat === '교통' && <Bus className="w-5 h-5 text-sky-500" />}
                        {cat === '식당' && <Utensils className="w-5 h-5 text-[#FF6B4A]" />}
                        {cat === '흥정' && <Tag className="w-5 h-5 text-emerald-600" />}
                        {cat === '비상' && <AlertTriangle className="w-5 h-5 text-[#D97706]" />}
                        <span className="font-black text-base text-slate-900">{cat}</span>
                      </div>
                      <span className="px-2.5 py-0.5 bg-orange-50 text-[#FF6B4A] text-xs font-black rounded-full border border-orange-200">
                        {catPhrases.length}개 문장
                      </span>
                    </div>

                    <div className="space-y-1 bg-[#FDFBF7] p-3 rounded-xl border border-orange-100">
                      {catPhrases.slice(0, 2).map((cp) => (
                        <div key={cp.id} className="flex justify-between text-xs">
                          <span className="font-black text-[#FF6B4A] italic">{cp.original}</span>
                          <span className="text-slate-700 font-bold">{cp.translation}</span>
                        </div>
                      ))}
                    </div>

                    <p className="text-[11px] font-black text-[#FF6B4A] mt-3 flex items-center justify-end gap-1">
                      <span>목록 보기</span> ➔
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: 저장됨 (북마크) */}
        {activeTab === 'bookmarks' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-[#FFB800] fill-current" />
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
                  const country =
                    COUNTRIES.find((c) => c.id === phrase.countryId) ||
                    selectedCountry;
                  return (
                    <PhraseCard
                      key={`bm-${phrase.id}`}
                      phrase={phrase}
                      country={country}
                      speed={speed}
                      onSetSpeed={setSpeed}
                      isBookmarked={true}
                      onToggleBookmark={handleToggleBookmark}
                      onOpenBillboard={setBillboardPhrase}
                      onOpenMicPractice={setMicPracticePhrase}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border-2 border-slate-100 p-6 shadow-xs">
                <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-700">
                  아직 저장된 문장이 없습니다.
                </h3>
                <p className="text-xs text-slate-400 mt-1 mb-4">
                  자주 쓰는 문장의 북마크(★)를 눌러 보관함에 추가하세요!
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: 긴급 전광판 핫 리스트 */}
        {activeTab === 'emergency' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="bg-[#FFB800]/20 border-2 border-[#FFB800]/60 p-4 rounded-2xl text-slate-900 shadow-xs">
              <div className="flex items-center gap-2 mb-1">
                <ShieldAlert className="w-5 h-5 text-[#D97706]" />
                <h2 className="font-black text-base text-slate-900">
                  3초 긴급 현장 외치기 전광판 모드
                </h2>
              </div>
              <p className="text-xs font-bold text-slate-700">
                운전기사나 현지 상인에게 휴대폰을 즉시 보여주고 큰 소리로 재생하세요!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {emergencyPhrases.map((phrase) => (
                <div
                  key={`emerg-${phrase.id}`}
                  onClick={() => setBillboardPhrase(phrase)}
                  className="bg-white hover:border-[#FF6B4A] p-5 rounded-2xl border-2 border-slate-100 cursor-pointer transition-all active:scale-95 shadow-xs group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2.5 py-0.5 bg-[#FFB800]/30 text-[#D97706] text-[10px] font-black rounded-md">
                      {phrase.category} • 긴급
                    </span>
                    <Maximize2 className="w-4 h-4 text-[#FF6B4A] group-hover:scale-110 transition-transform" />
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 font-['Montserrat'] tracking-tight italic">
                    {phrase.original}
                  </h3>
                  <p className="text-sm font-bold text-slate-700 mt-1">
                    {phrase.translation}
                  </p>
                  <p className="text-xs font-bold text-[#D97706] mt-0.5">
                    [{phrase.pronunciation}]
                  </p>

                  <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-[#FF6B4A] font-black">
                    <span>1초 만에 전광판 실행</span>
                    <span className="font-black">터치 ➔</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: 무한 연속 오디오 듣기 모드 허브 */}
        {activeTab === 'listening' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="bg-gradient-to-r from-slate-900 via-pink-950 to-slate-900 p-6 rounded-3xl border border-pink-900/50 text-white space-y-3 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#FF6B4A] text-white rounded-2xl shadow-md">
                  <Headphones className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    {selectedCountry.flag} {selectedCountry.name} 무한 연속 듣기
                  </h2>
                  <p className="text-xs text-pink-200 font-medium">
                    현지 여성 음성 억양 • 간격 및 반복 횟수 설정 가능
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                비행기 안, 이동 중인 택시, 호텔에서 이어폰을 끼고 자연스럽게 현지 회화를 반복 학습하세요.
              </p>
              <button
                onClick={() => setShowListeningModal(true)}
                className="w-full py-3 bg-[#FF6B4A] hover:bg-[#ff5a36] text-white text-xs font-black rounded-2xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Headphones className="w-4 h-4" />
                전체 {countryPhrases.length}개 표현 연속 듣기 플레이어 열기
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                카테고리별 바로 연속 듣기
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {['항공', '호텔', '교통', '식당', '흥정', '미팅/사교', '비상'].map((cat) => {
                  const catPhrases = countryPhrases.filter((p) => p.category === cat);
                  return (
                    <button
                      key={`cat-listen-${cat}`}
                      onClick={() => {
                        setSelectedCategory(cat as CategoryId);
                        setShowListeningModal(true);
                      }}
                      className="p-3.5 bg-white hover:border-[#FF6B4A] border border-slate-200 rounded-2xl text-left transition-all active:scale-95 shadow-xs flex flex-col justify-between"
                    >
                      <span className="text-xs font-extrabold text-slate-900">
                        {cat}
                      </span>
                      <span className="text-[11px] text-[#FF6B4A] font-bold mt-1">
                        {catPhrases.length}개 표현 ➔
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Footer Brand Attribution & Immersive UI Bar */}
        <footer className="pt-8 pb-4 flex flex-col items-center gap-2">
          <div className="bg-white border-2 border-slate-100 py-3.5 px-6 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center justify-between w-full text-xs text-slate-500 font-bold gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>GIJO Talk · 오프라인 모드</span>
            </div>
            <div className="flex items-center gap-1.5 font-black text-slate-700">
              <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">GIJO LABS</span>
              <span>제공</span>
            </div>
            <span className="text-[#FF6B4A] uppercase">{allPhrases.length}개 현장회화 탑재</span>
          </div>
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
          country={selectedCountry}
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
          country={selectedCountry}
          onClose={() => setMicPracticePhrase(null)}
        />
      )}

      {/* MODAL 4: Google Drive Backup & Restore Sync */}
      {showDriveModal && (
        <DriveModal
          onClose={() => setShowDriveModal(false)}
          savedPhraseIds={bookmarkedIds}
          customPhrases={customPhrases}
          onRestoreData={handleRestoreData}
          currentCountry={selectedCountry}
          countryPhrases={countryPhrases}
        />
      )}

      {/* MODAL 5: Continuous Audio Listening Mode Player */}
      <ListeningModal
        isOpen={showListeningModal}
        onClose={() => setShowListeningModal(false)}
        phrases={filteredPhrases.length > 0 ? filteredPhrases : countryPhrases}
        country={selectedCountry}
        initialSpeed={speed}
      />
    </div>
  );
}
