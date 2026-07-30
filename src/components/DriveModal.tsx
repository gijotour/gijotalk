import { Modal } from './Modal';
import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  X,
  HardDrive,
  Upload,
  Download,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LogOut,
  RefreshCw,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { googleSignIn, logoutGoogle, initAuth } from '../utils/googleAuth';
import {
  listQuickPassDriveFiles,
  uploadBackupToDrive,
  exportCheatSheetToDrive,
  downloadDriveFile,
  deleteDriveFile,
  DriveFile,
} from '../utils/driveApi';
import { Phrase, Country } from '../types';

interface DriveModalProps {
  onClose: () => void;
  savedPhraseIds: string[];
  customPhrases: Phrase[];
  onRestoreData: (savedIds: string[], custom: Phrase[]) => void;
  currentCountry: Country;
  countryPhrases: Phrase[];
}

export const DriveModal: React.FC<DriveModalProps> = ({
  onClose,
  savedPhraseIds,
  customPhrases,
  onRestoreData,
  currentCountry,
  countryPhrases,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  // File Deletion Confirmation State (Mandatory Workspace requirement)
  const [fileToDelete, setFileToDelete] = useState<DriveFile | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (u, token) => {
        setUser(u);
        setAccessToken(token);
        setIsAuthChecking(false);
      },
      () => {
        setUser(null);
        setAccessToken(null);
        setIsAuthChecking(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch Drive Files when user/token is ready
  const fetchFiles = async () => {
    if (!accessToken) return;
    setLoadingFiles(true);
    setMessage(null);
    try {
      const driveFiles = await listQuickPassDriveFiles(accessToken);
      setFiles(driveFiles);
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'Drive 파일 목록을 불러오지 못했습니다.' });
    } finally {
      setLoadingFiles(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchFiles();
    }
  }, [accessToken]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setMessage(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
        setMessage({ type: 'success', text: 'Google 계정으로 성공적으로 로그인이 완료되었습니다.' });
      }
    } catch (err: any) {
      console.error(err);
      setMessage({
        type: 'error',
        text: err.message || 'Google 로그인 중 오류가 발생했습니다.',
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logoutGoogle();
    setUser(null);
    setAccessToken(null);
    setFiles([]);
    setMessage({ type: 'success', text: '로그아웃 되었습니다.' });
  };

  // Backup data to Drive
  const handleBackup = async () => {
    if (!accessToken) return;
    setActionLoading(true);
    setMessage(null);
    try {
      const backupData = {
        app: 'GIJOTalk',
        providedBy: 'GIJO LABS',
        version: '1.0',
        timestamp: new Date().toISOString(),
        savedPhraseIds,
        customPhrases,
      };

      const result = await uploadBackupToDrive(accessToken, backupData);
      setMessage({
        type: 'success',
        text: `Google Drive에 백업이 저장되었습니다! (${result.name})`,
      });
      await fetchFiles();
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message || '백업 저장 중 오류가 발생했습니다.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Export Cheat Sheet to Drive as TXT
  const handleExportCheatSheet = async () => {
    if (!accessToken) return;
    setActionLoading(true);
    setMessage(null);
    try {
      const dateStr = new Date().toLocaleDateString('ko-KR');
      let content = `====================================================\n`;
      content += ` GIJO Talk (by GIJO LABS) ${currentCountry.flag} ${currentCountry.name} 필수 여행 회화 치트시트\n`;
      content += ` 작성일: ${dateStr}\n`;
      content += `====================================================\n\n`;

      const categories = ['항공', '호텔', '교통', '식당', '흥정', '미팅/사교', '욕설/은어', '비상'];
      categories.forEach((cat) => {
        const catPhrases = countryPhrases.filter((p) => p.category === cat);
        if (catPhrases.length > 0) {
          content += `\n▶ [${cat}]\n----------------------------------------------------\n`;
          catPhrases.forEach((p, idx) => {
            content += `${idx + 1}. ${p.original} (${p.pronunciation})\n`;
            content += `   의미: ${p.translation}\n`;
            if (p.usageTip) content += `   팁: ${p.usageTip}\n`;
            content += `\n`;
          });
        }
      });

      if (customPhrases.length > 0) {
        content += `\n▶ [AI 맞춤 추가 문장]\n----------------------------------------------------\n`;
        customPhrases.forEach((p, idx) => {
          content += `${idx + 1}. ${p.original} (${p.pronunciation})\n`;
          content += `   의미: ${p.translation}\n\n`;
        });
      }

      const result = await exportCheatSheetToDrive(accessToken, currentCountry.name, content);
      setMessage({
        type: 'success',
        text: `Google Drive에 ${currentCountry.name} 여행 회화 치트시트가 저장되었습니다! (${result.name})`,
      });
      await fetchFiles();
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message || '치트시트 생성 실패',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Restore backup from selected drive file
  const handleRestoreFile = async (file: DriveFile) => {
    if (!accessToken) return;
    setActionLoading(true);
    setMessage(null);
    try {
      const data = await downloadDriveFile(accessToken, file.id);
      if (data && (Array.isArray(data.savedPhraseIds) || Array.isArray(data.customPhrases))) {
        onRestoreData(data.savedPhraseIds || [], data.customPhrases || []);
        setMessage({
          type: 'success',
          text: `백업 파일("${file.name}")에서 단어장/custom 문장이 복원되었습니다!`,
        });
      } else {
        throw new Error('올바른 GIJO Talk 백업 파일 형식이 아닙니다.');
      }
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message || '복원 처리 중 오류가 발생했습니다.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Confirm and Execute File Deletion
  const confirmDeleteFile = async () => {
    if (!fileToDelete || !accessToken) return;
    setActionLoading(true);
    setMessage(null);
    try {
      await deleteDriveFile(accessToken, fileToDelete.id);
      setMessage({
        type: 'success',
        text: `파일 "${fileToDelete.name}" 삭제가 완료되었습니다.`,
      });
      setFileToDelete(null);
      await fetchFiles();
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message || '파일 삭제에 실패했습니다.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Modal onClose={onClose} label="Google Drive 동기화">
      <div className="bg-white border-2 border-orange-100 rounded-3xl max-w-lg w-full p-6 text-slate-900 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-orange-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-2xl text-white shadow-md">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900">GIJO Talk Drive 동기화</h3>
              <p className="text-xs text-slate-500 font-bold">
                GIJO LABS · 북마크 회화 & AI 맞춤 문장 백업/복원
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-ink-mute hover:text-slate-900 rounded-full bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Container */}
        <div className="overflow-y-auto py-4 space-y-4 flex-1 pr-1">
          {/* Status Message */}
          {message && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 border ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* User Authentication Status */}
          {isAuthChecking ? (
            <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-xs font-bold">계정 인증 상태 확인 중...</span>
            </div>
          ) : !user ? (
            /* Unauthenticated View: Material Sign in Button */
            <div className="bg-canvas border-2 border-slate-100 rounded-2xl p-6 text-center space-y-4">
              <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-2xl mb-1">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">
                Google 계정을 연결하여 백업하세요
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto font-medium">
                스마트폰 변경이나 앱 초기화 시에도 안심! 내가 저장한 단어장과 AI 맞춤 회화를
                Google Drive에 안전하게 저장하고 원클릭 복원할 수 있습니다.
              </p>

              <div className="pt-2">
                <button
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="w-full py-3 px-4 bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-700 font-bold text-xs flex items-center justify-center gap-3 shadow-xs hover:shadow transition-all active:scale-98 disabled:opacity-50"
                >
                  {isLoggingIn ? (
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  ) : (
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 48 48"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                      />
                      <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                      />
                    </svg>
                  )}
                  <span>Sign in with Google</span>
                </button>
              </div>
            </div>
          ) : (
            /* Authenticated View */
            <div className="space-y-4">
              {/* Account Card */}
              <div className="bg-canvas border-2 border-orange-100 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-10 h-10 rounded-full border border-orange-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                      {user.displayName?.[0] || 'U'}
                    </div>
                  )}
                  <div className="truncate">
                    <p className="font-bold text-xs text-slate-900 truncate">
                      {user.displayName || 'Google 사용자'}
                    </p>
                    <p className="text-xs text-slate-500 font-medium truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-ink-mute hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors shrink-0"
                  title="로그아웃"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Data Summary & Backup Controls */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleBackup}
                  disabled={actionLoading}
                  className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl text-left flex flex-col justify-between h-28 shadow-xs transition-all disabled:opacity-50 active:scale-98"
                >
                  <div className="flex items-center justify-between w-full">
                    <Upload className="w-5 h-5 text-blue-100" />
                    <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
                      JSON
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-xs">Drive 백업 저장</p>
                    <p className="text-xs text-blue-100 font-medium">
                      북마크 {savedPhraseIds.length}개 / AI문장 {customPhrases.length}개
                    </p>
                  </div>
                </button>

                <button
                  onClick={handleExportCheatSheet}
                  disabled={actionLoading}
                  className="p-4 bg-brand hover:bg-brand-hover text-white rounded-2xl text-left flex flex-col justify-between h-28 shadow-xs transition-all disabled:opacity-50 active:scale-98"
                >
                  <div className="flex items-center justify-between w-full">
                    <FileText className="w-5 h-5 text-orange-100" />
                    <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
                      TXT
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-xs">{currentCountry.name} 치트시트</p>
                    <p className="text-xs text-orange-100 font-medium">
                      Drive 텍스트 요약문 생성
                    </p>
                  </div>
                </button>
              </div>

              {/* Stored Drive Files Section */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    Google Drive 내 Quick Pass 파일
                  </h4>
                  <button
                    onClick={fetchFiles}
                    disabled={loadingFiles}
                    className="p-1 text-ink-mute hover:text-slate-700 rounded-xl hover:bg-slate-100"
                    title="새로고침"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingFiles ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {loadingFiles ? (
                  <div className="py-6 text-center text-xs font-bold text-ink-mute flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    <span>Drive 파일 검색 중...</span>
                  </div>
                ) : files.length === 0 ? (
                  <div className="p-6 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-xs text-ink-mute font-bold">
                    저장된 백업 파일이 없습니다. 상단에서 백업을 시작하세요!
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {files.map((f) => {
                      const isJson = f.mimeType.includes('json');
                      const dateFormatted = f.modifiedTime
                        ? new Date(f.modifiedTime).toLocaleDateString('ko-KR', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '알 수 없음';

                      return (
                        <div
                          key={f.id}
                          className="bg-white border border-slate-200 hover:border-blue-200 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-xs transition-all"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`p-2 rounded-xl shrink-0 ${
                                isJson ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-brand'
                              }`}
                            >
                              {isJson ? (
                                <HardDrive className="w-4 h-4" />
                              ) : (
                                <FileText className="w-4 h-4" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-xs text-slate-900 truncate">
                                {f.name}
                              </p>
                              <p className="text-xs text-ink-mute font-medium">
                                {dateFormatted}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {isJson && (
                              <button
                                onClick={() => handleRestoreFile(f)}
                                disabled={actionLoading}
                                className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                              >
                                <Download className="w-3 h-3" />
                                <span>복원</span>
                              </button>
                            )}
                            <button
                              onClick={() => setFileToDelete(f)}
                              disabled={actionLoading}
                              className="p-1.5 text-ink-mute hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                              title="삭제"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal (Workspace API Requirement) */}
        {fileToDelete && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs rounded-3xl z-20 flex items-center justify-center p-4">
            <div className="bg-white border-2 border-rose-100 rounded-2xl p-5 max-w-xs w-full text-center space-y-3 shadow-2xl animate-in zoom-in-95 duration-150">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl inline-block">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-xs text-slate-900">Google Drive 파일 삭제</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-bold">
                '<span className="text-rose-600">{fileToDelete.name}</span>' 파일을 Google Drive에서
                영구 삭제하시겠습니까?
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setFileToDelete(null)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  취소
                </button>
                <button
                  onClick={confirmDeleteFile}
                  disabled={actionLoading}
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow-xs"
                >
                  {actionLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>삭제 확인</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
