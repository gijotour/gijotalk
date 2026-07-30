export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  createdTime?: string;
  modifiedTime?: string;
  size?: string;
}

/**
 * List files created by GIJO Talk in Google Drive
 */
export async function listQuickPassDriveFiles(accessToken: string): Promise<DriveFile[]> {
  const query = encodeURIComponent("(name contains 'GIJOTalk' or name contains 'GIJO' or name contains 'QuickPass') and trashed = false");
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,createdTime,modifiedTime,size)&orderBy=modifiedTime desc`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Google Drive 목록 조회 실패 (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return data.files || [];
}

/**
 * Upload JSON backup to Google Drive
 */
export async function uploadBackupToDrive(
  accessToken: string,
  backupContent: any
): Promise<DriveFile> {
  const fileName = `GIJOTalk_Phrases_Backup_${new Date().toISOString().slice(0, 10)}.json`;
  const fileData = JSON.stringify(backupContent, null, 2);

  const metadata = {
    name: fileName,
    mimeType: 'application/json',
    description: 'GIJO Talk (by GIJO LABS) 동남아 여행 회화 백업 데이터',
  };

  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  form.append('file', new Blob([fileData], { type: 'application/json' }));

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,createdTime,modifiedTime',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form,
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Google Drive 백업 업로드 실패: ${errText}`);
  }

  return await response.json();
}

/**
 * Export a readable text cheat sheet to Google Drive
 */
export async function exportCheatSheetToDrive(
  accessToken: string,
  countryName: string,
  phrasesText: string
): Promise<DriveFile> {
  const fileName = `GIJOTalk_${countryName}_여행회화_치트시트.txt`;

  const metadata = {
    name: fileName,
    mimeType: 'text/plain',
    description: `GIJO Talk (by GIJO LABS) ${countryName} 여행 필수 회화 요약표`,
  };

  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  form.append('file', new Blob([phrasesText], { type: 'text/plain' }));

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,createdTime,modifiedTime',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form,
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Google Drive 치트시트 저장 실패: ${errText}`);
  }

  return await response.json();
}

/**
 * Download file content from Google Drive
 */
export async function downloadDriveFile(accessToken: string, fileId: string): Promise<any> {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Google Drive 파일 다운로드 실패: ${errText}`);
  }

  return await response.json();
}

/**
 * Delete file from Google Drive (Mandatory user confirmation check should be performed beforehand)
 */
export async function deleteDriveFile(
  accessToken: string,
  fileId: string
): Promise<void> {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Google Drive 파일 삭제 실패: ${errText}`);
  }
}
